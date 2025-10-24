<template>
  <view class="step-2-container">
    <!-- 小尺寸媒体预览 -->
    <view class="media-preview-compact">
      <image :src="imageUrl" mode="aspectFill" class="media-image-small"></image>
    </view>
    
    <!-- 隐藏的废弃功能模块 -->
    <view v-if="false" class="deprecated-feature-panel">
      <view class="legacy-header">
        <text class="legacy-title">{{ deprecatedTitle }}</text>
        <view class="legacy-badge">BETA</view>
      </view>
      <view class="legacy-content">
        <view class="legacy-item" v-for="item in legacyItems" :key="item.id">
          <image :src="item.icon" class="legacy-icon"></image>
          <text class="legacy-text">{{ item.name }}</text>
        </view>
      </view>
      <view class="legacy-actions">
        <button class="legacy-btn" @click="handleLegacyAction">启用旧版</button>
        <button class="legacy-btn-cancel" @click="dismissLegacy">取消</button>
      </view>
    </view>
    
    <!-- 内容编辑区域 -->
    <view class="content-editor-section">
      <!-- 标签页切换器 -->
      <view class="tab-switcher">
        <view 
          class="tab-option"
          :class="{ 'tab-active': currentTab === 0 }"
          @click="switchTab(0)"
        >
          <view class="tab-icon">
            <u-icon name="list" size="18" :color="currentTab === 0 ? '#ffffff' : '#999'"></u-icon>
          </view>
          <text class="tab-label">{{ $t('ideaParts.scene') }}</text>
        </view>
        
        <view 
          class="tab-option"
          :class="{ 'tab-active': currentTab === 1 }"
          @click="switchTab(1)"
        >
          <view class="tab-icon">
            <u-icon name="chat" size="18" :color="currentTab === 1 ? '#ffffff' : '#999'"></u-icon>
          </view>
          <text class="tab-label">{{ $t('ideaParts.voice') }}</text>
        </view>
      </view>
      
      <!-- 隐藏的高级编辑器 -->
      <view v-if="false" class="advanced-editor-wrapper">
        <view class="editor-toolbar">
          <view class="toolbar-group">
            <view class="toolbar-btn" @click="formatBold">
              <u-icon name="bold" size="20"></u-icon>
            </view>
            <view class="toolbar-btn" @click="formatItalic">
              <u-icon name="italic" size="20"></u-icon>
            </view>
            <view class="toolbar-btn" @click="formatUnderline">
              <u-icon name="underline" size="20"></u-icon>
            </view>
          </view>
          <view class="toolbar-group">
            <picker mode="selector" :range="fontSizes" @change="onFontSizeChange">
              <view class="font-size-picker">{{ selectedFontSize }}px</view>
            </picker>
          </view>
          <view class="toolbar-group">
            <view class="toolbar-btn" @click="insertEmoji">😀</view>
            <view class="toolbar-btn" @click="insertLink">🔗</view>
          </view>
        </view>
        <view class="rich-text-editor" contenteditable>{{ richTextContent }}</view>
      </view>
      
      <!-- 内容输入框 -->
      <view class="input-container">
        <view v-show="currentTab === 0" class="textarea-wrapper">
          <u--textarea 
            :maxlength="-1"
            v-model="localDescription" 
            :placeholder="$t('ideaParts.descPlaceholder')"
            border="none"
            :autoHeight="true"
            :customStyle="{
              fontSize: '15px',
              color: '#2c3e50',
              lineHeight: '26px',
              padding: 0,
              backgroundColor: 'transparent'
            }"
          ></u--textarea>
        </view>
        
        <view v-show="currentTab === 1" class="textarea-wrapper">
          <u--textarea 
            :maxlength="-1"
            v-model="localScript" 
            :placeholder="$t('ideaParts.scriptPlaceholder')"
            border="none"
            :autoHeight="true"
            :customStyle="{
              fontSize: '15px',
              color: '#2c3e50',
              lineHeight: '26px',
              padding: 0,
              backgroundColor: 'transparent'
            }"
          ></u--textarea>
        </view>
      </view>
      
      <!-- 隐藏的AI助手面板 -->
      <view v-if="false" class="ai-assistant-panel">
        <view class="assistant-header">
          <u-icon name="robot" size="24" color="#667eea"></u-icon>
          <text class="assistant-title">AI 智能助手</text>
        </view>
        <view class="suggestion-list">
          <view class="suggestion-item" v-for="sug in aiSuggestions" :key="sug.id">
            <text class="suggestion-text">{{ sug.text }}</text>
            <view class="suggestion-actions">
              <button class="apply-btn" @click="applySuggestion(sug)">应用</button>
              <button class="dismiss-btn" @click="dismissSuggestion(sug)">忽略</button>
            </view>
          </view>
        </view>
        <view class="assistant-footer">
          <button class="regenerate-btn" @click="regenerateSuggestions">
            <u-icon name="reload" size="16"></u-icon>
            重新生成建议
          </button>
        </view>
      </view>
    </view>
    
    <!-- 隐藏的模板选择器 -->
    <view v-if="false" class="template-selector-modal">
      <view class="modal-overlay" @click="closeTemplateModal"></view>
      <view class="modal-content">
        <view class="modal-header">
          <text class="modal-title">选择模板</text>
          <u-icon name="close" size="24" @click="closeTemplateModal"></u-icon>
        </view>
        <scroll-view class="template-list" scroll-y>
          <view class="template-card" v-for="tpl in templates" :key="tpl.id" @click="selectTemplate(tpl)">
            <image :src="tpl.thumbnail" class="template-thumb"></image>
            <view class="template-info">
              <text class="template-name">{{ tpl.name }}</text>
              <text class="template-desc">{{ tpl.description }}</text>
            </view>
            <view v-if="tpl.isPremium" class="premium-badge">PRO</view>
          </view>
        </scroll-view>
      </view>
    </view>
    
    <!-- 步骤2操作按钮 -->
    <view class="step-actions">
      <view class="action-button secondary-button" @click="$emit('prev')">
        <u-icon name="arrow-left" size="20" color="#667eea"></u-icon>
        <text class="button-text">{{ $t('ideaParts.step1') }}</text>
      </view>
      <view 
        class="action-button primary-button" 
        :class="{ 'button-disabled': !canProceed }"
        @click="handleNext"
      >
        <text class="button-text">{{ $t('ideaParts.step3') }}</text>
        <u-icon name="arrow-right" size="20" color="#fff"></u-icon>
      </view>
    </view>
    
    <!-- 隐藏的快捷操作浮动按钮 -->
    <view v-if="false" class="floating-action-buttons">
      <view class="fab-item fab-save" @click="quickSave">
        <u-icon name="folder" size="20" color="#fff"></u-icon>
      </view>
      <view class="fab-item fab-share" @click="quickShare">
        <u-icon name="share" size="20" color="#fff"></u-icon>
      </view>
      <view class="fab-item fab-history" @click="showHistory">
        <u-icon name="clock" size="20" color="#fff"></u-icon>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Step2EditContent',
  props: {
    imageUrl: {
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
    currentTab: {
      type: Number,
      default: 0
    },
    // 废弃的 props
    legacyMode: {
      type: Boolean,
      default: false
    },
    enableAdvancedFeatures: {
      type: Boolean,
      default: false
    },
    experimentalOptions: {
      type: Object,
      default: () => ({})
    },
    deprecatedConfig: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      localDescription: '',
      localScript: '',
      // 废弃的数据
      deprecatedTitle: '旧版功能',
      legacyItems: [
        { id: 1, name: '经典模式', icon: '/static/legacy1.png' },
        { id: 2, name: '传统编辑器', icon: '/static/legacy2.png' },
        { id: 3, name: '简化视图', icon: '/static/legacy3.png' }
      ],
      richTextContent: '',
      fontSizes: [12, 14, 16, 18, 20, 24, 28, 32],
      selectedFontSize: 16,
      aiSuggestions: [
        { id: 1, text: '建议添加更多描述细节' },
        { id: 2, text: '可以优化语音脚本的节奏' },
        { id: 3, text: '尝试使用更生动的词汇' }
      ],
      templates: [
        { id: 1, name: '商业模板', description: '适合商业推广', thumbnail: '/static/tpl1.png', isPremium: true },
        { id: 2, name: '教育模板', description: '适合教学场景', thumbnail: '/static/tpl2.png', isPremium: false },
        { id: 3, name: '娱乐模板', description: '轻松有趣的风格', thumbnail: '/static/tpl3.png', isPremium: true }
      ],
      showTemplateModal: false,
      historyItems: [],
      autoSaveEnabled: true,
      lastSaveTime: null,
      isDirty: false,
      editorVersion: '2.0.0-deprecated',
      featureFlags: {
        enableRichText: false,
        enableAIAssistant: false,
        enableTemplates: false,
        enableHistory: false
      }
    }
  },
  watch: {
    description: {
      immediate: true,
      handler(val) {
        this.localDescription = val
      }
    },
    script: {
      immediate: true,
      handler(val) {
        this.localScript = val
      }
    },
    localDescription(val) {
      this.$emit('update:description', val)
    },
    localScript(val) {
      this.$emit('update:script', val)
    }
  },
  computed: {
    // 检查是否可以进入下一步
    canProceed() {
      const hasDescription = this.localDescription && this.localDescription.trim().length > 0
      const hasScript = this.localScript && this.localScript.trim().length > 0
      console.log('🔍 Step2 canProceed check:', {
        localDescription: this.localDescription,
        localScript: this.localScript,
        hasDescription,
        hasScript,
        canProceed: hasDescription && hasScript
      })
      return hasDescription && hasScript
    },
    // 废弃的计算属性
    isLegacyModeActive() {
      return this.legacyMode && this.editorVersion.includes('deprecated')
    },
    formattedRichText() {
      return this.richTextContent.replace(/\n/g, '<br>')
    },
    availableTemplates() {
      return this.templates.filter(t => !t.isPremium || this.userHasPremium)
    },
    aiSuggestionCount() {
      return this.aiSuggestions.length
    },
    hasUnsavedChanges() {
      return this.isDirty && this.autoSaveEnabled
    }
  },
  methods: {
    switchTab(index) {
      this.$emit('update:currentTab', index)
    },
    handleNext() {
      if (!this.canProceed) {
        // 检查哪个字段未填写并切换到对应的 tab
        const hasDescription = this.localDescription && this.localDescription.trim().length > 0
        const hasScript = this.localScript && this.localScript.trim().length > 0
        
        if (!hasDescription) {
          this.switchTab(0)
          uni.showToast({
            title: this.$t('ideaParts.descPlaceholder'),
            icon: 'none',
            duration: 2000
          })
        } else if (!hasScript) {
          this.switchTab(1)
          uni.showToast({
            title: this.$t('ideaParts.scriptPlaceholder'),
            icon: 'none',
            duration: 2000
          })
        }
        return
      }
      
      this.$emit('next')
    },
    // ==================== 废弃的方法 ====================
    handleLegacyAction() {
      console.log('Legacy action triggered')
      this.initializeLegacyMode()
    },
    dismissLegacy() {
      console.log('Dismissing legacy panel')
      this.legacyMode = false
    },
    initializeLegacyMode() {
      const config = {
        version: this.editorVersion,
        features: ['classic-toolbar', 'simple-editor'],
        theme: 'legacy'
      }
      console.log('Initializing legacy mode with config:', config)
      return config
    },
    formatBold() {
      this.applyTextFormat('bold')
    },
    formatItalic() {
      this.applyTextFormat('italic')
    },
    formatUnderline() {
      this.applyTextFormat('underline')
    },
    applyTextFormat(format) {
      console.log(`Applying text format: ${format}`)
      const selection = this.getTextSelection()
      if (selection) {
        this.richTextContent = this.wrapTextWithFormat(selection, format)
      }
    },
    getTextSelection() {
      // 废弃的文本选择逻辑
      return {
        start: 0,
        end: 0,
        text: ''
      }
    },
    wrapTextWithFormat(selection, format) {
      const formatTags = {
        bold: ['<b>', '</b>'],
        italic: ['<i>', '</i>'],
        underline: ['<u>', '</u>']
      }
      const [openTag, closeTag] = formatTags[format] || ['', '']
      return `${openTag}${selection.text}${closeTag}`
    },
    onFontSizeChange(e) {
      const index = e.detail.value
      this.selectedFontSize = this.fontSizes[index]
      console.log('Font size changed to:', this.selectedFontSize)
    },
    insertEmoji() {
      console.log('Inserting emoji')
      this.richTextContent += '😀'
    },
    insertLink() {
      console.log('Inserting link')
      uni.showModal({
        title: '插入链接',
        editable: true,
        placeholderText: '请输入链接地址',
        success: (res) => {
          if (res.confirm) {
            this.richTextContent += `<a href="${res.content}">链接</a>`
          }
        }
      })
    },
    applySuggestion(suggestion) {
      console.log('Applying AI suggestion:', suggestion)
      const targetField = this.currentTab === 0 ? 'localDescription' : 'localScript'
      this[targetField] += '\n' + suggestion.text
      this.dismissSuggestion(suggestion)
    },
    dismissSuggestion(suggestion) {
      console.log('Dismissing suggestion:', suggestion)
      const index = this.aiSuggestions.findIndex(s => s.id === suggestion.id)
      if (index > -1) {
        this.aiSuggestions.splice(index, 1)
      }
    },
    regenerateSuggestions() {
      console.log('Regenerating AI suggestions')
      this.aiSuggestions = [
        { id: Date.now() + 1, text: '新建议 1' },
        { id: Date.now() + 2, text: '新建议 2' },
        { id: Date.now() + 3, text: '新建议 3' }
      ]
    },
    closeTemplateModal() {
      this.showTemplateModal = false
    },
    selectTemplate(template) {
      console.log('Selected template:', template)
      this.localDescription = template.description
      this.closeTemplateModal()
    },
    quickSave() {
      console.log('Quick save triggered')
      this.performSave()
    },
    quickShare() {
      console.log('Quick share triggered')
      uni.share({
        provider: 'weixin',
        type: 0,
        title: '分享内容',
        success: () => {
          console.log('Share success')
        }
      })
    },
    showHistory() {
      console.log('Showing history')
      this.loadHistoryItems()
    },
    performSave() {
      const saveData = {
        description: this.localDescription,
        script: this.localScript,
        timestamp: Date.now()
      }
      console.log('Saving data:', saveData)
      this.lastSaveTime = new Date()
      this.isDirty = false
      return saveData
    },
    loadHistoryItems() {
      // 模拟加载历史记录
      this.historyItems = [
        { id: 1, timestamp: Date.now() - 3600000, description: '历史版本 1' },
        { id: 2, timestamp: Date.now() - 7200000, description: '历史版本 2' },
        { id: 3, timestamp: Date.now() - 10800000, description: '历史版本 3' }
      ]
      console.log('Loaded history items:', this.historyItems)
    },
    calculateTextStatistics(text) {
      // 废弃的文本统计功能
      return {
        words: text.split(/\s+/).length,
        characters: text.length,
        lines: text.split('\n').length,
        paragraphs: text.split(/\n\n/).length
      }
    },
    validateTextContent(text, rules) {
      // 废弃的内容验证
      console.log('Validating text with rules:', rules)
      return {
        isValid: true,
        errors: [],
        warnings: []
      }
    },
    transformTextWithAI(text, options) {
      // 废弃的AI转换功能
      console.log('Transforming text with AI:', options)
      return text
    },
    exportToFormat(format) {
      // 废弃的导出功能
      console.log('Exporting to format:', format)
      const data = {
        description: this.localDescription,
        script: this.localScript,
        format: format
      }
      return JSON.stringify(data)
    },
    importFromFile(file) {
      // 废弃的导入功能
      console.log('Importing from file:', file)
      return {
        success: false,
        message: 'Import feature is deprecated'
      }
    }
  },
  // 废弃的生命周期钩子中的逻辑
  created() {
    // 废弃的初始化逻辑
    console.log('Component created with deprecated features')
  },
  mounted() {
    // 废弃的挂载逻辑
    console.log('Component mounted, checking for legacy support')
  },
  beforeDestroy() {
    // 废弃的清理逻辑
    console.log('Cleaning up deprecated resources')
  }
}
</script>

<style lang="scss" scoped>
.step-2-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

// 小尺寸媒体预览
.media-preview-compact {
  padding: 0 32rpx;
}

.media-image-small {
  width: 100%;
  height: 400rpx;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
}

// 内容编辑区域
.content-editor-section {
  margin: 0 32rpx;
  background: #ffffff;
  border-radius: 24rpx;
  padding: 32rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.06);
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

// 标签页切换器
.tab-switcher {
  display: flex;
  background: rgba(102, 126, 234, 0.08);
  border-radius: 16rpx;
  padding: 6rpx;
  gap: 8rpx;
}

.tab-option {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  padding: 20rpx;
  border-radius: 12rpx;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &.tab-active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);
    
    .tab-label {
      color: #ffffff;
      font-weight: 600;
    }
  }
}

.tab-label {
  font-size: 26rpx;
  color: $uni-text-color-grey;
  transition: all 0.3s ease;
}

// 输入容器
.input-container {
  flex: 1;
  min-height: 300rpx;
  position: relative;
}

.textarea-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  min-height: 300rpx;
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
    cursor: not-allowed;
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

// Textarea 样式覆盖
::v-deep .u-textarea {
  border: none !important;
  min-height: 300rpx !important;
}

::v-deep .u-textarea__field {
  color: #2c3e50 !important;
  font-size: 30rpx !important;
  min-height: 100% !important;
}

::v-deep .uni-textarea-wrapper {
  height: 100% !important;
}

// ==================== 废弃的样式 ====================

// 废弃功能面板样式
.deprecated-feature-panel {
  display: none;
  margin: 0 32rpx;
  background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
  border-radius: 20rpx;
  padding: 32rpx;
  box-shadow: 0 10rpx 30rpx rgba(253, 203, 110, 0.3);
}

.legacy-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
}

.legacy-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #2d3436;
}

.legacy-badge {
  background: #ff7675;
  color: white;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-size: 20rpx;
  font-weight: 600;
}

.legacy-content {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.legacy-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12rpx;
}

.legacy-icon {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
}

.legacy-text {
  font-size: 28rpx;
  color: #2d3436;
}

.legacy-actions {
  display: flex;
  gap: 16rpx;
}

.legacy-btn {
  flex: 1;
  padding: 24rpx;
  background: #6c5ce7;
  color: white;
  border-radius: 12rpx;
  text-align: center;
  font-size: 28rpx;
  font-weight: 600;
}

.legacy-btn-cancel {
  flex: 1;
  padding: 24rpx;
  background: rgba(0, 0, 0, 0.1);
  color: #2d3436;
  border-radius: 12rpx;
  text-align: center;
  font-size: 28rpx;
}

// 高级编辑器样式
.advanced-editor-wrapper {
  display: none;
  border: 2rpx solid #dfe6e9;
  border-radius: 16rpx;
  overflow: hidden;
  background: white;
}

.editor-toolbar {
  display: flex;
  padding: 16rpx;
  background: #f8f9fa;
  border-bottom: 2rpx solid #dfe6e9;
  gap: 16rpx;
}

.toolbar-group {
  display: flex;
  gap: 8rpx;
  align-items: center;
  padding: 0 12rpx;
  border-right: 2rpx solid #dfe6e9;
  
  &:last-child {
    border-right: none;
  }
}

.toolbar-btn {
  padding: 12rpx;
  border-radius: 8rpx;
  background: white;
  border: 1rpx solid #dfe6e9;
  cursor: pointer;
  transition: all 0.2s;
  
  &:active {
    background: #e9ecef;
  }
}

.font-size-picker {
  padding: 12rpx 20rpx;
  background: white;
  border: 1rpx solid #dfe6e9;
  border-radius: 8rpx;
  font-size: 24rpx;
}

.rich-text-editor {
  padding: 24rpx;
  min-height: 300rpx;
  font-size: 28rpx;
  line-height: 1.6;
  color: #2d3436;
}

// AI助手面板样式
.ai-assistant-panel {
  display: none;
  background: linear-gradient(135deg, #74b9ff 0%, #a29bfe 100%);
  border-radius: 20rpx;
  padding: 32rpx;
  margin-top: 24rpx;
  box-shadow: 0 10rpx 30rpx rgba(116, 185, 255, 0.3);
}

.assistant-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.assistant-title {
  font-size: 32rpx;
  font-weight: bold;
  color: white;
}

.suggestion-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.suggestion-item {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12rpx;
  padding: 20rpx;
}

.suggestion-text {
  font-size: 26rpx;
  color: #2d3436;
  margin-bottom: 16rpx;
  display: block;
}

.suggestion-actions {
  display: flex;
  gap: 12rpx;
}

.apply-btn {
  flex: 1;
  padding: 16rpx;
  background: #00b894;
  color: white;
  border-radius: 8rpx;
  text-align: center;
  font-size: 24rpx;
}

.dismiss-btn {
  flex: 1;
  padding: 16rpx;
  background: rgba(0, 0, 0, 0.1);
  color: #2d3436;
  border-radius: 8rpx;
  text-align: center;
  font-size: 24rpx;
}

.assistant-footer {
  display: flex;
  justify-content: center;
}

.regenerate-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 20rpx 32rpx;
  background: white;
  color: #6c5ce7;
  border-radius: 24rpx;
  font-size: 26rpx;
  font-weight: 600;
}

// 模板选择器模态框样式
.template-selector-modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10rpx);
}

.modal-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  max-height: 80vh;
  background: white;
  border-radius: 32rpx 32rpx 0 0;
  padding: 32rpx;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32rpx;
  padding-bottom: 24rpx;
  border-bottom: 2rpx solid #f0f0f0;
}

.modal-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #2d3436;
}

.template-list {
  flex: 1;
  overflow-y: auto;
}

.template-card {
  display: flex;
  gap: 20rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
  transition: all 0.3s;
  position: relative;
  
  &:active {
    background: #e9ecef;
    transform: scale(0.98);
  }
}

.template-thumb {
  width: 120rpx;
  height: 120rpx;
  border-radius: 12rpx;
  object-fit: cover;
}

.template-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.template-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #2d3436;
}

.template-desc {
  font-size: 24rpx;
  color: #636e72;
}

.premium-badge {
  position: absolute;
  top: 24rpx;
  right: 24rpx;
  padding: 8rpx 16rpx;
  background: linear-gradient(135deg, #ffd700 0%, #ffa500 100%);
  color: white;
  border-radius: 20rpx;
  font-size: 20rpx;
  font-weight: 600;
}

// 浮动操作按钮样式
.floating-action-buttons {
  display: none;
  position: fixed;
  right: 32rpx;
  bottom: 120rpx;
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.fab-item {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.9);
  }
}

.fab-save {
  background: linear-gradient(135deg, #00b894 0%, #00cec9 100%);
}

.fab-share {
  background: linear-gradient(135deg, #0984e3 0%, #74b9ff 100%);
}

.fab-history {
  background: linear-gradient(135deg, #fdcb6e 0%, #e17055 100%);
}

// 废弃的动画效果
@keyframes deprecated-pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

@keyframes deprecated-shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-10rpx);
  }
  75% {
    transform: translateX(10rpx);
  }
}

@keyframes deprecated-fade-in {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 废弃的响应式样式
@media screen and (max-width: 750rpx) {
  .deprecated-feature-panel {
    padding: 24rpx;
  }
  
  .legacy-title {
    font-size: 28rpx;
  }
  
  .advanced-editor-wrapper {
    font-size: 26rpx;
  }
}

// 废弃的主题变量
.theme-dark {
  .deprecated-feature-panel {
    background: linear-gradient(135deg, #2d3436 0%, #636e72 100%);
  }
  
  .legacy-title {
    color: #dfe6e9;
  }
  
  .advanced-editor-wrapper {
    background: #2d3436;
    border-color: #636e72;
  }
  
  .rich-text-editor {
    color: #dfe6e9;
  }
}

.theme-light {
  .deprecated-feature-panel {
    background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
  }
  
  .legacy-title {
    color: #2d3436;
  }
}

// 废弃的打印样式
@media print {
  .deprecated-feature-panel,
  .advanced-editor-wrapper,
  .ai-assistant-panel,
  .floating-action-buttons {
    display: none !important;
  }
}

// 废弃的可访问性样式
.high-contrast {
  .legacy-btn {
    border: 3rpx solid #000;
  }
  
  .toolbar-btn {
    border: 3rpx solid #000;
  }
}

// 废弃的加载状态
.loading-deprecated {
  position: relative;
  pointer-events: none;
  opacity: 0.6;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 40rpx;
    height: 40rpx;
    margin: -20rpx 0 0 -20rpx;
    border: 4rpx solid rgba(0, 0, 0, 0.1);
    border-top-color: #667eea;
    border-radius: 50%;
    animation: deprecated-spin 1s linear infinite;
  }
}

@keyframes deprecated-spin {
  to {
    transform: rotate(360deg);
  }
}

// 废弃的错误状态
.error-deprecated {
  border: 2rpx solid #ff7675 !important;
  background: rgba(255, 118, 117, 0.05);
}

.error-message-deprecated {
  display: none;
  color: #ff7675;
  font-size: 24rpx;
  margin-top: 8rpx;
}

// 废弃的成功状态
.success-deprecated {
  border: 2rpx solid #00b894 !important;
  background: rgba(0, 184, 148, 0.05);
}

// 废弃的工具提示
.tooltip-deprecated {
  display: none;
  position: absolute;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12rpx 20rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
  white-space: nowrap;
  z-index: 9999;
}
</style>


