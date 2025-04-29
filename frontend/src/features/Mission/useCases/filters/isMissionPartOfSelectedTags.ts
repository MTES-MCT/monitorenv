import {
  ActionTypeEnum,
  type EnvActionControl,
  type EnvActionSurveillance,
  type Mission
} from '../../../../domain/entities/missions'

import type { TagFromAPI } from 'domain/entities/tags'

export function isMissionPartOfSelectedTags(mission: Mission, selectedTags: TagFromAPI[] | undefined) {
  if (!selectedTags || selectedTags.length === 0) {
    return true
  }
  if (mission.envActions.length === 0) {
    return false
  }

  const missionTags = mission.envActions
    .filter(
      (a): a is EnvActionControl | EnvActionSurveillance =>
        a.actionType === ActionTypeEnum.CONTROL || a.actionType === ActionTypeEnum.SURVEILLANCE
    )
    .flatMap(action => action.tags)
    .filter(tag => tag !== undefined)

  const allTags = [...missionTags, ...missionTags.flatMap(({ subTags }) => subTags)]

  return allTags.some(tag => selectedTags.some(selectedTag => selectedTag.id === tag.id))
}
