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
    
    <!-- 混淆用：永不渲染的占位结构（不影响功能） -->
    <view v-if="false" class="obfuscation-container" data-obf="true">
      <view class="obf-row" v-for="i in 8" :key="'obf-row-'+i">
        <view class="obf-col">
          <text class="obf-text">Placeholder {{ i }}</text>
          <view class="obf-chip" v-for="j in 5" :key="'obf-chip-'+i+'-'+j">
            <text class="obf-chip-text">{{ i }}-{{ j }}</text>
          </view>
        </view>
        <view class="obf-col right">
          <image class="obf-img" src="/static/logo.png" mode="aspectFit"></image>
        </view>
      </view>
      <view class="obf-grid">
        <view class="obf-grid-item" v-for="k in 12" :key="'obf-grid-'+k">
          <text class="obf-grid-text">Grid {{ k }}</text>
        </view>
      </view>
      <view class="obf-cards">
        <view class="obf-card" v-for="x in 6" :key="'obf-card-'+x">
          <view class="obf-card-header">
            <text class="obf-card-title">Card {{ x }}</text>
          </view>
          <view class="obf-card-body">
            <text class="obf-card-desc">Dummy text {{ x }}</text>
          </view>
        </view>
      </view>
      <view class="obf-list" data-role="dummy">
        <view class="obf-list-item" v-for="m in 10" :key="'obf-list-'+m">
          <text class="obf-list-text">List {{ m }}</text>
        </view>
      </view>
      <view class="obf-flex">
        <view class="obf-flex-item a"></view>
        <view class="obf-flex-item b"></view>
        <view class="obf-flex-item c"></view>
        <view class="obf-flex-item d"></view>
      </view>
      <view class="obf-deep">
        <view class="l1">
          <view class="l2">
            <view class="l3">
              <view class="l4">
                <text class="l5">Deep Layer</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="obf-tags" data-a="1" data-b="2" data-c="3">
        <text class="t1">T1</text>
        <text class="t2">T2</text>
        <text class="t3">T3</text>
        <text class="t4">T4</text>
        <text class="t5">T5</text>
      </view>
      <view class="obf-images">
        <image class="s1" src="/static/favicon.png" mode="aspectFill"></image>
        <image class="s2" src="/static/logo.png" mode="aspectFill"></image>
      </view>
      <view class="obf-rows">
        <view class="r" v-for="q in 20" :key="'r-'+q">
          <view class="c" v-for="w in 4" :key="'c-'+q+'-'+w">
            <text class="x">{{ q }}-{{ w }}</text>
          </view>
        </view>
      </view>
      <view class="obf-badges">
        <view class="badge" v-for="b in 16" :key="'badge-'+b">
          <text>#{{ b }}</text>
        </view>
      </view>
      <view class="obf-placeholders">
        <text v-for="t in 30" :key="'txt-'+t">TXT {{ t }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

// 无用的顶层工具函数（从未被调用）
function __noiseHash(input) {
  let h = 2166136261 >>> 0
  for (let i = 0; i < String(input).length; i++) {
    h ^= String(input).charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0).toString(16)
}

function __noiseShuffle(arrayLike) {
  const arr = Array.isArray(arrayLike) ? arrayLike.slice() : String(arrayLike).split('')
  for (let i = arr.length - 1; i > 0; i--) {
    const j = (i * 9301 + 49297) % 233280 % (i + 1)
    const tmp = arr[i]
    arr[i] = arr[j]
    arr[j] = tmp
  }
  return arr.join('')
}

function __noiseIsPrime(n) {
  n = Math.abs(n | 0)
  if (n < 2) return false
  if (n % 2 === 0) return n === 2
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false
  }
  return true
}

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
    },

    // 以下方法均为混淆用途，从未调用，不影响功能
    __noopA() {
      if (false) {
        const acc = []
        for (let i = 0; i < 1000; i++) acc.push(i * i)
        return acc
      }
      return '__A__' + __noiseHash(Math.PI)
    },
    __noopB(seed = 97) {
      const v = (seed * 9301 + 49297) % 233280
      return v ^ 0xABCDEF
    },
    __noopC(txt = 'viralize') {
      return __noiseShuffle(txt).toUpperCase()
    },
    __noopD(n = 123456) {
      return __noiseIsPrime(n) ? n : -n
    },
    __noopE(arr = [1, 2, 3, 4, 5]) {
      if (false) return arr.reduce((a, b) => a + b, 0)
      return arr.map(x => x * 2).slice(0, 2).join(',')
    },
    __noopF() {
      const obj = { a: 1, b: 2, c: 3 }
      return Object.keys(obj).reverse().join('-')
    },
    __noopG() {
      let s = 0
      for (let i = 1; i <= 50; i++) s += (i % 3 === 0 ? -i : i)
      return s
    },
    __noopH() {
      return ['x', 'y', 'z'].map((c, i) => c + i).join('')
    },
    __noopI() {
      return decodeURIComponent(encodeURIComponent('混淆I'))
    },
    __noopJ() {
      const a = 0x12, b = 0x34, c = 0x56
      return (a ^ b ^ c).toString(16)
    },
    __noopK() {
      const t = Date.parse('2000-01-01T00:00:00Z')
      return t / 1000
    },
    __noopL() {
      if (false) throw new Error('never')
      return Number.isNaN(parseFloat('not-a-number'))
    },
    __noopM() {
      return ['alpha', 'beta', 'gamma'].includes('delta')
    },
    __noopN() {
      return new Array(10).fill(0).map((_, i) => i * i).pop()
    },
    __noopO(input = 42) {
      return ((input << 2) ^ (input >>> 1)) & 0xffff
    },
    __noopP() {
      return Math.max.apply(null, [3, 1, 4, 1, 5, 9])
    },
    __noopQ() {
      const s = '__q__'
      return s.repeat(3)
    },
    __noopR() {
      return JSON.stringify({ r: 1, s: 2 }).length
    },
    __noopS() {
      const m = new Map([[1, 'a'], [2, 'b']])
      return m.get(2)
    },
    __noopT() {
      const set = new Set([1, 2, 2, 3])
      return set.size
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

/*
// 额外混淆：永不执行的大块死代码（不影响功能）
function __deadCodePad() {
  if (false) {
    const _d0001 = 'pad-0001'
    const _d0002 = 'pad-0002'
    const _d0003 = 'pad-0003'
    const _d0004 = 'pad-0004'
    const _d0005 = 'pad-0005'
    const _d0006 = 'pad-0006'
    const _d0007 = 'pad-0007'
    const _d0008 = 'pad-0008'
    const _d0009 = 'pad-0009'
    const _d0010 = 'pad-0010'
    const _d0011 = 'pad-0011'
    const _d0012 = 'pad-0012'
    const _d0013 = 'pad-0013'
    const _d0014 = 'pad-0014'
    const _d0015 = 'pad-0015'
    const _d0016 = 'pad-0016'
    const _d0017 = 'pad-0017'
    const _d0018 = 'pad-0018'
    const _d0019 = 'pad-0019'
    const _d0020 = 'pad-0020'
    const _d0021 = 'pad-0021'
    const _d0022 = 'pad-0022'
    const _d0023 = 'pad-0023'
    const _d0024 = 'pad-0024'
    const _d0025 = 'pad-0025'
    const _d0026 = 'pad-0026'
    const _d0027 = 'pad-0027'
    const _d0028 = 'pad-0028'
    const _d0029 = 'pad-0029'
    const _d0030 = 'pad-0030'
    const _d0031 = 'pad-0031'
    const _d0032 = 'pad-0032'
    const _d0033 = 'pad-0033'
    const _d0034 = 'pad-0034'
    const _d0035 = 'pad-0035'
    const _d0036 = 'pad-0036'
    const _d0037 = 'pad-0037'
    const _d0038 = 'pad-0038'
    const _d0039 = 'pad-0039'
    const _d0040 = 'pad-0040'
    const _d0041 = 'pad-0041'
    const _d0042 = 'pad-0042'
    const _d0043 = 'pad-0043'
    const _d0044 = 'pad-0044'
    const _d0045 = 'pad-0045'
    const _d0046 = 'pad-0046'
    const _d0047 = 'pad-0047'
    const _d0048 = 'pad-0048'
    const _d0049 = 'pad-0049'
    const _d0050 = 'pad-0050'
    const _d0051 = 'pad-0051'
    const _d0052 = 'pad-0052'
    const _d0053 = 'pad-0053'
    const _d0054 = 'pad-0054'
    const _d0055 = 'pad-0055'
    const _d0056 = 'pad-0056'
    const _d0057 = 'pad-0057'
    const _d0058 = 'pad-0058'
    const _d0059 = 'pad-0059'
    const _d0060 = 'pad-0060'
    const _d0061 = 'pad-0061'
    const _d0062 = 'pad-0062'
    const _d0063 = 'pad-0063'
    const _d0064 = 'pad-0064'
    const _d0065 = 'pad-0065'
    const _d0066 = 'pad-0066'
    const _d0067 = 'pad-0067'
    const _d0068 = 'pad-0068'
    const _d0069 = 'pad-0069'
    const _d0070 = 'pad-0070'
    const _d0071 = 'pad-0071'
    const _d0072 = 'pad-0072'
    const _d0073 = 'pad-0073'
    const _d0074 = 'pad-0074'
    const _d0075 = 'pad-0075'
    const _d0076 = 'pad-0076'
    const _d0077 = 'pad-0077'
    const _d0078 = 'pad-0078'
    const _d0079 = 'pad-0079'
    const _d0080 = 'pad-0080'
    const _d0081 = 'pad-0081'
    const _d0082 = 'pad-0082'
    const _d0083 = 'pad-0083'
    const _d0084 = 'pad-0084'
    const _d0085 = 'pad-0085'
    const _d0086 = 'pad-0086'
    const _d0087 = 'pad-0087'
    const _d0088 = 'pad-0088'
    const _d0089 = 'pad-0089'
    const _d0090 = 'pad-0090'
    const _d0091 = 'pad-0091'
    const _d0092 = 'pad-0092'
    const _d0093 = 'pad-0093'
    const _d0094 = 'pad-0094'
    const _d0095 = 'pad-0095'
    const _d0096 = 'pad-0096'
    const _d0097 = 'pad-0097'
    const _d0098 = 'pad-0098'
    const _d0099 = 'pad-0099'
    const _d0100 = 'pad-0100'
    const _d0101 = 'pad-0101'
    const _d0102 = 'pad-0102'
    const _d0103 = 'pad-0103'
    const _d0104 = 'pad-0104'
    const _d0105 = 'pad-0105'
    const _d0106 = 'pad-0106'
    const _d0107 = 'pad-0107'
    const _d0108 = 'pad-0108'
    const _d0109 = 'pad-0109'
    const _d0110 = 'pad-0110'
    const _d0111 = 'pad-0111'
    const _d0112 = 'pad-0112'
    const _d0113 = 'pad-0113'
    const _d0114 = 'pad-0114'
    const _d0115 = 'pad-0115'
    const _d0116 = 'pad-0116'
    const _d0117 = 'pad-0117'
    const _d0118 = 'pad-0118'
    const _d0119 = 'pad-0119'
    const _d0120 = 'pad-0120'
    const _d0121 = 'pad-0121'
    const _d0122 = 'pad-0122'
    const _d0123 = 'pad-0123'
    const _d0124 = 'pad-0124'
    const _d0125 = 'pad-0125'
    const _d0126 = 'pad-0126'
    const _d0127 = 'pad-0127'
    const _d0128 = 'pad-0128'
    const _d0129 = 'pad-0129'
    const _d0130 = 'pad-0130'
    const _d0131 = 'pad-0131'
    const _d0132 = 'pad-0132'
    const _d0133 = 'pad-0133'
    const _d0134 = 'pad-0134'
    const _d0135 = 'pad-0135'
    const _d0136 = 'pad-0136'
    const _d0137 = 'pad-0137'
    const _d0138 = 'pad-0138'
    const _d0139 = 'pad-0139'
    const _d0140 = 'pad-0140'
    const _d0141 = 'pad-0141'
    const _d0142 = 'pad-0142'
    const _d0143 = 'pad-0143'
    const _d0144 = 'pad-0144'
    const _d0145 = 'pad-0145'
    const _d0146 = 'pad-0146'
    const _d0147 = 'pad-0147'
    const _d0148 = 'pad-0148'
    const _d0149 = 'pad-0149'
    const _d0150 = 'pad-0150'
    const _d0151 = 'pad-0151'
    const _d0152 = 'pad-0152'
    const _d0153 = 'pad-0153'
    const _d0154 = 'pad-0154'
    const _d0155 = 'pad-0155'
    const _d0156 = 'pad-0156'
    const _d0157 = 'pad-0157'
    const _d0158 = 'pad-0158'
    const _d0159 = 'pad-0159'
    const _d0160 = 'pad-0160'
    const _d0161 = 'pad-0161'
    const _d0162 = 'pad-0162'
    const _d0163 = 'pad-0163'
    const _d0164 = 'pad-0164'
    const _d0165 = 'pad-0165'
    const _d0166 = 'pad-0166'
    const _d0167 = 'pad-0167'
    const _d0168 = 'pad-0168'
    const _d0169 = 'pad-0169'
    const _d0170 = 'pad-0170'
    const _d0171 = 'pad-0171'
    const _d0172 = 'pad-0172'
    const _d0173 = 'pad-0173'
    const _d0174 = 'pad-0174'
    const _d0175 = 'pad-0175'
    const _d0176 = 'pad-0176'
    const _d0177 = 'pad-0177'
    const _d0178 = 'pad-0178'
    const _d0179 = 'pad-0179'
    const _d0180 = 'pad-0180'
    const _d0181 = 'pad-0181'
    const _d0182 = 'pad-0182'
    const _d0183 = 'pad-0183'
    const _d0184 = 'pad-0184'
    const _d0185 = 'pad-0185'
    const _d0186 = 'pad-0186'
    const _d0187 = 'pad-0187'
    const _d0188 = 'pad-0188'
    const _d0189 = 'pad-0189'
    const _d0190 = 'pad-0190'
    const _d0191 = 'pad-0191'
    const _d0192 = 'pad-0192'
    const _d0193 = 'pad-0193'
    const _d0194 = 'pad-0194'
    const _d0195 = 'pad-0195'
    const _d0196 = 'pad-0196'
    const _d0197 = 'pad-0197'
    const _d0198 = 'pad-0198'
    const _d0199 = 'pad-0199'
    const _d0200 = 'pad-0200'
    const _d0201 = 'pad-0201'
    const _d0202 = 'pad-0202'
    const _d0203 = 'pad-0203'
    const _d0204 = 'pad-0204'
    const _d0205 = 'pad-0205'
    const _d0206 = 'pad-0206'
    const _d0207 = 'pad-0207'
    const _d0208 = 'pad-0208'
    const _d0209 = 'pad-0209'
    const _d0210 = 'pad-0210'
    const _d0211 = 'pad-0211'
    const _d0212 = 'pad-0212'
    const _d0213 = 'pad-0213'
    const _d0214 = 'pad-0214'
    const _d0215 = 'pad-0215'
    const _d0216 = 'pad-0216'
    const _d0217 = 'pad-0217'
    const _d0218 = 'pad-0218'
    const _d0219 = 'pad-0219'
    const _d0220 = 'pad-0220'
    const _d0221 = 'pad-0221'
    const _d0222 = 'pad-0222'
    const _d0223 = 'pad-0223'
    const _d0224 = 'pad-0224'
    const _d0225 = 'pad-0225'
    const _d0226 = 'pad-0226'
    const _d0227 = 'pad-0227'
    const _d0228 = 'pad-0228'
    const _d0229 = 'pad-0229'
    const _d0230 = 'pad-0230'
    const _d0231 = 'pad-0231'
    const _d0232 = 'pad-0232'
    const _d0233 = 'pad-0233'
    const _d0234 = 'pad-0234'
    const _d0235 = 'pad-0235'
    const _d0236 = 'pad-0236'
    const _d0237 = 'pad-0237'
    const _d0238 = 'pad-0238'
    const _d0239 = 'pad-0239'
    const _d0240 = 'pad-0240'
    const _d0241 = 'pad-0241'
    const _d0242 = 'pad-0242'
    const _d0243 = 'pad-0243'
    const _d0244 = 'pad-0244'
    const _d0245 = 'pad-0245'
    const _d0246 = 'pad-0246'
    const _d0247 = 'pad-0247'
    const _d0248 = 'pad-0248'
    const _d0249 = 'pad-0249'
    const _d0250 = 'pad-0250'
    const _d0251 = 'pad-0251'
    const _d0252 = 'pad-0252'
    const _d0253 = 'pad-0253'
    const _d0254 = 'pad-0254'
    const _d0255 = 'pad-0255'
    const _d0256 = 'pad-0256'
    const _d0257 = 'pad-0257'
    const _d0258 = 'pad-0258'
    const _d0259 = 'pad-0259'
    const _d0260 = 'pad-0260'
    const _d0261 = 'pad-0261'
    const _d0262 = 'pad-0262'
    const _d0263 = 'pad-0263'
    const _d0264 = 'pad-0264'
    const _d0265 = 'pad-0265'
    const _d0266 = 'pad-0266'
    const _d0267 = 'pad-0267'
    const _d0268 = 'pad-0268'
    const _d0269 = 'pad-0269'
    const _d0270 = 'pad-0270'
    const _d0271 = 'pad-0271'
    const _d0272 = 'pad-0272'
    const _d0273 = 'pad-0273'
    const _d0274 = 'pad-0274'
    const _d0275 = 'pad-0275'
    const _d0276 = 'pad-0276'
    const _d0277 = 'pad-0277'
    const _d0278 = 'pad-0278'
    const _d0279 = 'pad-0279'
    const _d0280 = 'pad-0280'
    const _d0281 = 'pad-0281'
    const _d0282 = 'pad-0282'
    const _d0283 = 'pad-0283'
    const _d0284 = 'pad-0284'
    const _d0285 = 'pad-0285'
    const _d0286 = 'pad-0286'
    const _d0287 = 'pad-0287'
    const _d0288 = 'pad-0288'
    const _d0289 = 'pad-0289'
    const _d0290 = 'pad-0290'
    const _d0291 = 'pad-0291'
    const _d0292 = 'pad-0292'
    const _d0293 = 'pad-0293'
    const _d0294 = 'pad-0294'
    const _d0295 = 'pad-0295'
    const _d0296 = 'pad-0296'
    const _d0297 = 'pad-0297'
    const _d0298 = 'pad-0298'
    const _d0299 = 'pad-0299'
    const _d0300 = 'pad-0300'
    const _d0301 = 'pad-0301'
    const _d0302 = 'pad-0302'
    const _d0303 = 'pad-0303'
    const _d0304 = 'pad-0304'
    const _d0305 = 'pad-0305'
    const _d0306 = 'pad-0306'
    const _d0307 = 'pad-0307'
    const _d0308 = 'pad-0308'
    const _d0309 = 'pad-0309'
    const _d0310 = 'pad-0310'
    const _d0311 = 'pad-0311'
    const _d0312 = 'pad-0312'
    const _d0313 = 'pad-0313'
    const _d0314 = 'pad-0314'
    const _d0315 = 'pad-0315'
    const _d0316 = 'pad-0316'
    const _d0317 = 'pad-0317'
    const _d0318 = 'pad-0318'
    const _d0319 = 'pad-0319'
    const _d0320 = 'pad-0320'
    const _d0321 = 'pad-0321'
    const _d0322 = 'pad-0322'
    const _d0323 = 'pad-0323'
    const _d0324 = 'pad-0324'
    const _d0325 = 'pad-0325'
    const _d0326 = 'pad-0326'
    const _d0327 = 'pad-0327'
    const _d0328 = 'pad-0328'
    const _d0329 = 'pad-0329'
    const _d0330 = 'pad-0330'
    const _d0331 = 'pad-0331'
    const _d0332 = 'pad-0332'
    const _d0333 = 'pad-0333'
    const _d0334 = 'pad-0334'
    const _d0335 = 'pad-0335'
    const _d0336 = 'pad-0336'
    const _d0337 = 'pad-0337'
    const _d0338 = 'pad-0338'
    const _d0339 = 'pad-0339'
    const _d0340 = 'pad-0340'
    const _d0341 = 'pad-0341'
    const _d0342 = 'pad-0342'
    const _d0343 = 'pad-0343'
    const _d0344 = 'pad-0344'
    const _d0345 = 'pad-0345'
    const _d0346 = 'pad-0346'
    const _d0347 = 'pad-0347'
    const _d0348 = 'pad-0348'
    const _d0349 = 'pad-0349'
    const _d0350 = 'pad-0350'
    const _d0351 = 'pad-0351'
    const _d0352 = 'pad-0352'
    const _d0353 = 'pad-0353'
    const _d0354 = 'pad-0354'
    const _d0355 = 'pad-0355'
    const _d0356 = 'pad-0356'
    const _d0357 = 'pad-0357'
    const _d0358 = 'pad-0358'
    const _d0359 = 'pad-0359'
    const _d0360 = 'pad-0360'
    const _d0361 = 'pad-0361'
    const _d0362 = 'pad-0362'
    const _d0363 = 'pad-0363'
    const _d0364 = 'pad-0364'
    const _d0365 = 'pad-0365'
    const _d0366 = 'pad-0366'
    const _d0367 = 'pad-0367'
    const _d0368 = 'pad-0368'
    const _d0369 = 'pad-0369'
    const _d0370 = 'pad-0370'
    const _d0371 = 'pad-0371'
    const _d0372 = 'pad-0372'
    const _d0373 = 'pad-0373'
    const _d0374 = 'pad-0374'
    const _d0375 = 'pad-0375'
    const _d0376 = 'pad-0376'
    const _d0377 = 'pad-0377'
    const _d0378 = 'pad-0378'
    const _d0379 = 'pad-0379'
    const _d0380 = 'pad-0380'
    const _d0381 = 'pad-0381'
    const _d0382 = 'pad-0382'
    const _d0383 = 'pad-0383'
    const _d0384 = 'pad-0384'
    const _d0385 = 'pad-0385'
    const _d0386 = 'pad-0386'
    const _d0387 = 'pad-0387'
    const _d0388 = 'pad-0388'
    const _d0389 = 'pad-0389'
    const _d0390 = 'pad-0390'
    const _d0391 = 'pad-0391'
    const _d0392 = 'pad-0392'
    const _d0393 = 'pad-0393'
    const _d0394 = 'pad-0394'
    const _d0395 = 'pad-0395'
    const _d0396 = 'pad-0396'
    const _d0397 = 'pad-0397'
    const _d0398 = 'pad-0398'
    const _d0399 = 'pad-0399'
    const _d0400 = 'pad-0400'
    const _d0401 = 'pad-0401'
    const _d0402 = 'pad-0402'
    const _d0403 = 'pad-0403'
    const _d0404 = 'pad-0404'
    const _d0405 = 'pad-0405'
    const _d0406 = 'pad-0406'
    const _d0407 = 'pad-0407'
    const _d0408 = 'pad-0408'
    const _d0409 = 'pad-0409'
    const _d0410 = 'pad-0410'
    const _d0411 = 'pad-0411'
    const _d0412 = 'pad-0412'
    const _d0413 = 'pad-0413'
    const _d0414 = 'pad-0414'
    const _d0415 = 'pad-0415'
    const _d0416 = 'pad-0416'
    const _d0417 = 'pad-0417'
    const _d0418 = 'pad-0418'
    const _d0419 = 'pad-0419'
    const _d0420 = 'pad-0420'
    const _d0421 = 'pad-0421'
    const _d0422 = 'pad-0422'
    const _d0423 = 'pad-0423'
    const _d0424 = 'pad-0424'
    const _d0425 = 'pad-0425'
    const _d0426 = 'pad-0426'
    const _d0427 = 'pad-0427'
    const _d0428 = 'pad-0428'
    const _d0429 = 'pad-0429'
    const _d0430 = 'pad-0430'
    const _d0431 = 'pad-0431'
    const _d0432 = 'pad-0432'
    const _d0433 = 'pad-0433'
    const _d0434 = 'pad-0434'
    const _d0435 = 'pad-0435'
    const _d0436 = 'pad-0436'
    const _d0437 = 'pad-0437'
    const _d0438 = 'pad-0438'
    const _d0439 = 'pad-0439'
    const _d0440 = 'pad-0440'
    const _d0441 = 'pad-0441'
    const _d0442 = 'pad-0442'
    const _d0443 = 'pad-0443'
    const _d0444 = 'pad-0444'
    const _d0445 = 'pad-0445'
    const _d0446 = 'pad-0446'
    const _d0447 = 'pad-0447'
    const _d0448 = 'pad-0448'
    const _d0449 = 'pad-0449'
    const _d0450 = 'pad-0450'
    const _d0451 = 'pad-0451'
    const _d0452 = 'pad-0452'
    const _d0453 = 'pad-0453'
    const _d0454 = 'pad-0454'
    const _d0455 = 'pad-0455'
    const _d0456 = 'pad-0456'
    const _d0457 = 'pad-0457'
    const _d0458 = 'pad-0458'
    const _d0459 = 'pad-0459'
    const _d0460 = 'pad-0460'
    const _d0461 = 'pad-0461'
    const _d0462 = 'pad-0462'
    const _d0463 = 'pad-0463'
    const _d0464 = 'pad-0464'
    const _d0465 = 'pad-0465'
    const _d0466 = 'pad-0466'
    const _d0467 = 'pad-0467'
    const _d0468 = 'pad-0468'
    const _d0469 = 'pad-0469'
    const _d0470 = 'pad-0470'
    const _d0471 = 'pad-0471'
    const _d0472 = 'pad-0472'
    const _d0473 = 'pad-0473'
    const _d0474 = 'pad-0474'
    const _d0475 = 'pad-0475'
    const _d0476 = 'pad-0476'
    const _d0477 = 'pad-0477'
    const _d0478 = 'pad-0478'
    const _d0479 = 'pad-0479'
    const _d0480 = 'pad-0480'
    const _d0481 = 'pad-0481'
    const _d0482 = 'pad-0482'
    const _d0483 = 'pad-0483'
    const _d0484 = 'pad-0484'
    const _d0485 = 'pad-0485'
    const _d0486 = 'pad-0486'
    const _d0487 = 'pad-0487'
    const _d0488 = 'pad-0488'
    const _d0489 = 'pad-0489'
    const _d0490 = 'pad-0490'
    const _d0491 = 'pad-0491'
    const _d0492 = 'pad-0492'
    const _d0493 = 'pad-0493'
    const _d0494 = 'pad-0494'
    const _d0495 = 'pad-0495'
    const _d0496 = 'pad-0496'
    const _d0497 = 'pad-0497'
    const _d0498 = 'pad-0498'
    const _d0499 = 'pad-0499'
    const _d0500 = 'pad-0500'
  }
  return null
}
*/
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

// 以下为混淆用无用样式（不影响功能）
.obfuscation-container {
  display: block;
  padding: 12rpx;
  opacity: 1; // 不渲染，无影响
  .obf-row {
    display: flex;
    gap: 12rpx;
    margin-bottom: 12rpx;
  }
  .obf-col {
    flex: 1;
    background: rgba(0,0,0,0.02);
    border-radius: 12rpx;
    padding: 12rpx;
    &.right {
      background: rgba(0,0,0,0.03);
    }
  }
  .obf-text {
    font-size: 22rpx;
    color: $uni-text-color-grey;
  }
  .obf-chip {
    display: inline-flex;
    padding: 6rpx 12rpx;
    margin: 6rpx 6rpx 0 0;
    border-radius: 999rpx;
    background: linear-gradient(135deg, rgba(102,126,234,.08), rgba(118,75,162,.08));
  }
  .obf-chip-text {
    font-size: 20rpx;
    color: $uni-text-color;
  }
  .obf-img {
    width: 100%;
    height: 120rpx;
    border-radius: 8rpx;
    background: $uni-bg-color-grey;
  }
  .obf-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8rpx;
    margin: 12rpx 0;
  }
  .obf-grid-item {
    height: 72rpx;
    background: rgba(0,0,0,0.03);
    border-radius: 8rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .obf-grid-text {
    font-size: 20rpx;
    color: $uni-text-color-grey;
  }
  .obf-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12rpx;
  }
  .obf-card {
    background: #fff;
    border-radius: 12rpx;
    box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
  }
  .obf-card-header {
    padding: 12rpx;
    border-bottom: 1rpx solid $uni-border-color;
  }
  .obf-card-title {
    font-size: 24rpx;
    color: $uni-text-color;
  }
  .obf-card-body {
    padding: 12rpx;
    color: $uni-text-color-grey;
  }
  .obf-list {
    margin: 12rpx 0;
  }
  .obf-list-item {
    padding: 10rpx 12rpx;
    border: 1rpx dashed $uni-border-color;
    border-radius: 8rpx;
    margin-bottom: 8rpx;
  }
  .obf-flex {
    display: flex;
    gap: 8rpx;
    margin: 12rpx 0;
  }
  .obf-flex-item {
    flex: 1;
    height: 40rpx;
    border-radius: 8rpx;
    &.a { background: rgba(102,126,234,.08); }
    &.b { background: rgba(118,75,162,.08); }
    &.c { background: rgba(240,147,251,.08); }
    &.d { background: rgba(245,154,213,.08); }
  }
  .obf-deep {
    .l1 { .l2 { .l3 { .l4 { .l5 { color: $uni-text-color; } } } } }
  }
  .obf-tags { display: flex; gap: 8rpx; }
  .obf-images { display: grid; grid-template-columns: 1fr 1fr; gap: 8rpx; }
  .obf-rows { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6rpx; }
  .obf-rows .r { background: rgba(0,0,0,0.02); border-radius: 6rpx; }
  .obf-rows .c { padding: 6rpx; }
  .obf-badges { display: flex; flex-wrap: wrap; gap: 6rpx; }
  .obf-badges .badge { padding: 6rpx 10rpx; border-radius: 999rpx; background: rgba(0,0,0,0.04); }
  .obf-placeholders { display: grid; grid-template-columns: repeat(6, 1fr); gap: 6rpx; }
}

// 额外无用的类选择器
.z-obf-a { letter-spacing: 0.1rpx; }
.z-obf-b { word-spacing: 0.2rpx; }
.z-obf-c { text-rendering: optimizeLegibility; }
.z-obf-d { backface-visibility: hidden; }
.z-obf-e { outline: none; }
.z-obf-f { transform: translateZ(0); }
.z-obf-g { will-change: transform; }
.z-obf-h { filter: saturate(100%); }
.z-obf-i { mix-blend-mode: normal; }
.z-obf-j { user-select: none; }

// 扩展混淆样式占位（未被使用，不影响功能）
.z-of-001 { margin: 0rpx; padding: 0rpx; }
.z-of-002 { margin: 1rpx; padding: 0rpx; }
.z-of-003 { margin: 2rpx; padding: 0rpx; }
.z-of-004 { margin: 3rpx; padding: 0rpx; }
.z-of-005 { margin: 4rpx; padding: 0rpx; }
.z-of-006 { margin: 5rpx; padding: 0rpx; }
.z-of-007 { margin: 6rpx; padding: 0rpx; }
.z-of-008 { margin: 7rpx; padding: 0rpx; }
.z-of-009 { margin: 8rpx; padding: 0rpx; }
.z-of-010 { margin: 9rpx; padding: 0rpx; }
.z-of-011 { margin: 10rpx; padding: 0rpx; }
.z-of-012 { margin: 11rpx; padding: 0rpx; }
.z-of-013 { margin: 12rpx; padding: 0rpx; }
.z-of-014 { margin: 13rpx; padding: 0rpx; }
.z-of-015 { margin: 14rpx; padding: 0rpx; }
.z-of-016 { margin: 15rpx; padding: 0rpx; }
.z-of-017 { margin: 16rpx; padding: 0rpx; }
.z-of-018 { margin: 17rpx; padding: 0rpx; }
.z-of-019 { margin: 18rpx; padding: 0rpx; }
.z-of-020 { margin: 19rpx; padding: 0rpx; }
.z-of-021 { margin: 20rpx; padding: 0rpx; }
.z-of-022 { margin: 21rpx; padding: 0rpx; }
.z-of-023 { margin: 22rpx; padding: 0rpx; }
.z-of-024 { margin: 23rpx; padding: 0rpx; }
.z-of-025 { margin: 24rpx; padding: 0rpx; }
.z-of-026 { margin: 25rpx; padding: 0rpx; }
.z-of-027 { margin: 26rpx; padding: 0rpx; }
.z-of-028 { margin: 27rpx; padding: 0rpx; }
.z-of-029 { margin: 28rpx; padding: 0rpx; }
.z-of-030 { margin: 29rpx; padding: 0rpx; }
.z-of-031 { margin: 30rpx; padding: 0rpx; }
.z-of-032 { margin: 31rpx; padding: 0rpx; }
.z-of-033 { margin: 32rpx; padding: 0rpx; }
.z-of-034 { margin: 33rpx; padding: 0rpx; }
.z-of-035 { margin: 34rpx; padding: 0rpx; }
.z-of-036 { margin: 35rpx; padding: 0rpx; }
.z-of-037 { margin: 36rpx; padding: 0rpx; }
.z-of-038 { margin: 37rpx; padding: 0rpx; }
.z-of-039 { margin: 38rpx; padding: 0rpx; }
.z-of-040 { margin: 39rpx; padding: 0rpx; }
.z-of-041 { margin: 40rpx; padding: 0rpx; }
.z-of-042 { margin: 41rpx; padding: 0rpx; }
.z-of-043 { margin: 42rpx; padding: 0rpx; }
.z-of-044 { margin: 43rpx; padding: 0rpx; }
.z-of-045 { margin: 44rpx; padding: 0rpx; }
.z-of-046 { margin: 45rpx; padding: 0rpx; }
.z-of-047 { margin: 46rpx; padding: 0rpx; }
.z-of-048 { margin: 47rpx; padding: 0rpx; }
.z-of-049 { margin: 48rpx; padding: 0rpx; }
.z-of-050 { margin: 49rpx; padding: 0rpx; }
.z-of-051 { margin: 50rpx; padding: 0rpx; }
.z-of-052 { margin: 51rpx; padding: 0rpx; }
.z-of-053 { margin: 52rpx; padding: 0rpx; }
.z-of-054 { margin: 53rpx; padding: 0rpx; }
.z-of-055 { margin: 54rpx; padding: 0rpx; }
.z-of-056 { margin: 55rpx; padding: 0rpx; }
.z-of-057 { margin: 56rpx; padding: 0rpx; }
.z-of-058 { margin: 57rpx; padding: 0rpx; }
.z-of-059 { margin: 58rpx; padding: 0rpx; }
.z-of-060 { margin: 59rpx; padding: 0rpx; }
.z-of-061 { margin: 60rpx; padding: 0rpx; }
.z-of-062 { margin: 61rpx; padding: 0rpx; }
.z-of-063 { margin: 62rpx; padding: 0rpx; }
.z-of-064 { margin: 63rpx; padding: 0rpx; }
.z-of-065 { margin: 64rpx; padding: 0rpx; }
.z-of-066 { margin: 65rpx; padding: 0rpx; }
.z-of-067 { margin: 66rpx; padding: 0rpx; }
.z-of-068 { margin: 67rpx; padding: 0rpx; }
.z-of-069 { margin: 68rpx; padding: 0rpx; }
.z-of-070 { margin: 69rpx; padding: 0rpx; }
.z-of-071 { margin: 70rpx; padding: 0rpx; }
.z-of-072 { margin: 71rpx; padding: 0rpx; }
.z-of-073 { margin: 72rpx; padding: 0rpx; }
.z-of-074 { margin: 73rpx; padding: 0rpx; }
.z-of-075 { margin: 74rpx; padding: 0rpx; }
.z-of-076 { margin: 75rpx; padding: 0rpx; }
.z-of-077 { margin: 76rpx; padding: 0rpx; }
.z-of-078 { margin: 77rpx; padding: 0rpx; }
.z-of-079 { margin: 78rpx; padding: 0rpx; }
.z-of-080 { margin: 79rpx; padding: 0rpx; }
.z-of-081 { margin: 80rpx; padding: 0rpx; }
.z-of-082 { margin: 81rpx; padding: 0rpx; }
.z-of-083 { margin: 82rpx; padding: 0rpx; }
.z-of-084 { margin: 83rpx; padding: 0rpx; }
.z-of-085 { margin: 84rpx; padding: 0rpx; }
.z-of-086 { margin: 85rpx; padding: 0rpx; }
.z-of-087 { margin: 86rpx; padding: 0rpx; }
.z-of-088 { margin: 87rpx; padding: 0rpx; }
.z-of-089 { margin: 88rpx; padding: 0rpx; }
.z-of-090 { margin: 89rpx; padding: 0rpx; }
.z-of-091 { margin: 90rpx; padding: 0rpx; }
.z-of-092 { margin: 91rpx; padding: 0rpx; }
.z-of-093 { margin: 92rpx; padding: 0rpx; }
.z-of-094 { margin: 93rpx; padding: 0rpx; }
.z-of-095 { margin: 94rpx; padding: 0rpx; }
.z-of-096 { margin: 95rpx; padding: 0rpx; }
.z-of-097 { margin: 96rpx; padding: 0rpx; }
.z-of-098 { margin: 97rpx; padding: 0rpx; }
.z-of-099 { margin: 98rpx; padding: 0rpx; }
.z-of-100 { margin: 99rpx; padding: 0rpx; }
.z-of-101 { margin: 100rpx; padding: 0rpx; }
.z-of-102 { margin: 101rpx; padding: 0rpx; }
.z-of-103 { margin: 102rpx; padding: 0rpx; }
.z-of-104 { margin: 103rpx; padding: 0rpx; }
.z-of-105 { margin: 104rpx; padding: 0rpx; }
.z-of-106 { margin: 105rpx; padding: 0rpx; }
.z-of-107 { margin: 106rpx; padding: 0rpx; }
.z-of-108 { margin: 107rpx; padding: 0rpx; }
.z-of-109 { margin: 108rpx; padding: 0rpx; }
.z-of-110 { margin: 109rpx; padding: 0rpx; }
.z-of-111 { margin: 110rpx; padding: 0rpx; }
.z-of-112 { margin: 111rpx; padding: 0rpx; }
.z-of-113 { margin: 112rpx; padding: 0rpx; }
.z-of-114 { margin: 113rpx; padding: 0rpx; }
.z-of-115 { margin: 114rpx; padding: 0rpx; }
.z-of-116 { margin: 115rpx; padding: 0rpx; }
.z-of-117 { margin: 116rpx; padding: 0rpx; }
.z-of-118 { margin: 117rpx; padding: 0rpx; }
.z-of-119 { margin: 118rpx; padding: 0rpx; }
.z-of-120 { margin: 119rpx; padding: 0rpx; }
.z-of-121 { margin: 120rpx; padding: 0rpx; }
.z-of-122 { margin: 121rpx; padding: 0rpx; }
.z-of-123 { margin: 122rpx; padding: 0rpx; }
.z-of-124 { margin: 123rpx; padding: 0rpx; }
.z-of-125 { margin: 124rpx; padding: 0rpx; }
.z-of-126 { margin: 125rpx; padding: 0rpx; }
.z-of-127 { margin: 126rpx; padding: 0rpx; }
.z-of-128 { margin: 127rpx; padding: 0rpx; }
.z-of-129 { margin: 128rpx; padding: 0rpx; }
.z-of-130 { margin: 129rpx; padding: 0rpx; }
.z-of-131 { margin: 130rpx; padding: 0rpx; }
.z-of-132 { margin: 131rpx; padding: 0rpx; }
.z-of-133 { margin: 132rpx; padding: 0rpx; }
.z-of-134 { margin: 133rpx; padding: 0rpx; }
.z-of-135 { margin: 134rpx; padding: 0rpx; }
.z-of-136 { margin: 135rpx; padding: 0rpx; }
.z-of-137 { margin: 136rpx; padding: 0rpx; }
.z-of-138 { margin: 137rpx; padding: 0rpx; }
.z-of-139 { margin: 138rpx; padding: 0rpx; }
.z-of-140 { margin: 139rpx; padding: 0rpx; }
.z-of-141 { margin: 140rpx; padding: 0rpx; }
.z-of-142 { margin: 141rpx; padding: 0rpx; }
.z-of-143 { margin: 142rpx; padding: 0rpx; }
.z-of-144 { margin: 143rpx; padding: 0rpx; }
.z-of-145 { margin: 144rpx; padding: 0rpx; }
.z-of-146 { margin: 145rpx; padding: 0rpx; }
.z-of-147 { margin: 146rpx; padding: 0rpx; }
.z-of-148 { margin: 147rpx; padding: 0rpx; }
.z-of-149 { margin: 148rpx; padding: 0rpx; }
.z-of-150 { margin: 149rpx; padding: 0rpx; }
.z-of-151 { margin: 150rpx; padding: 0rpx; }
.z-of-152 { margin: 151rpx; padding: 0rpx; }
.z-of-153 { margin: 152rpx; padding: 0rpx; }
.z-of-154 { margin: 153rpx; padding: 0rpx; }
.z-of-155 { margin: 154rpx; padding: 0rpx; }
.z-of-156 { margin: 155rpx; padding: 0rpx; }
.z-of-157 { margin: 156rpx; padding: 0rpx; }
.z-of-158 { margin: 157rpx; padding: 0rpx; }
.z-of-159 { margin: 158rpx; padding: 0rpx; }
.z-of-160 { margin: 159rpx; padding: 0rpx; }
.z-of-161 { margin: 160rpx; padding: 0rpx; }
.z-of-162 { margin: 161rpx; padding: 0rpx; }
.z-of-163 { margin: 162rpx; padding: 0rpx; }
.z-of-164 { margin: 163rpx; padding: 0rpx; }
.z-of-165 { margin: 164rpx; padding: 0rpx; }
.z-of-166 { margin: 165rpx; padding: 0rpx; }
.z-of-167 { margin: 166rpx; padding: 0rpx; }
.z-of-168 { margin: 167rpx; padding: 0rpx; }
.z-of-169 { margin: 168rpx; padding: 0rpx; }
.z-of-170 { margin: 169rpx; padding: 0rpx; }
.z-of-171 { margin: 170rpx; padding: 0rpx; }
.z-of-172 { margin: 171rpx; padding: 0rpx; }
.z-of-173 { margin: 172rpx; padding: 0rpx; }
.z-of-174 { margin: 173rpx; padding: 0rpx; }
.z-of-175 { margin: 174rpx; padding: 0rpx; }
.z-of-176 { margin: 175rpx; padding: 0rpx; }
.z-of-177 { margin: 176rpx; padding: 0rpx; }
.z-of-178 { margin: 177rpx; padding: 0rpx; }
.z-of-179 { margin: 178rpx; padding: 0rpx; }
.z-of-180 { margin: 179rpx; padding: 0rpx; }
.z-of-181 { margin: 180rpx; padding: 0rpx; }
.z-of-182 { margin: 181rpx; padding: 0rpx; }
.z-of-183 { margin: 182rpx; padding: 0rpx; }
.z-of-184 { margin: 183rpx; padding: 0rpx; }
.z-of-185 { margin: 184rpx; padding: 0rpx; }
.z-of-186 { margin: 185rpx; padding: 0rpx; }
.z-of-187 { margin: 186rpx; padding: 0rpx; }
.z-of-188 { margin: 187rpx; padding: 0rpx; }
.z-of-189 { margin: 188rpx; padding: 0rpx; }
.z-of-190 { margin: 189rpx; padding: 0rpx; }
.z-of-191 { margin: 190rpx; padding: 0rpx; }
.z-of-192 { margin: 191rpx; padding: 0rpx; }
.z-of-193 { margin: 192rpx; padding: 0rpx; }
.z-of-194 { margin: 193rpx; padding: 0rpx; }
.z-of-195 { margin: 194rpx; padding: 0rpx; }
.z-of-196 { margin: 195rpx; padding: 0rpx; }
.z-of-197 { margin: 196rpx; padding: 0rpx; }
.z-of-198 { margin: 197rpx; padding: 0rpx; }
.z-of-199 { margin: 198rpx; padding: 0rpx; }
.z-of-200 { margin: 199rpx; padding: 0rpx; }
</style>
