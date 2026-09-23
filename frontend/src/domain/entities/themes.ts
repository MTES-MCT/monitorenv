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

export type ThemeToAPI = {
  endedAt?: string
  id?: number
  name?: string
  startedAt?: string
  subThemes: Omit<ThemeToAPI, 'subThemes'>[]
}

export type ThemeTable = {
  endedAt?: string
  id?: number
  name?: string
  parentId?: number
  rowId: string
  startedAt?: string
  subRows?: ThemeTable[]
  subThemes: ThemeTable[]
}
