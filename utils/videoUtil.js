/**
 * 下载视频到相册（仅 APP 平台）
 * @param {string} url - 视频URL
 * @param {Function} i18n - 国际化函数
 */
export async function downloadVideo(url, i18n) {
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

