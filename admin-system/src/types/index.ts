// 用户类型
export interface User {
  id: number
  username: string
  nickname: string
  email: string
  phone: string
  avatar?: string
  status: 0 | 1
  roleId: number
  roleName: string
  createTime: string
}

// 角色类型
export interface Role {
  id: number
  name: string
  code: string
  description: string
  status: 0 | 1
  permissions: string[]
  createTime: string
}

// 菜单类型
export interface Menu {
  id: number
  parentId: number
  name: string
  path: string
  component?: string
  icon?: string
  sort: number
  status: 0 | 1
  type: 0 | 1 | 2 // 0:目录 1:菜单 2:按钮
  permission?: string
  children?: Menu[]
  createTime: string
}

// 登录日志类型
export interface LoginLog {
  id: number
  username: string
  ip: string
  location: string
  browser: string
  os: string
  status: 0 | 1
  message: string
  loginTime: string
}

// 操作日志类型
export interface OperationLog {
  id: number
  username: string
  module: string
  type: string
  description: string
  requestMethod: string
  requestUrl: string
  requestParams: string
  responseData: string
  ip: string
  duration: number
  status: 0 | 1
  errorMsg?: string
  createTime: string
}

// 登录参数
export interface LoginParams {
  username: string
  password: string
  remember?: boolean
}

// 登录结果
export interface LoginResult {
  token: string
  user: User
}

// 分页参数
export interface PageParams {
  pageNum: number
  pageSize: number
}

// 分页结果
export interface PageResult<T> {
  list: T[]
  total: number
  pageNum: number
  pageSize: number
}

// 通用响应
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}
