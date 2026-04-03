import type { Menu } from '@/types'
import { getMenuList } from '@/api/menu'

// 从后端获取菜单列表
export const fetchMenuList = async (): Promise<Menu[]> => {
  return await getMenuList()
}
