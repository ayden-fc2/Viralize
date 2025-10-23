<template>
  <view class="lang-page">
    <u-status-bar></u-status-bar>
    <u-navbar
      :title="$t('mine.language')"
      :autoBack="true"
      bgColor="transparent"
      leftIconColor="#667eea"
    >
    </u-navbar>
    
    <view class="page-content">
      <view class="options-container">
        <u-cell-group :border="false">
          <u-cell
            title="English"
            label="English"
            :titleStyle="{
              fontWeight: '600',
              color: selectedValue === 'en' ? '#667eea' : '#2c3e50'
            }"
            @click="onSelectOption('en')"
          >
            <u-icon 
              v-if="selectedValue === 'en'" 
              name="checkmark" 
              color="#667eea" 
              size="24"
              slot="value"
            ></u-icon>
          </u-cell>
          
          <u-cell
            title="简体中文"
            label="Simplified Chinese"
            :titleStyle="{
              fontWeight: '600',
              color: selectedValue === 'zh-Hans' ? '#667eea' : '#2c3e50'
            }"
            @click="onSelectOption('zh-Hans')"
          >
            <u-icon 
              v-if="selectedValue === 'zh-Hans'" 
              name="checkmark" 
              color="#667eea" 
              size="24"
              slot="value"
            ></u-icon>
          </u-cell>
          
          <u-cell
            title="繁體中文"
            label="Traditional Chinese"
            :titleStyle="{
              fontWeight: '600',
              color: selectedValue === 'zh-Hant' ? '#667eea' : '#2c3e50'
            }"
            @click="onSelectOption('zh-Hant')"
          >
            <u-icon 
              v-if="selectedValue === 'zh-Hant'" 
              name="checkmark" 
              color="#667eea" 
              size="24"
              slot="value"
            ></u-icon>
          </u-cell>
          
          <u-cell
            title="日本語"
            label="Japanese"
            :titleStyle="{
              fontWeight: '600',
              color: selectedValue === 'ja' ? '#667eea' : '#2c3e50'
            }"
            @click="onSelectOption('ja')"
          >
            <u-icon 
              v-if="selectedValue === 'ja'" 
              name="checkmark" 
              color="#667eea" 
              size="24"
              slot="value"
            ></u-icon>
          </u-cell>
        </u-cell-group>
      </view>
    </view>
    
    <u-safe-bottom></u-safe-bottom>
    
    <!-- 确认弹窗 -->
    <u-modal
      :show="dialogVisible"
      :title="$t('lang.confirm')"
      :content="dialogText"
      :confirmText="$t('lang.confirmBtn')"
      :cancelText="$t('lang.cancelBtn')"
      :showCancelButton="true"
      @confirm="onConfirm"
      @cancel="onCancel"
    >
    </u-modal>
  </view>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      pendingValue: 'en',
    }
  },
  computed: {
    selectedValue() {
      // 使用 uni.getLocale() 获取当前语言
      return uni.getLocale()
    },
    dialogText() {
      return this.$t('lang.confirmMessage')
    }
  },
  methods: {
    onSelectOption(value) {
      if (this.selectedValue !== value) {
        this.pendingValue = value
        this.dialogVisible = true
      }
    },
    onConfirm() {
      // 使用 uni.setLocale 和 $i18n.locale 切换语言
      uni.setLocale(this.pendingValue)
      this.$i18n.locale = this.pendingValue
      this.dialogVisible = false
      
      // 延迟刷新以确保语言切换生效
      setTimeout(() => {
        uni.reLaunch({
          url: '/pages/home/home'
        })
      }, 300)
    },
    onCancel() {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.lang-page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: $uni-bg-color-grey;
}

.page-content {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 44px;  // 为 navbar 留出空间
  padding: 40rpx;
  box-sizing: border-box;  // 添加 box-sizing 确保 padding 不会增加总宽度

  .options-container {
    width: 100%;
    background: $uni-bg-color;
    border-radius: $uni-border-radius-lg;
    overflow: hidden;
    box-shadow: $uni-shadow-sm;
  }
}

::v-deep .u-cell {
  background-color: $uni-bg-color !important;
  padding: 32rpx 40rpx !important;
  
  .u-cell__title-text {
    font-size: 32rpx !important;
  }
  
  .u-cell__label {
    color: $uni-text-color-grey !important;
    font-size: 24rpx !important;
    margin-top: 8rpx !important;
  }
  
  .u-cell__body {
    border-color: $uni-border-color !important;
  }
  
  .u-line {
    background-color: $uni-border-color !important;
  }
  
  &:active {
    background-color: $uni-bg-color-hover !important;
  }
}

::v-deep .u-navbar {
  background-color: $uni-bg-color !important;
}
</style>

