import { Navigate, useRoutes } from 'react-router-dom'
import { useUserStore } from '@/store/user'
import AppLayout from '@/components/Layout'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import User from '@/pages/User'
import Role from '@/pages/Role'
import Menu from '@/pages/Menu'
import OperationLog from '@/pages/Log/OperationLog'
import LoginLog from '@/pages/Log/LoginLog'
import Profile from '@/pages/Profile'

// 路由守卫组件
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useUserStore()
  return token ? children : <Navigate to="/login" replace />
}

const Router = () => {
  const routes = useRoutes([
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/',
      element: (
        <PrivateRoute>
          <AppLayout />
        </PrivateRoute>
      ),
      children: [
        {
          index: true,
          element: <Navigate to="/dashboard" replace />,
        },
        {
          path: 'dashboard',
          element: <Dashboard />,
        },
        {
          path: 'user/list',
          element: <User />,
        },
        {
          path: 'user/role',
          element: <Role />,
        },
        {
          path: 'system/menu',
          element: <Menu />,
        },
        {
          path: 'log/operation',
          element: <OperationLog />,
        },
        {
          path: 'log/login',
          element: <LoginLog />,
        },
        {
          path: 'profile',
          element: <Profile />,
        },
      ],
    },
  ])

  return routes
}

export default Router
