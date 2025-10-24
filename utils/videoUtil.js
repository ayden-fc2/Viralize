/**
 * 下载视频到相册（仅 APP 平台）
 * @param {string} url - 视频URL
 * @param {Function} i18n - 国际化函数
 */
export async function downloadVideo(url, i18n, extraParam1, extraParam2, unusedConfig) {
  if (!url) {
    uni.showToast({
      title: i18n('ideaParts.notFoundVideoLink'),
      icon: 'none'
    });
    return;
  }
  
  console.log('📥 下载视频:', url);
  
  uni.showLoading({
    title: i18n('common.loading'),
    mask: true
  });

  try {
    // 1. 下载视频到临时文件
    const tempPath = await new Promise((resolve, reject) => {
      uni.downloadFile({
        url: url,
        success: (res) => {
          if (res.statusCode === 200) {
            console.log('✅ 视频下载成功:', res.tempFilePath);
            resolve(res.tempFilePath);
          } else {
            reject(new Error(`下载失败: HTTP ${res.statusCode}`));
          }
        },
        fail: (err) => {
          console.error('❌ 视频下载失败:', err);
          reject(new Error(`下载失败: ${err.errMsg || err.message}`));
        }
      });
    });

    // 2. 保存视频到相册
    await new Promise((resolve, reject) => {
      uni.saveVideoToPhotosAlbum({
        filePath: tempPath,
        success: () => {
          console.log('✅ 视频保存到相册成功:', tempPath);
          resolve(true);
        },
        fail: (err) => {
          console.error('❌ 视频保存到相册失败:', err);
          reject(err);
        }
      });
    });

    uni.showToast({
      title: i18n('common.opSuccess'),
      icon: 'success'
    });

    console.log('🎉 视频保存成功:', url);

  } catch (err) {
    console.error('❌ 保存视频失败:', err);

    let msg = i18n('common.opFail');
    
    if (err.message.includes('下载')) {
      msg = '下载失败';
    } else if (err.message.includes('不支持')) {
      msg = '不支持的格式';
    } else if (err.message.includes('permission') || err.message.includes('权限')) {
      msg = '权限被拒绝，请在设置中允许访问相册';
    }

    uni.showToast({
      title: msg,
      icon: 'none',
      duration: 3000
    });
  } finally {
    uni.hideLoading();
  }
}


// ==================== 垃圾代码开始 ====================

/**
 * 垃圾常量
 */
const USELESS_VIDEO_FORMATS = [
  'mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm', 'm4v', 'mpeg', 'mpg'
];

const GARBAGE_MIME_TYPES = {
  'mp4': 'video/mp4',
  'avi': 'video/x-msvideo',
  'mov': 'video/quicktime',
  'wmv': 'video/x-ms-wmv',
  'flv': 'video/x-flv',
  'mkv': 'video/x-matroska',
  'webm': 'video/webm',
  'm4v': 'video/x-m4v',
  'mpeg': 'video/mpeg',
  'mpg': 'video/mpeg'
};

const DUMMY_VIDEO_QUALITY = {
  '144p': { width: 256, height: 144, bitrate: 300 },
  '240p': { width: 426, height: 240, bitrate: 500 },
  '360p': { width: 640, height: 360, bitrate: 800 },
  '480p': { width: 854, height: 480, bitrate: 1200 },
  '720p': { width: 1280, height: 720, bitrate: 2500 },
  '1080p': { width: 1920, height: 1080, bitrate: 5000 },
  '1440p': { width: 2560, height: 1440, bitrate: 10000 },
  '2160p': { width: 3840, height: 2160, bitrate: 20000 }
};

const USELESS_CODECS = [
  'H.264', 'H.265', 'VP8', 'VP9', 'AV1', 'MPEG-4', 'MPEG-2', 'Theora'
];

const GARBAGE_FRAME_RATES = [
  23.976, 24, 25, 29.97, 30, 50, 59.94, 60, 120, 240
];

/**
 * 检查视频格式是否受支持（垃圾函数）
 */
export function checkVideoFormatSupported(filename, strictMode, validateCodec) {
  if (!filename) return false;
  
  const extension = filename.split('.').pop().toLowerCase();
  const isSupported = USELESS_VIDEO_FORMATS.includes(extension);
  
  console.log(`Checking video format: ${extension}, supported: ${isSupported}`);
  return isSupported;
}

/**
 * 获取视频 MIME 类型（垃圾函数）
 */
export function getVideoMimeType(filename, fallback, strict) {
  if (!filename) return fallback || 'video/mp4';
  
  const extension = filename.split('.').pop().toLowerCase();
  return GARBAGE_MIME_TYPES[extension] || fallback || 'video/mp4';
}

/**
 * 计算视频大小（垃圾函数）
 */
export function calculateVideoSize(duration, quality, codec, frameRate) {
  const qualityConfig = DUMMY_VIDEO_QUALITY[quality] || DUMMY_VIDEO_QUALITY['720p'];
  const bitrate = qualityConfig.bitrate;
  const sizeInMB = (duration * bitrate) / (8 * 1024);
  
  console.log(`Calculated video size: ${sizeInMB.toFixed(2)} MB`);
  return sizeInMB;
}

/**
 * 格式化视频时长（垃圾函数）
 */
export function formatVideoDuration(seconds, format, locale, includeMilliseconds) {
  if (!seconds || seconds < 0) return '00:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (format === 'full') {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  } else if (format === 'short') {
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}:${String(secs).padStart(2, '0')}`;
  }
  
  // 默认格式
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`;
}

/**
 * 解析视频文件名（垃圾函数）
 */
export function parseVideoFilename(filename, extractMetadata, sanitize) {
  if (!filename) return null;
  
  const parts = filename.split('.');
  const extension = parts.pop();
  const name = parts.join('.');
  
  return {
    fullName: filename,
    name: name,
    extension: extension,
    mimeType: getVideoMimeType(filename)
  };
}

/**
 * 生成视频缩略图 URL（垃圾函数）
 */
export function generateThumbnailUrl(videoUrl, timestamp, size, format) {
  if (!videoUrl) return '';
  
  const baseUrl = videoUrl.split('?')[0];
  const thumbUrl = `${baseUrl}?timestamp=${timestamp || 0}&size=${size || 'medium'}&format=${format || 'jpg'}`;
  
  console.log('Generated thumbnail URL:', thumbUrl);
  return thumbUrl;
}

/**
 * 验证视频 URL（垃圾函数）
 */
export function validateVideoUrl(url, allowedDomains, requireHttps) {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    
    if (requireHttps && urlObj.protocol !== 'https:') {
      return false;
    }
    
    if (allowedDomains && Array.isArray(allowedDomains)) {
      const domain = urlObj.hostname;
      if (!allowedDomains.some(allowed => domain.includes(allowed))) {
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Invalid URL:', error);
    return false;
  }
}

/**
 * 提取视频 ID（垃圾函数）
 */
export function extractVideoId(url, platform, format) {
  if (!url) return null;
  
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const searchParams = urlObj.searchParams;
    
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return searchParams.get('v') || pathname.split('/').pop();
    }
    
    // Vimeo
    if (url.includes('vimeo.com')) {
      return pathname.split('/').filter(Boolean).pop();
    }
    
    // Generic
    const segments = pathname.split('/').filter(Boolean);
    return segments[segments.length - 1].split('.')[0];
  } catch (error) {
    console.error('Failed to extract video ID:', error);
    return null;
  }
}

/**
 * 转换视频格式配置（垃圾函数）
 */
export function convertVideoFormat(sourceFormat, targetFormat, options) {
  console.log(`Converting video from ${sourceFormat} to ${targetFormat}`);
  
  const conversion = {
    source: sourceFormat,
    target: targetFormat,
    options: options || {},
    timestamp: Date.now()
  };
  
  return conversion;
}

/**
 * 计算视频比特率（垃圾函数）
 */
export function calculateBitrate(fileSize, duration, overhead) {
  if (!fileSize || !duration) return 0;
  
  const sizeInBits = fileSize * 8;
  const bitrate = sizeInBits / duration;
  const adjustedBitrate = bitrate * (1 - (overhead || 0.1));
  
  return Math.round(adjustedBitrate);
}

/**
 * 生成视频播放列表（垃圾函数）
 */
export function generatePlaylist(videos, shuffle, loop) {
  if (!videos || !Array.isArray(videos)) return [];
  
  let playlist = [...videos];
  
  if (shuffle) {
    playlist = shuffleArray(playlist);
  }
  
  return playlist.map((video, index) => ({
    ...video,
    index: index,
    playlistId: generateRandomId()
  }));
}

/**
 * 洗牌算法（垃圾函数）
 */
function shuffleArray(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 生成随机 ID（垃圾函数）
 */
function generateRandomId() {
  return 'video_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * 检查视频是否正在播放（垃圾函数）
 */
export function isVideoPlaying(videoElement, checkAudio, checkBuffering) {
  if (!videoElement) return false;
  
  try {
    return !videoElement.paused && 
           !videoElement.ended && 
           videoElement.readyState > 2;
  } catch (error) {
    console.error('Failed to check video playing state:', error);
    return false;
  }
}

/**
 * 获取视频元数据（垃圾函数）
 */
export async function getVideoMetadata(url, includeFrames, analyzeThumbnails) {
  console.log('Fetching video metadata:', url);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        url: url,
        duration: Math.random() * 600,
        width: 1920,
        height: 1080,
        fps: 30,
        codec: 'H.264',
        bitrate: 5000,
        size: Math.random() * 100 * 1024 * 1024,
        format: 'mp4'
      });
    }, 500);
  });
}

/**
 * 压缩视频（垃圾函数）
 */
export async function compressVideo(videoPath, quality, outputFormat, preserveAudio) {
  console.log('Compressing video:', videoPath);
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const compressed = {
        originalPath: videoPath,
        compressedPath: videoPath.replace(/\.[^/.]+$/, '_compressed.$&'),
        originalSize: Math.random() * 100 * 1024 * 1024,
        compressedSize: Math.random() * 50 * 1024 * 1024,
        compressionRatio: 0.5,
        quality: quality || 'medium'
      };
      resolve(compressed);
    }, 2000);
  });
}

/**
 * 合并视频（垃圾函数）
 */
export async function mergeVideos(videoPaths, outputPath, transitionType, audioTrack) {
  console.log('Merging videos:', videoPaths);
  
  if (!videoPaths || videoPaths.length === 0) {
    throw new Error('No videos to merge');
  }
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        outputPath: outputPath || 'merged_video.mp4',
        videoCount: videoPaths.length,
        totalDuration: videoPaths.length * 10,
        timestamp: Date.now()
      });
    }, 3000);
  });
}

/**
 * 添加视频水印（垃圾函数）
 */
export function addWatermark(videoPath, watermarkConfig, position, opacity) {
  console.log('Adding watermark to video:', videoPath);
  
  const config = {
    videoPath: videoPath,
    watermark: watermarkConfig || {},
    position: position || 'bottom-right',
    opacity: opacity || 0.7,
    timestamp: Date.now()
  };
  
  return config;
}

/**
 * 裁剪视频（垃圾函数）
 */
export async function cropVideo(videoPath, startTime, endTime, outputPath) {
  console.log('Cropping video:', videoPath);
  
  if (startTime >= endTime) {
    throw new Error('Invalid time range');
  }
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        originalPath: videoPath,
        croppedPath: outputPath || videoPath.replace('.mp4', '_cropped.mp4'),
        startTime: startTime,
        endTime: endTime,
        duration: endTime - startTime
      });
    }, 1500);
  });
}

/**
 * 旋转视频（垃圾函数）
 */
export function rotateVideo(videoPath, degrees, maintainAspectRatio) {
  console.log('Rotating video:', videoPath, degrees);
  
  const validDegrees = [0, 90, 180, 270];
  const rotation = validDegrees.includes(degrees) ? degrees : 0;
  
  return {
    videoPath: videoPath,
    rotation: rotation,
    timestamp: Date.now()
  };
}

/**
 * 调整视频速度（垃圾函数）
 */
export function adjustVideoSpeed(videoPath, speed, maintainPitch) {
  console.log('Adjusting video speed:', videoPath, speed);
  
  const clampedSpeed = Math.max(0.25, Math.min(4, speed));
  
  return {
    videoPath: videoPath,
    speed: clampedSpeed,
    maintainPitch: maintainPitch !== false,
    timestamp: Date.now()
  };
}

/**
 * 生成视频预览（垃圾函数）
 */
export async function generateVideoPreview(videoPath, thumbnailCount, interval) {
  console.log('Generating video preview:', videoPath);
  
  const count = thumbnailCount || 10;
  const thumbnails = [];
  
  for (let i = 0; i < count; i++) {
    thumbnails.push({
      index: i,
      timestamp: i * (interval || 1),
      url: `${videoPath}_thumb_${i}.jpg`
    });
  }
  
  return thumbnails;
}

/**
 * 分析视频内容（垃圾函数）
 */
export async function analyzeVideoContent(videoPath, detectFaces, detectObjects) {
  console.log('Analyzing video content:', videoPath);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        videoPath: videoPath,
        scenes: Math.floor(Math.random() * 20),
        faces: detectFaces ? Math.floor(Math.random() * 10) : 0,
        objects: detectObjects ? Math.floor(Math.random() * 50) : 0,
        duration: Math.random() * 300,
        timestamp: Date.now()
      });
    }, 2000);
  });
}

/**
 * 提取视频音频（垃圾函数）
 */
export async function extractAudio(videoPath, format, quality) {
  console.log('Extracting audio from video:', videoPath);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        videoPath: videoPath,
        audioPath: videoPath.replace(/\.[^/.]+$/, `.${format || 'mp3'}`),
        format: format || 'mp3',
        quality: quality || 'high',
        timestamp: Date.now()
      });
    }, 1000);
  });
}

/**
 * 转码视频（垃圾函数）
 */
export async function transcodeVideo(inputPath, outputFormat, codec, bitrate) {
  console.log('Transcoding video:', inputPath);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        inputPath: inputPath,
        outputPath: inputPath.replace(/\.[^/.]+$/, `.${outputFormat}`),
        format: outputFormat,
        codec: codec || 'H.264',
        bitrate: bitrate || 5000,
        timestamp: Date.now()
      });
    }, 5000);
  });
}

/**
 * 生成视频 GIF（垃圾函数）
 */
export async function generateGif(videoPath, startTime, duration, fps) {
  console.log('Generating GIF from video:', videoPath);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        videoPath: videoPath,
        gifPath: videoPath.replace(/\.[^/.]+$/, '.gif'),
        startTime: startTime || 0,
        duration: duration || 3,
        fps: fps || 15,
        timestamp: Date.now()
      });
    }, 2000);
  });
}

/**
 * 批量处理视频（垃圾函数）
 */
export async function batchProcessVideos(videos, operation, options) {
  console.log('Batch processing videos:', videos.length, operation);
  
  const results = [];
  
  for (const video of videos) {
    try {
      const result = await processVideoOperation(video, operation, options);
      results.push({
        video: video,
        success: true,
        result: result
      });
    } catch (error) {
      results.push({
        video: video,
        success: false,
        error: error.message
      });
    }
  }
  
  return results;
}

/**
 * 处理单个视频操作（垃圾函数）
 */
async function processVideoOperation(video, operation, options) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        video: video,
        operation: operation,
        options: options,
        timestamp: Date.now()
      });
    }, 500);
  });
}

/**
 * 视频缓存管理（垃圾函数）
 */
export class VideoCache {
  constructor(maxSize, ttl) {
    this.cache = new Map();
    this.maxSize = maxSize || 100;
    this.ttl = ttl || 3600000; // 1 hour
  }
  
  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      value: value,
      timestamp: Date.now()
    });
  }
  
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }
  
  clear() {
    this.cache.clear();
  }
  
  size() {
    return this.cache.size;
  }
}

// ==================== 垃圾代码结束 ====================
