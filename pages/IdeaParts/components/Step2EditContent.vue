<template>
  <view class="step-2-container">
    <!-- 小尺寸媒体预览 -->
    <view class="media-preview-compact">
      <image :src="imageUrl" mode="aspectFill" class="media-image-small"></image>
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
    }
  },
  data() {
    return {
      localDescription: '',
      localScript: ''
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
    }
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
</style>

