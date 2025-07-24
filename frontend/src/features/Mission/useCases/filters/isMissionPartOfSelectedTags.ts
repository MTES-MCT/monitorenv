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

  const missionTagsWithoutChildren = [...missionTags.filter(tag => tag.subTags?.length === 0)]
  const missionSubTags = [...missionTags.flatMap(({ subTags }) => subTags)]

  const allTagsWithoutChildrenFilter = [...selectedTags.filter(tagFilter => tagFilter?.subTags?.length === 0)]
  const allSubTagsFilter = selectedTags.flatMap(tagFilter => tagFilter?.subTags || [])

  const hasMatchingSubTags = allSubTagsFilter.some(tagFilter =>
    missionSubTags.some(subTag => subTag.id === tagFilter.id)
  )

  let hasMatchingTags = false
  if (missionTagsWithoutChildren.length > 0) {
    hasMatchingTags = allTagsWithoutChildrenFilter.some(tagFilter =>
      missionTagsWithoutChildren.some(tag => tag.id === tagFilter.id)
    )
  }

  return hasMatchingTags || hasMatchingSubTags
}
