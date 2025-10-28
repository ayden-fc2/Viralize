<template>
  <view class="message-tab">
    <!-- 顶部装饰 -->
    <view class="top-decoration">
      <view class="decoration-circle circle-1"></view>
      <view class="decoration-circle circle-2"></view>
    </view>
    
    <!-- 固定顶部区域 -->
    <view class="fixed-header">
      <!-- 标题区域 -->
      <view class="header-section">
        <text class="page-title">{{ $t('message.title') }}</text>
        <text class="subtitle-text">{{ $t('message.subtitle') }}</text>
      </view>
    </view>
    
    <!-- 空状态 -->
    <view class="empty-state">
      <u-icon name="email" size="64" color="rgba(102, 126, 234, 0.3)"></u-icon>
      <text class="empty-text">{{ $t('message.noMessages') }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'MessageTab',
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.message-tab {
  width: 100%;
  height: 100%;
  position: relative;
  background: linear-gradient(180deg, #f8f9ff 0%, #ffffff 100%);
  overflow: hidden;
}

.top-decoration {
  position: absolute;
  top: 20rpx;
  right: -100rpx;
  width: 400rpx;
  height: 400rpx;
  pointer-events: none;
  z-index: 0;
  
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

.fixed-header {
  position: relative;
  z-index: 1;
  padding: 60rpx 40rpx 24rpx;
}

.header-section {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  
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

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24rpx;
  padding: 200rpx 40rpx;
  
  .empty-text {
    font-size: 28rpx;
    color: $uni-text-color-grey;
  }
}
</style>

