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

