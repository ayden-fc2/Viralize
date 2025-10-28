import { getStorageStoredData } from '../utils/storeUtil'

const STORAGE_KEY = 'viralize-community-'
const DATA_VERSION = '1.0' // 数据版本号

// 检查数据版本，如果版本不匹配则清除旧数据
function checkAndClearOldData() {
  const storedVersion = uni.getStorageSync(STORAGE_KEY + 'version')
  if (storedVersion !== DATA_VERSION) {
    console.log('🔄 检测到数据版本更新，清除旧数据')
    uni.removeStorageSync(STORAGE_KEY + 'posts')
    uni.removeStorageSync(STORAGE_KEY + 'comments')
    uni.removeStorageSync(STORAGE_KEY + 'blockedUsers')
    uni.removeStorageSync(STORAGE_KEY + 'reportedPosts')
    uni.removeStorageSync(STORAGE_KEY + 'reportedComments')
    uni.setStorageSync(STORAGE_KEY + 'version', DATA_VERSION)
  }
}

// 在加载数据前检查版本
checkAndClearOldData()

// Initialize two official Viralize announcements
const INITIAL_POSTS = [
  {
    id: 'post_official_001',
    author: {
      id: 'user_viralize',
      name: 'Viralize',
      avatar: '',
      isOfficial: true
    },
    content: 'Welcome to Viralize Community! 🎉\n\nHere you can:\n• Share your creative works\n• Connect with other creators\n• Get the latest product updates\n• Join community events\n\nLet\'s create amazing content together!',
    images: [],
    likes: 1,
    comments: 0,
    isLiked: false,
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000 // 7 days ago
  },
  {
    id: 'post_official_002',
    author: {
      id: 'user_viralize',
      name: 'Viralize',
      avatar: '',
      isOfficial: true
    },
    content: '📢 Viralize v1.0 is now live!\n\nNew features:\n✨ AI Scene Generation\n✨ Smart Video Creation\n✨ Multi-language Support\n✨ Project Management\n\nThank you for your support and feedback!',
    images: [],
    likes: 1,
    comments: 1,
    isLiked: false,
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000 // 3 days ago
  }
]

// 初始化评论数据
const INITIAL_COMMENTS = {
  'post_official_002': [
    {
      id: 'comment_official_001',
      author: {
        id: 'user_viralize',
        name: 'Viralize',
        avatar: ''
      },
      content: 'Thank you all for your support! We will keep working hard to bring you better features. 🚀',
      createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000 // 2 days ago
    }
  ]
}

const state = {
  // 当前用户 ID（实际项目中应该从用户认证模块获取）
  currentUserId: 'user_current',
  posts: getStorageStoredData(STORAGE_KEY, 'posts') || INITIAL_POSTS,
  comments: getStorageStoredData(STORAGE_KEY, 'comments') || INITIAL_COMMENTS,
  blockedUsers: getStorageStoredData(STORAGE_KEY, 'blockedUsers') || [],
  reportedPosts: getStorageStoredData(STORAGE_KEY, 'reportedPosts') || [],
  reportedComments: getStorageStoredData(STORAGE_KEY, 'reportedComments') || []
}

const mutations = {
  SET_POSTS(state, posts) {
    state.posts = posts
  },
  
  ADD_POST(state, post) {
    state.posts.unshift(post)
  },
  
  UPDATE_POST(state, { postId, updates }) {
    const index = state.posts.findIndex(p => p.id === postId)
    if (index !== -1) {
      state.posts[index] = { ...state.posts[index], ...updates }
    }
  },
  
  DELETE_POST(state, postId) {
    state.posts = state.posts.filter(p => p.id !== postId)
    // 同时删除该帖子的评论
    delete state.comments[postId]
  },
  
  SET_COMMENTS(state, { postId, comments }) {
    state.comments = {
      ...state.comments,
      [postId]: comments
    }
  },
  
  ADD_COMMENT(state, { postId, comment }) {
    if (!state.comments[postId]) {
      state.comments[postId] = []
    }
    state.comments[postId].push(comment)
    
    // 更新帖子评论数
    const post = state.posts.find(p => p.id === postId)
    if (post) {
      post.comments = (post.comments || 0) + 1
    }
  },
  
  DELETE_COMMENT(state, { postId, commentId }) {
    if (state.comments[postId]) {
      state.comments[postId] = state.comments[postId].filter(c => c.id !== commentId)
      
      // 更新帖子评论数
      const post = state.posts.find(p => p.id === postId)
      if (post && post.comments > 0) {
        post.comments -= 1
      }
    }
  },
  
  TOGGLE_LIKE(state, postId) {
    const post = state.posts.find(p => p.id === postId)
    if (post) {
      post.isLiked = !post.isLiked
      post.likes += post.isLiked ? 1 : -1
    }
  },
  
  BLOCK_USER(state, userId) {
    if (!state.blockedUsers.includes(userId)) {
      state.blockedUsers.push(userId)
    }
  },
  
  UNBLOCK_USER(state, userId) {
    state.blockedUsers = state.blockedUsers.filter(id => id !== userId)
  },
  
  REPORT_POST(state, postId) {
    if (!state.reportedPosts.includes(postId)) {
      state.reportedPosts.push(postId)
    }
  },
  
  REPORT_COMMENT(state, commentId) {
    if (!state.reportedComments.includes(commentId)) {
      state.reportedComments.push(commentId)
    }
  }
}

const actions = {
  // 创建帖子
  createPost({ commit, state }, { content, images = [] }) {
    const now = Date.now()
    const postId = `post_${now}_${Math.random().toString(36).substr(2, 9)}`
    
    const newPost = {
      id: postId,
      author: {
        id: 'user_current',
        name: 'Viralize User',
        avatar: '',
        isOfficial: false
      },
      content,
      images,
      likes: 0,
      comments: 0,
      isLiked: false,
      createdAt: now
    }
    
    commit('ADD_POST', newPost)
    uni.setStorageSync(STORAGE_KEY + 'posts', JSON.stringify(state.posts))
    
    return newPost
  },
  
  // 删除帖子
  deletePost({ commit, state }, postId) {
    commit('DELETE_POST', postId)
    uni.setStorageSync(STORAGE_KEY + 'posts', JSON.stringify(state.posts))
    uni.setStorageSync(STORAGE_KEY + 'comments', JSON.stringify(state.comments))
  },
  
  // 点赞/取消点赞
  toggleLike({ commit, state }, postId) {
    commit('TOGGLE_LIKE', postId)
    uni.setStorageSync(STORAGE_KEY + 'posts', JSON.stringify(state.posts))
  },
  
  // 添加评论
  addComment({ commit, state }, { postId, content }) {
    const now = Date.now()
    const commentId = `comment_${now}_${Math.random().toString(36).substr(2, 9)}`
    
    const newComment = {
      id: commentId,
      author: {
        id: 'user_current',
        name: 'Viralize User',
        avatar: ''
      },
      content,
      createdAt: now
    }
    
    commit('ADD_COMMENT', { postId, comment: newComment })
    uni.setStorageSync(STORAGE_KEY + 'comments', JSON.stringify(state.comments))
    uni.setStorageSync(STORAGE_KEY + 'posts', JSON.stringify(state.posts))
    
    return newComment
  },
  
  // 删除评论
  deleteComment({ commit, state }, { postId, commentId }) {
    commit('DELETE_COMMENT', { postId, commentId })
    uni.setStorageSync(STORAGE_KEY + 'comments', JSON.stringify(state.comments))
    uni.setStorageSync(STORAGE_KEY + 'posts', JSON.stringify(state.posts))
  },
  
  // 拉黑用户
  blockUser({ commit, state }, userId) {
    commit('BLOCK_USER', userId)
    uni.setStorageSync(STORAGE_KEY + 'blockedUsers', JSON.stringify(state.blockedUsers))
  },
  
  // 取消拉黑
  unblockUser({ commit, state }, userId) {
    commit('UNBLOCK_USER', userId)
    uni.setStorageSync(STORAGE_KEY + 'blockedUsers', JSON.stringify(state.blockedUsers))
  },
  
  // 举报帖子
  reportPost({ commit, state }, postId) {
    commit('REPORT_POST', postId)
    uni.setStorageSync(STORAGE_KEY + 'reportedPosts', JSON.stringify(state.reportedPosts))
  },
  
  // 举报评论
  reportComment({ commit, state }, commentId) {
    commit('REPORT_COMMENT', commentId)
    uni.setStorageSync(STORAGE_KEY + 'reportedComments', JSON.stringify(state.reportedComments))
  }
}

const getters = {
  // 获取当前用户 ID
  currentUserId: state => state.currentUserId,
  
  // 获取所有未被拉黑用户的帖子
  visiblePosts: state => {
    return state.posts
      .filter(post => !state.blockedUsers.includes(post.author.id))
      .sort((a, b) => b.createdAt - a.createdAt)
  },
  
  // 获取帖子的评论（过滤拉黑用户）
  getPostComments: state => postId => {
    const comments = state.comments[postId] || []
    return comments.filter(comment => !state.blockedUsers.includes(comment.author.id))
  },
  
  // 检查用户是否被拉黑
  isUserBlocked: state => userId => {
    return state.blockedUsers.includes(userId)
  },
  
  // 检查帖子是否被举报
  isPostReported: state => postId => {
    return state.reportedPosts.includes(postId)
  },
  
  // 检查评论是否被举报
  isCommentReported: state => commentId => {
    return state.reportedComments.includes(commentId)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

