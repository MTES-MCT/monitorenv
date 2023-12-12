import type { Mission } from '../../../entities/missions'

export function isMissionPartOfSelectedControlPlans(mission: Mission, selectedThemes: number[] | undefined) {
  if (!selectedThemes || selectedThemes.length === 0) {
    return true
  }
  if (mission.envActions.length === 0) {
    return false
  }

  const missionControlPlans = mission.envActions.flatMap((action: any) =>
    action.controlPlans?.flatMap(controlPlan => controlPlan.themeId)
  )
  const controlPlansFiltered = missionControlPlans.filter(controlPlan => selectedThemes.includes(controlPlan))

  return controlPlansFiltered.length > 0
}
