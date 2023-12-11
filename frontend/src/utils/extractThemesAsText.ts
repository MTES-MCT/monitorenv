import type { ControlPlansData } from '../domain/entities/controlPlan'
import type { Option } from '@mtes-mct/monitor-ui'

export function extractThemesAsText(controlPlans: ControlPlansData[], controlPlansAsOptions: Option<number>[]) {
  if (controlPlans?.length === 0) {
    return ''
  }

  return controlPlans
    .reduce((controlPlansCollection, currentControlPlan) => {
      const controlPlanFromOptions = controlPlansAsOptions.find(
        controlPlan => controlPlan.value === currentControlPlan.themeId
      )
      if (currentControlPlan?.themeId && controlPlanFromOptions) {
        const controlPLanLabel = controlPlanFromOptions.label
        controlPlansCollection.push(controlPLanLabel || '')
      }

      return controlPlansCollection
    }, [] as string[])
    .join(' - ')
}
