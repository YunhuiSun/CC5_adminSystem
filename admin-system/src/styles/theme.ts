import type { ThemeConfig } from 'antd'
import type { ThemeStyle } from '@/store/themeStyle'

// 默认主题配置 - 原始Ant Design Pro深蓝侧边栏风格
const defaultTheme: ThemeConfig = {
  // 使用Ant Design默认配置，保留原始风格
}

// 现代风主题配置 - 保持Ant Design默认样式
const modernTheme: ThemeConfig = {
  // 使用Ant Design默认配置，不做任何自定义
}

// 古典风主题配置
const classicTheme: ThemeConfig = {
  token: {
    colorPrimary: '#8b4513',
    colorSuccess: '#228b22',
    colorWarning: '#d2691e',
    colorError: '#b22222',
    colorInfo: '#4682b4',
    colorBgBase: '#faf8f3',
    colorBgContainer: '#fffef9',
    colorBgElevated: '#fffef9',
    colorBgLayout: '#f5f0e6',
    colorTextBase: '#3d2914',
    colorText: '#3d2914',
    colorTextSecondary: '#6b4423',
    colorBorder: '#d4c4a8',
    colorSplit: '#e8dcc8',
    borderRadius: 2,
    wireframe: false,
  },
  components: {
    Button: {
      colorPrimary: '#8b4513',
      colorPrimaryHover: '#a0522d',
      colorPrimaryActive: '#654321',
      borderRadius: 2,
    },
    Menu: {
      colorItemBg: 'transparent',
      colorItemBgSelected: 'rgba(139, 69, 19, 0.12)',
      colorItemBgHover: 'rgba(139, 69, 19, 0.06)',
      colorItemText: '#6b4423',
      colorItemTextSelected: '#8b4513',
      colorItemTextHover: '#8b4513',
    },
    Table: {
      colorBgContainer: '#fffef9',
      colorText: '#3d2914',
      colorTextHeading: '#8b4513',
      colorBorder: '#d4c4a8',
      headerBg: '#f5f0e6',
      headerColor: '#8b4513',
    },
    Card: {
      colorBgContainer: '#fffef9',
      colorBorderSecondary: '#d4c4a8',
    },
    Input: {
      colorBgContainer: '#fffef9',
      colorBorder: '#d4c4a8',
      colorText: '#3d2914',
      colorTextPlaceholder: '#a09070',
    },
    Select: {
      colorBgContainer: '#fffef9',
      colorBorder: '#d4c4a8',
      colorText: '#3d2914',
    },
    Modal: {
      colorBgElevated: '#fffef9',
      colorText: '#3d2914',
      colorTextHeading: '#8b4513',
    },
    Pagination: {
      colorBgContainer: '#fffef9',
      colorText: '#6b4423',
      colorPrimary: '#8b4513',
    },
  },
}

// 科技风主题配置
const techTheme: ThemeConfig = {
  token: {
    colorPrimary: '#00d4ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#f5222d',
    colorInfo: '#00d4ff',
    colorBgBase: '#0a1628',
    colorBgContainer: '#0f1d32',
    colorBgElevated: '#162236',
    colorBgLayout: '#0a1628',
    colorTextBase: '#e0f7ff',
    colorText: '#e0f7ff',
    colorTextSecondary: '#8ba3c7',
    colorBorder: '#1e3a5f',
    colorSplit: '#1e3a5f',
    borderRadius: 4,
    wireframe: false,
  },
  components: {
    Button: {
      colorPrimary: '#00d4ff',
      colorPrimaryHover: '#33ddff',
      colorPrimaryActive: '#00a8cc',
      algorithm: true,
    },
    Menu: {
      colorItemBg: 'transparent',
      colorItemBgSelected: 'rgba(0, 212, 255, 0.15)',
      colorItemBgHover: 'rgba(0, 212, 255, 0.08)',
      colorItemText: '#8ba3c7',
      colorItemTextSelected: '#00d4ff',
      colorItemTextHover: '#00d4ff',
    },
    Table: {
      colorBgContainer: '#0f1d32',
      colorText: '#e0f7ff',
      colorTextHeading: '#00d4ff',
      colorBorder: '#1e3a5f',
      headerBg: '#162236',
      headerColor: '#00d4ff',
    },
    Card: {
      colorBgContainer: '#0f1d32',
      colorBorderSecondary: '#1e3a5f',
    },
    Input: {
      colorBgContainer: '#162236',
      colorBorder: '#1e3a5f',
      colorText: '#e0f7ff',
      colorTextPlaceholder: '#5a7090',
    },
    Select: {
      colorBgContainer: '#162236',
      colorBorder: '#1e3a5f',
      colorText: '#e0f7ff',
    },
    Modal: {
      colorBgElevated: '#0f1d32',
      colorText: '#e0f7ff',
      colorTextHeading: '#00d4ff',
    },
    Pagination: {
      colorBgContainer: '#0f1d32',
      colorText: '#8ba3c7',
      colorPrimary: '#00d4ff',
    },
  },
}

export const getThemeConfig = (style: ThemeStyle): ThemeConfig => {
  switch (style) {
    case 'default':
      return defaultTheme
    case 'modern':
      return modernTheme
    case 'classic':
      return classicTheme
    case 'tech':
      return techTheme
    default:
      return defaultTheme
  }
}
