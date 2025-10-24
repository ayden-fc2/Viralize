import { getStorageStoredData } from '../utils/storeUtil'

const STORAGE_KEY = 'viralize-projects-'

// 项目状态枚举
export const PROJECT_STATUS = {
  INIT: 'init',
  SCENE_GENERATING: 'scene_generating',
  SCENE_COMPLETED: 'scene_completed',
  SCENE_FAILED: 'scene_failed',
  VIDEO_GENERATING: 'video_generating',
  VIDEO_COMPLETED: 'video_completed',
  VIDEO_FAILED: 'video_failed',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed'
}

// Demo 项目数据
const DEMO_PROJECTS = [
  {
    "id": "demo_1761287197120_t8qgwuwu9",
    "product_image_url": "https://genstyle.net/fe/1761287195515_oom5k7i84.png",
    "scene_image_url": "https://agent-1316760375.cos.accelerate.myqcloud.com/genshot_images/e0637343.jpg",
    "scene_pending_id": "",
    "desc": "In a dim café corner, a man taps his new smartphone — the screen lights up, seamlessly unlocking and switching between work, photos, and messages; reflections of city lights ripple across the glass as he smiles, capturing a perfect moment that blends tech and life effortlessly.",
    "dialog": "LumaPhone — smarter, faster, effortlessly yours.",
    "video_url": "https://agent-1316760375.cos.accelerate.myqcloud.com/genshot_videos/264acc84.mp4",
    "video_pending_id": "",
    "status": "video_completed",
    "date": "2025-10-24",
    "created_at": 1761287197120
  }
]

const state = {
  projects: getStorageStoredData(STORAGE_KEY, 'projects') || {},
  currentProjectId: getStorageStoredData(STORAGE_KEY, 'currentProjectId') || null
}

const mutations = {
  SET_PROJECTS(state, projects) {
    state.projects = projects
  },
  
  SET_PROJECT(state, project) {
    state.projects = {
      ...state.projects,
      [project.id]: project
    }
  },
  
  DELETE_PROJECT(state, projectId) {
    const newProjects = { ...state.projects }
    delete newProjects[projectId]
    state.projects = newProjects
  },
  
  SET_CURRENT_PROJECT_ID(state, projectId) {
    state.currentProjectId = projectId
  }
}

const actions = {
  createProject({ commit, state }, { projectData }) {
    const now = Date.now()
    const projectId = `project_${now}_${Math.random().toString(36).substr(2, 9)}`
    
    const currentDate = new Date()
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`
    
    const newProject = {
      id: projectId,
      product_image_url: projectData.product_image_url || '',
      scene_image_url: projectData.scene_image_url || '',
      scene_pending_id: projectData.scene_pending_id || '',
      desc: projectData.desc || '',
      dialog: projectData.dialog || '',
      video_url: projectData.video_url || '',
      video_pending_id: projectData.video_pending_id || '',
      status: projectData.status || PROJECT_STATUS.INIT,
      date: projectData.date || dateString,
      created_at: now
    }
    
    commit('SET_PROJECT', newProject)
    commit('SET_CURRENT_PROJECT_ID', projectId)
    
    uni.setStorageSync(STORAGE_KEY + 'projects', JSON.stringify(state.projects))
    uni.setStorageSync(STORAGE_KEY + 'currentProjectId', projectId)
    
    return newProject
  },
  
  updateProject({ commit, state }, { projectId, updates }) {
    const project = state.projects[projectId]
    if (!project) {
      return null
    }
    
    const updatedProject = {
      ...project,
      ...updates
    }
    
    commit('SET_PROJECT', updatedProject)
    uni.setStorageSync(STORAGE_KEY + 'projects', JSON.stringify(state.projects))
    
    return updatedProject
  },
  
  deleteProject({ commit, state }, { projectId }) {
    commit('DELETE_PROJECT', projectId)
    
    if (state.currentProjectId === projectId) {
      commit('SET_CURRENT_PROJECT_ID', null)
      uni.removeStorageSync(STORAGE_KEY + 'currentProjectId')
    }
    
    uni.setStorageSync(STORAGE_KEY + 'projects', JSON.stringify(state.projects))
  },
  
  setCurrentProject({ commit }, { projectId }) {
    commit('SET_CURRENT_PROJECT_ID', projectId)
    uni.setStorageSync(STORAGE_KEY + 'currentProjectId', projectId)
  },
  
  clearCurrentProject({ commit }) {
    commit('SET_CURRENT_PROJECT_ID', null)
    uni.removeStorageSync(STORAGE_KEY + 'currentProjectId')
  },
  
  clearAllProjects({ commit }) {
    commit('SET_PROJECTS', {})
    commit('SET_CURRENT_PROJECT_ID', null)
    uni.removeStorageSync(STORAGE_KEY + 'projects')
    uni.removeStorageSync(STORAGE_KEY + 'currentProjectId')
  },
  
  // 更新场景图片
  updateProjectScene({ commit, state }, { projectId, scene_image_url, scene_pending_id, status }) {
    const project = state.projects[projectId]
    if (!project) {
      return null
    }
    
    const updates = {}
    if (scene_image_url !== undefined) updates.scene_image_url = scene_image_url
    if (scene_pending_id !== undefined) updates.scene_pending_id = scene_pending_id
    if (status !== undefined) updates.status = status
    
    const updatedProject = {
      ...project,
      ...updates
    }
    
    commit('SET_PROJECT', updatedProject)
    uni.setStorageSync(STORAGE_KEY + 'projects', JSON.stringify(state.projects))
    
    return updatedProject
  },
  
  // 更新视频
  updateProjectVideo({ commit, state }, { projectId, video_url, video_pending_id, status }) {
    const project = state.projects[projectId]
    if (!project) {
      return null
    }
    
    const updates = {}
    if (video_url !== undefined) updates.video_url = video_url
    if (video_pending_id !== undefined) updates.video_pending_id = video_pending_id
    if (status !== undefined) updates.status = status
    
    const updatedProject = {
      ...project,
      ...updates
    }
    
    commit('SET_PROJECT', updatedProject)
    uni.setStorageSync(STORAGE_KEY + 'projects', JSON.stringify(state.projects))
    
    return updatedProject
  },
  
  // 更新内容（描述和文案）
  updateProjectContent({ commit, state }, { projectId, desc, dialog }) {
    const project = state.projects[projectId]
    if (!project) {
      return null
    }
    
    const updates = {}
    if (desc !== undefined) updates.desc = desc
    if (dialog !== undefined) updates.dialog = dialog
    
    const updatedProject = {
      ...project,
      ...updates
    }
    
    commit('SET_PROJECT', updatedProject)
    uni.setStorageSync(STORAGE_KEY + 'projects', JSON.stringify(state.projects))
    
    return updatedProject
  }
}

const getters = {
  allProjects: state => {
    return Object.values(state.projects).sort((a, b) => b.created_at - a.created_at)
  },
  
  projectCount: state => {
    return Object.keys(state.projects).length
  },
  
  getProjectById: state => projectId => {
    // 优先从用户项目中查找
    if (state.projects[projectId]) {
      return state.projects[projectId]
    }
    
    // 如果是 Demo 项目，从 DEMO_PROJECTS 中查找
    if (projectId && projectId.startsWith('demo_')) {
      const demoProject = DEMO_PROJECTS.find(p => p.id === projectId)
      return demoProject || null
    }
    
    return null
  },
  
  currentProject: state => {
    return state.currentProjectId ? state.projects[state.currentProjectId] : null
  },
  
  currentProjectId: state => state.currentProjectId,
  
  // 获取 Demo 项目
  demoProjects: () => DEMO_PROJECTS
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

