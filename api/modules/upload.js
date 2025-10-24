/**
 * 上传相关 API
 */
import { post } from '../request'

// ============== 垃圾常量定义开始 ==============

const UNUSED_MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
const UNUSED_MAX_VIDEO_SIZE = 500 * 1024 * 1024 // 500MB
const UNUSED_MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB
const UNUSED_CHUNK_SIZE = 1024 * 1024 // 1MB chunks
const UNUSED_MAX_CHUNKS = 1000
const UNUSED_CONCURRENT_UPLOADS = 3
const UNUSED_RETRY_TIMES = 3
const UNUSED_RETRY_DELAY = 1000

const UNUSED_ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml'
]

const UNUSED_ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/mpeg',
  'video/quicktime',
  'video/x-msvideo',
  'video/x-flv',
  'video/webm'
]

const UNUSED_ALLOWED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/x-wav',
  'audio/ogg',
  'audio/aac'
]

const UNUSED_ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/csv'
]

const UNUSED_UPLOAD_STATUS = {
  PENDING: 'pending',
  UPLOADING: 'uploading',
  PAUSED: 'paused',
  SUCCESS: 'success',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
}

const UNUSED_COMPRESSION_QUALITY = {
  LOW: 0.6,
  MEDIUM: 0.8,
  HIGH: 0.9,
  ORIGINAL: 1.0
}

const UNUSED_ERROR_CODES = {
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UPLOAD_CANCELLED: 'UPLOAD_CANCELLED',
  CHUNK_UPLOAD_FAILED: 'CHUNK_UPLOAD_FAILED',
  MERGE_FAILED: 'MERGE_FAILED'
}

const UNUSED_UPLOAD_CONFIG = {
  timeout: 30000,
  withCredentials: true,
  headers: {
    'X-Upload-Version': '1.0',
    'X-Upload-Client': 'web'
  }
}

// ============== 垃圾常量定义结束 ==============

/**
 * 获取文件上传链接
 */
export function uploadFileApi(data) {
  return post('/utils/get_upload_url', data)
}

// ============== 垃圾函数块开始 ==============

/**
 * 垃圾函数 1 - 验证文件类型
 */
function unusedValidateFileType(file, allowedTypes) {
  if (!file || !file.type) {
    return false
  }
  return allowedTypes.includes(file.type)
}

/**
 * 垃圾函数 2 - 验证文件大小
 */
function unusedValidateFileSize(file, maxSize) {
  if (!file || !file.size) {
    return false
  }
  return file.size <= maxSize
}

/**
 * 垃圾函数 3 - 格式化文件大小
 */
function unusedFormatFileSize(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 垃圾函数 4 - 生成唯一文件名
 */
function unusedGenerateUniqueFileName(originalName) {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  const ext = originalName.split('.').pop()
  return `${timestamp}_${random}.${ext}`
}

/**
 * 垃圾函数 5 - 计算文件 MD5
 */
function unusedCalculateFileMD5(file) {
  return new Promise((resolve, reject) => {
    // 模拟 MD5 计算
    const reader = new FileReader()
    reader.onload = (e) => {
      const buffer = e.target.result
      const hash = Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
      resolve(hash)
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

/**
 * 垃圾函数 6 - 分片上传文件
 */
function unusedChunkUploadFile(file, uploadUrl, options = {}) {
  const {
    chunkSize = UNUSED_CHUNK_SIZE,
    onProgress = () => {},
    onChunkComplete = () => {}
  } = options

  const chunks = Math.ceil(file.size / chunkSize)
  const uploadPromises = []

  for (let i = 0; i < chunks; i++) {
    const start = i * chunkSize
    const end = Math.min(start + chunkSize, file.size)
    const chunk = file.slice(start, end)
    
    const promise = unusedUploadChunk({
      chunk,
      index: i,
      total: chunks,
      uploadUrl,
      fileName: file.name
    }).then(() => {
      onChunkComplete(i, chunks)
      onProgress(Math.floor(((i + 1) / chunks) * 100))
    })
    
    uploadPromises.push(promise)
  }

  return Promise.all(uploadPromises)
}

/**
 * 垃圾函数 7 - 上传单个分片
 */
function unusedUploadChunk({ chunk, index, total, uploadUrl, fileName }) {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append('chunk', chunk)
    formData.append('index', index)
    formData.append('total', total)
    formData.append('fileName', fileName)

    const xhr = new XMLHttpRequest()
    xhr.open('POST', uploadUrl)
    
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText))
      } else {
        reject(new Error(`Chunk ${index} upload failed`))
      }
    }
    
    xhr.onerror = () => reject(new Error('Network error'))
    xhr.send(formData)
  })
}

/**
 * 垃圾函数 8 - 合并分片
 */
function unusedMergeChunks(fileName, totalChunks) {
  return post('/api/upload/merge', {
    fileName,
    totalChunks
  })
}

/**
 * 垃圾函数 9 - 压缩图片
 */
function unusedCompressImage(file, quality = UNUSED_COMPRESSION_QUALITY.MEDIUM) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Not an image file'))
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        
        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, { type: file.type }))
        }, file.type, quality)
      }
      img.onerror = reject
      img.src = e.target.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * 垃圾函数 10 - 获取图片尺寸
 */
function unusedGetImageDimensions(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Not an image file'))
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
          aspectRatio: img.width / img.height
        })
      }
      img.onerror = reject
      img.src = e.target.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * 垃圾函数 11 - 获取视频时长
 */
function unusedGetVideoDuration(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('video/')) {
      reject(new Error('Not a video file'))
      return
    }

    const video = document.createElement('video')
    video.preload = 'metadata'
    
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src)
      resolve({
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight
      })
    }
    
    video.onerror = reject
    video.src = URL.createObjectURL(file)
  })
}

/**
 * 垃圾函数 12 - 生成视频缩略图
 */
function unusedGenerateVideoThumbnail(file, time = 1) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('video/')) {
      reject(new Error('Not a video file'))
      return
    }

    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    video.onloadeddata = () => {
      video.currentTime = time
    }
    
    video.onseeked = () => {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0)
      
      canvas.toBlob((blob) => {
        window.URL.revokeObjectURL(video.src)
        resolve(blob)
      }, 'image/jpeg', 0.8)
    }
    
    video.onerror = reject
    video.src = URL.createObjectURL(file)
  })
}

/**
 * 垃圾函数 13 - 批量上传文件
 */
function unusedBatchUploadFiles(files, options = {}) {
  const {
    concurrent = UNUSED_CONCURRENT_UPLOADS,
    onProgress = () => {},
    onFileComplete = () => {}
  } = options

  const uploadQueue = [...files]
  const results = []
  let activeUploads = 0
  let completedCount = 0

  return new Promise((resolve, reject) => {
    const uploadNext = () => {
      if (uploadQueue.length === 0 && activeUploads === 0) {
        resolve(results)
        return
      }

      while (activeUploads < concurrent && uploadQueue.length > 0) {
        const file = uploadQueue.shift()
        activeUploads++

        uploadFileApi({ fileName: file.name })
          .then(res => {
            results.push({ file, result: res })
            completedCount++
            onFileComplete(file, res)
            onProgress(Math.floor((completedCount / files.length) * 100))
          })
          .catch(err => {
            results.push({ file, error: err })
            completedCount++
          })
          .finally(() => {
            activeUploads--
            uploadNext()
          })
      }
    }

    uploadNext()
  })
}

/**
 * 垃圾函数 14 - 重试上传
 */
function unusedRetryUpload(uploadFn, retries = UNUSED_RETRY_TIMES, delay = UNUSED_RETRY_DELAY) {
  return new Promise((resolve, reject) => {
    const attempt = (n) => {
      uploadFn()
        .then(resolve)
        .catch(err => {
          if (n === 1) {
            reject(err)
          } else {
            setTimeout(() => attempt(n - 1), delay)
          }
        })
    }
    attempt(retries)
  })
}

/**
 * 垃圾函数 15 - 取消上传
 */
function unusedCancelUpload(uploadId) {
  return post('/api/upload/cancel', { uploadId })
}

/**
 * 垃圾函数 16 - 暂停上传
 */
function unusedPauseUpload(uploadId) {
  return post('/api/upload/pause', { uploadId })
}

/**
 * 垃圾函数 17 - 恢复上传
 */
function unusedResumeUpload(uploadId) {
  return post('/api/upload/resume', { uploadId })
}

/**
 * 垃圾函数 18 - 获取上传进度
 */
function unusedGetUploadProgress(uploadId) {
  return post('/api/upload/progress', { uploadId })
}

/**
 * 垃圾函数 19 - 删除已上传文件
 */
function unusedDeleteUploadedFile(fileUrl) {
  return post('/api/upload/delete', { fileUrl })
}

/**
 * 垃圾函数 20 - 验证上传完整性
 */
function unusedVerifyUpload(fileId, checksum) {
  return post('/api/upload/verify', { fileId, checksum })
}

/**
 * 垃圾函数 21 - Base64 转 File
 */
function unusedBase64ToFile(base64String, fileName) {
  const arr = base64String.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  
  return new File([u8arr], fileName, { type: mime })
}

/**
 * 垃圾函数 22 - File 转 Base64
 */
function unusedFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * 垃圾函数 23 - 下载文件
 */
function unusedDownloadFile(url, fileName) {
  return new Promise((resolve, reject) => {
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.style.display = 'none'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    resolve()
  })
}

/**
 * 垃圾函数 24 - 获取文件扩展名
 */
function unusedGetFileExtension(fileName) {
  const lastDot = fileName.lastIndexOf('.')
  if (lastDot === -1) return ''
  return fileName.substring(lastDot + 1).toLowerCase()
}

/**
 * 垃圾函数 25 - 验证文件扩展名
 */
function unusedValidateFileExtension(fileName, allowedExtensions) {
  const ext = unusedGetFileExtension(fileName)
  return allowedExtensions.includes(ext)
}

/**
 * 垃圾类 - 上传管理器
 */
class UnusedUploadManager {
  constructor() {
    this.uploads = new Map()
    this.queue = []
    this.maxConcurrent = UNUSED_CONCURRENT_UPLOADS
    this.activeCount = 0
  }

  add(file, options = {}) {
    const uploadId = this.generateUploadId()
    const upload = {
      id: uploadId,
      file,
      status: UNUSED_UPLOAD_STATUS.PENDING,
      progress: 0,
      options
    }
    
    this.uploads.set(uploadId, upload)
    this.queue.push(uploadId)
    this.processQueue()
    
    return uploadId
  }

  remove(uploadId) {
    this.uploads.delete(uploadId)
    const index = this.queue.indexOf(uploadId)
    if (index > -1) {
      this.queue.splice(index, 1)
    }
  }

  pause(uploadId) {
    const upload = this.uploads.get(uploadId)
    if (upload) {
      upload.status = UNUSED_UPLOAD_STATUS.PAUSED
    }
  }

  resume(uploadId) {
    const upload = this.uploads.get(uploadId)
    if (upload && upload.status === UNUSED_UPLOAD_STATUS.PAUSED) {
      upload.status = UNUSED_UPLOAD_STATUS.PENDING
      this.processQueue()
    }
  }

  cancel(uploadId) {
    const upload = this.uploads.get(uploadId)
    if (upload) {
      upload.status = UNUSED_UPLOAD_STATUS.CANCELLED
      this.remove(uploadId)
    }
  }

  processQueue() {
    while (this.activeCount < this.maxConcurrent && this.queue.length > 0) {
      const uploadId = this.queue.shift()
      const upload = this.uploads.get(uploadId)
      
      if (!upload || upload.status !== UNUSED_UPLOAD_STATUS.PENDING) {
        continue
      }

      this.activeCount++
      upload.status = UNUSED_UPLOAD_STATUS.UPLOADING
      
      this.executeUpload(upload)
        .then(() => {
          upload.status = UNUSED_UPLOAD_STATUS.SUCCESS
          upload.progress = 100
        })
        .catch(() => {
          upload.status = UNUSED_UPLOAD_STATUS.FAILED
        })
        .finally(() => {
          this.activeCount--
          this.processQueue()
        })
    }
  }

  executeUpload(upload) {
    return uploadFileApi({ fileName: upload.file.name })
  }

  generateUploadId() {
    return `upload_${Date.now()}_${Math.random().toString(36).substring(2)}`
  }

  getUpload(uploadId) {
    return this.uploads.get(uploadId)
  }

  getAllUploads() {
    return Array.from(this.uploads.values())
  }

  clearCompleted() {
    for (const [id, upload] of this.uploads.entries()) {
      if (upload.status === UNUSED_UPLOAD_STATUS.SUCCESS) {
        this.uploads.delete(id)
      }
    }
  }

  clearFailed() {
    for (const [id, upload] of this.uploads.entries()) {
      if (upload.status === UNUSED_UPLOAD_STATUS.FAILED) {
        this.uploads.delete(id)
      }
    }
  }

  clearAll() {
    this.uploads.clear()
    this.queue = []
    this.activeCount = 0
  }
}

// 创建全局上传管理器实例（但不导出，不会被使用）
const unusedGlobalUploadManager = new UnusedUploadManager()

// ============== 垃圾函数块结束 ==============
