import { Mission } from '@features/Mission/mission.type'

export function isMissionPartOfSelectedControlPlans(mission: Mission.Mission, selectedThemes: number[] | undefined) {
  if (!selectedThemes || selectedThemes.length === 0) {
    return true
  }
  if (mission.envActions.length === 0) {
    return false
  }

  const missionControlPlans = mission.envActions.flatMap((action: any) =>
    action.controlPlans?.flatMap(controlPlan => controlPlan.themeId)
  )

  return missionControlPlans.some(controlPlan => selectedThemes.includes(controlPlan))
}
