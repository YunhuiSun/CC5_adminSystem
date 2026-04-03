import type { LoginLog, OperationLog, PageResult, PageParams } from '@/types'
import request from '@/utils/request'

// 获取登录日志列表
export const getLoginLogList = (params: PageParams & { username?: string }): Promise<PageResult<LoginLog>> => {
  return request.get('/log/login', { params }).then((res: any) => ({
    list: res.data?.list || res.list || [],
    total: res.data?.total || res.total || 0,
    pageNum: res.data?.pageNum || res.pageNum || 1,
    pageSize: res.data?.pageSize || res.pageSize || 10,
  }))
}

// 获取操作日志列表
export const getOperationLogList = (params: PageParams & { module?: string }): Promise<PageResult<OperationLog>> => {
  return request.get('/log/operation', { params }).then((res: any) => ({
    list: res.data?.list || res.list || [],
    total: res.data?.total || res.total || 0,
    pageNum: res.data?.pageNum || res.pageNum || 1,
    pageSize: res.data?.pageSize || res.pageSize || 10,
  }))
}

// 清空登录日志
export const clearLoginLog = (): Promise<void> => {
  return request.delete('/log/login/clear')
}

// 删除单条登录日志
export const deleteLoginLog = (id: number): Promise<void> => {
  return request.delete(`/log/login/${id}`)
}

// 清空操作日志
export const clearOperationLog = (): Promise<void> => {
  return request.delete('/log/operation/clear')
}

// 删除单条操作日志
export const deleteOperationLog = (id: number): Promise<void> => {
  return request.delete(`/log/operation/${id}`)
}
