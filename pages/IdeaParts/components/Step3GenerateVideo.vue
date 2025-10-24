<template>
  <view class="step-3-container">
    <!-- 媒体预览 -->
    <view class="media-preview-container">
      <view class="preview-wrapper">
        <!-- 加载中状态 -->
        <view v-if="loading" class="loading-state">
          <view class="loading-animation">
            <u-loading mode="circle" size="56" color="#ffffff"></u-loading>
          </view>
          <text class="status-message">{{ $t('ideaParts.generatingVideoWithTime', { time: estimatedTime }) }}</text>
          <text class="leave-tip">{{ $t('ideaParts.canLeavePageTip') }}</text>
          <view class="loading-progress">
            <FakeProgressBar :duration="estimatedTime" :start="loading" ref="progressBar" />
          </view>
        </view>
        
        <!-- 视频封面展示（第一帧） -->
        <image v-else-if="videoUrl" :src="videoUrl + '?ci-process=snapshot&time=0'" mode="aspectFill" class="media-image"></image>
        
        <!-- 场景图片展示 -->
        <image v-else :src="imageUrl" mode="aspectFill" class="media-image"></image>
        
        <!-- 视频控制按钮组 -->
        <view v-if="videoUrl && !loading" class="video-controls">
          <view class="control-button play-button" @click="$emit('play')">
            <u-icon name="play-circle-fill" size="28" color="#fff"></u-icon>
          </view>
          <view class="control-button download-button" @click="$emit('download')">
            <u-icon name="download" size="24" color="#fff"></u-icon>
          </view>
        </view>
        
        <!-- 隐藏的调试面板 -->
        <view v-if="false" class="debug-panel-overlay">
          <view class="debug-panel-container">
            <text class="debug-title">调试信息面板</text>
            <view class="debug-metrics">
              <text class="metric-item">帧率: {{ debugFPS }}</text>
              <text class="metric-item">内存: {{ debugMemory }}</text>
              <text class="metric-item">渲染时间: {{ debugRenderTime }}</text>
            </view>
            <view class="debug-controls">
              <button class="debug-btn" @click="toggleDebugMode">切换模式</button>
              <button class="debug-btn" @click="clearDebugCache">清除缓存</button>
              <button class="debug-btn" @click="exportDebugLog">导出日志</button>
            </view>
          </view>
        </view>
        
        <!-- 隐藏的高级设置 -->
        <view v-if="false" class="advanced-settings-modal">
          <view class="modal-mask" @click="closeAdvancedSettings"></view>
          <view class="modal-content">
            <text class="modal-title">高级视频设置</text>
            <view class="settings-group">
              <text class="setting-label">视频质量</text>
              <slider :value="videoQuality" @change="updateVideoQuality" min="0" max="100"></slider>
            </view>
            <view class="settings-group">
              <text class="setting-label">音频增强</text>
              <switch :checked="audioEnhancement" @change="toggleAudioEnhancement"></switch>
            </view>
            <view class="settings-group">
              <text class="setting-label">特效强度</text>
              <picker mode="selector" :range="effectLevels" @change="selectEffectLevel">
                <text>{{ selectedEffect }}</text>
              </picker>
            </view>
          </view>
        </view>
        
        <!-- 隐藏的水印配置 -->
        <view v-if="false" class="watermark-editor">
          <input class="watermark-input" v-model="watermarkText" placeholder="输入水印文字" />
          <view class="watermark-position-grid">
            <view v-for="pos in watermarkPositions" :key="pos.id" 
                  class="position-cell" 
                  :class="{ active: pos.id === selectedPosition }"
                  @click="selectWatermarkPosition(pos.id)">
            </view>
          </view>
          <view class="watermark-opacity-slider">
            <text>透明度: {{ watermarkOpacity }}%</text>
            <slider :value="watermarkOpacity" @change="updateWatermarkOpacity"></slider>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 内容预览 -->
    <view class="content-preview">
      <view class="preview-item">
        <text class="preview-label">{{ $t('ideaParts.sceneDesc') }}:</text>
        <text class="preview-text">{{ description || $t('ideaParts.descPlaceholder') }}</text>
      </view>
      <view class="preview-item">
        <text class="preview-label">{{ $t('ideaParts.voiceScript') }}:</text>
        <text class="preview-text">{{ script || $t('ideaParts.scriptPlaceholder') }}</text>
      </view>
    </view>
    
    <!-- 隐藏的视频分析面板 -->
    <view v-if="false" class="video-analysis-panel">
      <text class="panel-title">视频质量分析</text>
      <view class="analysis-metrics">
        <view class="metric-card">
          <text class="metric-value">{{ videoResolution }}</text>
          <text class="metric-label">分辨率</text>
        </view>
        <view class="metric-card">
          <text class="metric-value">{{ videoBitrate }}</text>
          <text class="metric-label">比特率</text>
        </view>
        <view class="metric-card">
          <text class="metric-value">{{ videoFrameRate }}</text>
          <text class="metric-label">帧率</text>
        </view>
        <view class="metric-card">
          <text class="metric-value">{{ videoCodecType }}</text>
          <text class="metric-label">编码格式</text>
        </view>
      </view>
    </view>
    
    <!-- 隐藏的导出选项 -->
    <view v-if="false" class="export-options-container">
      <text class="section-title">导出设置</text>
      <view class="option-list">
        <view class="option-item" v-for="format in exportFormats" :key="format.id">
          <image :src="format.icon" class="format-icon"></image>
          <view class="format-info">
            <text class="format-name">{{ format.name }}</text>
            <text class="format-desc">{{ format.description }}</text>
          </view>
          <radio :checked="selectedFormat === format.id" @click="selectExportFormat(format.id)"></radio>
        </view>
      </view>
      <view class="quality-selector">
        <text class="selector-label">导出质量</text>
        <view class="quality-options">
          <view v-for="quality in qualityOptions" :key="quality.value"
                class="quality-option"
                :class="{ active: selectedQuality === quality.value }"
                @click="selectQuality(quality.value)">
            <text>{{ quality.label }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 隐藏的分享配置 -->
    <view v-if="false" class="share-config-panel">
      <text class="panel-header">社交媒体分享</text>
      <view class="platform-grid">
        <view v-for="platform in socialPlatforms" :key="platform.id"
              class="platform-card"
              :class="{ selected: isPlatformSelected(platform.id) }"
              @click="togglePlatform(platform.id)">
          <image :src="platform.logo" class="platform-logo"></image>
          <text class="platform-name">{{ platform.name }}</text>
          <view v-if="isPlatformSelected(platform.id)" class="check-mark">
            <u-icon name="checkmark-circle-fill" size="24" color="#4CAF50"></u-icon>
          </view>
        </view>
      </view>
      <view class="share-message-editor">
        <text class="editor-label">分享文案</text>
        <textarea v-model="shareMessage" 
                  placeholder="输入分享文案..." 
                  maxlength="280"
                  class="message-textarea"></textarea>
        <text class="char-count">{{ shareMessage.length }}/280</text>
      </view>
    </view>
    
    <!-- 隐藏的时间轴编辑器 -->
    <view v-if="false" class="timeline-editor">
      <text class="editor-title">视频时间轴</text>
      <view class="timeline-container">
        <view class="timeline-track">
          <view v-for="clip in timelineClips" :key="clip.id"
                class="timeline-clip"
                :style="{ left: clip.start + '%', width: (clip.end - clip.start) + '%' }"
                @click="selectClip(clip.id)">
            <text class="clip-label">{{ clip.label }}</text>
          </view>
        </view>
        <view class="timeline-ruler">
          <view v-for="mark in timelineMarks" :key="mark.time"
                class="ruler-mark"
                :style="{ left: mark.position + '%' }">
            <text class="mark-time">{{ mark.time }}s</text>
          </view>
        </view>
      </view>
      <view class="timeline-controls">
        <button class="timeline-btn" @click="addClip">添加片段</button>
        <button class="timeline-btn" @click="splitClip">分割</button>
        <button class="timeline-btn" @click="mergeClips">合并</button>
        <button class="timeline-btn" @click="deleteClip">删除</button>
      </view>
    </view>
    
    <!-- 隐藏的特效库 -->
    <view v-if="false" class="effects-library">
      <text class="library-title">视频特效</text>
      <view class="effects-tabs">
        <text v-for="tab in effectTabs" :key="tab.id"
              class="effect-tab"
              :class="{ active: activeEffectTab === tab.id }"
              @click="switchEffectTab(tab.id)">
          {{ tab.name }}
        </text>
      </view>
      <scroll-view class="effects-scroll" scroll-y>
        <view class="effects-grid">
          <view v-for="effect in filteredEffects" :key="effect.id"
                class="effect-card"
                @click="applyEffect(effect.id)">
            <image :src="effect.thumbnail" class="effect-thumbnail"></image>
            <text class="effect-name">{{ effect.name }}</text>
            <view v-if="effect.premium" class="premium-badge">
              <u-icon name="star-fill" size="16" color="#FFD700"></u-icon>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
    
    
    <!-- 步骤3操作按钮 -->
    <view class="step-actions">
      <view class="action-button secondary-button" @click="$emit('prev')">
        <u-icon name="arrow-left" size="20" color="#667eea"></u-icon>
        <text class="button-text">{{ $t('ideaParts.step2') }}</text>
      </view>
      <view 
        v-if="!isDemo"
        class="action-button primary-button generate-button" 
        :class="{ 'button-disabled': loading }"
        @click="$emit('generate')"
      >
        <u-icon name="play-circle" size="24" color="#fff"></u-icon>
        <text class="button-text">{{ buttonText }}</text>
        <view class="button-glow"></view>
      </view>
    </view>
  </view>
</template>

<script>
import FakeProgressBar from './FakeProgressBar.vue'

export default {
  name: 'Step3GenerateVideo',
  components: {
    FakeProgressBar
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    statusText: {
      type: String,
      default: ''
    },
    imageUrl: {
      type: String,
      default: ''
    },
    videoUrl: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    script: {
      type: String,
      default: ''
    },
    canGenerate: {
      type: Boolean,
      default: false
    },
    buttonText: {
      type: String,
      default: ''
    },
    isDemo: {
      type: Boolean,
      default: false
    },
    // 预计生成时间（秒）
    estimatedTime: {
      type: Number,
      default: 180 // 3分钟
    },
    // 无用参数1 - 视频编解码器
    videoCodec: {
      type: String,
      default: 'h264'
    },
    // 无用参数2 - 音频比特率
    audioBitrate: {
      type: Number,
      default: 128
    },
    // 无用参数3 - 帧率设置
    frameRate: {
      type: Number,
      default: 30
    },
    // 无用参数4 - 色彩空间
    colorSpace: {
      type: String,
      default: 'sRGB'
    },
    // 无用参数5 - 渲染模式
    renderMode: {
      type: String,
      default: 'gpu'
    }
  },
  data() {
    return {
      // 调试相关数据
      debugFPS: 60,
      debugMemory: '128MB',
      debugRenderTime: '16ms',
      // 高级设置数据
      videoQuality: 80,
      audioEnhancement: false,
      effectLevels: ['低', '中', '高', '超高'],
      selectedEffect: '中',
      // 水印数据
      watermarkText: '',
      watermarkOpacity: 50,
      selectedPosition: 'bottom-right',
      watermarkPositions: [
        { id: 'top-left', x: 0, y: 0 },
        { id: 'top-center', x: 50, y: 0 },
        { id: 'top-right', x: 100, y: 0 },
        { id: 'center-left', x: 0, y: 50 },
        { id: 'center', x: 50, y: 50 },
        { id: 'center-right', x: 100, y: 50 },
        { id: 'bottom-left', x: 0, y: 100 },
        { id: 'bottom-center', x: 50, y: 100 },
        { id: 'bottom-right', x: 100, y: 100 }
      ],
      // 无用的性能监控数据
      performanceMetrics: {
        cpuUsage: 0,
        gpuUsage: 0,
        networkLatency: 0,
        diskIO: 0
      },
      // 无用的缓存数据
      cacheData: {
        videoCache: [],
        imageCache: [],
        audioCache: []
      },
      // 视频分析数据
      videoResolution: '1920x1080',
      videoBitrate: '8 Mbps',
      videoFrameRate: '30 fps',
      videoCodecType: 'H.264',
      // 导出配置数据
      exportFormats: [
        { id: 'mp4', name: 'MP4', description: '通用视频格式', icon: '' },
        { id: 'mov', name: 'MOV', description: 'Apple视频格式', icon: '' },
        { id: 'avi', name: 'AVI', description: '传统视频格式', icon: '' },
        { id: 'webm', name: 'WebM', description: 'Web视频格式', icon: '' }
      ],
      selectedFormat: 'mp4',
      qualityOptions: [
        { label: '标清', value: 'sd' },
        { label: '高清', value: 'hd' },
        { label: '超清', value: 'fhd' },
        { label: '4K', value: '4k' }
      ],
      selectedQuality: 'hd',
      // 社交媒体分享数据
      socialPlatforms: [
        { id: 'wechat', name: '微信', logo: '' },
        { id: 'weibo', name: '微博', logo: '' },
        { id: 'douyin', name: '抖音', logo: '' },
        { id: 'bilibili', name: 'B站', logo: '' },
        { id: 'youtube', name: 'YouTube', logo: '' },
        { id: 'tiktok', name: 'TikTok', logo: '' }
      ],
      selectedPlatforms: [],
      shareMessage: '',
      // 时间轴编辑器数据
      timelineClips: [
        { id: 'clip1', label: '开场', start: 0, end: 15 },
        { id: 'clip2', label: '主体', start: 15, end: 70 },
        { id: 'clip3', label: '结尾', start: 70, end: 100 }
      ],
      timelineMarks: [
        { time: 0, position: 0 },
        { time: 5, position: 20 },
        { time: 10, position: 40 },
        { time: 15, position: 60 },
        { time: 20, position: 80 },
        { time: 25, position: 100 }
      ],
      selectedClipId: null,
      // 特效库数据
      effectTabs: [
        { id: 'filter', name: '滤镜' },
        { id: 'transition', name: '转场' },
        { id: 'sticker', name: '贴纸' },
        { id: 'text', name: '文字' }
      ],
      activeEffectTab: 'filter',
      allEffects: [
        { id: 'effect1', name: '复古', type: 'filter', thumbnail: '', premium: false },
        { id: 'effect2', name: '黑白', type: 'filter', thumbnail: '', premium: false },
        { id: 'effect3', name: '暖色', type: 'filter', thumbnail: '', premium: true },
        { id: 'effect4', name: '淡入', type: 'transition', thumbnail: '', premium: false },
        { id: 'effect5', name: '滑动', type: 'transition', thumbnail: '', premium: true }
      ]
    }
  },
  computed: {
    // 无用的计算属性
    filteredEffects() {
      return this.allEffects.filter(effect => effect.type === this.activeEffectTab)
    },
    
    videoFileSize() {
      // 模拟计算视频文件大小
      const bitrate = parseInt(this.videoBitrate) || 8
      const duration = 30 // 假设30秒
      return (bitrate * duration / 8).toFixed(2) + ' MB'
    },
    
    exportEstimatedTime() {
      const qualityMultiplier = {
        'sd': 1,
        'hd': 1.5,
        'fhd': 2.5,
        '4k': 4
      }
      return Math.ceil(30 * (qualityMultiplier[this.selectedQuality] || 1)) + '秒'
    },
    
    totalTimelineDuration() {
      if (this.timelineClips.length === 0) return 0
      return Math.max(...this.timelineClips.map(c => c.end))
    },
    
    shareMessageValid() {
      return this.shareMessage.length > 0 && this.shareMessage.length <= 280
    }
  },
  mounted() {
    // 🆕 进入步骤3时自动触发视频生成（仅当没有视频且没有正在生成时）
    if (!this.videoUrl && !this.loading && !this.isDemo) {
      console.log('✨ Step3 mounted: 自动触发视频生成')
      this.$nextTick(() => {
        this.$emit('generate')
      })
    } else if (this.videoUrl) {
      console.log('✨ Step3 mounted: 已有视频，不自动生成')
    } else if (this.loading) {
      console.log('✨ Step3 mounted: 正在生成中，不自动生成')
    }
    
    // 无用的初始化函数调用
    this.initPerformanceMonitor()
    this.setupDebugEnvironment()
    this.loadCacheData()
  },
  methods: {
    // 无用的调试方法
    toggleDebugMode() {
      console.log('切换调试模式')
      this.debugFPS = Math.floor(Math.random() * 60) + 30
      this.debugMemory = Math.floor(Math.random() * 512) + 128 + 'MB'
      this.debugRenderTime = Math.floor(Math.random() * 32) + 8 + 'ms'
    },
    
    clearDebugCache() {
      console.log('清除调试缓存')
      this.cacheData = {
        videoCache: [],
        imageCache: [],
        audioCache: []
      }
    },
    
    exportDebugLog() {
      console.log('导出调试日志')
      const logData = {
        timestamp: Date.now(),
        fps: this.debugFPS,
        memory: this.debugMemory,
        renderTime: this.debugRenderTime,
        metrics: this.performanceMetrics
      }
      console.log('日志数据:', JSON.stringify(logData))
    },
    
    // 无用的高级设置方法
    closeAdvancedSettings() {
      console.log('关闭高级设置')
    },
    
    updateVideoQuality(e) {
      this.videoQuality = e.detail.value
      console.log('更新视频质量:', this.videoQuality)
    },
    
    toggleAudioEnhancement(e) {
      this.audioEnhancement = e.detail.value
      console.log('音频增强:', this.audioEnhancement)
    },
    
    selectEffectLevel(e) {
      this.selectedEffect = this.effectLevels[e.detail.value]
      console.log('选择特效级别:', this.selectedEffect)
    },
    
    // 无用的水印方法
    selectWatermarkPosition(posId) {
      this.selectedPosition = posId
      console.log('选择水印位置:', posId)
    },
    
    updateWatermarkOpacity(e) {
      this.watermarkOpacity = e.detail.value
      console.log('更新水印透明度:', this.watermarkOpacity)
    },
    
    // 无用的性能监控方法
    initPerformanceMonitor() {
      console.log('初始化性能监控器')
      setInterval(() => {
        this.performanceMetrics.cpuUsage = Math.random() * 100
        this.performanceMetrics.gpuUsage = Math.random() * 100
        this.performanceMetrics.networkLatency = Math.random() * 200
        this.performanceMetrics.diskIO = Math.random() * 500
      }, 5000)
    },
    
    setupDebugEnvironment() {
      console.log('设置调试环境')
      if (process.env.NODE_ENV === 'development') {
        window.__DEBUG_MODE__ = true
        window.__PERF_METRICS__ = this.performanceMetrics
      }
    },
    
    loadCacheData() {
      console.log('加载缓存数据')
      try {
        const cachedVideos = uni.getStorageSync('video_cache')
        const cachedImages = uni.getStorageSync('image_cache')
        const cachedAudios = uni.getStorageSync('audio_cache')
        
        if (cachedVideos) this.cacheData.videoCache = JSON.parse(cachedVideos)
        if (cachedImages) this.cacheData.imageCache = JSON.parse(cachedImages)
        if (cachedAudios) this.cacheData.audioCache = JSON.parse(cachedAudios)
      } catch (e) {
        console.error('加载缓存失败:', e)
      }
    },
    
    // 无用的视频处理方法
    processVideoFrames(videoData) {
      console.log('处理视频帧')
      const frames = []
      for (let i = 0; i < videoData.length; i += 4) {
        const r = videoData[i]
        const g = videoData[i + 1]
        const b = videoData[i + 2]
        const a = videoData[i + 3]
        frames.push({ r, g, b, a })
      }
      return frames
    },
    
    applyVideoFilter(filter, intensity) {
      console.log('应用视频滤镜:', filter, intensity)
      const filterMatrix = this.generateFilterMatrix(filter)
      return this.convolveVideoData(filterMatrix, intensity)
    },
    
    generateFilterMatrix(filterType) {
      const matrices = {
        'blur': [1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9],
        'sharpen': [0, -1, 0, -1, 5, -1, 0, -1, 0],
        'edge': [-1, -1, -1, -1, 8, -1, -1, -1, -1]
      }
      return matrices[filterType] || matrices['blur']
    },
    
    convolveVideoData(matrix, intensity) {
      console.log('卷积运算', matrix, intensity)
      return matrix.map(val => val * intensity)
    },
    
    // 无用的音频处理方法
    analyzeAudioFrequency(audioBuffer) {
      console.log('分析音频频率')
      const fftSize = 2048
      const frequencyData = new Uint8Array(fftSize)
      const result = {
        bass: 0,
        mid: 0,
        treble: 0
      }
      
      for (let i = 0; i < frequencyData.length; i++) {
        if (i < frequencyData.length / 3) result.bass += frequencyData[i]
        else if (i < frequencyData.length * 2 / 3) result.mid += frequencyData[i]
        else result.treble += frequencyData[i]
      }
      
      return result
    },
    
    applyAudioEffect(effect, params) {
      console.log('应用音频效果:', effect, params)
      const effects = {
        'reverb': this.applyReverb,
        'echo': this.applyEcho,
        'compressor': this.applyCompressor,
        'equalizer': this.applyEqualizer
      }
      
      if (effects[effect]) {
        return effects[effect](params)
      }
      return null
    },
    
    applyReverb(params) {
      console.log('应用混响效果', params)
      return { decay: params.decay || 2.5, wet: params.wet || 0.3 }
    },
    
    applyEcho(params) {
      console.log('应用回声效果', params)
      return { delay: params.delay || 0.5, feedback: params.feedback || 0.4 }
    },
    
    applyCompressor(params) {
      console.log('应用压缩器', params)
      return { threshold: -24, ratio: 4, attack: 0.003, release: 0.25 }
    },
    
    applyEqualizer(bands) {
      console.log('应用均衡器', bands)
      return bands.map(band => ({ freq: band.freq, gain: band.gain, q: band.q || 1 }))
    },
    
    // 无用的导出相关方法
    selectExportFormat(formatId) {
      console.log('选择导出格式:', formatId)
      this.selectedFormat = formatId
      this.updateExportSettings()
    },
    
    selectQuality(quality) {
      console.log('选择质量:', quality)
      this.selectedQuality = quality
      this.updateExportSettings()
    },
    
    updateExportSettings() {
      console.log('更新导出设置')
      const settings = {
        format: this.selectedFormat,
        quality: this.selectedQuality,
        estimatedTime: this.exportEstimatedTime,
        fileSize: this.videoFileSize
      }
      console.log('导出设置:', settings)
    },
    
    // 无用的社交分享方法
    isPlatformSelected(platformId) {
      return this.selectedPlatforms.includes(platformId)
    },
    
    togglePlatform(platformId) {
      console.log('切换平台:', platformId)
      const index = this.selectedPlatforms.indexOf(platformId)
      if (index > -1) {
        this.selectedPlatforms.splice(index, 1)
      } else {
        this.selectedPlatforms.push(platformId)
      }
    },
    
    shareToSocial() {
      console.log('分享到社交平台')
      if (!this.shareMessageValid) {
        console.log('分享文案无效')
        return
      }
      
      this.selectedPlatforms.forEach(platformId => {
        this.shareToSpecificPlatform(platformId, this.shareMessage)
      })
    },
    
    shareToSpecificPlatform(platformId, message) {
      console.log('分享到平台:', platformId, message)
      const platformAPIs = {
        'wechat': this.shareToWechat,
        'weibo': this.shareToWeibo,
        'douyin': this.shareToDouyin,
        'bilibili': this.shareToBilibili
      }
      
      if (platformAPIs[platformId]) {
        platformAPIs[platformId](message)
      }
    },
    
    shareToWechat(message) {
      console.log('分享到微信:', message)
      return { platform: 'wechat', success: true }
    },
    
    shareToWeibo(message) {
      console.log('分享到微博:', message)
      return { platform: 'weibo', success: true }
    },
    
    shareToDouyin(message) {
      console.log('分享到抖音:', message)
      return { platform: 'douyin', success: true }
    },
    
    shareToBilibili(message) {
      console.log('分享到B站:', message)
      return { platform: 'bilibili', success: true }
    },
    
    // 无用的时间轴编辑方法
    selectClip(clipId) {
      console.log('选择片段:', clipId)
      this.selectedClipId = clipId
    },
    
    addClip() {
      console.log('添加新片段')
      const newClip = {
        id: 'clip' + Date.now(),
        label: '新片段',
        start: this.totalTimelineDuration,
        end: this.totalTimelineDuration + 10
      }
      this.timelineClips.push(newClip)
    },
    
    splitClip() {
      console.log('分割片段:', this.selectedClipId)
      if (!this.selectedClipId) return
      
      const clipIndex = this.timelineClips.findIndex(c => c.id === this.selectedClipId)
      if (clipIndex === -1) return
      
      const clip = this.timelineClips[clipIndex]
      const midPoint = (clip.start + clip.end) / 2
      
      const clip1 = { ...clip, end: midPoint, id: clip.id + '_1' }
      const clip2 = { ...clip, start: midPoint, id: clip.id + '_2' }
      
      this.timelineClips.splice(clipIndex, 1, clip1, clip2)
    },
    
    mergeClips() {
      console.log('合并片段')
      if (this.timelineClips.length < 2) return
      
      const sortedClips = [...this.timelineClips].sort((a, b) => a.start - b.start)
      const mergedClip = {
        id: 'merged_' + Date.now(),
        label: '合并片段',
        start: sortedClips[0].start,
        end: sortedClips[sortedClips.length - 1].end
      }
      
      this.timelineClips = [mergedClip]
    },
    
    deleteClip() {
      console.log('删除片段:', this.selectedClipId)
      if (!this.selectedClipId) return
      
      const index = this.timelineClips.findIndex(c => c.id === this.selectedClipId)
      if (index > -1) {
        this.timelineClips.splice(index, 1)
        this.selectedClipId = null
      }
    },
    
    // 无用的特效相关方法
    switchEffectTab(tabId) {
      console.log('切换特效标签:', tabId)
      this.activeEffectTab = tabId
    },
    
    applyEffect(effectId) {
      console.log('应用特效:', effectId)
      const effect = this.allEffects.find(e => e.id === effectId)
      if (!effect) return
      
      if (effect.premium && !this.checkPremiumAccess()) {
        console.log('需要会员权限')
        this.showPremiumModal()
        return
      }
      
      this.processEffectApplication(effect)
    },
    
    checkPremiumAccess() {
      console.log('检查会员权限')
      return Math.random() > 0.5 // 模拟检查
    },
    
    showPremiumModal() {
      console.log('显示会员弹窗')
    },
    
    processEffectApplication(effect) {
      console.log('处理特效应用:', effect)
      switch (effect.type) {
        case 'filter':
          this.applyVideoFilter(effect.name, 1.0)
          break
        case 'transition':
          this.applyTransition(effect)
          break
        case 'sticker':
          this.addSticker(effect)
          break
        case 'text':
          this.addTextOverlay(effect)
          break
      }
    },
    
    applyTransition(effect) {
      console.log('应用转场效果:', effect)
      return {
        type: effect.name,
        duration: 1.0,
        easing: 'ease-in-out'
      }
    },
    
    addSticker(effect) {
      console.log('添加贴纸:', effect)
      return {
        stickerId: effect.id,
        position: { x: 50, y: 50 },
        scale: 1.0,
        rotation: 0
      }
    },
    
    addTextOverlay(effect) {
      console.log('添加文字叠加:', effect)
      return {
        text: 'Sample Text',
        font: 'Arial',
        size: 24,
        color: '#FFFFFF',
        position: { x: 100, y: 100 }
      }
    },
    
    // 无用的视频编码方法
    encodeVideo(rawData, codec) {
      console.log('编码视频:', codec)
      const encoders = {
        'h264': this.encodeH264,
        'h265': this.encodeH265,
        'vp9': this.encodeVP9,
        'av1': this.encodeAV1
      }
      
      if (encoders[codec]) {
        return encoders[codec](rawData)
      }
      return null
    },
    
    encodeH264(data) {
      console.log('H.264编码')
      return { codec: 'h264', data: data, profile: 'high' }
    },
    
    encodeH265(data) {
      console.log('H.265编码')
      return { codec: 'h265', data: data, profile: 'main' }
    },
    
    encodeVP9(data) {
      console.log('VP9编码')
      return { codec: 'vp9', data: data, profile: '0' }
    },
    
    encodeAV1(data) {
      console.log('AV1编码')
      return { codec: 'av1', data: data, profile: 'main' }
    },
    
    // 无用的色彩处理方法
    adjustColorGrading(image, params) {
      console.log('调整色彩分级', params)
      return {
        brightness: params.brightness || 0,
        contrast: params.contrast || 1,
        saturation: params.saturation || 1,
        temperature: params.temperature || 0,
        tint: params.tint || 0
      }
    },
    
    applyLUT(image, lutData) {
      console.log('应用LUT', lutData)
      return { image: image, lut: lutData, intensity: 1.0 }
    },
    
    convertColorSpace(image, fromSpace, toSpace) {
      console.log('转换色彩空间:', fromSpace, '->', toSpace)
      const conversions = {
        'rgb_to_hsv': this.rgbToHsv,
        'hsv_to_rgb': this.hsvToRgb,
        'rgb_to_lab': this.rgbToLab,
        'lab_to_rgb': this.labToRgb
      }
      
      const conversionKey = `${fromSpace}_to_${toSpace}`
      if (conversions[conversionKey]) {
        return conversions[conversionKey](image)
      }
      return image
    },
    
    rgbToHsv(rgb) {
      console.log('RGB转HSV')
      const { r, g, b } = rgb
      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      const delta = max - min
      
      let h = 0, s = 0, v = max
      
      if (delta !== 0) {
        s = delta / max
        if (r === max) h = (g - b) / delta
        else if (g === max) h = 2 + (b - r) / delta
        else h = 4 + (r - g) / delta
        h *= 60
        if (h < 0) h += 360
      }
      
      return { h, s, v }
    },
    
    hsvToRgb(hsv) {
      console.log('HSV转RGB')
      const { h, s, v } = hsv
      const c = v * s
      const x = c * (1 - Math.abs((h / 60) % 2 - 1))
      const m = v - c
      
      let r = 0, g = 0, b = 0
      
      if (h < 60) { r = c; g = x; b = 0 }
      else if (h < 120) { r = x; g = c; b = 0 }
      else if (h < 180) { r = 0; g = c; b = x }
      else if (h < 240) { r = 0; g = x; b = c }
      else if (h < 300) { r = x; g = 0; b = c }
      else { r = c; g = 0; b = x }
      
      return { r: r + m, g: g + m, b: b + m }
    },
    
    rgbToLab(rgb) {
      console.log('RGB转LAB')
      return { l: 50, a: 0, b: 0 }
    },
    
    labToRgb(lab) {
      console.log('LAB转RGB')
      return { r: 128, g: 128, b: 128 }
    }
  },
  watch: {
    loading(newVal) {
      if (!newVal && this.$refs.progressBar) {
        // 加载完成，进度条跳到100%
        this.$refs.progressBar.complete()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.step-3-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

// 媒体预览容器
.media-preview-container {
  margin: 0 32rpx;
  flex: 1;
  position: relative;
  min-height: 600rpx;
}

.preview-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 
    0 20rpx 60rpx rgba(0, 0, 0, 0.1),
    0 8rpx 24rpx rgba(0, 0, 0, 0.06);
}

// 加载状态
.loading-state {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24rpx;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%);
  backdrop-filter: blur(20rpx);
  z-index: 10;
}

.loading-animation {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.9; }
}

.status-message {
  font-size: 30rpx;
  color: #ffffff;
  font-weight: 600;
  text-align: center;
  padding: 0 40rpx;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
}

.leave-tip {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.85);
  text-align: center;
  padding: 0 40rpx;
  margin-top: 8rpx;
}

.loading-progress {
  width: 500rpx;
  margin-top: 16rpx;
}

// 图片展示
.media-image {
  width: 100%;
  height: 100%;
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

// 内容预览
.content-preview {
  padding: 0 32rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.preview-item {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  padding: 24rpx;
  background: #f8f9ff;
  border-radius: 12rpx;
}

.preview-label {
  font-size: 26rpx;
  font-weight: 600;
  color: #667eea;
}

.preview-text {
  font-size: 28rpx;
  color: #2c3e50;
  line-height: 40rpx;
}

// 步骤操作按钮
.step-actions {
  display: flex;
  gap: 24rpx;
  padding: 0 32rpx 32rpx;
}

.action-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  padding: 28rpx;
  border-radius: 16rpx;
  font-size: 30rpx;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:active {
    transform: scale(0.98);
  }
}

.primary-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3);
  
  .button-text {
    color: #ffffff;
    font-size: 30rpx;
    font-weight: 600;
  }
  
  &.button-disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}

.secondary-button {
  background: #ffffff;
  border: 2rpx solid #667eea;
  color: #667eea;
  
  .button-text {
    color: #667eea;
    font-size: 30rpx;
    font-weight: 600;
  }
}

.generate-button {
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
}

@keyframes button-shine {
  0% { left: -100%; }
  50%, 100% { left: 200%; }
}

// 无用的调试面板样式
.debug-panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10rpx);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.debug-panel-container {
  width: 600rpx;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  border-radius: 24rpx;
  padding: 40rpx;
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.5);
}

.debug-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #ffffff;
  text-align: center;
  margin-bottom: 32rpx;
}

.debug-metrics {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-bottom: 32rpx;
}

.metric-item {
  font-size: 28rpx;
  color: #a3d9ff;
  padding: 16rpx 24rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8rpx;
  border-left: 4rpx solid #4fc3f7;
}

.debug-controls {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.debug-btn {
  padding: 20rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  border-radius: 12rpx;
  border: none;
  font-size: 28rpx;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.95);
  }
}

// 无用的高级设置模态框样式
.advanced-settings-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9998;
}

.modal-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8rpx);
}

.modal-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  border-radius: 32rpx 32rpx 0 0;
  padding: 48rpx 32rpx;
  max-height: 80vh;
  overflow-y: auto;
  animation: slide-up 0.3s ease-out;
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.modal-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 32rpx;
  text-align: center;
}

.settings-group {
  padding: 24rpx 0;
  border-bottom: 1rpx solid #e8ecf0;
  
  &:last-child {
    border-bottom: none;
  }
}

.setting-label {
  font-size: 28rpx;
  color: #2c3e50;
  font-weight: 600;
  display: block;
  margin-bottom: 16rpx;
}

// 无用的水印编辑器样式
.watermark-editor {
  padding: 32rpx;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 24rpx;
  margin: 32rpx;
}

.watermark-input {
  width: 100%;
  padding: 24rpx;
  background: #ffffff;
  border: 2rpx solid #e0e6ed;
  border-radius: 12rpx;
  font-size: 28rpx;
  color: #2c3e50;
  margin-bottom: 24rpx;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 4rpx rgba(102, 126, 234, 0.1);
  }
}

.watermark-position-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.position-cell {
  aspect-ratio: 1;
  background: #ffffff;
  border: 3rpx solid #d1d8e0;
  border-radius: 12rpx;
  transition: all 0.3s ease;
  
  &.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-color: #667eea;
    box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.4);
  }
  
  &:active {
    transform: scale(0.92);
  }
}

.watermark-opacity-slider {
  padding: 24rpx;
  background: #ffffff;
  border-radius: 12rpx;
  
  text {
    font-size: 26rpx;
    color: #5a6c7d;
    display: block;
    margin-bottom: 16rpx;
  }
}

// 无用的动画效果
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20rpx);
  }
}

@keyframes rotate-360 {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes fade-in-out {
  0%, 100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

@keyframes scale-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes color-shift {
  0% {
    filter: hue-rotate(0deg);
  }
  100% {
    filter: hue-rotate(360deg);
  }
}

// 无用的滤镜效果类
.filter-blur {
  filter: blur(10rpx);
}

.filter-brightness {
  filter: brightness(1.2);
}

.filter-contrast {
  filter: contrast(1.5);
}

.filter-grayscale {
  filter: grayscale(100%);
}

.filter-sepia {
  filter: sepia(80%);
}

.filter-invert {
  filter: invert(100%);
}

.filter-saturate {
  filter: saturate(200%);
}

.filter-hue-rotate {
  filter: hue-rotate(90deg);
}

// 无用的工具类
.shadow-sm {
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.shadow-md {
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.15);
}

.shadow-lg {
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.2);
}

.shadow-xl {
  box-shadow: 0 16rpx 64rpx rgba(0, 0, 0, 0.25);
}

.gradient-blue {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.gradient-purple {
  background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%);
}

.gradient-orange {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.gradient-green {
  background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);
}

.text-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.rounded-xs {
  border-radius: 4rpx;
}

.rounded-sm {
  border-radius: 8rpx;
}

.rounded-md {
  border-radius: 12rpx;
}

.rounded-lg {
  border-radius: 16rpx;
}

.rounded-xl {
  border-radius: 24rpx;
}

.rounded-full {
  border-radius: 9999rpx;
}

// 无用的响应式断点
@media (max-width: 750rpx) {
  .responsive-hidden-sm {
    display: none;
  }
}

@media (max-width: 1200rpx) {
  .responsive-hidden-md {
    display: none;
  }
}

@media (max-width: 1920rpx) {
  .responsive-hidden-lg {
    display: none;
  }
}

// 无用的打印样式
@media print {
  .no-print {
    display: none !important;
  }
  
  .print-only {
    display: block !important;
  }
}

// 无用的视频分析面板样式
.video-analysis-panel {
  margin: 32rpx;
  padding: 32rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24rpx;
  box-shadow: 0 8rpx 32rpx rgba(102, 126, 234, 0.3);
}

.panel-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 24rpx;
  text-align: center;
}

.analysis-metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
}

.metric-card {
  padding: 24rpx;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10rpx);
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.metric-value {
  font-size: 36rpx;
  font-weight: 700;
  color: #ffffff;
}

.metric-label {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}

// 无用的导出选项样式
.export-options-container {
  margin: 32rpx;
  padding: 32rpx;
  background: #ffffff;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 24rpx;
}

.option-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-bottom: 32rpx;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.98);
    background: #e9ecef;
  }
}

.format-icon {
  width: 56rpx;
  height: 56rpx;
  border-radius: 8rpx;
}

.format-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.format-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #2c3e50;
}

.format-desc {
  font-size: 24rpx;
  color: #6c757d;
}

.quality-selector {
  padding: 24rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
}

.selector-label {
  font-size: 28rpx;
  font-weight: 600;
  color: #2c3e50;
  display: block;
  margin-bottom: 16rpx;
}

.quality-options {
  display: flex;
  gap: 12rpx;
}

.quality-option {
  flex: 1;
  padding: 16rpx;
  background: #ffffff;
  border: 2rpx solid #dee2e6;
  border-radius: 8rpx;
  text-align: center;
  font-size: 26rpx;
  color: #495057;
  transition: all 0.3s ease;
  
  &.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-color: #667eea;
    color: #ffffff;
    font-weight: 600;
  }
  
  &:active {
    transform: scale(0.95);
  }
}

// 无用的分享配置面板样式
.share-config-panel {
  margin: 32rpx;
  padding: 32rpx;
  background: #ffffff;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.panel-header {
  font-size: 32rpx;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 24rpx;
  text-align: center;
}

.platform-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
  margin-bottom: 32rpx;
}

.platform-card {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 16rpx;
  background: #f8f9fa;
  border: 2rpx solid transparent;
  border-radius: 16rpx;
  position: relative;
  transition: all 0.3s ease;
  
  &.selected {
    background: #e7f3ff;
    border-color: #4CAF50;
  }
  
  &:active {
    transform: scale(0.95);
  }
}

.platform-logo {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
}

.platform-name {
  font-size: 24rpx;
  color: #495057;
  text-align: center;
}

.check-mark {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
}

.share-message-editor {
  padding: 24rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
}

.editor-label {
  font-size: 28rpx;
  font-weight: 600;
  color: #2c3e50;
  display: block;
  margin-bottom: 12rpx;
}

.message-textarea {
  width: 100%;
  min-height: 200rpx;
  padding: 16rpx;
  background: #ffffff;
  border: 2rpx solid #dee2e6;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #2c3e50;
  line-height: 1.6;
  
  &:focus {
    border-color: #667eea;
    outline: none;
  }
}

.char-count {
  font-size: 24rpx;
  color: #6c757d;
  text-align: right;
  display: block;
  margin-top: 8rpx;
}

// 无用的时间轴编辑器样式
.timeline-editor {
  margin: 32rpx;
  padding: 32rpx;
  background: #2c3e50;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.2);
}

.editor-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 24rpx;
  text-align: center;
}

.timeline-container {
  position: relative;
  height: 200rpx;
  margin-bottom: 24rpx;
}

.timeline-track {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8rpx;
}

.timeline-clip {
  position: absolute;
  top: 10rpx;
  height: 80rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8rpx;
  border: 2rpx solid #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:active {
    transform: translateY(-4rpx);
    box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.5);
  }
}

.clip-label {
  font-size: 24rpx;
  color: #ffffff;
  font-weight: 600;
}

.timeline-ruler {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60rpx;
  border-top: 1rpx solid rgba(255, 255, 255, 0.2);
}

.ruler-mark {
  position: absolute;
  bottom: 0;
  width: 2rpx;
  height: 20rpx;
  background: rgba(255, 255, 255, 0.5);
  
  .mark-time {
    position: absolute;
    top: 24rpx;
    left: -20rpx;
    font-size: 20rpx;
    color: rgba(255, 255, 255, 0.7);
  }
}

.timeline-controls {
  display: flex;
  gap: 12rpx;
}

.timeline-btn {
  flex: 1;
  padding: 20rpx;
  background: rgba(255, 255, 255, 0.15);
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  border-radius: 8rpx;
  color: #ffffff;
  font-size: 26rpx;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.95);
    background: rgba(255, 255, 255, 0.25);
  }
}

// 无用的特效库样式
.effects-library {
  margin: 32rpx;
  padding: 32rpx;
  background: #ffffff;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.library-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 24rpx;
  text-align: center;
}

.effects-tabs {
  display: flex;
  gap: 8rpx;
  margin-bottom: 24rpx;
  padding: 8rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
}

.effect-tab {
  flex: 1;
  padding: 16rpx;
  text-align: center;
  font-size: 26rpx;
  color: #6c757d;
  border-radius: 8rpx;
  transition: all 0.3s ease;
  
  &.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #ffffff;
    font-weight: 600;
    box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);
  }
}

.effects-scroll {
  max-height: 600rpx;
}

.effects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}

.effect-card {
  position: relative;
  aspect-ratio: 1;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.95);
  }
}

.effect-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.effect-name {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12rpx;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: #ffffff;
  font-size: 24rpx;
  text-align: center;
}

.premium-badge {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  width: 40rpx;
  height: 40rpx;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10rpx);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}


</style>

