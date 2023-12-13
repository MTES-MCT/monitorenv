import type { ControlPlansData, ControlPlansTheme } from '../domain/entities/controlPlan'

export function extractThemesAsText(controlPlans: ControlPlansData[], themes: Array<ControlPlansTheme>) {
  if (controlPlans?.length === 0) {
    return ''
  }

  return controlPlans
    .reduce((controlPlansCollection, currentControlPlan) => {
      const actionTheme = themes.find(theme => theme.id === currentControlPlan.themeId)
      if (currentControlPlan?.themeId && actionTheme) {
        const controlPLanLabel = actionTheme.theme
        controlPlansCollection.push(controlPLanLabel || '')
      }

      return controlPlansCollection
    }, [] as string[])
    .join(' - ')
}
