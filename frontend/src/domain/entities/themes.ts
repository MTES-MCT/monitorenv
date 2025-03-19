export type ThemeAPI = {
  id: number
  name: string
  subThemes: SubThemeAPI[]
}

export type SubThemeAPI = {
  id: number
  name: string
}
