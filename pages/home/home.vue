<template>
  <view class="home-container">
    <view class="content">
      <swiper class="uni-swiper" :duration="300" :current="currentTabIndex">
        <swiper-item @touchmove.stop.prevent>
          <view class="tab-content">
            <u-status-bar></u-status-bar>
            <view class="page-header">
              <text class="page-title">{{ $t('home.tab1') }}</text>
            </view>
            <view class="todo-placeholder">
              <text class="todo-text">TODO: {{ $t('home.tab1') }} 内容</text>
            </view>
          </view>
        </swiper-item>
        
        <swiper-item @touchmove.stop.prevent>
          <view class="tab-content">
            <u-status-bar></u-status-bar>
            <view class="page-header">
              <text class="page-title">{{ $t('home.tab2') }}</text>
            </view>
            <view class="todo-placeholder">
              <text class="todo-text">TODO: {{ $t('home.tab2') }} 内容</text>
            </view>
          </view>
        </swiper-item>
        
        <swiper-item @touchmove.stop.prevent>
          <view class="tab-content">
            <u-status-bar></u-status-bar>
            <view class="page-header">
              <text class="page-title">{{ $t('home.tab3') }}</text>
            </view>
            <view class="todo-placeholder">
              <text class="todo-text">TODO: {{ $t('home.tab3') }} 内容</text>
              
              <!-- 添加退出登录按钮 -->
              <view class="logout-section">
                <button class="logout-btn" @click="handleLogout">退出登录</button>
              </view>
            </view>
          </view>
        </swiper-item>
      </swiper>
    </view>
    
    <view>
      <u-tabbar 
        :value="currentTabIndex" 
        :placeholder="false"
        activeColor="#667eea"
        inactiveColor="#8c9cb0"
      >
        <u-tabbar-item :text="$t('home.tab1')" @click="switchTabbar(0)">
          <image
            class="tab-icon"
            :class="currentTabIndex === 0 ? 'tab-icon-active' : 'tab-icon-inactive'"
            mode="aspectFit"
            slot="active-icon"
            src="/static/home-fill.svg"
          ></image>
          <image
            class="tab-icon"
            :class="currentTabIndex === 0 ? 'tab-icon-active' : 'tab-icon-inactive'"
            mode="aspectFit"
            slot="inactive-icon"
            src="/static/home.svg"
          ></image>
        </u-tabbar-item>
        
        <u-tabbar-item :text="$t('home.tab2')" @click="switchTabbar(1)">
          <image
            class="tab-icon"
            :class="currentTabIndex === 1 ? 'tab-icon-active' : 'tab-icon-inactive'"
            mode="aspectFit"
            slot="active-icon"
            src="/static/folder-fill.svg"
          ></image>
          <image
            class="tab-icon"
            :class="currentTabIndex === 1 ? 'tab-icon-active' : 'tab-icon-inactive'"
            mode="aspectFit"
            slot="inactive-icon"
            src="/static/folder.svg"
          ></image>
        </u-tabbar-item>
        
        <u-tabbar-item :text="$t('home.tab3')" @click="switchTabbar(2)">
          <image
            class="tab-icon"
            :class="currentTabIndex === 2 ? 'tab-icon-active' : 'tab-icon-inactive'"
            mode="aspectFit"
            slot="active-icon"
            src="/static/user-Fill.svg"
          ></image>
          <image
            class="tab-icon"
            :class="currentTabIndex === 2 ? 'tab-icon-active' : 'tab-icon-inactive'"
            mode="aspectFit"
            slot="inactive-icon"
            src="/static/user.svg"
          ></image>
        </u-tabbar-item>
      </u-tabbar>
    </view>
    
    <u-safe-bottom></u-safe-bottom>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      currentTabIndex: 0
    }
  },
  computed: {
    ...mapGetters('user', ['token', 'userInfo', 'isLoggedIn'])
  },
  onLoad() {
    console.log('🏠 进入首页')
    
    // 如果未登录，跳转到登录页
    if (!this.isLoggedIn) {
      uni.reLaunch({
        url: '/pages/login/login'
      })
    }
  },
  methods: {
    /**
     * 切换 Tab
     */
    switchTabbar(index) {
      this.currentTabIndex = index
    },
    
    /**
     * 退出登录
     */
    handleLogout() {
      uni.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
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
.home-container {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  background: $uni-bg-color-grey;
  
  .content {
    width: 100%;
    flex: 1;
    position: relative;
    
    .uni-swiper {
      height: 100%;
    }
  }
  
  .tab-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    
    .page-header {
      background: $uni-bg-color;
      padding: 40rpx 40rpx 30rpx;
      box-shadow: $uni-shadow-sm;
      
      .page-title {
        font-size: 48rpx;
        font-weight: 600;
        color: $uni-text-color;
      }
    }
    
    .todo-placeholder {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40rpx;
      
      .todo-text {
        font-size: 32rpx;
        color: $uni-text-color-grey;
        text-align: center;
        margin-bottom: 60rpx;
      }
      
      .logout-section {
        width: 100%;
        max-width: 600rpx;
        margin-top: 60rpx;
        
        .logout-btn {
          width: 100%;
          height: 88rpx;
          background: linear-gradient(135deg, $viralize-primary 0%, $viralize-primary-light 100%);
          color: $uni-text-color-inverse;
          border: none;
          border-radius: $uni-border-radius-lg;
          font-size: 32rpx;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          
          &:active {
            opacity: 0.9;
          }
        }
      }
    }
  }
}

::v-deep .u-tabbar {
  background: $uni-bg-color;
  border-top: 1rpx solid $uni-border-color;
}

::v-deep .u-tabbar__content {
  background-color: $uni-bg-color;
}

::v-deep .u-tabbar-item__text {
  font-size: 24rpx;
}

.tab-icon {
  width: 48rpx;
  height: 48rpx;
}

// 未激活状态的图标 - 灰色 #8c9cb0
.tab-icon-inactive {
  filter: brightness(0) saturate(100%) invert(62%) sepia(8%) saturate(686%) hue-rotate(172deg) brightness(92%) contrast(90%);
}

// 激活状态的图标 - 品牌主色紫色 #667eea
.tab-icon-active {
  filter: brightness(0) saturate(100%) invert(42%) sepia(78%) saturate(1893%) hue-rotate(220deg) brightness(98%) contrast(88%);
}
</style>
