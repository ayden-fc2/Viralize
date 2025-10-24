<template>
  <view class="idea-parts-page">
    <!-- 顶部导航 -->
    <view class="top-navigation">
      <u-status-bar></u-status-bar>
      <u-navbar
        :title="$t('ideaParts.title')"
        :autoBack="true"
        bgColor="transparent"
      ></u-navbar>
    </view>
    
    <!-- 步骤条 - 固定在顶部 -->
    <view class="steps-container-fixed">
      <u-steps :current="currentStepIndex" direction="row" dot>
        <u-steps-item 
          :title="$t('ideaParts.step1')"
          @click="goToStep(0)"
        ></u-steps-item>
        <u-steps-item 
          :title="$t('ideaParts.step2')"
          @click="goToStep(1)"
        ></u-steps-item>
        <u-steps-item 
          :title="$t('ideaParts.step3')"
          @click="goToStep(2)"
        ></u-steps-item>
      </u-steps>
    </view>
    
    <!-- 主内容区 - 根据步骤渲染不同组件 -->
    <view class="main-content-container">
      <!-- 步骤1: 生成分镜图 -->
      <Step1GenerateScene
        v-if="currentStepIndex === 0"
        :loading="loading"
        :statusText="statusText"
        :productImageUrl="currentProject ? currentProject.product_image_url : ''"
        :sceneImageUrl="mediaData.imageUrl"
        :estimatedTime="30"
        @next="completeStep1"
        @regenerate="regenerateScene"
      />
      
      <!-- 步骤2: 编辑内容 -->
      <Step2EditContent
        v-if="currentStepIndex === 1"
        :imageUrl="mediaData.imageUrl"
        :description.sync="mediaData.description"
        :script.sync="mediaData.script"
        :currentTab.sync="mediaData.currentTab"
        @prev="goToStep(0)"
        @next="completeStep2"
      />
      
      <!-- 步骤3: 生成视频 -->
      <Step3GenerateVideo
        v-if="currentStepIndex === 2"
        :loading="loading"
        :statusText="statusText"
        :imageUrl="mediaData.imageUrl"
        :videoUrl="mediaData.videoUrl"
        :description="mediaData.description"
        :script="mediaData.script"
        :canGenerate="canGenerateVideo"
        :buttonText="getButtonText"
        :isDemo="isDemo"
        :estimatedTime="180"
        @prev="goToStep(1)"
        @generate="onGenerateTap"
        @play="onPlayTap"
        @download="onDownloadTap"
      />
    </view>
    
    <!-- 视频播放弹窗 -->
    <view v-if="previewVisible" class="video-modal-overlay" @click="hidePreview">
      <view class="video-modal-container" @click.stop>
        <view class="video-modal-header">
          <text class="video-modal-title">{{ $t('ideaParts.videoPreview') }}</text>
          <view class="video-close-button" @click="hidePreview">
            <u-icon name="close" size="22" color="#fff"></u-icon>
          </view>
        </view>
        <video 
          id="videoPlayer"
          ref="videoPlayer"
          :src="mediaData.videoUrl" 
          :poster="mediaData.imageUrl"
          class="video-player-element"
          controls
          :show-center-play-btn="true"
          :enable-play-gesture="true"
          :initial-time="0"
          objectFit="contain"
        ></video>
      </view>
    </view>
    
    <u-safe-bottom></u-safe-bottom>
  </view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { PROJECT_STATUS } from '@/store/modules/projects'
import { genVideoApi, getVideoApi, genImageApi, getImageApi } from '@/api/modules/onestep'
import Step1GenerateScene from './components/Step1GenerateScene.vue'
import Step2EditContent from './components/Step2EditContent.vue'
import Step3GenerateVideo from './components/Step3GenerateVideo.vue'

export default {
  name: 'IdeaParts',
  components: {
    Step1GenerateScene,
    Step2EditContent,
    Step3GenerateVideo
  },
  data() {
    return {
      loading: false,
      statusText: '',
      previewVisible: false,
      projectId: null,
      videoTimer: null,
      sceneTimer: null,
      taskDetail: null,
      sceneDetail: null,
      currentStepIndex: 0,  // 当前步骤索引：0-生成分镜图, 1-编辑内容, 2-生成视频
      maxUnlockedStep: 0,   // 最大已解锁步骤
      mediaData: {
        imageUrl: null,
        videoUrl: null,
        description: '',
        script: '',
        currentTab: 0
      }
    }
  },
  computed: {
    ...mapGetters('projects', ['getProjectById']),
    
    canGenerateVideo() {
      // Demo 项目不允许生成视频
      if (this.isDemo) {
        return false
      }
      return !!this.mediaData.imageUrl && !this.loading
    },
    
    currentProject() {
      return this.projectId ? this.getProjectById(this.projectId) : null
    },
    
    getButtonText() {
      if (this.loading) {
        return this.$t('common.loading')
      }
      return this.mediaData.videoUrl ? this.$t('ideaParts.regenerateVideo') : this.$t('ideaParts.generateVideo')
    },
    
    // 判断是否为 Demo 项目
    isDemo() {
      return this.projectId && this.projectId.startsWith('demo_')
    }
  },
  watch: {
    'mediaData.description'(newVal) {
      // Demo 项目不允许修改
      if (this.projectId && !this.isDemo) {
        this.updateProjectContent({
          projectId: this.projectId,
          desc: newVal,
          dialog: this.mediaData.script
        })
      }
    },
    'mediaData.script'(newVal) {
      // Demo 项目不允许修改
      if (this.projectId && !this.isDemo) {
        this.updateProjectContent({
          projectId: this.projectId,
          desc: this.mediaData.description,
          dialog: newVal
        })
      }
    }
  },
  async onLoad(options) {
    if (options.projectId) {
      // 通过项目 ID 加载项目
      const projectId = options.projectId
      console.log('📂 加载项目:', projectId)
      
      const project = this.getProjectById(projectId)
      
      if (!project) {
        console.error('❌ 项目不存在:', projectId)
        uni.showToast({
          title: this.$t('common.opFail'),
          icon: 'none'
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
        return
      }
      
      console.log('✅ 加载项目数据:', project)
      
      this.projectId = projectId
      
      // 映射项目数据到 mediaData
      // 优先使用场景图片，如果没有则使用产品图片
      this.mediaData.imageUrl = project.scene_image_url || project.product_image_url
      this.mediaData.videoUrl = project.video_url || ''
      // 注意：demo 项目使用 desc 和 dialog 字段
      this.mediaData.description = project.desc || project.description || ''
      this.mediaData.script = project.dialog || project.script || ''
      
      console.log('📝 媒体数据:', this.mediaData)
      
      // 🆕 根据项目状态初始化步骤
      if (project.scene_image_url) {
        // 场景图片已生成，解锁步骤2
        this.maxUnlockedStep = 1
        
        if (project.video_url) {
          // 视频已生成，解锁步骤3，直接跳到步骤3
          this.maxUnlockedStep = 2
          this.currentStepIndex = 2
          console.log('🎬 项目已有视频，跳转到步骤3')
        } else {
          // 跳到步骤2编辑内容
          this.currentStepIndex = 1
          console.log('📝 场景图已生成，跳转到步骤2')
        }
      } else if (project.product_image_url) {
        // 只有产品图片，停留在步骤1
        this.currentStepIndex = 0
        this.maxUnlockedStep = 0
        console.log('🎨 只有产品图，停留在步骤1')
      }
      
      // 如果是 demo 项目，显示提示
      if (this.isDemo) {
        console.log('🎭 这是一个 Demo 项目，不允许生成视频')
      }
      
    } else if (options.imageUrl) {
      const inputImage = decodeURIComponent(options.imageUrl)
      console.log('📷 接收到产品图片URL:', inputImage)
      
      try {
        // 创建新项目
        const project = await this.$store.dispatch('projects/createProject', {
          projectData: {
            product_image_url: inputImage,
            status: PROJECT_STATUS.INIT
          }
        })
        
        if (!project || !project.id) {
          const currentProjectId = this.$store.getters['projects/currentProjectId']
          if (currentProjectId) {
            this.projectId = currentProjectId
          } else {
            uni.showToast({
              title: this.$t('common.opFail'),
              icon: 'none'
            })
            return
          }
        } else {
          this.projectId = project.id
        }
        
        console.log('🆕 创建新项目成功:', this.projectId)
        
        // 🆕 新上传图片，从步骤1开始
        this.currentStepIndex = 0
        this.maxUnlockedStep = 0
        console.log('🎨 新上传图片，从步骤1开始生成场景')
        
        // 开始生成场景图片
        this.loading = true
        this.statusText = this.$t('common.loading')
        await this.createScene(inputImage)
        
      } catch (error) {
        console.error('❌ 创建项目失败:', error)
        uni.showToast({
          title: this.$t('common.opFail'),
          icon: 'none'
        })
      }
    }
  },
  onUnload() {
    this.stopVideoCheck()
    this.stopSceneCheck()
  },
  methods: {
    ...mapActions('projects', [
      'createProject',
      'updateProject',
      'updateProjectScene',
      'updateProjectVideo',
      'updateProjectContent',
      'setCurrentProject'
    ]),
    
      onPlayTap() {
        if (!this.mediaData.videoUrl) {
          uni.showToast({
            title: this.$t('ideaParts.notFoundVideoLink'),
            icon: 'none'
          })
          return
        }
        console.log('🎬 播放视频:', this.mediaData.videoUrl)
        this.previewVisible = true
        
        // 等待弹窗渲染完成后播放视频
        this.$nextTick(() => {
          setTimeout(() => {
            const videoContext = uni.createVideoContext('videoPlayer', this)
            if (videoContext) {
              console.log('▶️ 调用 videoContext.play()')
              videoContext.play()
            } else {
              console.warn('⚠️ videoContext 未创建成功')
            }
          }, 300)
        })
      },
      
      hidePreview() {
        // 停止视频播放
        const videoContext = uni.createVideoContext('videoPlayer', this)
        if (videoContext) {
          videoContext.pause()
        }
        this.previewVisible = false
      },
    
    async onDownloadTap() {
      // TODO: 实现下载功能
      uni.showToast({
        title: this.$t('common.opSuccess'),
        icon: 'success'
      })
    },
    
      onGenerateTap() {
        if (!this.canGenerateVideo) {
          if (this.isDemo) {
            uni.showToast({
              title: this.$t('ideaParts.demoNotAllowed'),
              icon: 'none'
            })
          }
          return
        }
        this.createVideo()
      },
    
    async createVideo() {
      try {
        console.log('🎬 开始生成视频...', {
          projectId: this.projectId,
          hasSceneImage: !!this.mediaData.imageUrl,
          hasDescription: !!this.mediaData.description,
          hasScript: !!this.mediaData.script
        })
        
        this.loading = true
        this.statusText = this.$t('ideaParts.generatingVideo') + '...'
        
        if (this.projectId) {
          console.log('📝 设置项目状态为视频生成中')
          await this.updateProject({
            projectId: this.projectId,
            updates: { status: PROJECT_STATUS.VIDEO_GENERATING }
          })
        }
        
        // 构建 prompt
        let promptText = 'Generate an advertisement video based on the provided product image.\n\n'
        
        let videoDescription = this.mediaData.description?.trim()
        if (!videoDescription) {
          videoDescription = 'A professional presenter showcasing the product in an engaging and dynamic way, with smooth camera movements and attractive lighting.'
        }
        promptText += `Video Description: ${videoDescription}\n\n`
        
        let voiceoverScript = this.mediaData.script?.trim()
        if (!voiceoverScript) {
          const currentLocale = uni.getLocale()
          const defaultScripts = {
            'zh-Hans': '这款产品拥有出色的品质和卓越的性能，能够满足您的各种需求，是您生活中不可或缺的好帮手。',
            'zh-Hant': '這款產品擁有出色的品質和卓越的性能，能夠滿足您的各種需求，是您生活中不可或缺的好幫手。',
            'ja': 'この製品は優れた品質と卓越した性能を備えており、あなたのさまざまなニーズを満たす、生活に欠かせない頼もしいパートナーです。',
            'en': 'This product features outstanding quality and excellent performance, meeting all your needs and serving as an indispensable companion in your daily life.'
          }
          voiceoverScript = defaultScripts[currentLocale] || defaultScripts['en']
        }
        promptText += `Voice-over Script: ${voiceoverScript}\n\n`
        
        promptText += '\nIMPORTANT: Create a dynamic 16:9 video in ONE CONTINUOUS SHOT (no cuts, transitions, or scene changes), closely following the scene description and synchronizing with the voice-over script.'
        
        const params = {
          prompt: promptText,
          input_image: this.mediaData.imageUrl
        }
        
        const res = await genVideoApi(params)
        console.log('✅ 生成视频任务提交成功:', res)
        
        if (res && res.id) {
          this.taskDetail = res
          
          if (this.projectId) {
            await this.updateProjectVideo({
              projectId: this.projectId,
              video_pending_id: res.id,
              video_url: '',
              status: PROJECT_STATUS.VIDEO_GENERATING
            })
          }
          
          this.startVideoCheck()
        } else {
          this.loading = false
          this.statusText = ''
          
          if (this.projectId) {
            this.updateProject({
              projectId: this.projectId,
              updates: { status: PROJECT_STATUS.VIDEO_FAILED }
            })
          }
          
          uni.showToast({
            title: this.$t('ideaParts.generateFailedMessage'),
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('❌ 生成视频错误:', error)
        this.loading = false
        this.statusText = ''
        
        if (this.projectId) {
          this.updateProject({
            projectId: this.projectId,
            updates: { status: PROJECT_STATUS.VIDEO_FAILED }
          })
        }
        
        uni.showToast({
          title: error.message || this.$t('common.opFail'),
          icon: 'none'
        })
      }
    },
    
    startVideoCheck() {
      this.stopVideoCheck()
      this.checkVideoTask()
      this.videoTimer = setInterval(() => {
        this.checkVideoTask()
      }, 5000)
    },
    
    async checkVideoTask() {
      if (!this.taskDetail || !this.taskDetail.id) {
        this.stopVideoCheck()
        return
      }
      
      try {
        const params = {
          task_id: this.taskDetail.id
        }
        
        const res = await getVideoApi(params)
        console.log('📹 查询视频任务结果:', res)
        
        this.taskDetail = res
        
        if (res.status === 'completed') {
          this.stopVideoCheck()
          this.loading = false
          this.statusText = ''
          
          if (res.output_text) {
            const mp4Regex = /(https?:\/\/[^\s]+\.mp4)/i
            const match = res.output_text.match(mp4Regex)
            
            if (match && match[1]) {
              this.mediaData.videoUrl = match[1]
              console.log('✅ 视频生成成功:', match[1])
              
              if (this.projectId) {
                await this.updateProjectVideo({
                  projectId: this.projectId,
                  video_url: match[1],
                  video_pending_id: '',
                  status: PROJECT_STATUS.VIDEO_COMPLETED
                })
              }
              
              uni.showToast({
                title: this.$t('common.opSuccess'),
                icon: 'success'
              })
            } else {
              console.warn('⚠️ 未在 output_text 中找到 .mp4 视频链接')
              
              if (this.projectId) {
                this.updateProject({
                  projectId: this.projectId,
                  updates: { 
                    status: PROJECT_STATUS.VIDEO_FAILED,
                    video_pending_id: ''
                  }
                })
              }
              
              uni.showToast({
                title: this.$t('ideaParts.notFoundVideoLink'),
                icon: 'none'
              })
            }
          } else {
            console.warn('⚠️ output_text 为空')
            
            if (this.projectId) {
              this.updateProject({
                projectId: this.projectId,
                updates: { 
                  status: PROJECT_STATUS.VIDEO_FAILED,
                  video_pending_id: ''
                }
              })
            }
            
            uni.showToast({
              title: this.$t('ideaParts.generateFailedMessage'),
              icon: 'none'
            })
          }
        }
        else if (res.status === 'failed') {
          this.stopVideoCheck()
          this.loading = false
          this.statusText = ''
          
          console.error('❌ 视频生成失败:', res.error_message)
          
          if (this.projectId) {
            this.updateProject({
              projectId: this.projectId,
              updates: { 
                status: PROJECT_STATUS.VIDEO_FAILED,
                video_pending_id: ''
              }
            })
          }
          
          uni.showToast({
            title: res.error_message || this.$t('common.opFail'),
            icon: 'none',
            duration: 3000
          })
        }
      } catch (error) {
        console.error('❌ 查询视频任务错误:', error)
      }
    },
    
    onSwiperChange(e) {
      const current = e.detail.current
      this.mediaData.currentTab = current
    },
    
    switchTab(index) {
      this.mediaData.currentTab = index
    },
    
    /**
     * 跳转到指定步骤
     */
    goToStep(stepIndex) {
      // 只能前往已解锁的步骤
      if (stepIndex <= this.maxUnlockedStep) {
        this.currentStepIndex = stepIndex
      } else {
        uni.showToast({
          title: this.$t('ideaParts.stepLocked'),
          icon: 'none'
        })
      }
    },
    
    /**
     * 完成步骤1 - 生成分镜图
     */
    completeStep1() {
      if (!this.mediaData.imageUrl || this.loading) {
        return
      }
      
      // 解锁步骤2
      if (this.maxUnlockedStep < 1) {
        this.maxUnlockedStep = 1
      }
      
      // 跳转到步骤2
      this.currentStepIndex = 1
    },
    
    /**
     * 完成步骤2 - 编辑内容
     */
    completeStep2() {
      // 解锁步骤3
      if (this.maxUnlockedStep < 2) {
        this.maxUnlockedStep = 2
      }
      
      // 跳转到步骤3
      this.currentStepIndex = 2
    },
    
    /**
     * 重新生成场景图
     */
    async regenerateScene() {
      const project = this.currentProject
      if (!project || !project.product_image_url) {
        uni.showToast({
          title: this.$t('common.opFail'),
          icon: 'none'
        })
        return
      }
      
      console.log('🔄 重新生成场景图:', project.product_image_url)
      
      // 显示 loading
      this.loading = true
      this.statusText = this.$t('common.loading')
      
      // 调用生成场景图片的方法
      await this.createScene(project.product_image_url)
    },
    
    stopVideoCheck() {
      if (this.videoTimer) {
        clearInterval(this.videoTimer)
        this.videoTimer = null
      }
    },
    
      stopSceneCheck() {
        if (this.sceneTimer) {
          clearInterval(this.sceneTimer)
          this.sceneTimer = null
        }
      },
      
      async createScene(inputImage) {
        try {
          console.log('🎨 开始生成广告图片...', {
            projectId: this.projectId,
            inputImage: inputImage
          })
          
          if (this.projectId) {
            console.log('📝 立即设置项目状态为场景图片生成中')
            await this.updateProject({
              projectId: this.projectId,
              updates: { status: PROJECT_STATUS.SCENE_GENERATING }
            })
          }
          
          const promptText = 'Generate an AD image based on given product image. Give me the first frame of the AD, including a presenter holding this product. IMPORTANT: The image MUST be in 16:9 aspect ratio (landscape/horizontal format). There should be no text on the first frame.'
          
          const params = {
            prompt: promptText,
            input_image: inputImage,
            aspect_ratio: "16:9"
          }
          
          const res = await genImageApi(params)
          console.log('✅ 生成图片任务提交成功:', res)
          
          if (res && res.id) {
            this.sceneDetail = res
            
            if (this.projectId) {
              await this.updateProjectScene({
                projectId: this.projectId,
                scene_pending_id: res.id,
                scene_image_url: '',
                status: PROJECT_STATUS.SCENE_GENERATING
              })
            }
            
            this.startSceneCheck()
          } else {
            this.loading = false
            this.statusText = ''
            
            if (this.projectId) {
              this.updateProject({
                projectId: this.projectId,
                updates: { status: PROJECT_STATUS.SCENE_FAILED }
              })
            }
            
            uni.showToast({
              title: this.$t('ideaParts.generateFailedMessage'),
              icon: 'none'
            })
          }
        } catch (error) {
          console.error('❌ 生成图片错误:', error)
          this.loading = false
          this.statusText = ''
          
          if (this.projectId) {
            this.updateProject({
              projectId: this.projectId,
              updates: { status: PROJECT_STATUS.SCENE_FAILED }
            })
          }
          
          uni.showToast({
            title: error.message || this.$t('common.opFail'),
            icon: 'none'
          })
        }
      },
      
      startSceneCheck() {
        this.stopSceneCheck()
        this.checkSceneTask()
        this.sceneTimer = setInterval(() => {
          this.checkSceneTask()
        }, 5000)
      },
      
      async checkSceneTask() {
        if (!this.sceneDetail || !this.sceneDetail.id) {
          this.stopSceneCheck()
          return
        }
        
        try {
          const params = {
            task_id: this.sceneDetail.id
          }
          
          const res = await getImageApi(params)
          console.log('📷 查询图片任务结果:', res)
          
          this.sceneDetail = res
          
          if (res.status === 'completed') {
            this.stopSceneCheck()
            this.loading = false
            this.statusText = ''
            
            this.mediaData.imageUrl = res.output_image
            console.log('✅ 图片生成成功:', res.output_image)
            
            if (this.projectId) {
              await this.updateProjectScene({
                projectId: this.projectId,
                scene_image_url: res.output_image,
                scene_pending_id: '',
                status: PROJECT_STATUS.SCENE_COMPLETED
              })
            }
            
            // 🆕 自动解锁并跳转到步骤2
            if (this.maxUnlockedStep < 1) {
              this.maxUnlockedStep = 1
            }
            this.currentStepIndex = 1
            console.log('✅ 场景图生成完成，自动跳转到步骤2')
            
            uni.showToast({
              title: this.$t('common.opSuccess'),
              icon: 'success'
            })
          }
          else if (res.status === 'failed') {
            this.stopSceneCheck()
            this.loading = false
            this.statusText = ''
            
            console.error('❌ 图片生成失败:', res.error_message)
            
            if (this.projectId) {
              this.updateProject({
                projectId: this.projectId,
                updates: { 
                  status: PROJECT_STATUS.SCENE_FAILED,
                  scene_pending_id: ''
                }
              })
            }
            
            uni.showToast({
              title: res.error_message || this.$t('common.opFail'),
              icon: 'none',
              duration: 3000
            })
          }
        } catch (error) {
          console.error('❌ 查询图片任务错误:', error)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
// 主页面容器
.idea-parts-page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #f0f4f8 0%, #e8eef3 100%);
  overflow: hidden;
}

// 顶部导航区
.top-navigation {
  position: relative;
  z-index: 100;
}

// 步骤条容器 - 固定在顶部，高度 56px
.steps-container-fixed {
  position: absolute;
  top: calc(var(--status-bar-height) + 44px);  // 状态栏高度 + navbar高度
  left: 0;
  right: 0;
  height: 56px;
  padding: 12rpx 32rpx;
  background: transparent;
  border-bottom: 2rpx solid $uni-border-color;
  z-index: 99;
  box-sizing: border-box;

  ::v-deep .u-steps-item__wrapper {
    background-color: transparent;
    background: transparent;
  }
}

// 主内容容器 - 占据剩余空间
.main-content-container {
  flex: 1;
  margin-top: calc(var(--status-bar-height) + 44px + 56px);  // 状态栏 + navbar + 步骤条
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 40rpx;
}

// 主内容滚动区（已弃用，保留兼容）
.main-content-area {
  flex: 1;
  width: 100%;
  height: 100%;
  margin-top: 44px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60rpx 0;
  box-sizing: border-box;
}

// 媒体预览容器
.media-preview-container {
  margin: 0 32rpx;
  position: relative;
}

.preview-wrapper {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 36rpx;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 
    0 12rpx 48rpx rgba(102, 126, 234, 0.25),
    0 4rpx 16rpx rgba(0, 0, 0, 0.08);
  position: relative;
}

// 加载状态
.loading-state {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 32rpx;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%);
  backdrop-filter: blur(24rpx);
  -webkit-backdrop-filter: blur(24rpx);
}

.loading-animation {
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 140rpx;
    height: 140rpx;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
    animation: pulse 2s ease-in-out infinite;
  }
}

@keyframes pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.3);
    opacity: 0.3;
  }
}

.status-message {
  font-size: 30rpx;
  color: #ffffff;
  font-weight: 600;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
  letter-spacing: 1rpx;
}

.loading-progress {
  width: 240rpx;
}

.progress-bar {
  width: 100%;
  height: 6rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #fff 0%, rgba(255, 255, 255, 0.8) 100%);
  border-radius: 3rpx;
  animation: loading-progress 1.5s ease-in-out infinite;
}

@keyframes loading-progress {
  0% {
    width: 0%;
    margin-left: 0%;
  }
  50% {
    width: 60%;
    margin-left: 20%;
  }
  100% {
    width: 0%;
    margin-left: 100%;
  }
}

// 媒体图片
.media-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

// 视频控制按钮组
.video-controls {
  position: absolute;
  top: 32rpx;
  right: 32rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  z-index: 10;
}

.control-button {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(20rpx);
  -webkit-backdrop-filter: blur(20rpx);
  border-radius: 50%;
  border: 2rpx solid rgba(255, 255, 255, 0.15);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.3);
  
  &:active {
    transform: scale(0.88);
  }
}

.play-button {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.45);
}

.button-label {
  font-size: 22rpx;
  color: #ffffff;
  font-weight: 600;
  letter-spacing: 0.5rpx;
}

// 内容编辑区域
.content-editor-section {
  margin: 48rpx 32rpx 32rpx;
  background: #ffffff;
  border-radius: 32rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
}

// 标签页切换器
.tab-switcher {
  display: flex;
  padding: 16rpx;
  background: #f8f9fb;
  border-bottom: 2rpx solid #e8eef3;
}

.tab-option {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  padding: 24rpx 16rpx;
  border-radius: 20rpx;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  
  &:active {
    transform: scale(0.96);
  }
}

.tab-active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.3);
  
  .tab-label {
    color: #ffffff !important;
    font-weight: 700;
  }
}

.tab-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-label {
  font-size: 28rpx;
  color: #999;
  font-weight: 600;
  transition: all 0.3s ease;
}

// 输入容器
.input-container {
  padding: 40rpx 32rpx;
  min-height: 320rpx;
}

.textarea-wrapper {
  width: 100%;
}

// 底部操作区
.action-footer {
  margin: 0 32rpx;
  box-sizing: border-box;
}

.generate-action-button {
  width: 100%;
  padding: 32rpx 48rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 28rpx;
  box-shadow: 
    0 12rpx 48rpx rgba(102, 126, 234, 0.4),
    0 4rpx 16rpx rgba(102, 126, 234, 0.2);
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-sizing: border-box;
  
  &:active {
    transform: translateY(2rpx) scale(0.98);
    box-shadow: 
      0 8rpx 32rpx rgba(102, 126, 234, 0.35),
      0 2rpx 8rpx rgba(102, 126, 234, 0.15);
  }
  
  &.button-disabled {
    background: linear-gradient(135deg, #ccc 0%, #999 100%);
    box-shadow: none;
    opacity: 0.5;
    
    .button-glow {
      display: none;
    }
  }
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  position: relative;
  z-index: 2;
}

.button-text {
  font-size: 32rpx;
  color: #ffffff;
  font-weight: 700;
  letter-spacing: 1.5rpx;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}

.button-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%);
  animation: button-shine 3s ease-in-out infinite;
  z-index: 1;
}

@keyframes button-shine {
  0% {
    left: -100%;
  }
  50%, 100% {
    left: 200%;
  }
}

// ============================================
// 以下是旧样式，已由组件样式替代，保留仅用于兼容
// ============================================

// 视频播放弹窗
.video-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 40rpx;
}

.video-modal-container {
  width: 100%;
  max-width: 750rpx;
  background: #000;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.5);
}

.video-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.video-modal-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #ffffff;
}

.video-close-button {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transition: all 0.3s;
  
  &:active {
    transform: scale(0.9);
    background: rgba(255, 255, 255, 0.3);
  }
}

.video-player-element {
  width: 100%;
  height: 70vh;
  max-height: 1000rpx;
  background: #000;
}

// Textarea 样式覆盖
::v-deep .u-textarea {
  border: none !important;
  min-height: 240rpx !important;
}

::v-deep .u-textarea__field {
  color: #2c3e50 !important;
  font-size: 30rpx !important;
  min-height: 100% !important;
}

::v-deep .uni-textarea-wrapper {
  height: 100% !important;
}
</style>

