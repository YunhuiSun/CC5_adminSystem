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

// 黑曜石主题配置 - Obsidian Command Center
const obsidianTheme: ThemeConfig = {
  token: {
    // Colors
    colorPrimary: '#d4a853',
    colorSuccess: '#4ade80',
    colorError: '#f87171',
    colorWarning: '#fbbf24',
    colorInfo: '#60a5fa',
    // Background
    colorBgBase: '#0d0d0f',
    colorBgContainer: '#1a1a1e',
    colorBgElevated: '#202024',
    colorBgLayout: '#0d0d0f',
    colorBgSpotlight: '#141416',
    colorBgMask: 'rgba(13, 13, 15, 0.85)',
    // Text
    colorText: '#a1a1aa',
    colorTextSecondary: '#71717a',
    colorTextTertiary: '#52525b',
    colorTextQuaternary: '#3f3f46',
    colorTextHeading: '#ffffff',
    colorTextLabel: '#a1a1aa',
    colorTextDescription: '#71717a',
    colorTextPlaceholder: '#52525b',
    // Borders
    colorBorder: 'rgba(255, 255, 255, 0.1)',
    colorBorderSecondary: 'rgba(255, 255, 255, 0.06)',
    colorSplit: 'rgba(255, 255, 255, 0.06)',
    // Typography
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: 14,
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,
    wireframe: false,
    // Shadows
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)',
    boxShadowSecondary: '0 2px 8px rgba(0, 0, 0, 0.3)',
  },
  components: {
    Button: {
      primaryShadow: '0 2px 8px rgba(212, 168, 83, 0.25)',
      colorPrimary: '#d4a853',
      colorPrimaryHover: '#e8c078',
      colorPrimaryActive: '#b8923d',
      defaultBg: '#1a1a1e',
      defaultBorderColor: 'rgba(255, 255, 255, 0.1)',
      defaultColor: '#a1a1aa',
      defaultHoverBg: '#202024',
      defaultHoverBorderColor: 'rgba(212, 168, 83, 0.3)',
      defaultHoverColor: '#d4a853',
      borderRadius: 8,
      paddingInline: 16,
      fontWeight: 500,
    },
    Card: {
      colorBgContainer: '#1a1a1e',
      colorBorderSecondary: 'rgba(255, 255, 255, 0.06)',
      borderRadiusLG: 12,
      paddingLG: 24,
    },
    Table: {
      colorBgContainer: '#141416',
      colorHeaderBg: '#1a1a1e',
      colorRowHover: 'rgba(212, 168, 83, 0.08)',
      colorText: '#a1a1aa',
      colorTextHeading: '#ffffff',
      colorBorder: 'rgba(255, 255, 255, 0.06)',
      colorBorderSecondary: 'rgba(255, 255, 255, 0.04)',
      headerBg: '#1a1a1e',
      headerColor: '#71717a',
      headerSortActiveBg: '#202024',
      headerSortHoverBg: '#202024',
      rowHoverBg: 'rgba(212, 168, 83, 0.08)',
      rowSelectedBg: 'rgba(212, 168, 83, 0.12)',
      rowSelectedHoverBg: 'rgba(212, 168, 83, 0.16)',
      borderColor: 'rgba(255, 255, 255, 0.06)',
    },
    Menu: {
      colorItemBg: 'transparent',
      colorItemBgSelected: 'rgba(212, 168, 83, 0.12)',
      colorItemBgHover: 'rgba(212, 168, 83, 0.06)',
      colorItemText: '#a1a1aa',
      colorItemTextSelected: '#d4a853',
      colorItemTextHover: '#d4a853',
      itemBorderRadius: 8,
      itemMarginInline: 8,
      itemPaddingInline: 16,
      itemSelectedColor: '#d4a853',
      itemHoverColor: '#d4a853',
      iconSize: 16,
      iconMarginInlineEnd: 10,
    },
    Input: {
      colorBgContainer: '#1a1a1e',
      colorBorder: 'rgba(255, 255, 255, 0.1)',
      colorBorderHover: 'rgba(255, 255, 255, 0.2)',
      activeBorderColor: '#d4a853',
      hoverBorderColor: 'rgba(255, 255, 255, 0.2)',
      colorText: '#ffffff',
      colorTextPlaceholder: '#52525b',
      activeShadow: '0 0 0 3px rgba(212, 168, 83, 0.15)',
      paddingBlock: 10,
      paddingInline: 14,
      borderRadius: 8,
    },
    Select: {
      colorBgContainer: '#1a1a1e',
      colorBorder: 'rgba(255, 255, 255, 0.1)',
      colorBgElevated: '#202024',
      optionSelectedBg: 'rgba(212, 168, 83, 0.12)',
      optionActiveBg: 'rgba(212, 168, 83, 0.06)',
      colorText: '#ffffff',
      colorTextPlaceholder: '#52525b',
      borderRadius: 8,
    },
    Modal: {
      colorBgElevated: '#202024',
      contentBg: '#202024',
      headerBg: '#202024',
      titleColor: '#ffffff',
      colorText: '#a1a1aa',
      colorTextHeading: '#ffffff',
      borderRadiusLG: 16,
    },
    Pagination: {
      colorBgContainer: '#1a1a1e',
      colorText: '#71717a',
      colorPrimary: '#d4a853',
      colorPrimaryHover: '#e8c078',
      itemActiveBg: 'rgba(212, 168, 83, 0.12)',
      itemBg: '#1a1a1e',
      itemHoverBg: 'rgba(212, 168, 83, 0.06)',
      borderRadius: 8,
    },
    Tabs: {
      colorBgContainer: 'transparent',
      colorPrimary: '#d4a853',
      itemColor: '#71717a',
      itemHoverColor: '#a1a1aa',
      itemSelectedColor: '#d4a853',
      inkBarColor: '#d4a853',
      itemActiveColor: '#d4a853',
      horizontalItemPadding: '12px 0',
      horizontalMargin: '0 0 0 24px',
    },
    Tag: {
      defaultBg: '#1a1a1e',
      defaultColor: '#a1a1aa',
      borderRadiusSM: 6,
    },
    Dropdown: {
      colorBgElevated: '#202024',
      controlItemBgHover: 'rgba(212, 168, 83, 0.08)',
      controlItemBgActive: 'rgba(212, 168, 83, 0.12)',
      colorText: '#a1a1aa',
      colorTextDescription: '#71717a',
      borderRadiusLG: 12,
    },
    Popconfirm: {
      colorBgElevated: '#202024',
      colorPrimary: '#d4a853',
    },
    Message: {
      contentBg: '#202024',
      colorText: '#ffffff',
    },
    Notification: {
      colorBgElevated: '#202024',
      colorText: '#ffffff',
    },
    Tree: {
      colorBgContainer: '#141416',
      nodeHoverBg: 'rgba(212, 168, 83, 0.08)',
      nodeSelectedBg: 'rgba(212, 168, 83, 0.12)',
      colorText: '#a1a1aa',
      colorTextPlaceholder: '#52525b',
      nodeHoverColor: '#d4a853',
      nodeSelectedColor: '#d4a853',
    },
    Form: {
      colorBgComponents: '#1a1a1e',
      colorText: '#a1a1aa',
      labelColor: '#71717a',
    },
    Tooltip: {
      colorBgSpotlight: '#202024',
      colorText: '#ffffff',
      borderRadius: 8,
    },
    Badge: {
      colorBgSpotlight: '#202024',
      colorText: '#ffffff',
    },
    Switch: {
      colorPrimary: '#d4a853',
      colorPrimaryHover: '#e8c078',
    },
    Checkbox: {
      colorPrimary: '#d4a853',
      colorPrimaryHover: '#e8c078',
    },
    Radio: {
      colorPrimary: '#d4a853',
      colorPrimaryHover: '#e8c078',
    },
    Slider: {
      trackBg: 'rgba(212, 168, 83, 0.3)',
      trackHoverBg: 'rgba(212, 168, 83, 0.4)',
      handleColor: '#d4a853',
      handleActiveColor: '#e8c078',
      railBg: 'rgba(255, 255, 255, 0.1)',
      railHoverBg: 'rgba(255, 255, 255, 0.15)',
    },
    Progress: {
      defaultColor: '#d4a853',
      remainingColor: 'rgba(255, 255, 255, 0.06)',
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
    case 'obsidian':
      return obsidianTheme
    default:
      return defaultTheme
  }
}
