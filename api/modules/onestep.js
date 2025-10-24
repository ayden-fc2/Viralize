/**
 * Onestep 相关 API
 */
import { post } from '../request'

/**
 * 生成场景图片
 */
export function genImageApi(data) {
  return post('/agent/image_gen/submit_task', data)
}

/**
 * 查询场景图片任务
 */
export function getImageApi(data) {
  return post('/agent/image_gen/query_task', data)
}

/**
 * 生成视频
 */
export function genVideoApi(data) {
  return post('/agent/video_gen/submit_task', data)
}

/**
 * 查询视频任务
 */
export function getVideoApi(data) {
  return post('/agent/video_gen/query_task', data)
}

