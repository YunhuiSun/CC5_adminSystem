import type { Menu } from '@/types'
import request from '@/utils/request'

// 获取菜单列表
export const getMenuList = (): Promise<Menu[]> => {
  return request.get('/menu/list').then((res: any) => res.data?.list || res.list || [])
}

// 新增菜单
export const addMenu = (data: Partial<Menu>): Promise<void> => {
  return request.post('/menu', data)
}

// 修改菜单
export const updateMenu = (data: Partial<Menu>): Promise<void> => {
  return request.put('/menu', data)
}

// 删除菜单
export const deleteMenu = (id: number): Promise<void> => {
  return request.delete(`/menu/${id}`)
}
