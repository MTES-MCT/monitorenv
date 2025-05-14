import {
  ActionTypeEnum,
  type EnvActionControl,
  type EnvActionSurveillance,
  type Mission
} from '../../../../domain/entities/missions'

export function isMissionPartOfSelectedThemes(mission: Mission, selectedThemes: number[] | undefined) {
  if (!selectedThemes || selectedThemes.length === 0) {
    return true
  }
  if (mission.envActions.length === 0) {
    return false
  }

  const missionThemes = mission.envActions
    .filter(
      (a): a is EnvActionControl | EnvActionSurveillance =>
        a.actionType === ActionTypeEnum.CONTROL || a.actionType === ActionTypeEnum.SURVEILLANCE
    )
    .flatMap(action => action.themes)
    .filter(theme => theme !== undefined)

  const allThemes = [...missionThemes, ...missionThemes.flatMap(({ subThemes }) => subThemes)]

  return allThemes.some(theme => selectedThemes.includes(theme.id))
}
