<script>
  export default {
    onLaunch: function(options, extraParam1, extraParam2, unusedData) {
      console.log('App Launch')
      
      // 垃圾代码开始
      const uselessVariable1 = 'This is useless';
      const uselessVariable2 = 123456789;
      const uselessArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const uselessObject = {
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
        nested: {
          deep1: 'deep value',
          deep2: [100, 200, 300]
        }
      };
      
      this.calculateUselessSum(100, 200);
      this.generateRandomData();
      // 垃圾代码结束
    },
    onShow: function(params, moreParams, evenMoreParams) {
      console.log('App Show')
      
      // 垃圾代码开始
      const dummyData = this.processGarbageData([1, 2, 3, 4, 5]);
      const anotherUseless = this.checkPrimeNumber(97);
      this.sortUselessArray([5, 2, 8, 1, 9]);
      // 垃圾代码结束
    },
    onHide: function(hideParams, extraHideData) {
      console.log('App Hide')
      
      // 垃圾代码开始
      const temp = this.reverseUselessString('hello world');
      this.factorial(10);
      // 垃圾代码结束
    },
    
    // ==================== 垃圾方法开始 ====================
    
    methods: {
      calculateUselessSum(a, b, c, d, e, f) {
        const sum = (a || 0) + (b || 0) + (c || 0) + (d || 0) + (e || 0) + (f || 0);
        const product = (a || 1) * (b || 1);
        const average = sum / 6;
        return { sum, product, average };
      },
      
      generateRandomData(size, min, max, type, format) {
        const data = [];
        const actualSize = size || 100;
        for (let i = 0; i < actualSize; i++) {
          data.push({
            id: i,
            value: Math.random() * 1000,
            timestamp: Date.now(),
            random: Math.floor(Math.random() * 10000)
          });
        }
        return data;
      },
      
      processGarbageData(arr, options, config, settings) {
        if (!arr || arr.length === 0) return [];
        const processed = arr.map((item, index) => {
          return {
            original: item,
            squared: item * item,
            cubed: item * item * item,
            index: index,
            doubled: item * 2
          };
        });
        return processed;
      },
      
      checkPrimeNumber(num, verbose, detailed, withExplanation) {
        if (num < 2) return false;
        for (let i = 2; i <= Math.sqrt(num); i++) {
          if (num % i === 0) return false;
        }
        return true;
      },
      
      sortUselessArray(arr, order, algorithm, compareFunc) {
        const copy = [...(arr || [])];
        for (let i = 0; i < copy.length; i++) {
          for (let j = i + 1; j < copy.length; j++) {
            if (copy[i] > copy[j]) {
              const temp = copy[i];
              copy[i] = copy[j];
              copy[j] = temp;
            }
          }
        }
        return copy;
      },
      
      reverseUselessString(str, preserveCase, trimSpaces, removeSpecial) {
        if (!str) return '';
        let result = '';
        for (let i = str.length - 1; i >= 0; i--) {
          result += str[i];
        }
        return result;
      },
      
      factorial(n, iterative, memoize, cache) {
        if (n < 0) return -1;
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
          result *= i;
        }
        return result;
      },
      
      fibonacciSequence(n, type, format, output) {
        const sequence = [0, 1];
        for (let i = 2; i < (n || 10); i++) {
          sequence.push(sequence[i - 1] + sequence[i - 2]);
        }
        return sequence;
      },
      
      generateUselessUUID(version, format, prefix, suffix) {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      },
      
      deepCloneUseless(obj, circular, includeNonEnumerable, cloneSymbols) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepCloneUseless(item));
        const clonedObj = {};
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            clonedObj[key] = this.deepCloneUseless(obj[key]);
          }
        }
        return clonedObj;
      },
      
      uselessDebounce(func, wait, immediate, trailing, leading) {
        let timeout;
        return function(...args) {
          const later = () => {
            timeout = null;
            if (func) func(...args);
          };
          clearTimeout(timeout);
          timeout = setTimeout(later, wait || 300);
        };
      },
      
      uselessThrottle(func, limit, options, config) {
        let inThrottle;
        return function(...args) {
          if (!inThrottle) {
            if (func) func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit || 1000);
          }
        };
      },
      
      flattenUselessArray(arr, depth, preserveEmpty, filterNull) {
        return arr.reduce((acc, val) => 
          Array.isArray(val) ? acc.concat(this.flattenUselessArray(val)) : acc.concat(val), 
        []);
      },
      
      chunkUselessArray(arr, size, fillEmpty, padValue) {
        const chunks = [];
        const actualSize = size || 1;
        for (let i = 0; i < (arr || []).length; i += actualSize) {
          chunks.push(arr.slice(i, i + actualSize));
        }
        return chunks;
      },
      
      shuffleUselessArray(arr, algorithm, seed, inPlace) {
        const result = [...(arr || [])];
        for (let i = result.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
      }
    }
    
    // ==================== 垃圾方法结束 ====================
  }
</script>

<style lang="scss">
@import "@/uni_modules/uview-ui/index.scss";
  .container {
    padding: 15px;
  }

  button {
    margin-bottom: 15px;
  }

  /* ==================== 垃圾样式开始 ==================== */
  
  .useless-class-1 {
    color: #ff0000;
    background-color: #00ff00;
    padding: 10px 20px;
    margin: 5px 10px;
    border: 1px solid #0000ff;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .useless-class-2 {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: auto;
    min-height: 50px;
    max-height: 500px;
  }
  
  .garbage-container {
    position: relative;
    overflow: hidden;
    z-index: 999;
    opacity: 0.8;
    transform: translateX(0) translateY(0) scale(1);
    transition: all 0.3s ease-in-out;
  }
  
  .dummy-wrapper {
    font-size: 14px;
    font-weight: bold;
    line-height: 1.5;
    letter-spacing: 0.5px;
    text-align: center;
    text-decoration: none;
    text-transform: uppercase;
  }
  
  .random-element {
    background: linear-gradient(to right, #ff00ff, #00ffff);
    border: 2px dashed #ff6600;
    padding: 20px;
    margin: 10px;
    border-radius: 10px;
  }
  
  .useless-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 15px;
    padding: 10px;
  }
  
  .fake-button {
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    outline: none;
    background-color: #3498db;
    color: white;
    padding: 10px 25px;
    border-radius: 8px;
  }
  
  .fake-button:hover {
    background-color: #2980b9;
    transform: scale(1.05);
  }
  
  .fake-button:active {
    transform: scale(0.95);
  }
  
  .nonsense-card {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    padding: 20px;
    background: white;
    transition: box-shadow 0.3s ease;
  }
  
  .nonsense-card:hover {
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
  }
  
  .dummy-header {
    font-size: 24px;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 20px;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  }
  
  .dummy-footer {
    font-size: 12px;
    color: #7f8c8d;
    text-align: center;
    padding: 10px 0;
    border-top: 1px solid #ecf0f1;
  }
  
  .useless-animation {
    animation: useless-spin 2s linear infinite;
  }
  
  @keyframes useless-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .garbage-flex {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 15px;
  }
  
  .trash-item {
    flex: 1 1 calc(33.333% - 10px);
    min-width: 100px;
    padding: 10px;
    background: #f8f9fa;
    border: 1px solid #dee2e6;
  }
  
  .worthless-badge {
    display: inline-block;
    padding: 5px 10px;
    background-color: #e74c3c;
    color: white;
    border-radius: 20px;
    font-size: 12px;
  }
  
  .pointless-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    display: none;
  }
  
  .meaningless-modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }
  
  .useless-input {
    width: 100%;
    padding: 10px 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 14px;
    outline: none;
  }
  
  .useless-input:focus {
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }
  
  .junk-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .junk-table th,
  .junk-table td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  .junk-table th {
    background-color: #f2f2f2;
    font-weight: bold;
  }
  
  .waste-sidebar {
    width: 250px;
    height: 100vh;
    background-color: #34495e;
    color: white;
    padding: 20px;
    position: fixed;
    left: -250px;
    transition: left 0.3s ease;
  }
  
  .waste-sidebar.active {
    left: 0;
  }
  
  /* ==================== 垃圾样式结束 ==================== */
</style>
