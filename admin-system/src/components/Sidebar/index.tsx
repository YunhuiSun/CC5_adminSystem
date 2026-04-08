import { useState, useEffect } from 'react'
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  SafetyOutlined,
  SettingOutlined,
  MenuOutlined,
  FileTextOutlined,
  EditOutlined,
  LoginOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Menu } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import { getMenuList } from '@/api/menu'
import { useThemeStore } from '@/store/themeStyle'
import type { Menu as MenuType } from '@/types'
import styles from './index.module.css'

const iconMap: Record<string, React.ReactNode> = {
  DashboardOutlined: <DashboardOutlined />,
  UserOutlined: <UserOutlined />,
  TeamOutlined: <TeamOutlined />,
  SafetyOutlined: <SafetyOutlined />,
  SettingOutlined: <SettingOutlined />,
  MenuOutlined: <MenuOutlined />,
  FileTextOutlined: <FileTextOutlined />,
  EditOutlined: <EditOutlined />,
  LoginOutlined: <LoginOutlined />,
}

interface SidebarProps {
  collapsed: boolean
  onCollapse: (collapsed: boolean) => void
}

// 将扁平菜单数据转换为树形结构
const buildMenuTree = (menus: MenuType[]): MenuType[] => {
  // 只保留目录(0)和菜单(1)，过滤掉按钮(2)和字典管理
  const filtered = menus.filter(item => item.type !== 2 && item.name !== '字典管理')

  const menuMap = new Map<number, MenuType>()
  const result: MenuType[] = []

  // 先创建所有菜单项的映射
  filtered.forEach(menu => {
    menuMap.set(menu.id, { ...menu, children: [] })
  })

  // 构建树形结构
  filtered.forEach(menu => {
    const menuItem = menuMap.get(menu.id)!
    if (menu.parentId === 0) {
      // 顶级菜单
      result.push(menuItem)
    } else {
      // 子菜单
      const parent = menuMap.get(menu.parentId)
      if (parent) {
        parent.children = parent.children || []
        parent.children.push(menuItem)
      }
    }
  })

  return result
}

const Sidebar = ({ collapsed, onCollapse }: SidebarProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuData, setMenuData] = useState<MenuType[]>([])
  const { themeStyle } = useThemeStore()

  useEffect(() => {
    getMenuList().then(res => {
      if (Array.isArray(res) && res.length > 0) {
        const treeData = buildMenuTree(res)
        setMenuData(treeData)
      }
    })
  }, [])

  const handleClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key)
  }

  const renderMenuItems = (items: MenuType[]): MenuProps['items'] => {
    if (!Array.isArray(items)) return []
    // 只显示目录(0)和菜单(1)，过滤掉按钮(2)
    return items.filter(item => item.type !== 2).map(item => ({
      key: item.path,
      icon: iconMap[item.icon],
      label: item.name,
      children: item.children && item.children.length > 0
        ? renderMenuItems(item.children)
        : undefined,
    }))
  }

  const getMenuTheme = () => {
    switch (themeStyle) {
      case 'tech':
        return 'dark'
      case 'default':
        return 'dark'
      case 'classic':
        return 'light'
      case 'modern':
        return 'light'
      case 'obsidian':
        return 'dark'
      default:
        return 'dark'
    }
  }

  return (
    <div className={`${styles.sidebar} ${styles[themeStyle]}`}>
      <div className={styles.logo}>
        {collapsed ? 'Admin' : '后台管理系统'}
      </div>
      <Menu
        mode={collapsed ? 'vertical' : 'inline'}
        theme={getMenuTheme()}
        selectedKeys={[location.pathname]}
        defaultOpenKeys={collapsed ? undefined : []}
        inlineCollapsed={collapsed}
        items={renderMenuItems(menuData)}
        onClick={handleClick}
        className={styles.menu}
      />
    </div>
  )
}

export default Sidebar
