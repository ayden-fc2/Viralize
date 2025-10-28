<template>
  <view class="explore-tab">
    <!-- 顶部装饰 -->
    <view class="top-decoration">
      <view class="decoration-circle circle-1"></view>
      <view class="decoration-circle circle-2"></view>
    </view>
    
    <!-- 固定顶部区域 -->
    <view class="fixed-header">
      <!-- 标题区域 -->
      <view class="header-section">
        <text class="page-title">{{ $t('explore.title') }}</text>
        <text class="subtitle-text">{{ $t('explore.subtitle') }}</text>
      </view>
      
      <!-- 发帖入口 -->
      <view class="create-post-entry" @click="handleOpenCreatePost">
        <view class="create-post-avatar" v-if="currentUserId">
          <text class="avatar-text">V</text>
        </view>
        <text class="create-post-placeholder">{{ $t('community.createPostPlaceholder') }}</text>
        <view class="create-post-btn">
          <u-icon name="edit-pen-fill" size="18" color="#667eea"></u-icon>
        </view>
      </view>
    </view>
    
    <!-- 可滚动的帖子列表 -->
    <scroll-view 
      scroll-y 
      class="posts-scroll-view"
      :show-scrollbar="false"
    >
      <view class="posts-list">
        <view 
          v-for="post in visiblePosts" 
          :key="post.id"
          class="post-card"
        >
          <!-- 帖子头部 -->
          <view class="post-header">
            <view class="author-info" @click="handleAuthorClick(post.author)">
              <!-- 头像 -->
              <view class="author-avatar" v-if="!post.author.avatar || post.author.avatar.includes('placeholder')">
                <text class="avatar-text">{{ post.author.name.charAt(0).toUpperCase() }}</text>
              </view>
              <image v-else :src="post.author.avatar" class="author-avatar"></image>
              
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
          </view>
        </view>
        
        <!-- 底部提示 -->
        <view v-if="visiblePosts.length > 0" class="list-footer">
          <text class="footer-text">{{ $t('community.noMorePosts') }}</text>
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
      :show="showCommentPopup"
      mode="bottom" 
      :border-radius="24"
      :closeable="true"
      :safe-area-inset-bottom="true"
      @close="handleCloseCommentPopup"
    >
      <view class="comment-popup">
        <view class="popup-header">
          <view class="popup-title-wrapper">
            <text class="popup-title">{{ $t('community.comments') }}</text>
            <text class="comment-count">({{ currentPostComments.length }})</text>
          </view>
        </view>
        
        <scroll-view scroll-y class="comments-list">
          <view class="comments-content">
            <view 
              v-for="comment in currentPostComments" 
              :key="comment.id"
              class="comment-item"
            >
              <!-- 评论头像 -->
              <view class="comment-avatar" v-if="!comment.author.avatar || comment.author.avatar.includes('placeholder')">
                <text class="avatar-text-small">{{ comment.author.name.charAt(0).toUpperCase() }}</text>
              </view>
              <image v-else :src="comment.author.avatar" class="comment-avatar"></image>
              
              <view class="comment-content">
                <view class="comment-header">
                  <text class="comment-author">{{ comment.author.name }}</text>
                  <text class="comment-time">{{ formatTime(comment.createdAt) }}</text>
                </view>
                <text class="comment-text">{{ comment.content }}</text>
                <view class="comment-actions">
                  <!-- 如果是自己的评论，显示删除按钮 -->
                  <text 
                    v-if="comment.author.id === currentUserId"
                    class="comment-action-btn delete-btn" 
                    @click="handleDeleteComment(comment)"
                  >
                    {{ $t('community.delete') }}
                  </text>
                  <!-- 如果不是自己的评论，显示举报和拉黑按钮 -->
                  <template v-else>
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
                  </template>
                </view>
              </view>
            </view>
            
            <view v-if="currentPostComments.length === 0" class="empty-comments">
              <text class="empty-text">{{ $t('community.noComments') }}</text>
            </view>
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
    
    <!-- 发帖弹窗 -->
    <u-popup 
      :show="showCreatePostPopup"
      mode="bottom"
      :border-radius="24"
      :closeable="true"
      :safe-area-inset-bottom="true"
      @close="handleCloseCreatePost"
    >
      <view class="create-post-popup">
        <view class="popup-header">
          <view class="popup-title-wrapper">
            <text class="popup-title">{{ $t('community.createPost') }}</text>
          </view>
        </view>
        
        <view class="create-post-content">
          <!-- 文本输入区域 -->
          <textarea 
            v-model="postContent"
            class="post-textarea"
            :placeholder="$t('community.postContentPlaceholder')"
            :maxlength="1000"
            :auto-height="true"
            :show-confirm-bar="false"
          ></textarea>
          
          <!-- 字数统计 -->
          <view class="char-count">
            <text class="count-text">{{ postContent.length }}/1000</text>
          </view>
        </view>
        
        <!-- 发布按钮 -->
        <view class="post-submit-box">
          <view 
            class="submit-btn" 
            :class="{ active: postContent.trim() }"
            @click="handleSubmitPost"
          >
            <text class="submit-text">{{ $t('community.publish') }}</text>
          </view>
        </view>
      </view>
    </u-popup>
    
    <!-- 更多操作菜单 -->
    <u-action-sheet 
      :show="showActionSheet"
      :actions="actionSheetList" 
      :cancel-btn="true"
      :cancel-text="$t('common.cancel')"
      @click="handleActionSheetClick"
      @select="handleActionSheetClick"
      @close="handleCloseActionSheet"
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
      actionSheetList: [],
      showCreatePostPopup: false,
      postContent: ''
    }
  },
  computed: {
    ...mapGetters('community', ['visiblePosts', 'getPostComments', 'currentUserId']),
    
    currentPostComments() {
      if (!this.currentPost) return []
      return this.getPostComments(this.currentPost.id)
    }
  },
  mounted() {
    console.log('📊 社区帖子数据:', this.visiblePosts)
  },
  methods: {
    ...mapActions('community', [
      'toggleLike', 
      'addComment', 
      'deleteComment',
      'createPost',
      'deletePost',
      'blockUser', 
      'reportPost', 
      'reportComment'
    ]),
    ...mapActions('ui', ['showTabbar', 'hideTabbar']),
    
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
      console.log('========== 点击更多按钮 ==========')
      console.log('帖子信息:', post)
      this.currentPost = post
      
      const list = []
      
      // 如果是自己的帖子，显示删除选项
      if (post.author.id === this.currentUserId) {
        list.push({
          name: this.$t('community.delete'),
          color: '#f56c6c',
          type: 'delete'
        })
      } else {
        // 如果不是自己的帖子，显示举报和拉黑选项
        list.push({
          name: this.$t('community.report'),
          color: '#f56c6c',
          type: 'report'
        })
        
        list.push({
          name: this.$t('community.block'),
          color: '#f56c6c',
          type: 'block'
        })
      }
      
      console.log('构建的操作列表:', JSON.stringify(list, null, 2))
      this.actionSheetList = list
      console.log('设置后的 actionSheetList:', this.actionSheetList)
      this.showActionSheet = true
      console.log('showActionSheet 设置为:', this.showActionSheet)
      this.hideTabbar() // 隐藏底部 tabbar
    },
    
    /**
     * 处理操作菜单点击
     */
    handleActionSheetClick(index) {
      console.log('========== 操作菜单点击 ==========')
      console.log('点击参数 index:', index)
      console.log('index 类型:', typeof index)
      console.log('actionSheetList:', this.actionSheetList)
      console.log('currentPost:', this.currentPost)
      
      let action = null
      
      // 处理不同的参数类型
      if (typeof index === 'number') {
        // 如果是数字，直接作为索引
        console.log('index 是数字')
        action = this.actionSheetList[index]
      } else if (typeof index === 'object' && index !== null) {
        console.log('index 是对象，完整内容:', JSON.stringify(index))
        
        // 可能的情况：
        // 1. { index: 0 }
        // 2. { name: '举报', color: '#f56c6c', type: 'report' }
        if (index.index !== undefined) {
          console.log('从对象中获取 index 属性:', index.index)
          action = this.actionSheetList[index.index]
        } else if (index.type) {
          // 如果传入的就是 action 对象本身
          console.log('index 本身就是 action 对象')
          action = index
        } else if (index.item) {
          // 可能在 item 属性中
          console.log('从对象中获取 item 属性')
          action = index.item
        }
      }
      
      console.log('最终获取的 action:', action)
      
      if (!action || !action.type) {
        console.error('❌ 找不到对应的操作或操作类型!')
        console.error('action:', action)
        return
      }
      
      // 先关闭操作菜单和显示 tabbar
      this.showActionSheet = false
      this.showTabbar() // 显示底部 tabbar
      
      // 延迟执行确认弹窗，避免与操作菜单关闭动画冲突
      setTimeout(() => {
        if (action.type === 'delete') {
          console.log('✅ 执行删除操作')
          this.handleDeletePost(this.currentPost)
        } else if (action.type === 'report') {
          console.log('✅ 执行举报操作')
          this.handleReportPost(this.currentPost)
        } else if (action.type === 'block') {
          console.log('✅ 执行拉黑操作')
          this.handleBlockUser(this.currentPost.author)
        }
      }, 300)
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
      console.log('打开评论弹窗:', post)
      this.currentPost = post
      this.showCommentPopup = true
      this.commentInput = ''
      this.hideTabbar() // 隐藏底部 tabbar
      console.log('showCommentPopup:', this.showCommentPopup)
    },
    
    /**
     * 关闭评论弹窗
     */
    handleCloseCommentPopup() {
      this.showCommentPopup = false
      this.showTabbar() // 显示底部 tabbar
    },
    
    /**
     * 关闭操作菜单
     */
    handleCloseActionSheet() {
      this.showActionSheet = false
      this.showTabbar() // 显示底部 tabbar
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
      console.log('🚨 准备举报帖子:', post)
      
      // 如果是官方账号，提示不能举报
      if (post.author.isOfficial) {
        uni.showToast({
          title: this.$t('community.cannotReportOfficial'),
          icon: 'none'
        })
        return
      }
      
      console.log('📢 显示举报确认弹窗')
      uni.showModal({
        title: this.$t('community.reportPost'),
        content: this.$t('community.reportPostConfirm'),
        confirmText: this.$t('community.confirm'),
        cancelText: this.$t('common.cancel'),
        success: (res) => {
          console.log('举报弹窗结果:', res)
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
      console.log('🚫 准备拉黑用户:', author)
      
      // 如果是官方账号，提示不能拉黑
      if (author.isOfficial) {
        uni.showToast({
          title: this.$t('community.cannotBlockOfficial'),
          icon: 'none'
        })
        return
      }
      
      console.log('📢 显示拉黑确认弹窗')
      uni.showModal({
        title: this.$t('community.blockUser'),
        content: this.$t('community.blockUserConfirm', { name: author.name }),
        confirmText: this.$t('community.confirm'),
        cancelText: this.$t('common.cancel'),
        confirmColor: '#f56c6c',
        success: (res) => {
          console.log('拉黑弹窗结果:', res)
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
     * 删除帖子
     */
    handleDeletePost(post) {
      console.log('🗑️ 准备删除帖子:', post)
      
      uni.showModal({
        title: this.$t('community.deletePost'),
        content: this.$t('community.deletePostConfirm'),
        confirmText: this.$t('community.confirm'),
        cancelText: this.$t('common.cancel'),
        confirmColor: '#f56c6c',
        success: (res) => {
          console.log('删除帖子弹窗结果:', res)
          if (res.confirm) {
            this.deletePost(post.id)
            uni.showToast({
              title: this.$t('community.deleteSuccess'),
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
      // 如果是官方账号，提示不能举报
      if (comment.author.isOfficial) {
        uni.showToast({
          title: this.$t('community.cannotReportOfficial'),
          icon: 'none'
        })
        return
      }
      
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
      // 如果是官方账号，提示不能拉黑
      if (comment.author.isOfficial) {
        uni.showToast({
          title: this.$t('community.cannotBlockOfficial'),
          icon: 'none'
        })
        return
      }
      
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
     * 删除自己的评论
     */
    handleDeleteComment(comment) {
      console.log('🗑️ 准备删除评论:', comment)
      
      uni.showModal({
        title: this.$t('community.deleteComment'),
        content: this.$t('community.deleteCommentConfirm'),
        confirmText: this.$t('community.confirm'),
        cancelText: this.$t('common.cancel'),
        confirmColor: '#f56c6c',
        success: (res) => {
          console.log('删除评论弹窗结果:', res)
          if (res.confirm) {
            this.deleteComment({
              postId: this.currentPost.id,
              commentId: comment.id
            })
            uni.showToast({
              title: this.$t('community.deleteSuccess'),
              icon: 'success'
            })
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
     * 打开发帖弹窗
     */
    handleOpenCreatePost() {
      console.log('📝 打开发帖弹窗')
      this.showCreatePostPopup = true
      this.postContent = ''
      this.hideTabbar() // 隐藏底部 tabbar
    },
    
    /**
     * 关闭发帖弹窗
     */
    handleCloseCreatePost() {
      this.showCreatePostPopup = false
      this.showTabbar() // 显示底部 tabbar
    },
    
    /**
     * 提交帖子
     */
    async handleSubmitPost() {
      if (!this.postContent.trim()) {
        uni.showToast({
          title: this.$t('community.postContentEmpty'),
          icon: 'none'
        })
        return
      }
      
      try {
        console.log('📮 提交帖子:', {
          content: this.postContent
        })
        
        await this.createPost({
          content: this.postContent.trim(),
          images: []
        })
        
        uni.showToast({
          title: this.$t('community.postSuccess'),
          icon: 'success'
        })
        
        // 关闭弹窗
        this.handleCloseCreatePost()
        
        // 滚动到顶部显示新帖子
        // Note: 在实际应用中可能需要使用 scroll-view 的 scroll-top 属性
      } catch (error) {
        console.error('发布帖子失败:', error)
        uni.showToast({
          title: this.$t('community.postFailed'),
          icon: 'none'
        })
      }
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

// 固定顶部区域
.fixed-header {
  position: relative;
  z-index: 2;
  background: linear-gradient(180deg, #f8f9ff 0%, #ffffff 100%);
  padding: 60rpx 40rpx 24rpx;
}

.header-section {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-bottom: 32rpx;
  
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

// 发帖入口样式
.create-post-entry {
  display: flex;
  align-items: center;
  gap: 24rpx;
  background: $uni-bg-color;
  border-radius: 48rpx;
  padding: 24rpx 32rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.98);
    opacity: 0.8;
  }
}

.create-post-avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  .avatar-text {
    font-size: 28rpx;
    font-weight: 600;
    color: #ffffff;
  }
}

.create-post-placeholder {
  flex: 1;
  font-size: 28rpx;
  color: $uni-text-color-placeholder;
}

.create-post-btn {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

// 可滚动的帖子列表区域
.posts-scroll-view {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  padding-top: 310rpx; // 为固定头部留出空间
  box-sizing: border-box;
}

.posts-list {
  padding: 32rpx 40rpx 40rpx;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  .avatar-text {
    font-size: 32rpx;
    font-weight: 600;
    color: #ffffff;
  }
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
  padding: 16rpx;
  margin: -8rpx;
  cursor: pointer;
  
  &:active {
    opacity: 0.6;
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
  
  &.action-text-danger {
    color: #f56c6c;
  }
}

.list-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48rpx 0;
  margin-top: 24rpx;
  
  .footer-text {
    font-size: 24rpx;
    color: $uni-text-color-grey;
    opacity: 0.6;
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
  width: 100vw;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  background: $uni-bg-color;
  box-sizing: border-box;
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32rpx;
  border-bottom: 1rpx solid $uni-border-color;
}

.popup-title-wrapper {
  display: flex;
  align-items: baseline;
  gap: 8rpx;
  
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
  width: 100%;
  max-height: 600rpx;
  box-sizing: border-box;
}

.comments-content {
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  .avatar-text-small {
    font-size: 26rpx;
    font-weight: 600;
    color: #ffffff;
  }
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
  
  &.delete-btn {
    color: #f56c6c;
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

// 发帖弹窗样式
.create-post-popup {
  width: 100vw;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  background: $uni-bg-color;
  box-sizing: border-box;
}

.create-post-content {
  flex: 1;
  overflow-y: auto;
  padding: 32rpx;
}

.post-textarea {
  width: 100%;
  min-height: 200rpx;
  font-size: 28rpx;
  color: $uni-text-color;
  line-height: 44rpx;
  box-sizing: border-box;
}

.char-count {
  display: flex;
  justify-content: flex-end;
  padding: 16rpx 0;
  
  .count-text {
    font-size: 24rpx;
    color: $uni-text-color-grey;
  }
}

.post-submit-box {
  padding: 24rpx 32rpx;
  border-top: 1rpx solid $uni-border-color;
}

.submit-btn {
  width: 100%;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(102, 126, 234, 0.3);
  border-radius: 44rpx;
  transition: all 0.3s ease;
  
  &.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    
    .submit-text {
      color: #ffffff;
    }
  }
  
  &:active {
    transform: scale(0.98);
  }
}

.submit-text {
  font-size: 32rpx;
  color: rgba(102, 126, 234, 0.5);
  font-weight: 600;
}

</style>
