export type ThemeFromAPI = {
  id: number
  name: string
  subThemes: ThemeFromAPI[]
}

export type ThemeOption = {
  id: number
  name: string
  subThemes?: ThemeOption[]
}
