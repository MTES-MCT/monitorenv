import { get } from 'lodash'

import type { ControlPlansData } from '../../../../../domain/entities/controlPlan'
import type { Mission } from '../../../../../domain/entities/missions'

export const updateTheme =
  (setFieldValue: (field: string, value: any) => void, mission: Mission) =>
  (value: number | undefined, actionIndex: number, themeIndex: number) => {
    const themesPath = `envActions[${actionIndex}].controlPlans`
    const currentThemeValue = get(mission, themesPath) as ControlPlansData[]
    const newValue = [...currentThemeValue]
    newValue.splice(themeIndex, 1, { subThemeIds: [], tagIds: [], themeId: value })

    setFieldValue(themesPath, newValue)
  }
export const updateSubThemes =
  (setFieldValue: (field: string, value: any) => void) =>
  (
    value: number[] | undefined,
    actionIndex: number,
    themeIndex: number,
    themeId: number | undefined,
    themeOfSubThemeId: number | undefined
  ) => {
    const subThemesPath = `envActions[${actionIndex}].controlPlans[${themeIndex}].subThemeIds`
    const tagsPath = `envActions[${actionIndex}].controlPlans[${themeIndex}].tagIds`
    setFieldValue(subThemesPath, value)

    if (!themeId && themeOfSubThemeId) {
      setFieldValue(`envActions[${actionIndex}].controlPlans[${themeIndex}].themeId`, themeOfSubThemeId)
    }
    if (!value || value?.length === 0) {
      setFieldValue(tagsPath, undefined)
    }
  }
export const updateTags =
  (setFieldValue: (field: string, value: any) => void) => (value: string, actionIndex: number, themeIndex: number) => {
    const tagsPath = `envActions[${actionIndex}].controlPlans[${themeIndex}].tagIds`

    setFieldValue(tagsPath, value)
  }
