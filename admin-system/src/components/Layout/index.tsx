import { useState } from 'react'
import { Layout, ConfigProvider } from 'antd'
import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/Sidebar'
import AppHeader from '@/components/Header'
import { useThemeStore } from '@/store/themeStyle'
import { getThemeConfig } from '@/styles/theme'
import styles from './index.module.css'

const { Sider, Content } = Layout

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false)
  const { themeStyle } = useThemeStore()
  const themeConfig = getThemeConfig(themeStyle)

  return (
    <ConfigProvider theme={themeConfig}>
      <Layout className={`${styles.layout} ${styles[themeStyle]}`}>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={200}
          collapsedWidth={80}
          className={styles.sider}
        >
          <Sidebar collapsed={collapsed} />
        </Sider>
        <Layout
          className={styles.mainLayout}
          style={{
            marginLeft: collapsed ? 80 : 200,
          }}
        >
          <AppHeader collapsed={collapsed} setCollapsed={setCollapsed} />
          <Content className={styles.content}>
            <div className={styles.main}>
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}

export default AppLayout
