export type ControlPlans = {
  subThemes: {
    id: number
    subTheme: string
    themeId: number
  }[]
  tags: {
    id: number
    tag: string
    themeId: number
  }[]
  themes: {
    id: number
    theme: string
  }[]
}

export type ControlPlansData = {
  subThemeIds: number[]
  tagIds: number[]
  themeId: number
}
