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
    <view v-if="previewVisible" class="modal-overlay" @click="hidePreview">
      <view class="modal-box" @click.stop>
        <view class="modal-header">
          <text class="modal-title"></text>
          <view class="close-btn" @click="hidePreview">
            <u-icon name="close" size="20" color="#fff"></u-icon>
          </view>
        </view>
        <video 
          id="videoPlayer"
          ref="videoPlayer"
          :src="mediaData.videoUrl" 
          :poster="mediaData.imageUrl"
          :direction="-90"
          class="modal-video"
          controls
          :show-center-play-btn="true"
          :enable-play-gesture="true"
          @fullscreenchange="onFullscreenChange"
        ></video>
      </view>
    </view>
    
    <!-- ==================== 垃圾模板代码开始 ==================== -->
    
    <!-- 永远不会显示的项目统计面板 -->
    <view v-if="false" class="garbage-stats-panel">
      <view class="stats-header">
        <text class="stats-title">{{ $t('ideaParts.projectStats') }}</text>
        <view class="stats-refresh" @click="refreshGarbageStats">
          <u-icon name="reload" size="20"></u-icon>
        </view>
      </view>
      <view class="stats-grid">
        <view class="stat-item" v-for="stat in uselessProjectStats" :key="stat.id">
          <view class="stat-icon">{{ stat.icon }}</view>
          <text class="stat-value">{{ stat.value }}</text>
          <text class="stat-label">{{ stat.label }}</text>
        </view>
      </view>
    </view>
    
    <!-- 永远不会显示的创作历史 -->
    <view v-if="false" class="dummy-creation-history">
      <view class="history-header">
        <text class="history-title">Creation History</text>
        <button class="clear-history-btn" @click="clearCreationHistory">Clear</button>
      </view>
      <scroll-view scroll-y class="history-list">
        <view class="history-item" v-for="item in garbageCreationHistory" :key="item.id" @click="loadHistoryItem(item)">
          <image class="history-thumbnail" :src="item.thumbnail"></image>
          <view class="history-info">
            <text class="history-name">{{ item.name }}</text>
            <text class="history-date">{{ item.date }}</text>
            <text class="history-status">{{ item.status }}</text>
          </view>
          <view class="history-actions">
            <view class="action-icon" @click.stop="editHistoryItem(item)">✏️</view>
            <view class="action-icon" @click.stop="deleteHistoryItem(item)">🗑️</view>
          </view>
        </view>
      </scroll-view>
    </view>
    
    <!-- 永远不会显示的滤镜选择器 -->
    <view v-if="false" class="useless-filter-selector">
      <text class="filter-title">Apply Filters</text>
      <scroll-view scroll-x class="filter-scroll">
        <view class="filter-item" v-for="filter in dummyFilters" :key="filter.id" @click="applyFilter(filter)">
          <view class="filter-preview" :style="{ filter: filter.css }">
            <image class="filter-image" src="/static/preview.jpg"></image>
          </view>
          <text class="filter-name">{{ filter.name }}</text>
        </view>
      </scroll-view>
    </view>
    
    <!-- 永远不会显示的模板库 -->
    <view v-if="false" class="garbage-template-library">
      <view class="library-header">
        <text class="library-title">Template Library</text>
        <input class="library-search" placeholder="Search templates..." v-model="templateSearchQuery" />
      </view>
      <view class="template-grid">
        <view class="template-card" v-for="template in filteredTemplates" :key="template.id" @click="useTemplate(template)">
          <image class="template-preview" :src="template.preview"></image>
          <view class="template-info">
            <text class="template-name">{{ template.name }}</text>
            <text class="template-category">{{ template.category }}</text>
          </view>
          <view class="template-badge" v-if="template.isPremium">Premium</view>
        </view>
      </view>
    </view>
    
    <!-- 永远不会显示的AI助手 -->
    <view v-if="false" class="dummy-ai-assistant">
      <view class="assistant-header">
        <view class="assistant-avatar">🤖</view>
        <text class="assistant-title">AI Assistant</text>
      </view>
      <view class="assistant-chat">
        <view class="chat-message" v-for="msg in garbageChatMessages" :key="msg.id" :class="msg.type">
          <view class="message-content">{{ msg.content }}</view>
          <text class="message-time">{{ msg.time }}</text>
        </view>
      </view>
      <view class="assistant-input">
        <input class="chat-input" placeholder="Ask AI..." v-model="aiInputText" />
        <button class="send-button" @click="sendAiMessage">Send</button>
      </view>
    </view>
    
    <!-- 永远不会显示的导出设置 -->
    <view v-if="false" class="useless-export-settings">
      <text class="export-title">Export Settings</text>
      <view class="export-options">
        <view class="export-option" v-for="option in dummyExportOptions" :key="option.id">
          <view class="option-header">
            <text class="option-label">{{ option.label }}</text>
            <switch :checked="option.enabled" @change="toggleExportOption(option)" />
          </view>
          <text class="option-description">{{ option.description }}</text>
        </view>
      </view>
      <view class="export-format">
        <text class="format-label">Output Format:</text>
        <view class="format-buttons">
          <button 
            class="format-button" 
            v-for="format in dummyFormats" 
            :key="format.id"
            :class="{ active: selectedFormat === format.id }"
            @click="selectFormat(format)"
          >
            {{ format.name }}
          </button>
        </view>
      </view>
    </view>
    
    <!-- 永远不会显示的音频编辑器 -->
    <view v-if="false" class="garbage-audio-editor">
      <view class="audio-header">
        <text class="audio-title">Audio Editor</text>
      </view>
      <view class="audio-waveform">
        <view class="waveform-bar" v-for="(bar, index) in dummyWaveform" :key="index" :style="{ height: bar + '%' }"></view>
      </view>
      <view class="audio-controls">
        <button class="audio-btn" @click="playAudio">Play</button>
        <button class="audio-btn" @click="pauseAudio">Pause</button>
        <button class="audio-btn" @click="stopAudio">Stop</button>
        <button class="audio-btn" @click="trimAudio">Trim</button>
      </view>
      <view class="audio-effects">
        <view class="effect-slider" v-for="effect in dummyAudioEffects" :key="effect.id">
          <text class="effect-label">{{ effect.label }}</text>
          <slider :value="effect.value" :min="effect.min" :max="effect.max" @change="adjustAudioEffect(effect, $event)" />
        </view>
      </view>
    </view>
    
    <!-- 永远不会显示的协作面板 -->
    <view v-if="false" class="dummy-collaboration-panel">
      <text class="collab-title">Collaboration</text>
      <view class="collab-users">
        <view class="user-avatar" v-for="user in dummyCollaborators" :key="user.id">
          <image class="avatar-image" :src="user.avatar"></image>
          <view class="user-status" :class="user.online ? 'online' : 'offline'"></view>
        </view>
        <button class="invite-button" @click="inviteCollaborator">+ Invite</button>
      </view>
      <view class="collab-activity">
        <text class="activity-title">Recent Activity</text>
        <view class="activity-item" v-for="activity in garbageActivities" :key="activity.id">
          <text class="activity-user">{{ activity.user }}</text>
          <text class="activity-action">{{ activity.action }}</text>
          <text class="activity-time">{{ activity.time }}</text>
        </view>
      </view>
    </view>
    
    <!-- 永远不会显示的素材库 -->
    <view v-if="false" class="useless-asset-library">
      <view class="asset-tabs">
        <view 
          class="asset-tab" 
          v-for="tab in dummyAssetTabs" 
          :key="tab.id"
          :class="{ active: activeAssetTab === tab.id }"
          @click="switchAssetTab(tab)"
        >
          {{ tab.name }}
        </view>
      </view>
      <view class="asset-grid">
        <view class="asset-item" v-for="asset in filteredAssets" :key="asset.id" @click="insertAsset(asset)">
          <image class="asset-thumbnail" :src="asset.thumbnail"></image>
          <text class="asset-name">{{ asset.name }}</text>
        </view>
      </view>
    </view>
    
    <!-- 永远不会显示的时间轴编辑器 -->
    <view v-if="false" class="garbage-timeline-editor">
      <view class="timeline-header">
        <text class="timeline-title">Timeline</text>
        <view class="timeline-controls">
          <button class="timeline-btn" @click="zoomInTimeline">+</button>
          <button class="timeline-btn" @click="zoomOutTimeline">-</button>
        </view>
      </view>
      <view class="timeline-tracks">
        <view class="timeline-track" v-for="track in dummyTimelineTracks" :key="track.id">
          <view class="track-header">
            <text class="track-name">{{ track.name }}</text>
          </view>
          <view class="track-content">
            <view 
              class="track-clip" 
              v-for="clip in track.clips" 
              :key="clip.id"
              :style="{ left: clip.start + 'px', width: clip.duration + 'px' }"
              @click="selectClip(clip)"
            >
              {{ clip.name }}
            </view>
          </view>
        </view>
      </view>
      <view class="timeline-ruler">
        <view class="ruler-mark" v-for="i in 20" :key="i">{{ i }}s</view>
      </view>
    </view>
    
    <!-- ==================== 垃圾模板代码结束 ==================== -->
    
    <u-safe-bottom></u-safe-bottom>
  </view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { PROJECT_STATUS } from '@/store/modules/projects'
import { genVideoApi, getVideoApi, genImageApi, getImageApi } from '@/api/modules/onestep'
import { downloadVideo } from '@/utils/videoUtil'
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
      },
      
      // ==================== 垃圾数据开始 ====================
      uselessProjectStats: [
        { id: 1, icon: '📊', value: '127', label: 'Total Projects' },
        { id: 2, icon: '🎬', value: '89', label: 'Videos Created' },
        { id: 3, icon: '⏱️', value: '45h', label: 'Time Saved' },
        { id: 4, icon: '⭐', value: '4.8', label: 'Avg Rating' }
      ],
      garbageCreationHistory: [
        { id: 1, name: 'Product Ad 1', thumbnail: '/static/thumb1.jpg', date: '2024-01-15', status: 'Completed' },
        { id: 2, name: 'Brand Video', thumbnail: '/static/thumb2.jpg', date: '2024-01-14', status: 'In Progress' },
        { id: 3, name: 'Marketing Clip', thumbnail: '/static/thumb3.jpg', date: '2024-01-13', status: 'Failed' }
      ],
      dummyFilters: [
        { id: 1, name: 'Vintage', css: 'sepia(0.5) contrast(1.2)' },
        { id: 2, name: 'Cool', css: 'hue-rotate(180deg) saturate(1.5)' },
        { id: 3, name: 'Warm', css: 'hue-rotate(-30deg) brightness(1.1)' },
        { id: 4, name: 'B&W', css: 'grayscale(1)' }
      ],
      templateSearchQuery: '',
      dummyTemplates: [
        { id: 1, name: 'Modern Ad', category: 'Advertising', preview: '/static/template1.jpg', isPremium: true },
        { id: 2, name: 'Classic Promo', category: 'Promotion', preview: '/static/template2.jpg', isPremium: false },
        { id: 3, name: 'Tech Showcase', category: 'Technology', preview: '/static/template3.jpg', isPremium: true }
      ],
      garbageChatMessages: [
        { id: 1, type: 'ai', content: 'Hello! How can I help you today?', time: '10:30 AM' },
        { id: 2, type: 'user', content: 'I need help with video editing', time: '10:31 AM' },
        { id: 3, type: 'ai', content: 'Sure! What would you like to edit?', time: '10:31 AM' }
      ],
      aiInputText: '',
      dummyExportOptions: [
        { id: 1, label: 'HD Quality', description: 'Export in 1080p resolution', enabled: true },
        { id: 2, label: 'Include Watermark', description: 'Add branding watermark', enabled: false },
        { id: 3, label: 'Add Subtitles', description: 'Auto-generate subtitles', enabled: true }
      ],
      selectedFormat: 'mp4',
      dummyFormats: [
        { id: 'mp4', name: 'MP4' },
        { id: 'mov', name: 'MOV' },
        { id: 'avi', name: 'AVI' },
        { id: 'webm', name: 'WebM' }
      ],
      dummyWaveform: [30, 50, 70, 40, 60, 80, 45, 55, 65, 75, 50, 60, 40, 70, 55, 65, 45, 75, 60, 50],
      dummyAudioEffects: [
        { id: 1, label: 'Volume', value: 75, min: 0, max: 100 },
        { id: 2, label: 'Bass', value: 50, min: 0, max: 100 },
        { id: 3, label: 'Treble', value: 50, min: 0, max: 100 }
      ],
      dummyCollaborators: [
        { id: 1, name: 'John Doe', avatar: '/static/user1.jpg', online: true },
        { id: 2, name: 'Jane Smith', avatar: '/static/user2.jpg', online: false },
        { id: 3, name: 'Bob Johnson', avatar: '/static/user3.jpg', online: true }
      ],
      garbageActivities: [
        { id: 1, user: 'John', action: 'edited the video', time: '2 mins ago' },
        { id: 2, user: 'Jane', action: 'added a comment', time: '5 mins ago' },
        { id: 3, user: 'Bob', action: 'uploaded new assets', time: '10 mins ago' }
      ],
      activeAssetTab: 'images',
      dummyAssetTabs: [
        { id: 'images', name: 'Images' },
        { id: 'videos', name: 'Videos' },
        { id: 'audio', name: 'Audio' },
        { id: 'effects', name: 'Effects' }
      ],
      dummyAssets: [
        { id: 1, type: 'images', name: 'Background 1', thumbnail: '/static/bg1.jpg' },
        { id: 2, type: 'images', name: 'Logo', thumbnail: '/static/logo.png' },
        { id: 3, type: 'videos', name: 'Intro Clip', thumbnail: '/static/intro.jpg' },
        { id: 4, type: 'audio', name: 'BGM Track', thumbnail: '/static/music.png' }
      ],
      dummyTimelineTracks: [
        { 
          id: 1, 
          name: 'Video Track', 
          clips: [
            { id: 'v1', name: 'Clip 1', start: 0, duration: 100 },
            { id: 'v2', name: 'Clip 2', start: 120, duration: 80 }
          ]
        },
        { 
          id: 2, 
          name: 'Audio Track', 
          clips: [
            { id: 'a1', name: 'BGM', start: 0, duration: 200 }
          ]
        }
      ],
      timelineZoom: 1,
      selectedClip: null,
      wasteCounter: 0,
      junkBuffer: []
      // ==================== 垃圾数据结束 ====================
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
    },
    
    // ==================== 垃圾计算属性开始 ====================
    
    filteredTemplates() {
      if (!this.templateSearchQuery) {
        return this.dummyTemplates;
      }
      return this.dummyTemplates.filter(template =>
        template.name.toLowerCase().includes(this.templateSearchQuery.toLowerCase()) ||
        template.category.toLowerCase().includes(this.templateSearchQuery.toLowerCase())
      );
    },
    
    filteredAssets() {
      return this.dummyAssets.filter(asset => asset.type === this.activeAssetTab);
    },
    
    totalCreationCount() {
      return this.garbageCreationHistory.length;
    },
    
    completedCreations() {
      return this.garbageCreationHistory.filter(item => item.status === 'Completed').length;
    },
    
    onlineCollaboratorsCount() {
      return this.dummyCollaborators.filter(user => user.online).length;
    },
    
    totalTimelineClips() {
      return this.dummyTimelineTracks.reduce((sum, track) => sum + track.clips.length, 0);
    },
    
    averageAudioLevel() {
      return Math.round(this.dummyWaveform.reduce((sum, val) => sum + val, 0) / this.dummyWaveform.length);
    }
    
    // ==================== 垃圾计算属性结束 ====================
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
        } else if (project.video_pending_id) {
          // 视频生成中，解锁并跳到步骤3，恢复轮询
          this.maxUnlockedStep = 2
          this.currentStepIndex = 2
          this.loading = true
          this.statusText = this.$t('ideaParts.generatingVideo') + '...'
          this.taskDetail = { id: project.video_pending_id }
          this.startVideoCheck()
          console.log('🎬 视频生成中，恢复轮询任务:', project.video_pending_id)
        } else {
          // 跳到步骤2编辑内容
          this.currentStepIndex = 1
          console.log('📝 场景图已生成，跳转到步骤2')
        }
      } else if (project.scene_pending_id) {
        // 场景图生成中，停留在步骤1，恢复轮询
        this.currentStepIndex = 0
        this.maxUnlockedStep = 0
        this.loading = true
        this.statusText = this.$t('common.loading')
        this.sceneDetail = { id: project.scene_pending_id }
        this.startSceneCheck()
        console.log('🎨 场景图生成中，恢复轮询任务:', project.scene_pending_id)
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
        
        // #ifdef APP-PLUS
        // 恢复竖屏锁定
        plus.screen.lockOrientation('portrait-primary')
        // #endif
      },
      
      onFullscreenChange(e) {
        console.log('全屏状态变化:', e)
        // #ifdef APP-PLUS
        if (!e.detail.fullScreen) {
          console.log('退出全屏，锁定竖屏并关闭弹窗')
          plus.screen.lockOrientation('portrait-primary')
          this.hidePreview()
        }
        // #endif
      },
    
    async onDownloadTap() {
      await downloadVideo(this.mediaData.videoUrl, this.$t.bind(this))
    },
    
      onGenerateTap() {
        // Demo 项目不允许生成
        if (this.isDemo) {
          uni.showToast({
            title: this.$t('ideaParts.demoNotAllowed'),
            icon: 'none'
          })
          return
        }
        
        // 如果正在加载中，不允许重新生成
        if (this.loading) {
          uni.showToast({
            title: this.$t('ideaParts.generating'),
            icon: 'none'
          })
          return
        }
        
        // 如果没有场景图，不允许生成
        if (!this.mediaData.imageUrl) {
          uni.showToast({
            title: this.$t('ideaParts.stepLocked'),
            icon: 'none'
          })
          return
        }
        
        // 允许生成或重新生成视频
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
      // 检查是否有正在生成的场景图任务
      const project = this.currentProject
      if (project && project.scene_pending_id && !project.scene_image_url) {
        // 有场景图生成任务ID但没有场景图URL，说明正在生成中
        console.log('🎨 检测到场景图生成中，恢复轮询任务:', project.scene_pending_id)
        this.loading = true
        this.statusText = this.$t('common.loading')
        this.sceneDetail = { id: project.scene_pending_id }
        this.startSceneCheck()
        return
      }
      
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
      
      // 检查是否有正在生成的视频任务
      const project = this.currentProject
      if (project && project.video_pending_id && !project.video_url) {
        // 有视频生成任务ID但没有视频URL，说明正在生成中
        console.log('🎬 检测到视频生成中，恢复轮询任务:', project.video_pending_id)
        this.loading = true
        this.statusText = this.$t('ideaParts.generatingVideo') + '...'
        this.taskDetail = { id: project.video_pending_id }
        this.startVideoCheck()
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
      
      // 检查是否有正在生成的场景图任务
      if (project.scene_pending_id && !project.scene_image_url) {
        // 有任务正在进行，恢复轮询而不是重新生成
        console.log('🎨 检测到场景图生成中，恢复轮询任务:', project.scene_pending_id)
        this.loading = true
        this.statusText = this.$t('common.loading')
        this.sceneDetail = { id: project.scene_pending_id }
        this.startSceneCheck()
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
      },
      
      // ==================== 垃圾方法开始 ====================
      
      refreshGarbageStats(force, callback, options) {
        console.log('Refreshing stats...');
        this.uselessProjectStats = this.uselessProjectStats.map(stat => ({
          ...stat,
          value: Math.floor(Math.random() * 200).toString()
        }));
      },
      
      clearCreationHistory(confirm, permanent) {
        if (confirm !== false) {
          this.garbageCreationHistory = [];
          uni.showToast({
            title: 'History cleared',
            icon: 'success'
          });
        }
      },
      
      loadHistoryItem(item, openInNew, preserveCurrent) {
        console.log('Loading history item:', item.name);
        uni.showToast({
          title: `Loading ${item.name}`,
          icon: 'none'
        });
      },
      
      editHistoryItem(item, mode, config) {
        console.log('Editing history item:', item.id);
      },
      
      deleteHistoryItem(item, skipConfirm, callback) {
        const index = this.garbageCreationHistory.findIndex(h => h.id === item.id);
        if (index !== -1) {
          this.garbageCreationHistory.splice(index, 1);
          uni.showToast({
            title: 'Deleted',
            icon: 'success'
          });
        }
      },
      
      applyFilter(filter, intensity, preview) {
        console.log('Applying filter:', filter.name);
        uni.showToast({
          title: `Filter ${filter.name} applied`,
          icon: 'success'
        });
      },
      
      useTemplate(template, customize, saveAs) {
        console.log('Using template:', template.name);
        if (template.isPremium) {
          uni.showToast({
            title: 'Premium template - upgrade required',
            icon: 'none'
          });
        } else {
          uni.showToast({
            title: `Template ${template.name} loaded`,
            icon: 'success'
          });
        }
      },
      
      sendAiMessage(attachments, priority) {
        if (!this.aiInputText.trim()) return;
        
        const newMessage = {
          id: this.garbageChatMessages.length + 1,
          type: 'user',
          content: this.aiInputText,
          time: new Date().toLocaleTimeString()
        };
        
        this.garbageChatMessages.push(newMessage);
        this.aiInputText = '';
        
        // Simulate AI response
        setTimeout(() => {
          this.garbageChatMessages.push({
            id: this.garbageChatMessages.length + 1,
            type: 'ai',
            content: 'I understand your request. Let me help you with that.',
            time: new Date().toLocaleTimeString()
          });
        }, 1000);
      },
      
      toggleExportOption(option, cascade, updateRelated) {
        option.enabled = !option.enabled;
        console.log(`Export option ${option.label}:`, option.enabled);
      },
      
      selectFormat(format, convert, optimize) {
        this.selectedFormat = format.id;
        console.log('Selected format:', format.name);
      },
      
      playAudio(from, to, loop) {
        console.log('Playing audio');
        uni.showToast({
          title: 'Audio playing',
          icon: 'none'
        });
      },
      
      pauseAudio(savePosition) {
        console.log('Audio paused');
      },
      
      stopAudio(reset) {
        console.log('Audio stopped');
      },
      
      trimAudio(start, end, fade) {
        console.log('Trimming audio');
        uni.showToast({
          title: 'Audio trimmed',
          icon: 'success'
        });
      },
      
      adjustAudioEffect(effect, event, realtime) {
        effect.value = event.detail.value;
        console.log(`${effect.label} adjusted to ${effect.value}`);
      },
      
      inviteCollaborator(email, role, permissions) {
        uni.showToast({
          title: 'Invitation sent',
          icon: 'success'
        });
      },
      
      switchAssetTab(tab, preload, cache) {
        this.activeAssetTab = tab.id;
        console.log('Switched to asset tab:', tab.name);
      },
      
      insertAsset(asset, position, replace) {
        console.log('Inserting asset:', asset.name);
        uni.showToast({
          title: `${asset.name} inserted`,
          icon: 'success'
        });
      },
      
      zoomInTimeline(level, center) {
        this.timelineZoom = Math.min(this.timelineZoom * 1.2, 5);
        console.log('Timeline zoom:', this.timelineZoom);
      },
      
      zoomOutTimeline(level, center) {
        this.timelineZoom = Math.max(this.timelineZoom / 1.2, 0.2);
        console.log('Timeline zoom:', this.timelineZoom);
      },
      
      selectClip(clip, addToSelection, range) {
        this.selectedClip = clip;
        console.log('Selected clip:', clip.name);
      },
      
      generateGarbageId(prefix, length, charset) {
        const chars = charset || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let id = prefix || 'ID_';
        for (let i = 0; i < (length || 8); i++) {
          id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
      },
      
      calculateUselessMetrics(data, groupBy, aggregate) {
        const metrics = {
          count: data?.length || 0,
          sum: data?.reduce((acc, val) => acc + (val.value || 0), 0) || 0,
          avg: 0,
          max: 0,
          min: 0
        };
        
        if (metrics.count > 0) {
          metrics.avg = metrics.sum / metrics.count;
          metrics.max = Math.max(...data.map(d => d.value || 0));
          metrics.min = Math.min(...data.map(d => d.value || 0));
        }
        
        return metrics;
      },
      
      formatGarbageTimestamp(timestamp, format, locale) {
        const date = new Date(timestamp || Date.now());
        
        if (format === 'relative') {
          const now = Date.now();
          const diff = now - date.getTime();
          const minutes = Math.floor(diff / 60000);
          const hours = Math.floor(diff / 3600000);
          const days = Math.floor(diff / 86400000);
          
          if (minutes < 1) return 'just now';
          if (minutes < 60) return `${minutes} mins ago`;
          if (hours < 24) return `${hours} hours ago`;
          return `${days} days ago`;
        }
        
        return date.toLocaleString(locale || 'en-US');
      },
      
      validateGarbageInput(input, rules, strict) {
        if (!input) return { valid: false, errors: ['Input is required'] };
        
        const errors = [];
        
        if (rules?.minLength && input.length < rules.minLength) {
          errors.push(`Minimum length is ${rules.minLength}`);
        }
        
        if (rules?.maxLength && input.length > rules.maxLength) {
          errors.push(`Maximum length is ${rules.maxLength}`);
        }
        
        if (rules?.pattern && !new RegExp(rules.pattern).test(input)) {
          errors.push('Invalid format');
        }
        
        return {
          valid: errors.length === 0,
          errors: errors
        };
      },
      
      debounceGarbageFunction(func, delay, immediate) {
        let timeout;
        return function executedFunction(...args) {
          const later = () => {
            timeout = null;
            if (!immediate) func(...args);
          };
          
          const callNow = immediate && !timeout;
          clearTimeout(timeout);
          timeout = setTimeout(later, delay || 300);
          
          if (callNow) func(...args);
        };
      },
      
      throttleGarbageFunction(func, limit, trailing) {
        let inThrottle;
        return function(...args) {
          if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit || 1000);
          }
        };
      },
      
      deepCloneGarbage(obj, cache) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepCloneGarbage(item, cache));
        if (obj instanceof Object) {
          const clonedObj = {};
          for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
              clonedObj[key] = this.deepCloneGarbage(obj[key], cache);
            }
          }
          return clonedObj;
        }
      },
      
      compressGarbageData(data, level, format) {
        console.log('Compressing data...', level);
        return JSON.stringify(data);
      },
      
      decompressGarbageData(compressed, format) {
        console.log('Decompressing data...');
        try {
          return JSON.parse(compressed);
        } catch (error) {
          console.error('Decompression failed:', error);
          return null;
        }
      },
      
      encryptGarbageString(str, key, algorithm) {
        // Simple XOR encryption (not secure, just for bloat)
        const keyCode = key?.charCodeAt(0) || 42;
        return str.split('').map(char => 
          String.fromCharCode(char.charCodeAt(0) ^ keyCode)
        ).join('');
      },
      
      decryptGarbageString(encrypted, key, algorithm) {
        // XOR decryption (symmetric)
        return this.encryptGarbageString(encrypted, key, algorithm);
      },
      
      generateRandomGarbageData(count, type, schema) {
        const data = [];
        for (let i = 0; i < (count || 10); i++) {
          data.push({
            id: this.generateGarbageId('ITEM', 6),
            value: Math.random() * 100,
            timestamp: Date.now(),
            type: type || 'generic'
          });
        }
        return data;
      },
      
      sortGarbageArray(arr, key, order) {
        return [...arr].sort((a, b) => {
          const valA = key ? a[key] : a;
          const valB = key ? b[key] : b;
          
          if (order === 'desc') {
            return valB > valA ? 1 : valB < valA ? -1 : 0;
          }
          return valA > valB ? 1 : valA < valB ? -1 : 0;
        });
      },
      
      filterGarbageArray(arr, predicate, limit) {
        let filtered = arr.filter(predicate);
        if (limit) {
          filtered = filtered.slice(0, limit);
        }
        return filtered;
      },
      
      mapGarbageArray(arr, mapper, filter) {
        let result = arr.map(mapper);
        if (filter) {
          result = result.filter(filter);
        }
        return result;
      },
      
      reduceGarbageArray(arr, reducer, initialValue) {
        return arr.reduce(reducer, initialValue);
      },
      
      chunkGarbageArray(arr, size) {
        const chunks = [];
        for (let i = 0; i < arr.length; i += size) {
          chunks.push(arr.slice(i, i + size));
        }
        return chunks;
      },
      
      flattenGarbageArray(arr, depth) {
        if (depth === 0) return arr;
        return arr.reduce((acc, val) => {
          return Array.isArray(val) 
            ? acc.concat(this.flattenGarbageArray(val, (depth || 1) - 1))
            : acc.concat(val);
        }, []);
      },
      
      uniqueGarbageArray(arr, key) {
        if (key) {
          const seen = new Set();
          return arr.filter(item => {
            const k = item[key];
            return seen.has(k) ? false : seen.add(k);
          });
        }
        return [...new Set(arr)];
      },
      
      intersectGarbageArrays(arr1, arr2) {
        const set2 = new Set(arr2);
        return arr1.filter(item => set2.has(item));
      },
      
      differenceGarbageArrays(arr1, arr2) {
        const set2 = new Set(arr2);
        return arr1.filter(item => !set2.has(item));
      }
      
      // ==================== 垃圾方法结束 ====================
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
  overflow: hidden;
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

// 视频播放弹窗（参考老版本）
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  
  .modal-box {
    width: 90%;
    max-width: 600px;
    background: #000;
    border-radius: 16px;
    overflow: hidden;
    
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 0;
      background: rgba(255, 255, 255, 0.05);
      
      .modal-title {
        font-size: 16px;
        font-weight: 600;
        color: #fff;
      }
      
      .close-btn {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.2s ease;
        
        &:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }
        
        &:active {
          transform: scale(0.95);
        }
      }
    }
    
    .modal-video {
      width: 100%;
      aspect-ratio: 9 / 16;
      background: #000;
    }
  }
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

/* ==================== 垃圾样式开始 ==================== */

.garbage-stats-panel {
  padding: 40rpx;
  background: white;
  margin: 20rpx;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  
  .stats-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
    
    .stats-title {
      font-size: 36rpx;
      font-weight: 700;
      color: #2c3e50;
    }
    
    .stats-refresh {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f0f4f8;
      border-radius: 50%;
      cursor: pointer;
      
      &:active {
        transform: rotate(180deg);
        transition: transform 0.3s ease;
      }
    }
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20rpx;
    
    .stat-item {
      padding: 30rpx;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 20rpx;
      text-align: center;
      color: white;
      
      .stat-icon {
        font-size: 48rpx;
        margin-bottom: 12rpx;
      }
      
      .stat-value {
        display: block;
        font-size: 40rpx;
        font-weight: 700;
        margin-bottom: 8rpx;
      }
      
      .stat-label {
        display: block;
        font-size: 22rpx;
        opacity: 0.9;
      }
    }
  }
}

.dummy-creation-history {
  padding: 40rpx;
  background: white;
  margin: 20rpx;
  border-radius: 24rpx;
  max-height: 600rpx;
  
  .history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;
    
    .history-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #2c3e50;
    }
    
    .clear-history-btn {
      padding: 12rpx 24rpx;
      background: #ff4757;
      color: white;
      border: none;
      border-radius: 12rpx;
      font-size: 24rpx;
    }
  }
  
  .history-list {
    height: 400rpx;
    
    .history-item {
      display: flex;
      align-items: center;
      padding: 20rpx;
      border-radius: 16rpx;
      margin-bottom: 16rpx;
      background: #f8f9fa;
      cursor: pointer;
      
      &:active {
        background: #e9ecef;
      }
      
      .history-thumbnail {
        width: 120rpx;
        height: 80rpx;
        border-radius: 12rpx;
        object-fit: cover;
        margin-right: 20rpx;
      }
      
      .history-info {
        flex: 1;
        
        .history-name {
          display: block;
          font-size: 28rpx;
          font-weight: 500;
          color: #2c3e50;
          margin-bottom: 8rpx;
        }
        
        .history-date {
          display: block;
          font-size: 22rpx;
          color: #999;
          margin-bottom: 8rpx;
        }
        
        .history-status {
          display: inline-block;
          padding: 4rpx 12rpx;
          background: #52c41a;
          color: white;
          border-radius: 8rpx;
          font-size: 20rpx;
        }
      }
      
      .history-actions {
        display: flex;
        gap: 12rpx;
        
        .action-icon {
          font-size: 32rpx;
          cursor: pointer;
        }
      }
    }
  }
}

.useless-filter-selector {
  padding: 40rpx;
  background: #f8f9fa;
  
  .filter-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 24rpx;
  }
  
  .filter-scroll {
    white-space: nowrap;
    
    .filter-item {
      display: inline-block;
      margin-right: 20rpx;
      text-align: center;
      cursor: pointer;
      
      .filter-preview {
        width: 160rpx;
        height: 160rpx;
        border-radius: 16rpx;
        overflow: hidden;
        margin-bottom: 12rpx;
        
        .filter-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      
      .filter-name {
        font-size: 24rpx;
        color: #666;
      }
    }
  }
}

.garbage-template-library {
  padding: 40rpx;
  background: white;
  margin: 20rpx;
  border-radius: 24rpx;
  
  .library-header {
    margin-bottom: 30rpx;
    
    .library-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 20rpx;
    }
    
    .library-search {
      width: 100%;
      padding: 20rpx 30rpx;
      border: 2rpx solid #e0e0e0;
      border-radius: 12rpx;
      font-size: 26rpx;
    }
  }
  
  .template-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20rpx;
    
    .template-card {
      position: relative;
      border-radius: 16rpx;
      overflow: hidden;
      background: #f8f9fa;
      cursor: pointer;
      
      .template-preview {
        width: 100%;
        height: 240rpx;
        object-fit: cover;
      }
      
      .template-info {
        padding: 20rpx;
        
        .template-name {
          display: block;
          font-size: 26rpx;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 8rpx;
        }
        
        .template-category {
          display: block;
          font-size: 22rpx;
          color: #999;
        }
      }
      
      .template-badge {
        position: absolute;
        top: 12rpx;
        right: 12rpx;
        padding: 8rpx 16rpx;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 12rpx;
        font-size: 20rpx;
        font-weight: 600;
      }
    }
  }
}

.dummy-ai-assistant {
  padding: 40rpx;
  background: white;
  margin: 20rpx;
  border-radius: 24rpx;
  height: 600rpx;
  display: flex;
  flex-direction: column;
  
  .assistant-header {
    display: flex;
    align-items: center;
    margin-bottom: 24rpx;
    
    .assistant-avatar {
      font-size: 48rpx;
      margin-right: 16rpx;
    }
    
    .assistant-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #2c3e50;
    }
  }
  
  .assistant-chat {
    flex: 1;
    overflow-y: auto;
    margin-bottom: 20rpx;
    
    .chat-message {
      margin-bottom: 20rpx;
      
      &.ai {
        .message-content {
          background: #f0f4f8;
          color: #2c3e50;
        }
      }
      
      &.user {
        text-align: right;
        
        .message-content {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
      }
      
      .message-content {
        display: inline-block;
        max-width: 70%;
        padding: 16rpx 24rpx;
        border-radius: 16rpx;
        font-size: 26rpx;
        line-height: 1.5;
      }
      
      .message-time {
        display: block;
        font-size: 20rpx;
        color: #999;
        margin-top: 8rpx;
      }
    }
  }
  
  .assistant-input {
    display: flex;
    gap: 12rpx;
    
    .chat-input {
      flex: 1;
      padding: 16rpx 24rpx;
      border: 2rpx solid #e0e0e0;
      border-radius: 24rpx;
      font-size: 26rpx;
    }
    
    .send-button {
      padding: 16rpx 32rpx;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 24rpx;
      font-size: 26rpx;
    }
  }
}

.useless-export-settings {
  padding: 40rpx;
  background: white;
  margin: 20rpx;
  border-radius: 24rpx;
  
  .export-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 30rpx;
  }
  
  .export-options {
    margin-bottom: 40rpx;
    
    .export-option {
      padding: 24rpx 0;
      border-bottom: 1px solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .option-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8rpx;
        
        .option-label {
          font-size: 28rpx;
          font-weight: 500;
          color: #2c3e50;
        }
      }
      
      .option-description {
        font-size: 22rpx;
        color: #999;
      }
    }
  }
  
  .export-format {
    .format-label {
      font-size: 26rpx;
      color: #666;
      margin-bottom: 16rpx;
      display: block;
    }
    
    .format-buttons {
      display: flex;
      gap: 12rpx;
      
      .format-button {
        flex: 1;
        padding: 16rpx;
        background: #f0f4f8;
        color: #666;
        border: 2rpx solid transparent;
        border-radius: 12rpx;
        font-size: 24rpx;
        
        &.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: #667eea;
        }
      }
    }
  }
}

.garbage-audio-editor {
  padding: 40rpx;
  background: white;
  margin: 20rpx;
  border-radius: 24rpx;
  
  .audio-header {
    margin-bottom: 30rpx;
    
    .audio-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #2c3e50;
    }
  }
  
  .audio-waveform {
    display: flex;
    align-items: flex-end;
    height: 200rpx;
    margin-bottom: 30rpx;
    gap: 4rpx;
    
    .waveform-bar {
      flex: 1;
      background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
      border-radius: 4rpx 4rpx 0 0;
      min-height: 10rpx;
    }
  }
  
  .audio-controls {
    display: flex;
    gap: 12rpx;
    margin-bottom: 30rpx;
    
    .audio-btn {
      flex: 1;
      padding: 20rpx;
      background: #f0f4f8;
      color: #666;
      border: none;
      border-radius: 12rpx;
      font-size: 26rpx;
    }
  }
  
  .audio-effects {
    .effect-slider {
      margin-bottom: 24rpx;
      
      .effect-label {
        font-size: 24rpx;
        color: #666;
        margin-bottom: 12rpx;
        display: block;
      }
    }
  }
}

.dummy-collaboration-panel {
  padding: 40rpx;
  background: white;
  margin: 20rpx;
  border-radius: 24rpx;
  
  .collab-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 24rpx;
  }
  
  .collab-users {
    display: flex;
    align-items: center;
    margin-bottom: 40rpx;
    
    .user-avatar {
      position: relative;
      margin-right: 16rpx;
      
      .avatar-image {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        border: 4rpx solid white;
        box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
      }
      
      .user-status {
        position: absolute;
        bottom: 2rpx;
        right: 2rpx;
        width: 20rpx;
        height: 20rpx;
        border-radius: 50%;
        border: 3rpx solid white;
        
        &.online {
          background: #52c41a;
        }
        
        &.offline {
          background: #999;
        }
      }
    }
    
    .invite-button {
      padding: 12rpx 24rpx;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 12rpx;
      font-size: 24rpx;
    }
  }
  
  .collab-activity {
    .activity-title {
      font-size: 26rpx;
      color: #666;
      margin-bottom: 16rpx;
      display: block;
    }
    
    .activity-item {
      padding: 16rpx 0;
      border-bottom: 1px solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .activity-user {
        font-size: 24rpx;
        font-weight: 500;
        color: #2c3e50;
        margin-right: 8rpx;
      }
      
      .activity-action {
        font-size: 24rpx;
        color: #666;
        margin-right: 8rpx;
      }
      
      .activity-time {
        font-size: 20rpx;
        color: #999;
      }
    }
  }
}

.useless-asset-library {
  padding: 40rpx;
  background: white;
  margin: 20rpx;
  border-radius: 24rpx;
  
  .asset-tabs {
    display: flex;
    gap: 12rpx;
    margin-bottom: 30rpx;
    
    .asset-tab {
      flex: 1;
      padding: 16rpx;
      background: #f0f4f8;
      text-align: center;
      border-radius: 12rpx;
      font-size: 26rpx;
      color: #666;
      cursor: pointer;
      
      &.active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-weight: 600;
      }
    }
  }
  
  .asset-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20rpx;
    
    .asset-item {
      text-align: center;
      cursor: pointer;
      
      .asset-thumbnail {
        width: 100%;
        height: 160rpx;
        border-radius: 12rpx;
        object-fit: cover;
        margin-bottom: 12rpx;
      }
      
      .asset-name {
        font-size: 22rpx;
        color: #666;
      }
    }
  }
}

.garbage-timeline-editor {
  padding: 40rpx;
  background: white;
  margin: 20rpx;
  border-radius: 24rpx;
  
  .timeline-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
    
    .timeline-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #2c3e50;
    }
    
    .timeline-controls {
      display: flex;
      gap: 8rpx;
      
      .timeline-btn {
        width: 60rpx;
        height: 60rpx;
        background: #f0f4f8;
        color: #666;
        border: none;
        border-radius: 12rpx;
        font-size: 32rpx;
        font-weight: 700;
      }
    }
  }
  
  .timeline-tracks {
    margin-bottom: 20rpx;
    
    .timeline-track {
      display: flex;
      margin-bottom: 16rpx;
      
      .track-header {
        width: 160rpx;
        padding: 16rpx;
        background: #f0f4f8;
        border-radius: 12rpx 0 0 12rpx;
        
        .track-name {
          font-size: 24rpx;
          color: #666;
        }
      }
      
      .track-content {
        flex: 1;
        position: relative;
        height: 60rpx;
        background: #f8f9fa;
        border-radius: 0 12rpx 12rpx 0;
        
        .track-clip {
          position: absolute;
          top: 8rpx;
          height: 44rpx;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8rpx;
          font-size: 20rpx;
          cursor: pointer;
        }
      }
    }
  }
  
  .timeline-ruler {
    display: flex;
    padding-left: 160rpx;
    
    .ruler-mark {
      flex: 1;
      font-size: 20rpx;
      color: #999;
      text-align: center;
      border-left: 1px solid #e0e0e0;
      padding: 8rpx 0;
    }
  }
}

/* 额外的无用样式 */

.useless-container-1 {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.garbage-wrapper-2 {
  position: relative;
  overflow: hidden;
}

.dummy-box-3 {
  width: 100%;
  height: 100%;
  background: transparent;
}

.waste-element-4 {
  padding: 20rpx;
  margin: 10rpx;
  border-radius: 8rpx;
}

.junk-component-5 {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200rpx, 1fr));
  gap: 16rpx;
}

/* ==================== 垃圾样式结束 ==================== */
</style>

