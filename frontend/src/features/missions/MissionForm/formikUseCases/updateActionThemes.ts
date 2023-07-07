import { get } from 'lodash'

import type { EnvActionTheme, Mission } from '../../../../domain/entities/missions'

export const updateTheme =
  (setFieldValue: (field: string, value: any) => void, mission: Mission) =>
  (value: string, actionIndex: number, themeIndex: number) => {
    const themesPath = `envActions[${actionIndex}].themes`
    const currentThemeValue = get(mission, themesPath) as EnvActionTheme[]

    const newValue = [...currentThemeValue]
    newValue.splice(themeIndex, 1, { theme: value })

    setFieldValue(themesPath, newValue)
  }
export const updateSubThemes =
  (setFieldValue: (field: string, value: any) => void) => (value: string, actionIndex: number, themeIndex: number) => {
    const subThemesPath = `envActions[${actionIndex}].themes.${themeIndex}.subThemes`

    setFieldValue(subThemesPath, value)
  }
export const updateProtectedSpecies =
  (setFieldValue: (field: string, value: any) => void) => (value: string, actionIndex: number, themeIndex: number) => {
    const protectedSpeciesPath = `envActions[${actionIndex}].themes.${themeIndex}.protectedSpecies`

    setFieldValue(protectedSpeciesPath, value)
  }
