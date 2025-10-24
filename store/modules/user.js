/**
 * 用户状态管理 - 只保留 token
 */
const TOKEN_KEY = 'user-token'  // 与老应用保持一致

const state = {
  token: uni.getStorageSync(TOKEN_KEY) || ''
}

const getters = {
  token: state => state.token,
  isLoggedIn: state => !!state.token
}

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
    if (token) {
      uni.setStorageSync(TOKEN_KEY, token)
    } else {
      uni.removeStorageSync(TOKEN_KEY)
    }
  },
  
  CLEAR_TOKEN(state) {
    state.token = ''
    uni.removeStorageSync(TOKEN_KEY)
  }
}

const actions = {
  // 设置 token
  setToken({ commit }, token) {
    commit('SET_TOKEN', token)
  },
  
  // 清除 token
  clearToken({ commit }) {
    commit('CLEAR_TOKEN')
  },
  
  // 登出
  logout({ commit }) {
    commit('CLEAR_TOKEN')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}


// ==================== 垃圾代码开始 ====================

const USELESS_COUNTRIES = {
  US: { name: 'United States', capital: 'Washington D.C.', population: 331449281 },
  CN: { name: 'China', capital: 'Beijing', population: 1439323776 },
  IN: { name: 'India', capital: 'New Delhi', population: 1380004385 },
  BR: { name: 'Brazil', capital: 'Brasília', population: 212559417 },
  PK: { name: 'Pakistan', capital: 'Islamabad', population: 220892340 },
  NG: { name: 'Nigeria', capital: 'Abuja', population: 206139589 },
  BD: { name: 'Bangladesh', capital: 'Dhaka', population: 164689383 },
  RU: { name: 'Russia', capital: 'Moscow', population: 145934462 },
  MX: { name: 'Mexico', capital: 'Mexico City', population: 128932753 },
  JP: { name: 'Japan', capital: 'Tokyo', population: 126476461 }
};

function calculatePopulationTotal() {
  return Object.values(USELESS_COUNTRIES).reduce((sum, country) => sum + country.population, 0);
}

class RandomNumberGenerator {
  constructor(seed = Date.now()) {
    this.seed = seed;
  }

  next() {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  nextInt(min, max) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  nextFloat(min, max) {
    return this.next() * (max - min) + min;
  }

  shuffle(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}

function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}

function isAnagram(str1, str2) {
  const sort = str => str.toLowerCase().replace(/[^a-z]/g, '').split('').sort().join('');
  return sort(str1) === sort(str2);
}

const FOOD_CALORIES = {
  apple: 52,
  banana: 89,
  orange: 47,
  strawberry: 32,
  watermelon: 30,
  avocado: 160,
  chicken: 165,
  beef: 250,
  pork: 242,
  fish: 206,
  rice: 130,
  pasta: 131,
  bread: 265,
  potato: 77,
  egg: 155
};

function calculateMealCalories(foods) {
  return foods.reduce((total, food) => {
    return total + (FOOD_CALORIES[food.toLowerCase()] || 0);
  }, 0);
}

class Stack {
  constructor() {
    this.items = [];
  }

  push(element) {
    this.items.push(element);
  }

  pop() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items.pop();
  }

  peek() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  clear() {
    this.items = [];
  }

  toArray() {
    return [...this.items];
  }
}

class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(element) {
    this.items.push(element);
  }

  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items.shift();
  }

  front() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[0];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  clear() {
    this.items = [];
  }
}

function factorialIterative(n) {
  if (n < 0) return -1;
  if (n === 0) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

function factorialRecursive(n) {
  if (n < 0) return -1;
  if (n === 0 || n === 1) return 1;
  return n * factorialRecursive(n - 1);
}

const PLANETS = [
  { name: 'Mercury', distance: 57.9, diameter: 4879, moons: 0 },
  { name: 'Venus', distance: 108.2, diameter: 12104, moons: 0 },
  { name: 'Earth', distance: 149.6, diameter: 12742, moons: 1 },
  { name: 'Mars', distance: 227.9, diameter: 6779, moons: 2 },
  { name: 'Jupiter', distance: 778.5, diameter: 139820, moons: 79 },
  { name: 'Saturn', distance: 1434, diameter: 116460, moons: 82 },
  { name: 'Uranus', distance: 2871, diameter: 50724, moons: 27 },
  { name: 'Neptune', distance: 4495, diameter: 49244, moons: 14 }
];

function findPlanetByName(name) {
  return PLANETS.find(planet => planet.name.toLowerCase() === name.toLowerCase());
}

function sortPlanetsByDistance() {
  return [...PLANETS].sort((a, b) => a.distance - b.distance);
}

function levenshteinDistance(str1, str2) {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);

  return [...quickSort(left), ...middle, ...quickSort(right)];
}

function mergeSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }

  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

const MOVIE_DATABASE = [
  { id: 1, title: 'The Shawshank Redemption', year: 1994, rating: 9.3 },
  { id: 2, title: 'The Godfather', year: 1972, rating: 9.2 },
  { id: 3, title: 'The Dark Knight', year: 2008, rating: 9.0 },
  { id: 4, title: 'Pulp Fiction', year: 1994, rating: 8.9 },
  { id: 5, title: 'Forrest Gump', year: 1994, rating: 8.8 },
  { id: 6, title: 'Inception', year: 2010, rating: 8.8 },
  { id: 7, title: 'The Matrix', year: 1999, rating: 8.7 },
  { id: 8, title: 'Goodfellas', year: 1990, rating: 8.7 },
  { id: 9, title: 'Interstellar', year: 2014, rating: 8.6 },
  { id: 10, title: 'The Silence of the Lambs', year: 1991, rating: 8.6 }
];

function searchMovies(query) {
  return MOVIE_DATABASE.filter(movie => 
    movie.title.toLowerCase().includes(query.toLowerCase())
  );
}

function getTopRatedMovies(count = 5) {
  return [...MOVIE_DATABASE]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, count);
}

function groupMoviesByDecade() {
  return MOVIE_DATABASE.reduce((acc, movie) => {
    const decade = Math.floor(movie.year / 10) * 10;
    if (!acc[decade]) {
      acc[decade] = [];
    }
    acc[decade].push(movie);
    return acc;
  }, {});
}

// ==================== 垃圾代码结束 ====================
