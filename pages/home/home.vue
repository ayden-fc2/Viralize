<template>
  <view class="home-container">
    <view class="content">
      <swiper class="uni-swiper" :duration="300" :current="currentTabIndex">
        <swiper-item @touchmove.stop.prevent>
          <view class="tab-content">
            <u-status-bar></u-status-bar>
            <create-tab></create-tab>
          </view>
        </swiper-item>
        
        <swiper-item @touchmove.stop.prevent>
          <view class="tab-content">
            <u-status-bar></u-status-bar>
            <explore-tab></explore-tab>
          </view>
        </swiper-item>
        
        <swiper-item @touchmove.stop.prevent>
          <view class="tab-content">
            <u-status-bar></u-status-bar>
            <message-tab></message-tab>
          </view>
        </swiper-item>
        
        <swiper-item @touchmove.stop.prevent>
          <view class="tab-content-mine">
            <u-status-bar></u-status-bar>
            <mine-tab></mine-tab>
          </view>
        </swiper-item>
      </swiper>
    </view>
    
    <view v-show="showTabbar">
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
            class="tab-icon tab-icon-active"
            mode="aspectFit"
            slot="active-icon"
            src="/static/community-fill.svg"
          ></image>
          <image
            class="tab-icon tab-icon-inactive"
            mode="aspectFit"
            slot="inactive-icon"
            src="/static/community.svg"
          ></image>
        </u-tabbar-item>
        
        <u-tabbar-item :text="$t('home.tab3')" @click="switchTabbar(2)">
          <image
            class="tab-icon"
            :class="currentTabIndex === 2 ? 'tab-icon-active' : 'tab-icon-inactive'"
            mode="aspectFit"
            slot="active-icon"
            src="/static/email-fill.svg"
          ></image>
          <image
            class="tab-icon"
            :class="currentTabIndex === 2 ? 'tab-icon-active' : 'tab-icon-inactive'"
            mode="aspectFit"
            slot="inactive-icon"
            src="/static/email.svg"
          ></image>
        </u-tabbar-item>
        
        <u-tabbar-item :text="$t('home.tab4')" @click="switchTabbar(3)">
          <image
            class="tab-icon"
            :class="currentTabIndex === 3 ? 'tab-icon-active' : 'tab-icon-inactive'"
            mode="aspectFit"
            slot="active-icon"
            src="/static/user-Fill.svg"
          ></image>
          <image
            class="tab-icon"
            :class="currentTabIndex === 3 ? 'tab-icon-active' : 'tab-icon-inactive'"
            mode="aspectFit"
            slot="inactive-icon"
            src="/static/user.svg"
          ></image>
        </u-tabbar-item>
      </u-tabbar>
      
      <u-safe-bottom></u-safe-bottom>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import CreateTab from './tabs/create.vue'
import ExploreTab from './tabs/explore.vue'
import MessageTab from './tabs/message.vue'
import MineTab from './tabs/mine.vue'

export default {
  components: {
    CreateTab,
    ExploreTab,
    MessageTab,
    MineTab
  },
  data() {
    return {
      currentTabIndex: 0
    }
  },
  computed: {
    ...mapGetters('user', ['token', 'isLoggedIn']),
    ...mapGetters('ui', ['showTabbar'])
  },
  watch: {
    showTabbar(val) {
      console.log('🔄 showTabbar 变化:', val)
    }
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
    padding-bottom: 50px;  // 为 tabbar 留出空间
    box-sizing: border-box;
    position: relative;
    background: linear-gradient(180deg, #f8f9ff 0%, #ffffff 100%);
    
    .scroll-wrapper {
      flex: 1;
      height: 100%;
    }
    
    .content-padding {
      position: relative;
      padding: 60rpx 40rpx 40rpx;
      min-height: 100%;
    }
    
    .top-decoration {
      position: absolute;
      top: 20rpx;
      right: -100rpx;
      width: 400rpx;
      height: 400rpx;
      pointer-events: none;
      
      .decoration-circle {
        position: absolute;
        border-radius: 50%;
        opacity: 0.4;
        
        &.circle-1 {
          width: 300rpx;
          height: 300rpx;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
          top: 0;
          right: 0;
        }
        
        &.circle-2 {
          width: 200rpx;
          height: 200rpx;
          background: linear-gradient(135deg, rgba(240, 147, 251, 0.2), rgba(245, 154, 213, 0.2));
          bottom: 80rpx;
          left: -50rpx;
        }
      }
    }
    
    .header-section {
      display: flex;
      flex-direction: column;
      gap: 16rpx;
      margin-bottom: 48rpx;
      position: relative;
      z-index: 1;
      
      .page-title {
        font-size: 48rpx;
        font-weight: 700;
        color: $uni-text-color;
      }
      
      .subtitle-text {
        font-size: 28rpx;
        color: $uni-text-color-grey;
        line-height: 40rpx;
      }
    }
    
    .todo-cards {
      display: flex;
      flex-direction: column;
      gap: 24rpx;
      position: relative;
      z-index: 1;
    }
    
    .todo-card {
      background: $uni-bg-color;
      border-radius: 24rpx;
      padding: 32rpx;
      box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
      transition: all 0.3s ease;
      
      &:active {
        transform: scale(0.98);
        box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
      }
      
      .card-header {
        display: flex;
        align-items: center;
        gap: 16rpx;
        margin-bottom: 20rpx;
        
        .card-icon {
          width: 64rpx;
          height: 64rpx;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .card-title {
          font-size: 30rpx;
          font-weight: 600;
          color: $uni-text-color;
        }
      }
      
      .card-content {
        display: flex;
        flex-direction: column;
        gap: 12rpx;
        padding-left: 80rpx;
        
        .card-text {
          font-size: 28rpx;
          color: $uni-text-color;
          line-height: 40rpx;
        }
        
        .card-desc {
          font-size: 24rpx;
          color: $uni-text-color-grey;
          line-height: 36rpx;
        }
      }
    }
  }
  
  .tab-content-mine {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-bottom: 50px;  // 为 tabbar 留出空间
    box-sizing: border-box;
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
