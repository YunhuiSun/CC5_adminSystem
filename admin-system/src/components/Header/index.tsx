import { useNavigate } from 'react-router-dom'
import { Layout, Dropdown, Avatar, Badge, Space, theme, Button, Select } from 'antd'
import {
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  DownOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SkinOutlined,
} from '@ant-design/icons'
import { useUserStore } from '@/store/user'
import { useThemeStore, type ThemeStyle } from '@/store/themeStyle'
import styles from './index.module.css'

const { Header } = Layout

interface AppHeaderProps {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

const AppHeader = ({ collapsed, setCollapsed }: AppHeaderProps) => {
  const navigate = useNavigate()
  const { user, logout } = useUserStore()
  const { themeStyle, setThemeStyle } = useThemeStore()
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const items = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ]

  const themeOptions = [
    { value: 'default', label: '默认风格' },
    { value: 'modern', label: '简约风格' },
    { value: 'classic', label: '古典风格' },
    { value: 'tech', label: '科技风格' },
  ]

  const handleThemeChange = (value: ThemeStyle) => {
    setThemeStyle(value)
  }

  const getHeaderBackground = () => {
    if (themeStyle === 'default') {
      return '#001529'
    }
    return colorBgContainer
  }

  return (
    <Header
      style={{ padding: 0, background: getHeaderBackground() }}
      className={`${styles.header} ${styles[themeStyle]}`}
    >
      <div className={styles.left}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className={styles.trigger}
        />
      </div>
      <div className={styles.right}>
        <Space size={12} align="center">
          <span className={styles.themeLabel}><SkinOutlined className={styles.themeIcon} /> 主题</span>
          <Select
            value={themeStyle}
            onChange={handleThemeChange}
            options={themeOptions}
            className={styles.themeSelector}
            popupClassName={styles.themeDropdown}
          />
          <Badge count={5} size="small">
            <BellOutlined className={styles.bellIcon} />
          </Badge>
          <Dropdown menu={{ items }} placement="bottomRight">
            <Space className={styles.user}>
              <Avatar icon={<UserOutlined />} />
              <span>{user?.nickname || user?.username}</span>
              <DownOutlined style={{ fontSize: 12 }} />
            </Space>
          </Dropdown>
        </Space>
      </div>
    </Header>
  )
}

export default AppHeader
