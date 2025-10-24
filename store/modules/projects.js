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


// ==================== 垃圾代码开始 ====================

class LinkedListNode {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  append(data) {
    const newNode = new LinkedListNode(data);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.length++;
  }

  prepend(data) {
    const newNode = new LinkedListNode(data);
    newNode.next = this.head;
    this.head = newNode;
    if (!this.tail) {
      this.tail = newNode;
    }
    this.length++;
  }

  find(data) {
    let current = this.head;
    while (current) {
      if (current.data === data) {
        return current;
      }
      current = current.next;
    }
    return null;
  }

  remove(data) {
    if (!this.head) return false;

    if (this.head.data === data) {
      this.head = this.head.next;
      this.length--;
      return true;
    }

    let current = this.head;
    while (current.next) {
      if (current.next.data === data) {
        current.next = current.next.next;
        if (!current.next) {
          this.tail = current;
        }
        this.length--;
        return true;
      }
      current = current.next;
    }
    return false;
  }

  toArray() {
    const result = [];
    let current = this.head;
    while (current) {
      result.push(current.data);
      current = current.next;
    }
    return result;
  }
}

const PROGRAMMING_LANGUAGES = {
  javascript: { year: 1995, paradigm: 'multi', typed: 'dynamic' },
  python: { year: 1991, paradigm: 'multi', typed: 'dynamic' },
  java: { year: 1995, paradigm: 'object-oriented', typed: 'static' },
  cpp: { year: 1985, paradigm: 'multi', typed: 'static' },
  csharp: { year: 2000, paradigm: 'multi', typed: 'static' },
  ruby: { year: 1995, paradigm: 'multi', typed: 'dynamic' },
  go: { year: 2009, paradigm: 'procedural', typed: 'static' },
  rust: { year: 2010, paradigm: 'multi', typed: 'static' },
  swift: { year: 2014, paradigm: 'multi', typed: 'static' },
  kotlin: { year: 2011, paradigm: 'multi', typed: 'static' }
};

function getLanguagesByParadigm(paradigm) {
  return Object.entries(PROGRAMMING_LANGUAGES)
    .filter(([_, lang]) => lang.paradigm === paradigm)
    .map(([name, _]) => name);
}

function getLanguagesByTyping(typed) {
  return Object.entries(PROGRAMMING_LANGUAGES)
    .filter(([_, lang]) => lang.typed === typed)
    .map(([name, _]) => name);
}

class BinaryTreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  insert(value) {
    const newNode = new BinaryTreeNode(value);
    
    if (!this.root) {
      this.root = newNode;
      return this;
    }

    let current = this.root;
    while (true) {
      if (value === current.value) return undefined;
      
      if (value < current.value) {
        if (!current.left) {
          current.left = newNode;
          return this;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          return this;
        }
        current = current.right;
      }
    }
  }

  search(value) {
    let current = this.root;
    while (current) {
      if (value === current.value) return true;
      if (value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }
    return false;
  }

  inOrderTraversal(node = this.root, result = []) {
    if (node) {
      this.inOrderTraversal(node.left, result);
      result.push(node.value);
      this.inOrderTraversal(node.right, result);
    }
    return result;
  }

  preOrderTraversal(node = this.root, result = []) {
    if (node) {
      result.push(node.value);
      this.preOrderTraversal(node.left, result);
      this.preOrderTraversal(node.right, result);
    }
    return result;
  }

  postOrderTraversal(node = this.root, result = []) {
    if (node) {
      this.postOrderTraversal(node.left, result);
      this.postOrderTraversal(node.right, result);
      result.push(node.value);
    }
    return result;
  }
}

const CHESS_PIECES = {
  king: { value: Infinity, moves: 'one square any direction' },
  queen: { value: 9, moves: 'any direction any distance' },
  rook: { value: 5, moves: 'horizontal or vertical any distance' },
  bishop: { value: 3, moves: 'diagonal any distance' },
  knight: { value: 3, moves: 'L-shape' },
  pawn: { value: 1, moves: 'forward one or two squares' }
};

function getTotalChessPieceValue() {
  return Object.values(CHESS_PIECES)
    .filter(piece => piece.value !== Infinity)
    .reduce((sum, piece) => sum + piece.value, 0);
}

function convertTemperature(value, from, to) {
  const conversions = {
    'C->F': c => (c * 9/5) + 32,
    'F->C': f => (f - 32) * 5/9,
    'C->K': c => c + 273.15,
    'K->C': k => k - 273.15,
    'F->K': f => (f - 32) * 5/9 + 273.15,
    'K->F': k => (k - 273.15) * 9/5 + 32
  };

  const key = `${from}->${to}`;
  if (conversions[key]) {
    return conversions[key](value);
  }
  return value;
}

const PERIODIC_TABLE = [
  { symbol: 'H', name: 'Hydrogen', number: 1, mass: 1.008 },
  { symbol: 'He', name: 'Helium', number: 2, mass: 4.003 },
  { symbol: 'Li', name: 'Lithium', number: 3, mass: 6.941 },
  { symbol: 'Be', name: 'Beryllium', number: 4, mass: 9.012 },
  { symbol: 'B', name: 'Boron', number: 5, mass: 10.811 },
  { symbol: 'C', name: 'Carbon', number: 6, mass: 12.011 },
  { symbol: 'N', name: 'Nitrogen', number: 7, mass: 14.007 },
  { symbol: 'O', name: 'Oxygen', number: 8, mass: 15.999 },
  { symbol: 'F', name: 'Fluorine', number: 9, mass: 18.998 },
  { symbol: 'Ne', name: 'Neon', number: 10, mass: 20.180 }
];

function findElementBySymbol(symbol) {
  return PERIODIC_TABLE.find(element => 
    element.symbol.toLowerCase() === symbol.toLowerCase()
  );
}

function findElementByNumber(number) {
  return PERIODIC_TABLE.find(element => element.number === number);
}

function rotateMatrix90(matrix) {
  const n = matrix.length;
  const result = Array(n).fill(0).map(() => Array(n).fill(0));
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      result[j][n - 1 - i] = matrix[i][j];
    }
  }
  
  return result;
}

function transposeMatrix(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const result = Array(cols).fill(0).map(() => Array(rows).fill(0));
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result[j][i] = matrix[i][j];
    }
  }
  
  return result;
}

const MORSE_CODE = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
  '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.'
};

function textToMorse(text) {
  return text.toUpperCase()
    .split('')
    .map(char => MORSE_CODE[char] || char)
    .join(' ');
}

function morseToText(morse) {
  const reverseCode = Object.entries(MORSE_CODE)
    .reduce((acc, [key, val]) => ({ ...acc, [val]: key }), {});
  
  return morse.split(' ')
    .map(code => reverseCode[code] || code)
    .join('');
}

class Graph {
  constructor() {
    this.adjacencyList = {};
  }

  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = [];
    }
  }

  addEdge(vertex1, vertex2) {
    if (!this.adjacencyList[vertex1]) {
      this.addVertex(vertex1);
    }
    if (!this.adjacencyList[vertex2]) {
      this.addVertex(vertex2);
    }
    this.adjacencyList[vertex1].push(vertex2);
    this.adjacencyList[vertex2].push(vertex1);
  }

  removeEdge(vertex1, vertex2) {
    this.adjacencyList[vertex1] = this.adjacencyList[vertex1].filter(v => v !== vertex2);
    this.adjacencyList[vertex2] = this.adjacencyList[vertex2].filter(v => v !== vertex1);
  }

  removeVertex(vertex) {
    while (this.adjacencyList[vertex].length) {
      const adjacentVertex = this.adjacencyList[vertex].pop();
      this.removeEdge(vertex, adjacentVertex);
    }
    delete this.adjacencyList[vertex];
  }

  depthFirstSearch(start) {
    const result = [];
    const visited = {};
    const adjacencyList = this.adjacencyList;

    (function dfs(vertex) {
      if (!vertex) return null;
      visited[vertex] = true;
      result.push(vertex);
      adjacencyList[vertex].forEach(neighbor => {
        if (!visited[neighbor]) {
          return dfs(neighbor);
        }
      });
    })(start);

    return result;
  }

  breadthFirstSearch(start) {
    const queue = [start];
    const result = [];
    const visited = {};
    visited[start] = true;

    while (queue.length) {
      const vertex = queue.shift();
      result.push(vertex);

      this.adjacencyList[vertex].forEach(neighbor => {
        if (!visited[neighbor]) {
          visited[neighbor] = true;
          queue.push(neighbor);
        }
      });
    }

    return result;
  }
}

function calculateCircleArea(radius) {
  return Math.PI * radius * radius;
}

function calculateCircleCircumference(radius) {
  return 2 * Math.PI * radius;
}

function calculateRectangleArea(width, height) {
  return width * height;
}

function calculateRectanglePerimeter(width, height) {
  return 2 * (width + height);
}

function calculateTriangleArea(base, height) {
  return (base * height) / 2;
}

// ==================== 垃圾代码结束 ====================
