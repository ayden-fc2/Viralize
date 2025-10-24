<template>
  <view class="mine-tab">
    <!-- 用户信息 -->
    <view class="profile-section">
      <u-avatar 
        size="80" 
        :text="displayName.substring(0, 1)"
        bgColor="#667eea"
        color="#ffffff"
      ></u-avatar>
      <view class="info-row">
        <view class="name">{{ displayName }}</view>
      </view>
      <view class="contact-info">{{ displayEmail }}</view>
    </view>

    <!-- 菜单选项 -->
    <view class="menu-section">
      <view class="menu-group">
        <u-cell-group :border="false">
          <u-cell
            @click="onTermsTap"
            size="large"
            :title="$t('mine.terms')"
            isLink
          >
            <u-icon slot="icon" name="file-text" size="20" color="#667eea"></u-icon>
          </u-cell>
          <u-cell
            @click="onPrivacyTap"
            size="large"
            :title="$t('mine.privacy')"
            isLink
          >
            <u-icon slot="icon" name="lock" size="20" color="#667eea"></u-icon>
          </u-cell>
          <u-cell
            @click="onLanguageTap"
            size="large"
            :title="$t('mine.language')"
            isLink
          >
            <u-icon slot="icon" name="chat" size="20" color="#667eea"></u-icon>
          </u-cell>
          <u-cell
            @click="onRemoveAccountTap"
            :border="false"
            size="large"
            :title="$t('mine.deleteAccount')"
            isLink
            :titleStyle="{
              color: '#f5222d',
              fontWeight: '500',
            }"
          >
            <u-icon slot="icon" name="trash" size="20" color="#f5222d"></u-icon>
          </u-cell>
        </u-cell-group>
      </view>
    </view>

    <!-- 退出登录 -->
    <view class="action-section">
      <view class="menu-group">
        <u-cell-group :border="false">
          <u-cell
            @click="onSignOutTap"
            :border="false"
            size="large"
            :title="$t('mine.logout')"
            isLink
            :titleStyle="{
              color: '#f5222d',
              fontWeight: '500',
            }"
          >
            <u-icon slot="icon" name="minus-people-fill" size="20" color="#f5222d"></u-icon>
          </u-cell>
        </u-cell-group>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  computed: {
    displayName() {
      return this.$t('mine.userName')
    },
    
    displayEmail() {
      return this.$t('welcome.title')
    }
  },
  methods: {
    /**
     * 服务条款
     */
    onTermsTap() {
      const url = 'https://productphotography.video/terms'
      const title = this.$t('mine.terms')
      uni.navigateTo({
        url: `/pages/webview/webview?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
      })
    },
    
    /**
     * 隐私政策
     */
    onPrivacyTap() {
      const url = 'https://productphotography.video/privacy'
      const title = this.$t('mine.privacy')
      uni.navigateTo({
        url: `/pages/webview/webview?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
      })
    },
    
    /**
     * 语言设置
     */
    onLanguageTap() {
      uni.navigateTo({
        url: '/pages/lang/lang'
      })
    },
    
    /**
     * 删除账户
     */
    onRemoveAccountTap() {
      uni.showModal({
        title: this.$t('mine.deleteAccountTitle'),
        content: this.$t('mine.deleteAccountMessage'),
        confirmText: this.$t('mine.deleteAccountConfirm'),
        cancelText: this.$t('mine.deleteAccountCancel'),
        confirmColor: '#f5222d',
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: this.$t('common.loading'),
              mask: true
            })
            
            // 延迟处理，给用户反馈
            setTimeout(() => {
              // 清除所有 Vuex 数据
              this.$store.dispatch('user/logout')
              this.$store.dispatch('projects/clearAllProjects')
              
              uni.hideLoading()
              
              uni.showToast({
                title: this.$t('mine.deleteAccountSuccess'),
                icon: 'success',
                duration: 2000
              })
              
              // 跳转到登录页
              setTimeout(() => {
                uni.reLaunch({
                  url: '/pages/hello/hello'
                })
              }, 2000)
            }, 500)
          }
        }
      })
    },
    
    /**
     * 退出登录
     */
    onSignOutTap() {
      uni.showModal({
        title: this.$t('mine.logoutConfirm'),
        content: this.$t('mine.logoutMessage'),
        success: (res) => {
          if (res.confirm) {
            this.$store.dispatch('user/logout')
            uni.reLaunch({
              url: '/pages/login/login'
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.mine-tab {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 40rpx 0;
  background: $uni-bg-color-grey;
}

.profile-section {
  margin: 0 40rpx 24rpx;
  padding: 40rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  .info-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 20rpx;
  }
  
  .name {
    font-size: 36rpx;
    font-weight: 600;
    color: $uni-text-color;
  }
  
  .contact-info {
    font-size: 26rpx;
    color: $uni-text-color-grey;
    margin-top: 8rpx;
  }
}

.menu-section {
  margin: 0 40rpx 24rpx;
  flex: 1;
}

.action-section {
  margin: 0 40rpx 40rpx;
}

.menu-group {
  background: $uni-bg-color;
  border-radius: $uni-border-radius-lg;
  overflow: hidden;
  box-shadow: $uni-shadow-sm;
}

::v-deep .u-cell {
  background-color: $uni-bg-color !important;
  
  .u-cell__title-text {
    color: $uni-text-color !important;
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
</style>

