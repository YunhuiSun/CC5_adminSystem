import type { LoginParams, LoginResult, User, PageResult, PageParams } from '@/types'
import request from '@/utils/request'

// 登录
export const login = (data: LoginParams): Promise<LoginResult> => {
  return request.post('/auth/login', data)
}

// 获取用户信息
export const getUserInfo = (): Promise<User> => {
  return request.get('/auth/info')
}

// 获取用户列表
export const getUserList = (params: PageParams & { keyword?: string; status?: number }): Promise<PageResult<User>> => {
  return request.get('/user/list', { params }).then((res: any) => ({
    list: res.data?.list || res.list || [],
    total: res.data?.total || res.total || 0,
    pageNum: res.data?.pageNum || res.pageNum || 1,
    pageSize: res.data?.pageSize || res.pageSize || 10,
  }))
}

// 新增用户
export const addUser = (data: Partial<User>): Promise<void> => {
  // 转换字段名：驼峰 -> 下划线
  const apiData = {
    username: data.username,
    password: data.password,
    nickname: data.nickname,
    email: data.email,
    phone: data.phone,
    avatar: data.avatar,
    status: data.status,
    role_id: data.roleId,
  }
  return request.post('/user', apiData)
}

// 修改用户
export const updateUser = (data: Partial<User>): Promise<void> => {
  // 转换字段名：驼峰 -> 下划线
  const apiData = {
    id: data.id,
    username: data.username,
    nickname: data.nickname,
    email: data.email,
    phone: data.phone,
    avatar: data.avatar,
    status: data.status,
    role_id: data.roleId,
  }
  return request.put('/user', apiData)
}

// 删除用户
export const deleteUser = (id: number): Promise<void> => {
  return request.delete(`/user/${id}`)
}

// 批量删除用户
export const batchDeleteUser = (ids: number[]): Promise<void> => {
  return request.delete('/user/batch', { data: { ids } })
}
