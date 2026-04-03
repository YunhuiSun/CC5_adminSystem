import type { User, Role, Menu, LoginLog, OperationLog, PageResult, LoginResult } from '@/types'

// Mock 用户数据
const mockUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    nickname: '超级管理员',
    email: 'admin@example.com',
    phone: '13800138000',
    status: 1,
    roleId: 1,
    roleName: '超级管理员',
    createTime: '2024-01-01 00:00:00',
  },
  {
    id: 2,
    username: 'user',
    nickname: '普通用户',
    email: 'user@example.com',
    phone: '13800138001',
    status: 1,
    roleId: 2,
    roleName: '普通用户',
    createTime: '2024-01-02 00:00:00',
  },
]

// Mock 角色数据
const mockRoles: Role[] = [
  {
    id: 1,
    name: '超级管理员',
    code: 'admin',
    description: '拥有所有权限',
    status: 1,
    permissions: ['*'],
    createTime: '2024-01-01 00:00:00',
  },
  {
    id: 2,
    name: '普通用户',
    code: 'user',
    description: '普通用户权限',
    status: 1,
    permissions: ['user:list', 'dashboard:view'],
    createTime: '2024-01-01 00:00:00',
  },
]

// Mock 登录日志
const mockLoginLogs: LoginLog[] = Array.from({ length: 35 }, (_, i) => ({
  id: i + 1,
  username: i % 2 === 0 ? 'admin' : 'user',
  ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
  location: '北京市',
  browser: 'Chrome 120.0',
  os: 'Windows 11',
  status: Math.random() > 0.1 ? 1 : 0,
  message: Math.random() > 0.1 ? '登录成功' : '密码错误',
  loginTime: `2024-01-${String(Math.floor(Math.random() * 30) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
}))

// Mock 操作日志
const mockOperationLogs: OperationLog[] = Array.from({ length: 35 }, (_, i) => ({
  id: i + 1,
  username: i % 2 === 0 ? 'admin' : 'user',
  module: ['用户管理', '角色管理', '菜单管理', '系统管理'][Math.floor(Math.random() * 4)],
  type: ['新增', '修改', '删除', '查询'][Math.floor(Math.random() * 4)],
  description: `执行了${['新增', '修改', '删除', '查询'][Math.floor(Math.random() * 4)]}操作`,
  requestMethod: ['GET', 'POST', 'PUT', 'DELETE'][Math.floor(Math.random() * 4)],
  requestUrl: `/api/${['user', 'role', 'menu', 'system'][Math.floor(Math.random() * 4)]}`,
  requestParams: '{}',
  responseData: '{"code": 200}',
  ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
  duration: Math.floor(Math.random() * 1000),
  status: Math.random() > 0.05 ? 1 : 0,
  createTime: `2024-01-${String(Math.floor(Math.random() * 30) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
}))

// 模拟登录
export const mockLogin = (username: string, password: string): Promise<LoginResult> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === 'admin' && password === '123456') {
        resolve({
          token: 'mock_token_' + Date.now(),
          user: mockUsers[0],
        })
      } else if (username === 'user' && password === '123456') {
        resolve({
          token: 'mock_token_' + Date.now(),
          user: mockUsers[1],
        })
      } else {
        reject(new Error('用户名或密码错误'))
      }
    }, 500)
  })
}

// 模拟获取用户信息
export const mockGetUserInfo = (): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUsers[0])
    }, 300)
  })
}

// 模拟获取用户列表
export const mockGetUserList = (pageNum: number, pageSize: number, keyword?: string): Promise<PageResult<User>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let list = [...mockUsers]
      if (keyword) {
        list = list.filter(u => u.username.includes(keyword) || u.nickname.includes(keyword))
      }
      const start = (pageNum - 1) * pageSize
      const end = start + pageSize
      resolve({
        list: list.slice(start, end),
        total: list.length,
        pageNum,
        pageSize,
      })
    }, 300)
  })
}

// 模拟获取角色列表
export const mockGetRoleList = (pageNum: number, pageSize: number): Promise<PageResult<Role>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (pageNum - 1) * pageSize
      const end = start + pageSize
      resolve({
        list: mockRoles.slice(start, end),
        total: mockRoles.length,
        pageNum,
        pageSize,
      })
    }, 300)
  })
}

// 模拟获取所有角色
export const mockGetAllRoles = (): Promise<Role[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockRoles)
    }, 300)
  })
}

// 模拟获取菜单列表
export const mockGetMenuList = (): Promise<Menu[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([])
    }, 300)
  })
}

// 模拟获取登录日志
export const mockGetLoginLogList = (pageNum: number, pageSize: number): Promise<PageResult<LoginLog>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (pageNum - 1) * pageSize
      const end = start + pageSize
      resolve({
        list: mockLoginLogs.slice(start, end),
        total: mockLoginLogs.length,
        pageNum,
        pageSize,
      })
    }, 300)
  })
}

// 模拟获取操作日志
export const mockGetOperationLogList = (pageNum: number, pageSize: number): Promise<PageResult<OperationLog>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (pageNum - 1) * pageSize
      const end = start + pageSize
      resolve({
        list: mockOperationLogs.slice(start, end),
        total: mockOperationLogs.length,
        pageNum,
        pageSize,
      })
    }, 300)
  })
}
