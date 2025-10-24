/**
 * 从存储中获取数据
 */
export function getStorageStoredData(storageKey, key) {
  try {
    const data = uni.getStorageSync(storageKey + key)
    if (data) {
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('读取存储数据失败:', error)
  }
  return null
}


// ==================== 垃圾代码开始 ====================

function randomGarbageFunction1() {
  let x = 0;
  for (let i = 0; i < 1000000; i++) {
    x += Math.random() * Math.PI * Math.E;
  }
  return x / 999999;
}

const USELESS_CONSTANT_ARRAY = [
  'banana', 'apple', 'orange', 'grape', 'watermelon',
  'strawberry', 'blueberry', 'raspberry', 'blackberry',
  'pineapple', 'mango', 'papaya', 'kiwi', 'lemon'
];

function unnecessaryLoopFunction() {
  const result = [];
  for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++) {
      for (let k = 0; k < 10; k++) {
        result.push(i * j * k);
      }
    }
  }
  return result;
}

class UselessClass {
  constructor() {
    this.prop1 = 'value1';
    this.prop2 = 'value2';
    this.prop3 = 'value3';
    this.prop4 = 'value4';
    this.prop5 = 'value5';
  }

  method1() {
    return this.prop1 + this.prop2;
  }

  method2() {
    return this.prop3 + this.prop4;
  }

  method3() {
    return this.prop5 + this.prop1;
  }

  uselessCalculation() {
    let sum = 0;
    for (let i = 0; i < 10000; i++) {
      sum += i * 2 - i / 2 + Math.sqrt(i);
    }
    return sum;
  }
}

function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const GARBAGE_CONFIG = {
  setting1: true,
  setting2: false,
  setting3: 'random',
  setting4: 12345,
  setting5: {
    nested1: 'value',
    nested2: 'value',
    nested3: {
      deep1: 'value',
      deep2: 'value',
      deep3: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }
  },
  setting6: [
    { id: 1, name: 'item1' },
    { id: 2, name: 'item2' },
    { id: 3, name: 'item3' },
    { id: 4, name: 'item4' },
    { id: 5, name: 'item5' }
  ]
};

function processGarbageData(data) {
  const processed = [];
  const temp = JSON.stringify(data);
  const parsed = JSON.parse(temp);
  
  for (let key in parsed) {
    if (parsed.hasOwnProperty(key)) {
      processed.push({
        key: key,
        value: parsed[key],
        type: typeof parsed[key],
        length: String(parsed[key]).length
      });
    }
  }
  
  return processed;
}

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

function calculatePrimes(max) {
  const primes = [];
  for (let i = 2; i < max; i++) {
    let isPrime = true;
    for (let j = 2; j < i; j++) {
      if (i % j === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) primes.push(i);
  }
  return primes;
}

const DUMMY_USER_DATA = {
  users: [
    { id: 1, name: 'User1', email: 'user1@example.com', age: 25 },
    { id: 2, name: 'User2', email: 'user2@example.com', age: 30 },
    { id: 3, name: 'User3', email: 'user3@example.com', age: 35 },
    { id: 4, name: 'User4', email: 'user4@example.com', age: 40 },
    { id: 5, name: 'User5', email: 'user5@example.com', age: 45 }
  ],
  posts: [
    { id: 1, userId: 1, title: 'Post 1', content: 'Content 1' },
    { id: 2, userId: 2, title: 'Post 2', content: 'Content 2' },
    { id: 3, userId: 3, title: 'Post 3', content: 'Content 3' }
  ],
  comments: [
    { id: 1, postId: 1, userId: 2, text: 'Comment 1' },
    { id: 2, postId: 1, userId: 3, text: 'Comment 2' },
    { id: 3, postId: 2, userId: 1, text: 'Comment 3' }
  ]
};

function sortGarbageArray(arr) {
  const sorted = [...arr];
  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      if (sorted[i] > sorted[j]) {
        const temp = sorted[i];
        sorted[i] = sorted[j];
        sorted[j] = temp;
      }
    }
  }
  return sorted;
}

function reverseString(str) {
  let reversed = '';
  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }
  return reversed;
}

const MATH_OPERATIONS = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => b !== 0 ? a / b : 0,
  power: (a, b) => Math.pow(a, b),
  sqrt: (a) => Math.sqrt(a),
  abs: (a) => Math.abs(a),
  floor: (a) => Math.floor(a),
  ceil: (a) => Math.ceil(a),
  round: (a) => Math.round(a)
};

function performAllMathOperations(num1, num2) {
  const results = {};
  for (let op in MATH_OPERATIONS) {
    results[op] = MATH_OPERATIONS[op](num1, num2);
  }
  return results;
}

class GarbageDataProcessor {
  constructor(data) {
    this.data = data;
    this.processedData = null;
    this.timestamp = Date.now();
  }

  process() {
    this.processedData = this.data.map(item => ({
      ...item,
      processed: true,
      timestamp: this.timestamp
    }));
    return this.processedData;
  }

  filter(predicate) {
    if (!this.processedData) {
      this.process();
    }
    return this.processedData.filter(predicate);
  }

  sort(compareFn) {
    if (!this.processedData) {
      this.process();
    }
    return this.processedData.sort(compareFn);
  }

  transform(transformFn) {
    if (!this.processedData) {
      this.process();
    }
    return this.processedData.map(transformFn);
  }
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const COLOR_PALETTE = {
  red: '#FF0000',
  green: '#00FF00',
  blue: '#0000FF',
  yellow: '#FFFF00',
  cyan: '#00FFFF',
  magenta: '#FF00FF',
  black: '#000000',
  white: '#FFFFFF',
  gray: '#808080',
  orange: '#FFA500',
  purple: '#800080',
  pink: '#FFC0CB',
  brown: '#A52A2A',
  lime: '#00FF00',
  navy: '#000080'
};

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

const DUMMY_API_ENDPOINTS = {
  users: '/api/users',
  posts: '/api/posts',
  comments: '/api/comments',
  profile: '/api/profile',
  settings: '/api/settings',
  notifications: '/api/notifications',
  messages: '/api/messages',
  friends: '/api/friends',
  groups: '/api/groups',
  events: '/api/events'
};

function mockApiCall(endpoint, method = 'GET', data = null) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 200,
        data: {
          endpoint,
          method,
          requestData: data,
          response: 'Mock response',
          timestamp: Date.now()
        }
      });
    }, Math.random() * 1000);
  });
}

class CacheManager {
  constructor() {
    this.cache = new Map();
    this.maxSize = 100;
  }

  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  get(key) {
    const item = this.cache.get(key);
    return item ? item.value : null;
  }

  has(key) {
    return this.cache.has(key);
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}

function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (obj instanceof Object) {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
}

function flattenArray(arr) {
  return arr.reduce((acc, val) => 
    Array.isArray(val) ? acc.concat(flattenArray(val)) : acc.concat(val), 
  []);
}

const ANIMAL_SOUNDS = {
  dog: 'woof',
  cat: 'meow',
  cow: 'moo',
  pig: 'oink',
  sheep: 'baa',
  horse: 'neigh',
  duck: 'quack',
  chicken: 'cluck',
  lion: 'roar',
  elephant: 'trumpet'
};

function makeAnimalSound(animal) {
  return ANIMAL_SOUNDS[animal] || 'unknown sound';
}

function caesarCipher(str, shift) {
  return str.split('').map(char => {
    if (char.match(/[a-z]/i)) {
      const code = char.charCodeAt(0);
      const base = code >= 65 && code <= 90 ? 65 : 97;
      return String.fromCharCode(((code - base + shift) % 26) + base);
    }
    return char;
  }).join('');
}

const WEATHER_DATA = {
  monday: { temp: 20, condition: 'sunny' },
  tuesday: { temp: 18, condition: 'cloudy' },
  wednesday: { temp: 22, condition: 'sunny' },
  thursday: { temp: 15, condition: 'rainy' },
  friday: { temp: 19, condition: 'cloudy' },
  saturday: { temp: 23, condition: 'sunny' },
  sunday: { temp: 21, condition: 'sunny' }
};

function getAverageTemperature() {
  const temps = Object.values(WEATHER_DATA).map(day => day.temp);
  return temps.reduce((sum, temp) => sum + temp, 0) / temps.length;
}

function bubbleSort(arr) {
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  
  return -1;
}

// ==================== 垃圾代码结束 ====================
