export type ControlPlans = {
  subThemes: Array<ControlPlansSubTheme>
  tags: Array<ControlPlansTag>
  themes: Array<ControlPlansTheme>
}

export type ControlPlansTheme = {
  id: number
  theme: string
}

export type ControlPlansSubTheme = {
  id: number
  subTheme: string
  themeId: number
  year: number
}

export type ControlPlansTag = {
  id: number
  tag: string
  themeId: number
}

export type ControlPlansData = {
  subThemeIds: number[]
  tagIds: number[]
  themeId: number | undefined
}
