export const updateTheme = (setFieldValue: (field: string, value: any) => void) => (value: string) => {
  const themesPath = `themeId`
  const subThemesPath = `subThemeIds`

  setFieldValue(themesPath, value)
  setFieldValue(subThemesPath, [])
}
