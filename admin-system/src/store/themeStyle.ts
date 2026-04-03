import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeStyle = 'default' | 'modern' | 'classic' | 'tech'

interface ThemeState {
  themeStyle: ThemeStyle
  setThemeStyle: (style: ThemeStyle) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      themeStyle: 'default',
      setThemeStyle: (style) => set({ themeStyle: style }),
    }),
    {
      name: 'theme-style-storage',
    }
  )
)
