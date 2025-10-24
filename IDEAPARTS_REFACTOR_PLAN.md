# IdeaParts 步骤条重构任务书

## 📋 目标
在 IdeaParts 页面中添加步骤条，将视频生成流程分为三个明确的步骤，用户只能按顺序完成，可以回退修改。

## ✅ 已完成部分

### 1. 数据层
- ✅ 添加 `currentStepIndex` (当前步骤: 0/1/2)
- ✅ 添加 `maxUnlockedStep` (最大已解锁步骤)
- ✅ 添加 `sceneDetail` (场景图片任务详情)

### 2. 方法层
- ✅ `goToStep(stepIndex)` - 步骤跳转控制
- ✅ `completeStep1()` - 完成步骤1
- ✅ `completeStep2()` - 完成步骤2
- ✅ `createScene(inputImage)` - 生成场景图片
- ✅ `checkSceneTask()` - 轮询场景图片生成状态

### 3. 国际化
- ✅ `ideaParts.step1`: "生成分镜图"
- ✅ `ideaParts.step2`: "编辑内容"
- ✅ `ideaParts.step3`: "生成视频"
- ✅ `ideaParts.stepLocked`: "请先完成前面的步骤"

### 4. UI 组件
- ✅ 步骤条容器 (`.steps-container`)
- ✅ `u-steps` 组件已添加

## 🔨 待完成任务

### 任务 1: 修改 onLoad 逻辑，初始化步骤状态

**位置**: `async onLoad(options)` 方法

**修改内容**:
```javascript
// 加载已有项目时
if (options.projectId) {
  const project = this.getProjectById(projectId)
  
  // 根据项目状态初始化步骤
  if (project.scene_image_url) {
    // 场景图片已生成，解锁步骤2
    this.maxUnlockedStep = 1
    if (project.video_url) {
      // 视频已生成，解锁步骤3
      this.maxUnlockedStep = 2
      this.currentStepIndex = 2  // 直接跳到步骤3
    } else {
      this.currentStepIndex = 1  // 跳到步骤2编辑
    }
  } else {
    // 还在步骤1
    this.currentStepIndex = 0
    this.maxUnlockedStep = 0
  }
}

// 新上传图片时
else if (options.imageUrl) {
  // 从步骤1开始
  this.currentStepIndex = 0
  this.maxUnlockedStep = 0
}
```

---

### 任务 2: 修改场景图片生成成功后的逻辑

**位置**: `checkSceneTask()` 方法中的 `if (res.status === 'completed')`

**修改内容**:
```javascript
if (res.status === 'completed') {
  this.stopSceneCheck()
  this.loading = false
  this.statusText = ''
  
  this.mediaData.imageUrl = res.output_image
  
  if (this.projectId) {
    await this.updateProjectScene({
      projectId: this.projectId,
      scene_image_url: res.output_image,
      scene_pending_id: '',
      status: PROJECT_STATUS.SCENE_COMPLETED
    })
  }
  
  // 🆕 自动解锁并跳转到步骤2
  if (this.maxUnlockedStep < 1) {
    this.maxUnlockedStep = 1
  }
  this.currentStepIndex = 1  // 自动进入编辑页面
  
  uni.showToast({
    title: this.$t('common.opSuccess'),
    icon: 'success'
  })
}
```

---

### 任务 3: 添加步骤1的模板结构

**位置**: template 中 `<scroll-view>` 内部开始位置

**修改内容**:
```vue
<scroll-view scroll-y class="main-content-area" :show-scrollbar="false">
  
  <!-- 步骤1: 生成分镜图 -->
  <view v-show="currentStepIndex === 0" class="step-content step-1">
    <!-- 媒体预览容器 (原有的代码，保持不变) -->
    <view class="media-preview-container">
      <view class="preview-wrapper">
        <!-- loading 状态 -->
        <view v-if="loading" class="loading-state">
          <!-- ... 原有 loading UI ... -->
        </view>
        
        <!-- 图片展示 -->
        <image v-else-if="mediaData.imageUrl" :src="mediaData.imageUrl" mode="aspectFill" class="media-image"></image>
        
        <!-- 空状态 -->
        <view v-else class="empty-state">
          <u-icon name="photo" size="80" color="#ccc"></u-icon>
          <text class="empty-text">{{ $t('common.loading') }}</text>
        </view>
      </view>
    </view>
    
    <!-- 步骤1操作按钮 (新增) -->
    <view v-if="!loading && mediaData.imageUrl" class="step-actions">
      <view class="action-button primary-button" @click="completeStep1">
        <text class="button-text">{{ $t('ideaParts.step2') }}</text>
        <u-icon name="arrow-right" size="20" color="#fff"></u-icon>
      </view>
    </view>
  </view>
  
  <!-- 继续后面的步骤2和步骤3... -->
</scroll-view>
```

---

### 任务 4: 添加步骤2的模板结构

**位置**: 步骤1之后

**修改内容**:
```vue
<!-- 步骤2: 编辑场景描述与口播文案 -->
<view v-show="currentStepIndex === 1" class="step-content step-2">
  <!-- 小尺寸媒体预览 (新增) -->
  <view class="media-preview-compact">
    <image :src="mediaData.imageUrl" mode="aspectFill" class="media-image-small"></image>
  </view>
  
  <!-- 内容编辑区域 (原有的 content-editor-section，保持不变) -->
  <view class="content-editor-section">
    <!-- 标签页切换器 -->
    <view class="tab-switcher">
      <!-- ... 原有代码 ... -->
    </view>
    
    <!-- 内容输入框 -->
    <view class="input-container">
      <!-- ... 原有代码 ... -->
    </view>
  </view>
  
  <!-- 步骤2操作按钮 (新增) -->
  <view class="step-actions">
    <view class="action-button secondary-button" @click="goToStep(0)">
      <u-icon name="arrow-left" size="20" color="#667eea"></u-icon>
      <text class="button-text">{{ $t('ideaParts.step1') }}</text>
    </view>
    <view class="action-button primary-button" @click="completeStep2">
      <text class="button-text">{{ $t('ideaParts.step3') }}</text>
      <u-icon name="arrow-right" size="20" color="#fff"></u-icon>
    </view>
  </view>
</view>
```

---

### 任务 5: 添加步骤3的模板结构

**位置**: 步骤2之后，原 `action-footer` 之前

**修改内容**:
```vue
<!-- 步骤3: 生成视频 -->
<view v-show="currentStepIndex === 2" class="step-content step-3">
  <!-- 媒体预览 (显示图片或视频) -->
  <view class="media-preview-container">
    <view class="preview-wrapper">
      <!-- loading 状态 -->
      <view v-if="loading" class="loading-state">
        <!-- ... 原有 loading UI ... -->
      </view>
      
      <!-- 图片/视频展示 -->
      <image v-else :src="mediaData.imageUrl" mode="aspectFill" class="media-image"></image>
      
      <!-- 视频控制按钮 (原有的 video-controls，保持不变) -->
      <view v-if="mediaData.videoUrl && !loading" class="video-controls">
        <!-- ... 原有代码 ... -->
      </view>
    </view>
  </view>
  
  <!-- 内容预览 (新增) -->
  <view class="content-preview">
    <view class="preview-item">
      <text class="preview-label">{{ $t('ideaParts.sceneDesc') }}:</text>
      <text class="preview-text">{{ mediaData.description || $t('ideaParts.descPlaceholder') }}</text>
    </view>
    <view class="preview-item">
      <text class="preview-label">{{ $t('ideaParts.voiceScript') }}:</text>
      <text class="preview-text">{{ mediaData.script || $t('ideaParts.scriptPlaceholder') }}</text>
    </view>
  </view>
  
  <!-- 步骤3操作按钮 (新增) -->
  <view class="step-actions">
    <view class="action-button secondary-button" @click="goToStep(1)">
      <u-icon name="arrow-left" size="20" color="#667eea"></u-icon>
      <text class="button-text">{{ $t('ideaParts.step2') }}</text>
    </view>
    <view 
      v-if="!isDemo"
      class="action-button primary-button generate-button" 
      :class="{ 'button-disabled': !canGenerateVideo }"
      @click="onGenerateTap"
    >
      <u-icon name="play-circle" size="24" color="#fff"></u-icon>
      <text class="button-text">{{ getButtonText }}</text>
      <view class="button-glow"></view>
    </view>
  </view>
</view>
```

---

### 任务 6: 删除原有的底部操作区

**位置**: template 末尾的 `action-footer`

**修改内容**:
删除以下代码块:
```vue
<!-- 底部操作区 -->
<view class="action-footer">
  <view 
    class="generate-action-button" 
    :class="{ 'button-disabled': !canGenerateVideo }"
    @click="onGenerateTap"
  >
    <view class="button-content">
      <u-icon name="play-circle" size="24" color="#fff"></u-icon>
      <text class="button-text">{{ getButtonText }}</text>
    </view>
    <view class="button-glow"></view>
  </view>
</view>
```

---

### 任务 7: 添加新的 CSS 样式

**位置**: `<style lang="scss" scoped>` 末尾

**新增样式**:
```scss
// 步骤条容器
.steps-container {
  padding: 24rpx 32rpx;
  background: #ffffff;
  border-bottom: 2rpx solid $uni-border-color;
}

// 步骤内容
.step-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

// 小尺寸媒体预览
.media-preview-compact {
  width: 100%;
  padding: 0 32rpx;
  
  .media-image-small {
    width: 100%;
    height: 400rpx;
    border-radius: 16rpx;
    overflow: hidden;
  }
}

// 内容预览
.content-preview {
  padding: 0 32rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  
  .preview-item {
    display: flex;
    flex-direction: column;
    gap: 12rpx;
    padding: 24rpx;
    background: #f8f9ff;
    border-radius: 12rpx;
  }
  
  .preview-label {
    font-size: 26rpx;
    font-weight: 600;
    color: #667eea;
  }
  
  .preview-text {
    font-size: 28rpx;
    color: #2c3e50;
    line-height: 40rpx;
  }
}

// 步骤操作按钮组
.step-actions {
  display: flex;
  gap: 24rpx;
  padding: 0 32rpx 32rpx;
  
  .action-button {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12rpx;
    padding: 28rpx;
    border-radius: 16rpx;
    font-size: 30rpx;
    font-weight: 600;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    
    &:active {
      transform: scale(0.98);
    }
    
    .button-text {
      font-size: 30rpx;
      font-weight: 600;
    }
  }
  
  .primary-button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #ffffff;
    box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3);
    
    .button-text {
      color: #ffffff;
    }
    
    &.button-disabled {
      opacity: 0.5;
      pointer-events: none;
    }
  }
  
  .secondary-button {
    background: #ffffff;
    border: 2rpx solid #667eea;
    color: #667eea;
    
    .button-text {
      color: #667eea;
    }
  }
  
  .generate-button {
    position: relative;
    
    .button-glow {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%);
      animation: button-shine 3s ease-in-out infinite;
      z-index: 1;
    }
  }
}

// 空状态
.empty-state {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24rpx;
  
  .empty-text {
    font-size: 28rpx;
    color: #999;
  }
}
```

---

## 🎯 执行顺序

1. **任务 1**: 修改 onLoad 初始化逻辑
2. **任务 2**: 修改场景图片生成完成逻辑
3. **任务 3**: 添加步骤1模板
4. **任务 4**: 添加步骤2模板
5. **任务 5**: 添加步骤3模板
6. **任务 6**: 删除原底部操作区
7. **任务 7**: 添加新 CSS 样式

## 📊 预期效果

### 步骤1 - 生成分镜图
- 显示大尺寸图片预览
- Loading 状态显示进度
- 完成后显示"下一步"按钮

### 步骤2 - 编辑内容
- 显示小尺寸图片预览
- 编辑场景描述和口播文案
- 两个按钮："返回上一步" 和 "下一步"

### 步骤3 - 生成视频
- 显示大尺寸图片/视频预览
- 显示内容预览卡片
- 两个按钮："返回上一步" 和 "生成视频"
- 视频生成成功后，按钮变为"重新生成"

## ⚠️ 注意事项

1. **Demo 项目处理**: Demo 项目应该直接跳到步骤3（已有场景图和视频）
2. **步骤锁定**: 未解锁的步骤点击时提示 `ideaParts.stepLocked`
3. **状态同步**: 每个步骤的状态变化要同步到 Vuex
4. **返回处理**: 用户点击返回时要能回到上一步，不丢失数据
5. **Loading 状态**: 生成过程中禁止切换步骤

---

**创建时间**: 2025-01-23  
**版本**: v1.0

