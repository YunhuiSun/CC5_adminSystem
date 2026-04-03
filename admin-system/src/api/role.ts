import type { Role, PageResult, PageParams } from '@/types'
import request from '@/utils/request'

// 获取角色列表
export const getRoleList = (params: PageParams & { keyword?: string }): Promise<PageResult<Role>> => {
  return request.get('/role/list', { params }).then((res: any) => ({
    list: res.data?.list || res.list || [],
    total: res.data?.total || res.total || 0,
    pageNum: res.data?.pageNum || res.pageNum || 1,
    pageSize: res.data?.pageSize || res.pageSize || 10,
  }))
}

// 获取所有角色（不分页）
export const getAllRoles = (): Promise<Role[]> => {
  return request.get('/role/all').then((res: any) => res.data?.list || res.list || [])
}

// 新增角色
export const addRole = (data: Partial<Role>): Promise<void> => {
  return request.post('/role', data)
}

// 修改角色
export const updateRole = (data: Partial<Role>): Promise<void> => {
  return request.put('/role', data)
}

// 删除角色
export const deleteRole = (id: number): Promise<void> => {
  return request.delete(`/role/${id}`)
}

// 分配角色权限
export const assignRolePermissions = (roleId: number, permissions: string[]): Promise<void> => {
  return request.put(`/role/${roleId}/permissions`, { permissions })
}
