export const updateTheme = (setFieldValue: (field: string, value: any) => void) => (value: string) => {
  const themesPath = `theme`
  const subThemesPath = `subThemes`

  setFieldValue(themesPath, value)
  setFieldValue(subThemesPath, [])
}
