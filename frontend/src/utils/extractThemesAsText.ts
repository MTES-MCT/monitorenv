import type { ControlPlansData, ControlPlansThemeCollection } from '../domain/entities/controlPlan'

export function extractThemesAsText(controlPlans: ControlPlansData[], themes: ControlPlansThemeCollection) {
  if (controlPlans?.length === 0) {
    return ''
  }

  return controlPlans
    .reduce((controlPlansCollection, currentControlPlan) => {
      if (currentControlPlan?.themeId) {
        const themeLabel = currentControlPlan.themeId ? themes[currentControlPlan.themeId]?.theme : undefined

        controlPlansCollection.push(themeLabel ?? '')
      }

      return controlPlansCollection
    }, [] as string[])
    .join(' - ')
}
