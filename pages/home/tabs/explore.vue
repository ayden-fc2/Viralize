<template>
  <view class="explore-tab">
    <!-- 顶部装饰 -->
    <view class="top-decoration">
      <view class="decoration-circle circle-1"></view>
      <view class="decoration-circle circle-2"></view>
    </view>
    
    <scroll-view 
      scroll-y 
      class="content-wrapper"
      :show-scrollbar="false"
      @scrolltolower="onReachBottom"
    >
      <!-- 标题区域 -->
      <view class="header-section">
        <text class="page-title">{{ $t('explore.title') }}</text>
        <text class="subtitle-text">{{ $t('explore.subtitle') }}</text>
      </view>
      
      <!-- 帖子列表 -->
      <view class="posts-list">
        <view 
          v-for="post in visiblePosts" 
          :key="post.id"
          class="post-card"
        >
          <!-- 帖子头部 -->
          <view class="post-header">
            <view class="author-info" @click="handleAuthorClick(post.author)">
              <image :src="post.author.avatar" class="author-avatar"></image>
              <view class="author-details">
                <view class="author-name-row">
                  <text class="author-name">{{ post.author.name }}</text>
                  <image 
                    v-if="post.author.isOfficial" 
                    src="/static/verified.svg" 
                    class="verified-icon"
                  ></image>
                </view>
                <text class="post-time">{{ formatTime(post.createdAt) }}</text>
              </view>
            </view>
            <view class="post-more" @click="handleMoreClick(post)">
              <u-icon name="more-dot-fill" size="20" color="#8c9cb0"></u-icon>
            </view>
          </view>
          
          <!-- 置顶标签 -->
          <view v-if="post.isPinned" class="pinned-badge">
            <u-icon name="pushpin" size="12" color="#667eea"></u-icon>
            <text class="pinned-text">{{ $t('community.pinned') }}</text>
          </view>
          
          <!-- 帖子内容 -->
          <view class="post-content">
            <text class="post-text">{{ post.content }}</text>
          </view>
          
          <!-- 帖子图片 -->
          <view v-if="post.images && post.images.length > 0" class="post-images">
            <image 
              v-for="(img, index) in post.images.slice(0, 9)" 
              :key="index"
              :src="img" 
              class="post-image"
              mode="aspectFill"
              @click="previewImage(post.images, index)"
            ></image>
          </view>
          
          <!-- 帖子操作栏 -->
          <view class="post-actions">
            <view class="action-item" @click="handleLike(post)">
              <u-icon 
                :name="post.isLiked ? 'heart-fill' : 'heart'" 
                size="20" 
                :color="post.isLiked ? '#f56c6c' : '#8c9cb0'"
              ></u-icon>
              <text class="action-text" :class="{ liked: post.isLiked }">{{ post.likes }}</text>
            </view>
            
            <view class="action-item" @click="handleComment(post)">
              <u-icon name="chat" size="20" color="#8c9cb0"></u-icon>
              <text class="action-text">{{ post.comments }}</text>
            </view>
            
            <view class="action-item">
              <u-icon name="share" size="20" color="#8c9cb0"></u-icon>
              <text class="action-text">{{ $t('community.share') }}</text>
            </view>
          </view>
        </view>
        
        <!-- 空状态 -->
        <view v-if="visiblePosts.length === 0" class="empty-state">
          <u-icon name="chat" size="64" color="rgba(102, 126, 234, 0.3)"></u-icon>
          <text class="empty-text">{{ $t('community.noPosts') }}</text>
        </view>
      </view>
    </scroll-view>
    
    <!-- 评论弹窗 -->
    <u-popup 
      v-model="showCommentPopup" 
      mode="bottom" 
      :border-radius="24"
      :closeable="true"
      :safe-area-inset-bottom="true"
    >
      <view class="comment-popup">
        <view class="popup-header">
          <text class="popup-title">{{ $t('community.comments') }}</text>
          <text class="comment-count">{{ currentPostComments.length }}</text>
        </view>
        
        <scroll-view scroll-y class="comments-list">
          <view 
            v-for="comment in currentPostComments" 
            :key="comment.id"
            class="comment-item"
          >
            <image :src="comment.author.avatar" class="comment-avatar"></image>
            <view class="comment-content">
              <view class="comment-header">
                <text class="comment-author">{{ comment.author.name }}</text>
                <text class="comment-time">{{ formatTime(comment.createdAt) }}</text>
              </view>
              <text class="comment-text">{{ comment.content }}</text>
              <view class="comment-actions">
                <text 
                  class="comment-action-btn" 
                  @click="handleReportComment(comment)"
                >
                  {{ $t('community.report') }}
                </text>
                <text 
                  class="comment-action-btn" 
                  @click="handleBlockCommentAuthor(comment)"
                >
                  {{ $t('community.block') }}
                </text>
              </view>
            </view>
          </view>
          
          <view v-if="currentPostComments.length === 0" class="empty-comments">
            <text class="empty-text">{{ $t('community.noComments') }}</text>
          </view>
        </scroll-view>
        
        <view class="comment-input-box">
          <input 
            v-model="commentInput"
            class="comment-input"
            :placeholder="$t('community.writeComment')"
            :maxlength="500"
          />
          <view 
            class="send-btn" 
            :class="{ active: commentInput.trim() }"
            @click="handleSendComment"
          >
            <text class="send-text">{{ $t('community.send') }}</text>
          </view>
        </view>
      </view>
    </u-popup>
    
    <!-- 更多操作菜单 -->
    <u-action-sheet 
      :list="actionSheetList" 
      v-model="showActionSheet"
      :cancel-text="$t('common.cancel')"
      @click="handleActionSheetClick"
    ></u-action-sheet>
  </view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ExploreTab',
  data() {
    return {
      showCommentPopup: false,
      currentPost: null,
      commentInput: '',
      showActionSheet: false,
      actionSheetList: []
    }
  },
  computed: {
    ...mapGetters('community', ['visiblePosts', 'getPostComments']),
    
    currentPostComments() {
      if (!this.currentPost) return []
      return this.getPostComments(this.currentPost.id)
    }
  },
  methods: {
    ...mapActions('community', [
      'toggleLike', 
      'addComment', 
      'blockUser', 
      'reportPost', 
      'reportComment'
    ]),
    
    /**
     * 格式化时间
     */
    formatTime(timestamp) {
      const now = Date.now()
      const diff = now - timestamp
      
      const minute = 60 * 1000
      const hour = 60 * minute
      const day = 24 * hour
      
      if (diff < minute) {
        return this.$t('community.justNow')
      } else if (diff < hour) {
        return Math.floor(diff / minute) + this.$t('community.minutesAgo')
      } else if (diff < day) {
        return Math.floor(diff / hour) + this.$t('community.hoursAgo')
      } else if (diff < 7 * day) {
        return Math.floor(diff / day) + this.$t('community.daysAgo')
      } else {
        const date = new Date(timestamp)
        return `${date.getMonth() + 1}-${date.getDate()}`
      }
    },
    
    /**
     * 点击作者头像
     */
    handleAuthorClick(author) {
      console.log('点击作者:', author)
      // TODO: 跳转到用户主页
    },
    
    /**
     * 点击更多按钮
     */
    handleMoreClick(post) {
      this.currentPost = post
      
      const list = []
      
      // 如果不是官方账号，可以举报和拉黑
      if (!post.author.isOfficial) {
        list.push({
          text: this.$t('community.report'),
          color: '#f56c6c',
          type: 'report'
        })
        list.push({
          text: this.$t('community.block'),
          color: '#f56c6c',
          type: 'block'
        })
      }
      
      this.actionSheetList = list
      this.showActionSheet = true
    },
    
    /**
     * 处理操作菜单点击
     */
    handleActionSheetClick(index) {
      const action = this.actionSheetList[index]
      
      if (action.type === 'report') {
        this.handleReportPost(this.currentPost)
      } else if (action.type === 'block') {
        this.handleBlockUser(this.currentPost.author)
      }
    },
    
    /**
     * 点赞
     */
    handleLike(post) {
      this.toggleLike(post.id)
    },
    
    /**
     * 打开评论
     */
    handleComment(post) {
      this.currentPost = post
      this.showCommentPopup = true
      this.commentInput = ''
    },
    
    /**
     * 发送评论
     */
    async handleSendComment() {
      if (!this.commentInput.trim()) return
      
      try {
        await this.addComment({
          postId: this.currentPost.id,
          content: this.commentInput.trim()
        })
        
        this.commentInput = ''
        
        uni.showToast({
          title: this.$t('community.commentSuccess'),
          icon: 'success'
        })
      } catch (error) {
        console.error('发送评论失败:', error)
        uni.showToast({
          title: this.$t('community.commentFailed'),
          icon: 'none'
        })
      }
    },
    
    /**
     * 举报帖子
     */
    handleReportPost(post) {
      uni.showModal({
        title: this.$t('community.reportPost'),
        content: this.$t('community.reportPostConfirm'),
        confirmText: this.$t('community.confirm'),
        cancelText: this.$t('common.cancel'),
        success: (res) => {
          if (res.confirm) {
            this.reportPost(post.id)
            uni.showToast({
              title: this.$t('community.reportSuccess'),
              icon: 'success'
            })
          }
        }
      })
    },
    
    /**
     * 拉黑用户
     */
    handleBlockUser(author) {
      uni.showModal({
        title: this.$t('community.blockUser'),
        content: this.$t('community.blockUserConfirm', { name: author.name }),
        confirmText: this.$t('community.confirm'),
        cancelText: this.$t('common.cancel'),
        confirmColor: '#f56c6c',
        success: (res) => {
          if (res.confirm) {
            this.blockUser(author.id)
            uni.showToast({
              title: this.$t('community.blockSuccess'),
              icon: 'success'
            })
          }
        }
      })
    },
    
    /**
     * 举报评论
     */
    handleReportComment(comment) {
      uni.showModal({
        title: this.$t('community.reportComment'),
        content: this.$t('community.reportCommentConfirm'),
        confirmText: this.$t('community.confirm'),
        cancelText: this.$t('common.cancel'),
        success: (res) => {
          if (res.confirm) {
            this.reportComment(comment.id)
            uni.showToast({
              title: this.$t('community.reportSuccess'),
              icon: 'success'
            })
          }
        }
      })
    },
    
    /**
     * 拉黑评论作者
     */
    handleBlockCommentAuthor(comment) {
      uni.showModal({
        title: this.$t('community.blockUser'),
        content: this.$t('community.blockUserConfirm', { name: comment.author.name }),
        confirmText: this.$t('community.confirm'),
        cancelText: this.$t('common.cancel'),
        confirmColor: '#f56c6c',
        success: (res) => {
          if (res.confirm) {
            this.blockUser(comment.author.id)
            uni.showToast({
              title: this.$t('community.blockSuccess'),
              icon: 'success'
            })
            this.showCommentPopup = false
          }
        }
      })
    },
    
    /**
     * 预览图片
     */
    previewImage(images, current) {
      uni.previewImage({
        urls: images,
        current: current
      })
    },
    
    /**
     * 滚动到底部
     */
    onReachBottom() {
      console.log('滚动到底部')
      // TODO: 加载更多
    }
  }
}
</script>

<style lang="scss" scoped>
.explore-tab {
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

.content-wrapper {
  position: relative;
  z-index: 1;
  height: 100%;
  width: 100%;
  padding: 60rpx 40rpx 40rpx;
  box-sizing: border-box;
}

.header-section {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-bottom: 48rpx;
  
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

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.post-card {
  background: $uni-bg-color;
  border-radius: 24rpx;
  padding: 32rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.post-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 20rpx;
  flex: 1;
}

.author-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: $uni-bg-color-grey;
}

.author-details {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.author-name-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.author-name {
  font-size: 28rpx;
  font-weight: 600;
  color: $uni-text-color;
}

.verified-icon {
  width: 28rpx;
  height: 28rpx;
}

.post-time {
  font-size: 24rpx;
  color: $uni-text-color-grey;
}

.post-more {
  padding: 8rpx;
}

.pinned-badge {
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
  padding: 8rpx 16rpx;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 8rpx;
  margin-bottom: 20rpx;
  
  .pinned-text {
    font-size: 22rpx;
    color: #667eea;
    font-weight: 500;
  }
}

.post-content {
  margin-bottom: 24rpx;
}

.post-text {
  font-size: 28rpx;
  color: $uni-text-color;
  line-height: 44rpx;
  white-space: pre-wrap;
}

.post-images {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12rpx;
  margin-bottom: 24rpx;
}

.post-image {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 12rpx;
  background: $uni-bg-color-grey;
}

.post-actions {
  display: flex;
  align-items: center;
  gap: 48rpx;
  padding-top: 24rpx;
  border-top: 1rpx solid $uni-border-color;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
  cursor: pointer;
  
  &:active {
    opacity: 0.7;
  }
}

.action-text {
  font-size: 26rpx;
  color: $uni-text-color-grey;
  
  &.liked {
    color: #f56c6c;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24rpx;
  padding: 120rpx 0;
  
  .empty-text {
    font-size: 28rpx;
    color: $uni-text-color-grey;
  }
}

// 评论弹窗样式
.comment-popup {
  width: 100%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  background: $uni-bg-color;
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
  border-bottom: 1rpx solid $uni-border-color;
  
  .popup-title {
    font-size: 32rpx;
    font-weight: 600;
    color: $uni-text-color;
  }
  
  .comment-count {
    font-size: 28rpx;
    color: $uni-text-color-grey;
  }
}

.comments-list {
  flex: 1;
  max-height: 600rpx;
  padding: 24rpx 32rpx;
}

.comment-item {
  display: flex;
  gap: 20rpx;
  padding: 24rpx 0;
  border-bottom: 1rpx solid $uni-border-color;
  
  &:last-child {
    border-bottom: none;
  }
}

.comment-avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: $uni-bg-color-grey;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.comment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.comment-author {
  font-size: 26rpx;
  font-weight: 600;
  color: $uni-text-color;
}

.comment-time {
  font-size: 22rpx;
  color: $uni-text-color-grey;
}

.comment-text {
  font-size: 26rpx;
  color: $uni-text-color;
  line-height: 40rpx;
  white-space: pre-wrap;
}

.comment-actions {
  display: flex;
  align-items: center;
  gap: 32rpx;
  margin-top: 8rpx;
}

.comment-action-btn {
  font-size: 24rpx;
  color: $uni-text-color-grey;
  
  &:active {
    opacity: 0.7;
  }
}

.empty-comments {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80rpx 0;
  
  .empty-text {
    font-size: 26rpx;
    color: $uni-text-color-grey;
  }
}

.comment-input-box {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 24rpx 32rpx;
  border-top: 1rpx solid $uni-border-color;
  background: $uni-bg-color;
}

.comment-input {
  flex: 1;
  height: 72rpx;
  padding: 0 24rpx;
  background: $uni-bg-color-grey;
  border-radius: 36rpx;
  font-size: 28rpx;
  color: $uni-text-color;
}

.send-btn {
  padding: 16rpx 32rpx;
  background: rgba(102, 126, 234, 0.3);
  border-radius: 36rpx;
  transition: all 0.3s ease;
  
  &.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    
    .send-text {
      color: #ffffff;
    }
  }
}

.send-text {
  font-size: 28rpx;
  color: rgba(102, 126, 234, 0.5);
  font-weight: 500;
}
</style>
