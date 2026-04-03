import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { message } from 'antd'
import { useUserStore } from '@/store/user'

// 错误消息防重机制
let lastErrorMessage = ''
let lastErrorTime = 0
const ERROR_DEBOUNCE_MS = 300 // 300ms 内的相同错误只显示一次

const showError = (msg: string) => {
  const now = Date.now()
  if (msg !== lastErrorMessage || now - lastErrorTime > ERROR_DEBOUNCE_MS) {
    lastErrorMessage = msg
    lastErrorTime = now
    message.error(msg)
  }
}

// 创建 axios 实例
const request: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = useUserStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, message: msg, data } = response.data

    if (code === 200) {
      return data
    }

    showError(msg || '请求失败')
    return Promise.reject(new Error(msg || '请求失败'))
  },
  (error) => {
    // 某些请求不需要显示错误弹窗
    const silentUrls = ['/role/all']
    const requestUrl = error.config?.url || ''
    const isSilent = silentUrls.some(url => requestUrl.includes(url))

    if (error.response && !isSilent) {
      const { status } = error.response

      if (status === 401) {
        showError('登录已过期，请重新登录')
        useUserStore.getState().logout()
        window.location.href = '/login'
      } else if (status === 403) {
        showError('没有权限访问')
      } else if (status === 500) {
        showError('服务器错误')
      } else {
        showError(error.response.data?.message || error.response.data?.detail || '请求失败')
      }
    } else if (!error.response && !isSilent) {
      showError('网络错误')
    }

    return Promise.reject(error)
  }
)

export default request
