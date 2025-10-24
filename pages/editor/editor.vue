<template>
  <view class="page">
    <u-status-bar></u-status-bar>
    <u-navbar
      :title="$t('editor.title')"
      :autoBack="true"
      bgColor="transparent"
    ></u-navbar>
    
    <view class="page-content">
      <view class="content-wrapper">
        <!-- 图片预览卡片 -->
        <view class="media-card">
          <!-- 图片预览区 -->
          <view class="preview-area">
            <!-- Loading 状态 -->
            <view v-if="loading" class="loading-container">
              <u-loading mode="circle" size="48"></u-loading>
              <text v-if="statusText" class="loading-text">{{ statusText }}</text>
            </view>
            <!-- 图片显示 -->
            <image v-else :src="displayImage" mode="aspectFill" class="preview-img"></image>
          </view>
          
          <!-- 底部按钮 -->
          <view class="action-footer">
            <view 
              class="generate-btn" 
              :class="{ 'disabled': !canGenerate }"
              @click="onGenerateTap"
            >
              <text class="btn-text">{{ loading ? $t('common.loading') : $t('editor.generate') }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <u-safe-bottom></u-safe-bottom>
  </view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { PROJECT_STATUS } from '@/store/modules/projects'

export default {
  name: 'EditorPage',
  data() {
    return {
      loading: false,
      statusText: '',
      projectId: null,
      productImageUrl: null
    }
  },
  async onLoad(props) {
    if (props.projectId) {
      await this.loadProject(props.projectId)
    } else if (props.imageUrl) {
      const inputImage = decodeURIComponent(props.imageUrl)
      console.log('📷 接收到产品图片URL:', inputImage)
      
      try {
        const project = await this.$store.dispatch('projects/createProject', {
          projectData: {
            product_image_url: inputImage,
            status: PROJECT_STATUS.INIT
          }
        })
        
        console.log('🔍 createProject 返回值:', project)
        
        if (!project || !project.id) {
          console.error('❌ 项目创建失败，没有获取到项目ID')
          
          const currentProjectId = this.$store.getters['projects/currentProjectId']
          if (currentProjectId) {
            console.log('📌 从 currentProjectId 获取:', currentProjectId)
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
        
        console.log('🆕 创建新项目成功:', {
          projectId: this.projectId,
          product_image_url: inputImage
        })
        
        const createdProject = this.$store.getters['projects/getProjectById'](this.projectId)
        console.log('✅ 验证创建的项目:', createdProject)
        
        if (!createdProject) {
          console.error('❌ 无法从 store 中获取创建的项目')
          uni.showToast({
            title: this.$t('common.opFail'),
            icon: 'none'
          })
          return
        }
        
        this.productImageUrl = inputImage
        this.setCurrentProject({ projectId: this.projectId })
        
      } catch (error) {
        console.error('❌ 创建项目时发生错误:', error)
        uni.showToast({
          title: this.$t('common.opFail'),
          icon: 'none'
        })
      }
    }
  },
  computed: {
    ...mapGetters('projects', ['getProjectById']),
    
    currentProject() {
      return this.projectId ? this.getProjectById(this.projectId) : null
    },
    
    displayImage() {
      if (this.currentProject) {
        return this.currentProject.scene_image_url || this.currentProject.product_image_url
      }
      return this.productImageUrl
    },
    
    canGenerate() {
      return !!this.displayImage && !this.loading
    }
  },
  methods: {
    ...mapActions('projects', [
      'createProject',
      'updateProject',
      'setCurrentProject'
    ]),
    
    async loadProject(projectId) {
      const project = this.getProjectById(projectId)
      if (!project) {
        console.error('项目不存在:', projectId)
        uni.showToast({
          title: this.$t('common.opFail'),
          icon: 'none'
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
        return
      }
      
      console.log('恢复项目:', project)
      this.projectId = projectId
      this.productImageUrl = project.product_image_url
      
      this.setCurrentProject({ projectId })
    },
    
    onGenerateTap() {
      if (!this.canGenerate) {
        return
      }
      
      // TODO: 实现生成逻辑
      uni.showToast({
        title: '功能开发中...',
        icon: 'none'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #f0f2f5 0%, #ffffff 100%);
}

.page-content {
  flex: 1;
  padding: 40rpx;
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.media-card {
  width: 100%;
  max-width: 600rpx;
  background: $uni-bg-color;
  border-radius: 32rpx;
  padding: 24rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.preview-area {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 24rpx;
  overflow: hidden;
  position: relative;
  background: rgba(102, 126, 234, 0.05);
}

.loading-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24rpx;
  background: $uni-bg-color;
  
  .loading-text {
    font-size: 28rpx;
    color: $uni-text-color-grey;
  }
}

.preview-img {
  width: 100%;
  height: 100%;
}

.action-footer {
  display: flex;
  align-items: center;
  justify-content: center;
}

.generate-btn {
  flex: 1;
  height: 88rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.98);
    box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.4);
  }
  
  &.disabled {
    background: #e0e0e0;
    box-shadow: none;
    opacity: 0.6;
    
    &:active {
      transform: none;
    }
  }
  
  .btn-text {
    font-size: 32rpx;
    font-weight: 600;
    color: #ffffff;
  }
}
</style>

