/**
 * 上传相关 API
 */
import { post } from '../request'

/**
 * 获取文件上传链接
 */
export function uploadFileApi(data) {
  return post('/utils/get_upload_url', data)
}

