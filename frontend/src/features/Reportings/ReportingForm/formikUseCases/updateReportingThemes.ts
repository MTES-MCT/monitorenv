export const updateTheme = (setFieldValue: (field: string, value: any) => void) => (value: number | undefined) => {
  const themesPath = `themeId`
  const subThemesPath = `subThemeIds`

  setFieldValue(themesPath, value)
  setFieldValue(subThemesPath, [])
}
