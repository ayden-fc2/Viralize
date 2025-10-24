<template>
  <view class="create-tab">
    <!-- 顶部装饰 -->
    <view class="top-decoration">
      <view class="decoration-circle circle-1"></view>
      <view class="decoration-circle circle-2"></view>
    </view>
    
    <scroll-view 
      scroll-y 
      class="content-wrapper"
      :show-scrollbar="false"
    >
      <!-- 标题区域 -->
      <view class="header-section">
        <text class="app-name">Viralize</text>
        <text class="subtitle-text">{{ $t('create.subtitle') }}</text>
      </view>
      
      <!-- 上传区域 -->
      <view class="upload-section">
        <!-- 主上传区 -->
        <view class="main-upload-area" @click="handleChooseImage">
          <view class="upload-icon-wrapper">
            <view class="icon-bg">
              <u-icon name="plus" size="56" color="#667eea"></u-icon>
            </view>
          </view>
          <view class="upload-text-group">
            <text class="upload-title">{{ $t('create.uploadTitle') }}</text>
            <text class="upload-desc">{{ $t('create.uploadDesc') }}</text>
          </view>
        </view>
        
        <!-- 快捷操作 -->
        <view class="quick-actions">
          <view class="action-item" @click="handleChooseImage">
            <view class="action-icon">
              <u-icon name="photo" size="24" color="#667eea"></u-icon>
            </view>
            <text class="action-text">{{ $t('create.gallery') }}</text>
          </view>
          
          <view class="action-divider"></view>
          
          <view class="action-item" @click="handleTakePhoto">
            <view class="action-icon">
              <u-icon name="camera" size="24" color="#667eea"></u-icon>
            </view>
            <text class="action-text">{{ $t('create.camera') }}</text>
          </view>
        </view>
        
        <!-- 格式提示 -->
        <view class="format-tips">
          <view class="tip-item">
            <u-icon name="checkmark-circle" size="16" color="#52c41a"></u-icon>
            <text class="tip-text">{{ $t('create.tip1') }}</text>
          </view>
          <view class="tip-item">
            <u-icon name="checkmark-circle" size="16" color="#52c41a"></u-icon>
            <text class="tip-text">{{ $t('create.tip2') }}</text>
          </view>
        </view>
      </view>
      
      <!-- 项目模块 -->
      <view class="projects-module">
        <!-- 标题和 Switch -->
        <view class="projects-header">
          <text class="projects-title">{{ $t('projects.title') }}</text>
          
          <view class="custom-switch">
            <view 
              class="switch-item"
              :class="{ active: currentTab === 'demo' }"
              @click="switchTab('demo')"
            >
              <text class="switch-text">{{ $t('projects.demo') }}</text>
            </view>
            <view 
              class="switch-item"
              :class="{ active: currentTab === 'mine' }"
              @click="switchTab('mine')"
            >
              <text class="switch-text">{{ $t('projects.mine') }}</text>
            </view>
            <view 
              class="switch-indicator"
              :style="{ transform: currentTab === 'mine' ? 'translateX(100%)' : 'translateX(0)' }"
            ></view>
          </view>
        </view>
        
        <!-- 项目列表 -->
        <scroll-view 
          scroll-x 
          class="projects-scroll"
          :show-scrollbar="false"
        >
          <view class="projects-list">
            <view 
              v-for="project in displayProjects" 
              :key="project.id"
              class="project-item"
              @click="openProject(project.id)"
            >
              <view class="project-cover">
                <image 
                  v-if="project.scene_image_url"
                  :src="project.scene_image_url" 
                  mode="aspectFill"
                  class="cover-img"
                ></image>
                <view v-else class="cover-placeholder">
                  <u-icon name="photo" size="32" color="rgba(102, 126, 234, 0.3)"></u-icon>
                </view>
                
                <!-- 日期蒙版 -->
                <view class="date-mask">
                  <text class="date-text">{{ project.date }}</text>
                </view>
              </view>
            </view>
            
            <!-- 空状态 -->
            <view v-if="displayProjects.length === 0" class="empty-projects">
              <u-icon name="folder" size="48" color="rgba(102, 126, 234, 0.3)"></u-icon>
              <text class="empty-text">{{ $t('projects.empty') }}</text>
            </view>
          </view>
        </scroll-view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { uploadFileApi } from '@/api/modules/upload'

export default {
  name: 'CreateTab',
  data() {
    return {
      uploading: false,
      currentTab: 'demo'  // 默认选中 demo
    }
  },
  computed: {
    ...mapGetters('projects', ['allProjects', 'demoProjects', 'projectCount']),
    
    // 显示的项目列表
    displayProjects() {
      if (this.currentTab === 'demo') {
        return this.demoProjects
      } else {
        // 如果没有我的项目，返回空数组
        return this.allProjects
      }
    }
  },
  mounted() {
    // 如果有我的项目，默认选中我的
    if (this.projectCount > 0) {
      this.currentTab = 'mine'
    }
  },
  methods: {
    /**
     * 切换 Tab
     */
    switchTab(tab) {
      this.currentTab = tab
    },
    
    /**
     * 打开项目
     */
    openProject(projectId) {
      console.log('📂 打开项目:', projectId)
      
      // 跳转到 IdeaParts 页面并传递项目 ID
      uni.navigateTo({
        url: `/pages/IdeaParts/IdeaParts?projectId=${projectId}`
      })
    },
    
    /**
     * 选择图片
     */
    handleChooseImage() {
      if (this.uploading) {
        uni.showToast({
          title: this.$t('create.uploading'),
          icon: 'none'
        })
        return
      }
      
      uni.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album'],
        success: (res) => {
          const tempFilePath = res.tempFilePaths[0]
          this.uploadImage(tempFilePath)
        },
        fail: (error) => {
          console.error('选择图片失败:', error)
        }
      })
    },
    
    /**
     * 拍照
     */
    handleTakePhoto() {
      if (this.uploading) {
        uni.showToast({
          title: this.$t('create.uploading'),
          icon: 'none'
        })
        return
      }
      
      uni.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['camera'],
        success: (res) => {
          const tempFilePath = res.tempFilePaths[0]
          this.uploadImage(tempFilePath)
        },
        fail: (error) => {
          console.error('拍照失败:', error)
        }
      })
    },
    
    /**
     * 上传图片
     */
    async uploadImage(filePath) {
      try {
        this.uploading = true
        
        uni.showLoading({
          title: this.$t('create.uploading'),
          mask: true
        })
        
        console.log('📁 准备上传图片:', filePath)
        
        // 生成唯一文件名
        const timestamp = Date.now()
        const randomStr = Math.random().toString(36).substr(2, 9)
        const fileName = `viralize/${timestamp}_${randomStr}.jpg`
        
        // 获取上传链接
        const uploadUrlResponse = await uploadFileApi({
          target: fileName
        })
        
        console.log('✅ 获取上传链接成功')
        
        // 上传文件
        await this.uploadToCloud(filePath, uploadUrlResponse.data.upload_url)
        
        console.log('✅ 上传成功:', uploadUrlResponse.data.file_url)
        
        uni.hideLoading()
        
        // 参考老项目逻辑：上传成功后跳转到 IdeaParts 页面
        uni.navigateTo({
          url: '/pages/IdeaParts/IdeaParts?imageUrl=' + encodeURIComponent(uploadUrlResponse.data.file_url)
        })
        
      } catch (error) {
        console.error('❌ 上传失败:', error)
        uni.showToast({
          title: this.$t('create.uploadFailed'),
          icon: 'none'
        })
      } finally {
        this.uploading = false
        uni.hideLoading()
      }
    },
    
    /**
     * 上传到云存储
     */
    uploadToCloud(filePath, uploadUrl) {
      return new Promise((resolve, reject) => {
        // #ifdef APP-PLUS
        // APP 平台使用 plus.io.FileReader
        plus.io.resolveLocalFileSystemURL(filePath, (entry) => {
          entry.file((file) => {
            const fileReader = new plus.io.FileReader()
            
            fileReader.onloadend = (evt) => {
              const result = evt.target.result
              let fileData
              
              // 处理 DataURL 格式
              if (typeof result === 'string' && result.startsWith('data:')) {
                const base64Data = result.split(',')[1]
                const binaryString = atob(base64Data)
                const bytes = new Uint8Array(binaryString.length)
                for (let i = 0; i < binaryString.length; i++) {
                  bytes[i] = binaryString.charCodeAt(i)
                }
                fileData = bytes.buffer
              } else {
                fileData = result
              }
              
              // 上传
              uni.request({
                url: uploadUrl,
                method: 'PUT',
                data: fileData,
                header: {
                  'Content-Type': 'image/jpeg'
                },
                success: (res) => {
                  if (res.statusCode === 200 || res.statusCode === 204) {
                    resolve(res)
                  } else {
                    reject(new Error(`上传失败: ${res.statusCode}`))
                  }
                },
                fail: (error) => {
                  reject(error)
                }
              })
              
              fileReader.abort()
            }
            
            fileReader.onerror = (error) => {
              reject(error)
            }
            
            fileReader.readAsDataURL(file)
          }, reject)
        }, reject)
        // #endif
        
        // #ifdef H5
        // H5 平台使用 FileReader + uni.request
        // filePath 在 Web 中是 blob URL，需要通过 input 的 files 获取 File 对象
        // 但因为 uni.chooseImage 在 Web 中返回的是临时路径，我们需要重新处理
        
        // 方案：创建一个隐藏的 input，让用户选择文件
        // 但这里我们已经有了 filePath (blob URL)，需要转换成 File 对象
        
        // 从 blob URL 获取文件
        fetch(filePath)
          .then(res => res.blob())
          .then(blob => {
            const reader = new FileReader()
            
            reader.onload = (e) => {
              const fileData = e.target.result
              
              console.log('📄 Web: 文件读取完成，开始上传...')
              
              uni.request({
                url: uploadUrl,
                method: 'PUT',
                data: fileData,
                header: {
                  'Content-Type': blob.type || 'image/jpeg'
                },
                success: (res) => {
                  console.log('✅ Web: uni.request上传响应:', res)
                  if (res.statusCode === 200 || res.statusCode === 204) {
                    console.log('✅ Web: 文件上传成功')
                    resolve(res)
                  } else {
                    console.error('❌ Web: 上传失败，状态码:', res.statusCode)
                    reject(new Error(`上传失败: ${res.statusCode}`))
                  }
                },
                fail: (error) => {
                  console.error('❌ Web: uni.request上传失败:', error)
                  reject(new Error(`上传请求失败: ${error.errMsg || '未知错误'}`))
                }
              })
            }
            
            reader.onerror = (error) => {
              console.error('❌ Web: 文件读取失败:', error)
              reject(new Error('文件读取失败'))
            }
            
            reader.readAsArrayBuffer(blob)
          })
          .catch(error => {
            console.error('❌ Web: 获取blob失败:', error)
            reject(new Error('获取文件失败'))
          })
        // #endif
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.create-tab {
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

.content-wrapper {
  position: relative;
  z-index: 1;
  height: 100%;
  width: 100%;
  padding: 60rpx 40rpx 40rpx;
  box-sizing: border-box;
}

.header-section {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-bottom: 80rpx;
  
  .app-name {
    font-size: 56rpx;
    font-weight: 800;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: 2rpx;
  }
  
  .subtitle-text {
    font-size: 28rpx;
    color: $uni-text-color-grey;
    line-height: 40rpx;
  }
}

.upload-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.main-upload-area {
  background: $uni-bg-color;
  border-radius: 32rpx;
  padding: 80rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32rpx;
  box-shadow: 0 8rpx 32rpx rgba(102, 126, 234, 0.08);
  border: 2rpx dashed rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.98);
    box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.12);
  }
}

.upload-icon-wrapper {
  .icon-bg {
    width: 160rpx;
    height: 160rpx;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: -4rpx;
      left: -4rpx;
      right: -4rpx;
      bottom: -4rpx;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea, #764ba2);
      opacity: 0.2;
      z-index: -1;
    }
  }
}

.upload-text-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  
  .upload-title {
    font-size: 32rpx;
    font-weight: 600;
    color: $uni-text-color;
  }
  
  .upload-desc {
    font-size: 26rpx;
    color: $uni-text-color-grey;
    text-align: center;
    line-height: 36rpx;
  }
}

.quick-actions {
  background: $uni-bg-color;
  border-radius: 24rpx;
  padding: 24rpx 32rpx;
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
  
  .action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16rpx;
    flex: 1;
    padding: 24rpx;
    border-radius: 16rpx;
    transition: all 0.3s ease;
    
    &:active {
      background: $uni-bg-color-hover;
      transform: scale(0.95);
    }
    
    .action-icon {
      width: 88rpx;
      height: 88rpx;
      background: rgba(102, 126, 234, 0.08);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .action-text {
      font-size: 26rpx;
      color: $uni-text-color;
      font-weight: 500;
    }
  }
  
  .action-divider {
    width: 2rpx;
    height: 80rpx;
    background: $uni-border-color;
  }
}

.format-tips {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  padding: 24rpx 32rpx;
  background: rgba(82, 196, 26, 0.05);
  border-radius: 16rpx;
  
  .tip-item {
    display: flex;
    align-items: center;
    gap: 12rpx;
    
    .tip-text {
      font-size: 24rpx;
      color: $uni-text-color-grey;
      line-height: 32rpx;
    }
  }
}

// 项目模块
.projects-module {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  margin-top: 48rpx;
}

.projects-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
}

.projects-title {
  font-size: 32rpx;
  font-weight: 600;
  color: $uni-text-color;
  flex-shrink: 0;
}

.custom-switch {
  position: relative;
  display: flex;
  background: rgba(102, 126, 234, 0.08);
  border-radius: 20rpx;  // 增强圆角：12rpx → 20rpx
  padding: 6rpx;  // 稍微增加 padding
  flex-shrink: 0;
  width: 260rpx;  // 固定宽度
  
  .switch-item {
    position: relative;
    z-index: 2;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16rpx 0;
    border-radius: 16rpx;  // 增强圆角：10rpx → 16rpx
    transition: all 0.3s ease;
    cursor: pointer;
    
    .switch-text {
      font-size: 26rpx;
      font-weight: 500;
      color: $uni-text-color-grey;
      transition: all 0.3s ease;
    }
    
    &.active .switch-text {
      color: #ffffff;
      font-weight: 600;
    }
  }
  
  .switch-indicator {
    position: absolute;
    z-index: 1;
    top: 6rpx;  // 对应 padding
    left: 6rpx;
    width: calc(50% - 6rpx);  // 对应 padding
    height: calc(100% - 12rpx);  // 对应 padding
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16rpx;  // 增强圆角：10rpx → 16rpx
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);
  }
}

.projects-scroll {
  width: 100%;
  white-space: nowrap;
}

.projects-list {
  display: inline-flex;
  gap: 24rpx;
  padding: 8rpx 0;
}

.project-item {
  display: inline-block;
  width: 280rpx;
  flex-shrink: 0;
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.95);
  }
}

.project-cover {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;  // 改为 16:9 比例
  border-radius: 20rpx;
  overflow: hidden;
  background: rgba(102, 126, 234, 0.05);
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.cover-img {
  width: 100%;
  height: 100%;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.date-mask {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16rpx 20rpx;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  backdrop-filter: blur(4rpx);
  
  .date-text {
    font-size: 22rpx;
    color: #ffffff;
    font-weight: 500;
    text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.3);
  }
}

.empty-projects {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  width: 280rpx;
  aspect-ratio: 16 / 9;  // 改为 16:9 比例
  background: rgba(102, 126, 234, 0.05);
  border-radius: 20rpx;
  border: 2rpx dashed rgba(102, 126, 234, 0.2);
  
  .empty-text {
    font-size: 24rpx;
    color: $uni-text-color-placeholder;
  }
}
</style>

