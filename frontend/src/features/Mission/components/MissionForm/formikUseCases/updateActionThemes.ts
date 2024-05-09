import { Mission } from '@features/Mission/mission.type'
import { get } from 'lodash'

import type { ControlPlansData } from '../../../../../domain/entities/controlPlan'

export const updateTheme =
  (setFieldValue: (field: string, value: any) => void, mission: Mission.Mission) =>
  (value: number | undefined, actionIndex: number, themeIndex: number) => {
    const themesPath = `envActions[${actionIndex}].controlPlans`
    const currentThemeValue = get(mission, themesPath) as ControlPlansData[]
    const newValue = [...currentThemeValue]
    newValue.splice(themeIndex, 1, { subThemeIds: [], tagIds: [], themeId: value })

    setFieldValue(themesPath, newValue)
  }
export const updateSubThemes =
  (setFieldValue: (field: string, value: any) => void) => (value: string, actionIndex: number, themeIndex: number) => {
    const subThemesPath = `envActions[${actionIndex}].controlPlans[${themeIndex}].subThemeIds`
    const tagsPath = `envActions[${actionIndex}].controlPlans[${themeIndex}].tagIds`
    setFieldValue(subThemesPath, value)
    if (!value || value?.length === 0) {
      setFieldValue(tagsPath, value)
    }
  }
export const updateTags =
  (setFieldValue: (field: string, value: any) => void) => (value: string, actionIndex: number, themeIndex: number) => {
    const tagsPath = `envActions[${actionIndex}].controlPlans[${themeIndex}].tagIds`

    setFieldValue(tagsPath, value)
  }
