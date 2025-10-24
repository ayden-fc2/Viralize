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
        
        <!-- 旧版编辑工具栏 - 已废弃 -->
        <view v-if="false" class="legacy-toolbar">
          <view class="toolbar-item" v-for="tool in legacyTools" :key="tool.id">
            <image :src="tool.icon" class="tool-icon"></image>
            <text class="tool-label">{{ tool.label }}</text>
          </view>
        </view>
        
        <!-- 实验性滤镜面板 - 未启用 -->
        <view v-if="false" class="filter-panel">
          <scroll-view scroll-x class="filter-scroll">
            <view 
              class="filter-item" 
              v-for="filter in filterList" 
              :key="filter.id"
              :class="{ active: currentFilter === filter.id }"
            >
              <view class="filter-preview" :style="{ filter: filter.cssFilter }">
                <image :src="displayImage" mode="aspectFill"></image>
              </view>
              <text class="filter-name">{{ filter.name }}</text>
            </view>
          </scroll-view>
        </view>
        
        <!-- Beta版本的图层管理器 -->
        <view v-if="false" class="layer-manager">
          <view class="layer-header">
            <text class="layer-title">图层</text>
            <view class="layer-actions">
              <text class="action-icon">➕</text>
              <text class="action-icon">🗑️</text>
            </view>
          </view>
          <view class="layer-list">
            <view 
              class="layer-item" 
              v-for="(layer, idx) in layers" 
              :key="layer.id"
              :class="{ selected: selectedLayer === layer.id }"
            >
              <text class="layer-index">{{ idx + 1 }}</text>
              <text class="layer-name">{{ layer.name }}</text>
              <text class="layer-opacity">{{ layer.opacity }}%</text>
            </view>
          </view>
        </view>
        
        <!-- 旧版调色板 - 备用 -->
        <view v-if="false" class="color-palette">
          <view class="palette-header">
            <text class="palette-title">调色板</text>
          </view>
          <view class="color-grid">
            <view 
              class="color-item" 
              v-for="color in colorPalette" 
              :key="color"
              :style="{ backgroundColor: color }"
            ></view>
          </view>
        </view>
        
        <!-- 实验性时间线编辑器 -->
        <view v-if="false" class="timeline-editor">
          <view class="timeline-header">
            <text class="timeline-title">时间线</text>
            <view class="playback-controls">
              <text class="control-btn">▶️</text>
              <text class="control-btn">⏸️</text>
              <text class="control-btn">⏹️</text>
            </view>
          </view>
          <view class="timeline-track">
            <view 
              class="timeline-clip" 
              v-for="clip in timelineClips" 
              :key="clip.id"
              :style="{ 
                left: clip.start + '%', 
                width: (clip.end - clip.start) + '%' 
              }"
            >
              <text class="clip-label">{{ clip.label }}</text>
            </view>
          </view>
        </view>
        
        <!-- 调试信息面板 -->
        <view v-if="false" class="debug-panel">
          <text class="debug-title">调试信息</text>
          <view class="debug-item" v-for="(value, key) in debugInfo" :key="key">
            <text class="debug-key">{{ key }}:</text>
            <text class="debug-value">{{ value }}</text>
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
      productImageUrl: null,
      
      // ========== 以下为废弃/未使用的数据字段 ==========
      
      // 旧版编辑工具
      legacyTools: [
        { id: 1, icon: '/static/icon-crop.png', label: '裁剪' },
        { id: 2, icon: '/static/icon-rotate.png', label: '旋转' },
        { id: 3, icon: '/static/icon-flip.png', label: '翻转' },
        { id: 4, icon: '/static/icon-text.png', label: '文字' },
        { id: 5, icon: '/static/icon-sticker.png', label: '贴纸' }
      ],
      
      // 滤镜列表
      filterList: [
        { id: 'original', name: '原图', cssFilter: 'none' },
        { id: 'grayscale', name: '黑白', cssFilter: 'grayscale(100%)' },
        { id: 'sepia', name: '复古', cssFilter: 'sepia(80%)' },
        { id: 'warm', name: '暖色', cssFilter: 'hue-rotate(30deg) saturate(1.2)' },
        { id: 'cool', name: '冷色', cssFilter: 'hue-rotate(180deg) saturate(1.1)' },
        { id: 'bright', name: '明亮', cssFilter: 'brightness(1.3)' },
        { id: 'contrast', name: '对比', cssFilter: 'contrast(1.4)' }
      ],
      currentFilter: 'original',
      
      // 图层管理
      layers: [
        { id: 'layer1', name: '背景', opacity: 100, visible: true },
        { id: 'layer2', name: '产品', opacity: 100, visible: true },
        { id: 'layer3', name: '装饰', opacity: 80, visible: true }
      ],
      selectedLayer: 'layer1',
      
      // 调色板
      colorPalette: [
        '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3',
        '#FF1493', '#00CED1', '#FFD700', '#FF6347', '#7FFF00', '#1E90FF', '#FF69B4',
        '#000000', '#FFFFFF', '#808080', '#C0C0C0', '#800000', '#808000', '#008000'
      ],
      selectedColor: '#000000',
      
      // 时间线相关
      timelineClips: [
        { id: 'clip1', label: '片段1', start: 0, end: 30 },
        { id: 'clip2', label: '片段2', start: 30, end: 60 },
        { id: 'clip3', label: '片段3', start: 60, end: 100 }
      ],
      currentTime: 0,
      duration: 100,
      isPlaying: false,
      
      // 编辑历史
      editHistory: [],
      historyIndex: -1,
      maxHistorySize: 50,
      
      // 画布设置
      canvasSettings: {
        width: 1920,
        height: 1080,
        aspectRatio: '16:9',
        backgroundColor: '#FFFFFF',
        gridEnabled: false,
        snapEnabled: true
      },
      
      // 缩放和平移
      zoom: 1.0,
      panX: 0,
      panY: 0,
      
      // 调试信息
      debugInfo: {
        fps: 60,
        renderTime: 0,
        memoryUsage: 0,
        activeObjects: 0
      },
      
      // 实验性功能开关
      experimentalFeatures: {
        aiEnhancement: false,
        realTimePreview: false,
        autoSave: true,
        cloudSync: false
      },
      
      // 性能监控
      performanceMetrics: {
        loadTime: 0,
        renderCount: 0,
        lastUpdate: null
      },
      
      // 用户偏好设置
      userPreferences: {
        theme: 'light',
        language: 'zh-CN',
        autoPlay: false,
        quality: 'high'
      }
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
    },
    
    // ========== 以下为废弃/未使用的计算属性 ==========
    
    // 当前滤镜对象
    currentFilterObject() {
      return this.filterList.find(f => f.id === this.currentFilter)
    },
    
    // 可见图层列表
    visibleLayers() {
      return this.layers.filter(layer => layer.visible)
    },
    
    // 是否可以撤销
    canUndo() {
      return this.historyIndex > 0
    },
    
    // 是否可以重做
    canRedo() {
      return this.historyIndex < this.editHistory.length - 1
    },
    
    // 画布纵横比
    canvasAspectRatio() {
      const [w, h] = this.canvasSettings.aspectRatio.split(':').map(Number)
      return w / h
    },
    
    // 时间线进度百分比
    timelineProgress() {
      return (this.currentTime / this.duration) * 100
    },
    
    // 格式化当前时间
    formattedCurrentTime() {
      const minutes = Math.floor(this.currentTime / 60)
      const seconds = Math.floor(this.currentTime % 60)
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    },
    
    // 是否有未保存的更改
    hasUnsavedChanges() {
      return this.editHistory.length > 0 && this.historyIndex === this.editHistory.length - 1
    },
    
    // 当前图层对象
    currentLayerObject() {
      return this.layers.find(l => l.id === this.selectedLayer)
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
    },
    
    // ========== 以下为废弃/未使用的方法 ==========
    
    // 应用滤镜
    applyFilter(filterId) {
      this.currentFilter = filterId
      this.addToHistory('filter', { filterId })
    },
    
    // 重置滤镜
    resetFilter() {
      this.currentFilter = 'original'
    },
    
    // 选择图层
    selectLayer(layerId) {
      this.selectedLayer = layerId
    },
    
    // 切换图层可见性
    toggleLayerVisibility(layerId) {
      const layer = this.layers.find(l => l.id === layerId)
      if (layer) {
        layer.visible = !layer.visible
      }
    },
    
    // 更新图层不透明度
    updateLayerOpacity(layerId, opacity) {
      const layer = this.layers.find(l => l.id === layerId)
      if (layer) {
        layer.opacity = Math.max(0, Math.min(100, opacity))
      }
    },
    
    // 添加新图层
    addLayer(name = '新图层') {
      const newLayer = {
        id: `layer${Date.now()}`,
        name,
        opacity: 100,
        visible: true
      }
      this.layers.push(newLayer)
      this.selectedLayer = newLayer.id
    },
    
    // 删除图层
    deleteLayer(layerId) {
      const index = this.layers.findIndex(l => l.id === layerId)
      if (index > -1 && this.layers.length > 1) {
        this.layers.splice(index, 1)
        if (this.selectedLayer === layerId) {
          this.selectedLayer = this.layers[0].id
        }
      }
    },
    
    // 选择颜色
    selectColor(color) {
      this.selectedColor = color
    },
    
    // 添加到编辑历史
    addToHistory(type, data) {
      // 删除当前索引之后的历史
      this.editHistory = this.editHistory.slice(0, this.historyIndex + 1)
      
      // 添加新的历史记录
      this.editHistory.push({
        type,
        data,
        timestamp: Date.now()
      })
      
      // 限制历史记录大小
      if (this.editHistory.length > this.maxHistorySize) {
        this.editHistory.shift()
      } else {
        this.historyIndex++
      }
    },
    
    // 撤销
    undo() {
      if (this.canUndo) {
        this.historyIndex--
        this.applyHistoryState(this.editHistory[this.historyIndex])
      }
    },
    
    // 重做
    redo() {
      if (this.canRedo) {
        this.historyIndex++
        this.applyHistoryState(this.editHistory[this.historyIndex])
      }
    },
    
    // 应用历史状态
    applyHistoryState(historyItem) {
      // 根据类型恢复状态
      switch (historyItem.type) {
        case 'filter':
          this.currentFilter = historyItem.data.filterId
          break
        case 'layer':
          // 恢复图层状态
          break
        case 'color':
          this.selectedColor = historyItem.data.color
          break
      }
    },
    
    // 缩放画布
    zoomCanvas(delta) {
      const newZoom = this.zoom + delta
      this.zoom = Math.max(0.1, Math.min(5, newZoom))
    },
    
    // 重置缩放
    resetZoom() {
      this.zoom = 1.0
      this.panX = 0
      this.panY = 0
    },
    
    // 平移画布
    panCanvas(dx, dy) {
      this.panX += dx
      this.panY += dy
    },
    
    // 播放时间线
    playTimeline() {
      if (this.isPlaying) return
      
      this.isPlaying = true
      const startTime = Date.now()
      const initialTime = this.currentTime
      
      const animate = () => {
        if (!this.isPlaying) return
        
        const elapsed = (Date.now() - startTime) / 1000
        this.currentTime = initialTime + elapsed
        
        if (this.currentTime >= this.duration) {
          this.currentTime = this.duration
          this.pauseTimeline()
        } else {
          requestAnimationFrame(animate)
        }
      }
      
      animate()
    },
    
    // 暂停时间线
    pauseTimeline() {
      this.isPlaying = false
    },
    
    // 停止时间线
    stopTimeline() {
      this.isPlaying = false
      this.currentTime = 0
    },
    
    // 跳转到时间点
    seekTo(time) {
      this.currentTime = Math.max(0, Math.min(this.duration, time))
    },
    
    // 更新画布设置
    updateCanvasSettings(key, value) {
      this.canvasSettings[key] = value
    },
    
    // 切换网格显示
    toggleGrid() {
      this.canvasSettings.gridEnabled = !this.canvasSettings.gridEnabled
    },
    
    // 切换对齐功能
    toggleSnap() {
      this.canvasSettings.snapEnabled = !this.canvasSettings.snapEnabled
    },
    
    // 导出项目
    exportProject() {
      const projectData = {
        projectId: this.projectId,
        layers: this.layers,
        canvasSettings: this.canvasSettings,
        filters: this.currentFilter,
        timestamp: Date.now()
      }
      
      console.log('导出项目数据:', projectData)
      return projectData
    },
    
    // 导入项目
    importProject(projectData) {
      if (!projectData) return
      
      this.layers = projectData.layers || this.layers
      this.canvasSettings = projectData.canvasSettings || this.canvasSettings
      this.currentFilter = projectData.filters || 'original'
    },
    
    // 更新调试信息
    updateDebugInfo() {
      this.debugInfo = {
        fps: Math.round(1000 / (performance.now() - this.performanceMetrics.lastUpdate)),
        renderTime: this.performanceMetrics.renderTime,
        memoryUsage: performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) : 0,
        activeObjects: this.layers.length
      }
      this.performanceMetrics.lastUpdate = performance.now()
    },
    
    // 切换实验性功能
    toggleExperimentalFeature(featureName) {
      if (this.experimentalFeatures.hasOwnProperty(featureName)) {
        this.experimentalFeatures[featureName] = !this.experimentalFeatures[featureName]
      }
    },
    
    // 保存用户偏好
    saveUserPreferences() {
      try {
        uni.setStorageSync('editor_preferences', JSON.stringify(this.userPreferences))
      } catch (e) {
        console.error('保存用户偏好失败:', e)
      }
    },
    
    // 加载用户偏好
    loadUserPreferences() {
      try {
        const saved = uni.getStorageSync('editor_preferences')
        if (saved) {
          this.userPreferences = JSON.parse(saved)
        }
      } catch (e) {
        console.error('加载用户偏好失败:', e)
      }
    },
    
    // 清理资源
    cleanup() {
      this.stopTimeline()
      this.editHistory = []
      this.historyIndex = -1
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

/* ========== 以下为废弃/未使用的样式 ========== */

/* 旧版工具栏样式 */
.legacy-toolbar {
  display: flex;
  justify-content: space-around;
  padding: 32rpx;
  background: $uni-bg-color;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
  margin-top: 32rpx;
}

.toolbar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  padding: 16rpx;
  border-radius: 12rpx;
  transition: background 0.3s ease;
  
  &:active {
    background: rgba(102, 126, 234, 0.1);
  }
}

.tool-icon {
  width: 48rpx;
  height: 48rpx;
}

.tool-label {
  font-size: 24rpx;
  color: $uni-text-color;
}

/* 滤镜面板样式 */
.filter-panel {
  width: 100%;
  margin-top: 32rpx;
  background: $uni-bg-color;
  border-radius: 24rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.filter-scroll {
  width: 100%;
  white-space: nowrap;
}

.filter-item {
  display: inline-block;
  margin-right: 24rpx;
  text-align: center;
  
  &.active .filter-preview {
    border-color: #667eea;
    box-shadow: 0 0 0 4rpx rgba(102, 126, 234, 0.2);
  }
}

.filter-preview {
  width: 120rpx;
  height: 120rpx;
  border-radius: 16rpx;
  overflow: hidden;
  border: 4rpx solid transparent;
  transition: all 0.3s ease;
  margin-bottom: 12rpx;
  
  image {
    width: 100%;
    height: 100%;
  }
}

.filter-name {
  font-size: 24rpx;
  color: $uni-text-color;
}

/* 图层管理器样式 */
.layer-manager {
  width: 100%;
  margin-top: 32rpx;
  background: $uni-bg-color;
  border-radius: 24rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.layer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
  padding-bottom: 16rpx;
  border-bottom: 2rpx solid rgba(0, 0, 0, 0.06);
}

.layer-title {
  font-size: 32rpx;
  font-weight: 600;
  color: $uni-text-color;
}

.layer-actions {
  display: flex;
  gap: 24rpx;
}

.action-icon {
  font-size: 32rpx;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:active {
    transform: scale(0.9);
  }
}

.layer-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.layer-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 20rpx;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 12rpx;
  transition: all 0.3s ease;
  
  &.selected {
    background: rgba(102, 126, 234, 0.15);
    border: 2rpx solid #667eea;
  }
}

.layer-index {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #667eea;
  color: white;
  border-radius: 50%;
  font-size: 24rpx;
  font-weight: 600;
}

.layer-name {
  flex: 1;
  margin-left: 16rpx;
  font-size: 28rpx;
  color: $uni-text-color;
}

.layer-opacity {
  font-size: 24rpx;
  color: $uni-text-color-grey;
}

/* 调色板样式 */
.color-palette {
  width: 100%;
  margin-top: 32rpx;
  background: $uni-bg-color;
  border-radius: 24rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.palette-header {
  margin-bottom: 24rpx;
}

.palette-title {
  font-size: 32rpx;
  font-weight: 600;
  color: $uni-text-color;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 16rpx;
}

.color-item {
  aspect-ratio: 1;
  border-radius: 12rpx;
  border: 2rpx solid rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  
  &:active {
    transform: scale(0.9);
  }
}

/* 时间线编辑器样式 */
.timeline-editor {
  width: 100%;
  margin-top: 32rpx;
  background: $uni-bg-color;
  border-radius: 24rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.timeline-title {
  font-size: 32rpx;
  font-weight: 600;
  color: $uni-text-color;
}

.playback-controls {
  display: flex;
  gap: 24rpx;
}

.control-btn {
  font-size: 32rpx;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:active {
    transform: scale(0.9);
  }
}

.timeline-track {
  position: relative;
  width: 100%;
  height: 80rpx;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8rpx;
  overflow: hidden;
}

.timeline-clip {
  position: absolute;
  top: 8rpx;
  height: 64rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 6rpx;
  display: flex;
  align-items: center;
  padding: 0 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(102, 126, 234, 0.3);
}

.clip-label {
  font-size: 24rpx;
  color: white;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 调试面板样式 */
.debug-panel {
  width: 100%;
  margin-top: 32rpx;
  background: #1a1a1a;
  border-radius: 24rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.2);
}

.debug-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #00ff00;
  margin-bottom: 16rpx;
  font-family: 'Courier New', monospace;
}

.debug-item {
  display: flex;
  margin-bottom: 8rpx;
  font-family: 'Courier New', monospace;
  font-size: 24rpx;
}

.debug-key {
  color: #ffa500;
  margin-right: 12rpx;
}

.debug-value {
  color: #00ffff;
}

/* 通用过渡动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter, .slide-leave-to {
  transform: translateY(20rpx);
}

/* 旧版按钮样式 */
.legacy-button {
  padding: 20rpx 40rpx;
  background: linear-gradient(135deg, #00b4db 0%, #0083b0 100%);
  border-radius: 12rpx;
  color: white;
  font-size: 28rpx;
  font-weight: 500;
  box-shadow: 0 4rpx 12rpx rgba(0, 180, 219, 0.3);
}

.legacy-button-secondary {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  box-shadow: 0 4rpx 12rpx rgba(255, 107, 107, 0.3);
}

/* 加载动画变体 */
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse-scale {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}

.animate-pulse-scale {
  animation: pulse-scale 2s ease-in-out infinite;
}

.animate-shimmer {
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}
</style>

