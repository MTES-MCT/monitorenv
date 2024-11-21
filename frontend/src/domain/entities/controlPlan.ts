export type ControlPlans = {
  subThemes: ControlPlansSubThemeCollection
  tags: ControlPlansTagCollection
  themes: ControlPlansThemeCollection
}

export type ControlPlansThemeCollection = {
  [key: number]: ControlPlansTheme
}

export type ControlPlansTheme = {
  id: number
  theme: string
}

export type ControlPlansSubThemeCollection = {
  [key: number]: ControlPlansSubTheme
}

export type ControlPlansSubTheme = {
  id: number
  subTheme: string
  themeId: number
  year: number
}

export type ControlPlansTagCollection = {
  [key: number]: ControlPlansTag
}

export type ControlPlansTag = {
  id: number
  tag: string
  themeId: number
}

export type ControlPlansData = {
  subThemeIds?: number[] | undefined
  tagIds?: number[] | undefined
  themeId?: number | undefined
}

export const CONTROL_PLAN_INIT = {
  subThemeIds: [],
  tagIds: [],
  themeId: undefined
}

export const UNIQ_CONTROL_PLAN_INDEX = 0
