import { ElLoading, ElMessage } from "element-plus";

/**
 * @param {string} msg
 */
export function warningMessage(msg) {
  ElMessage({
    message: msg,
    type: 'warning',
    plain: true,
  })
}

/**
 * @param {string} msg
 */
export function createLoading(msg = "请稍后") {
  return ElLoading.service({
    fullscreen: true,
    text: msg,
    background: 'rgba(0, 0, 0, 0.7)',
  })
}
