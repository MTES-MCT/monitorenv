import { isPartOfTags } from '@utils/isPartOfTags'

import {
  ActionTypeEnum,
  type EnvActionControl,
  type EnvActionSurveillance,
  type Mission
} from '../../../../domain/entities/missions'

import type { TagOption } from 'domain/entities/tags'

export function isMissionPartOfSelectedTags(mission: Mission, selectedTags: TagOption[] | undefined) {
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

  return isPartOfTags({
    filterTags: selectedTags,
    tagsToCompare: missionTags
  })
}
