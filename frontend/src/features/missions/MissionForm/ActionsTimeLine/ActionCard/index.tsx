import { FishMissionAction } from '@features/missions/fishActions.types'

import { EnvActions } from './EnvActions'
import { FishActions } from './FishActions'
import { Action, TimeLine } from './style'
import { ActionSource, type EnvActionForTimeline } from '../../../../../domain/entities/missions'
import { getDateAsLocalizedStringExpanded } from '../../../../../utils/getDateAsLocalizedString'

import type { DetachedReportingForTimeline, ReportingForTimeline } from '../../../../../domain/entities/reporting'
import type { MouseEventHandler } from 'react'

type ActionCardProps = {
  action:
    | EnvActionForTimeline
    | ReportingForTimeline
    | DetachedReportingForTimeline
    | FishMissionAction.FishActionForTimeline
  duplicateAction: MouseEventHandler
  hasError: boolean
  removeAction: MouseEventHandler
  selectAction: MouseEventHandler
  selected: boolean
  setCurrentActionIndex: (string) => void
}

export function ActionCard({
  action,
  duplicateAction,
  hasError,
  removeAction,
  selectAction,
  selected,
  setCurrentActionIndex
}: ActionCardProps) {
  const onClickCard = id => {
    if (action.actionSource !== ActionSource.MONITORENV) {
      return
    }
    selectAction(id)
  }

  return (
    <Action data-cy="action-card" onClick={onClickCard}>
      <TimeLine $isFishAction={action.actionSource === ActionSource.MONITORFISH}>
        {getDateAsLocalizedStringExpanded(action.timelineDate)}
      </TimeLine>

      {action.actionSource === ActionSource.MONITORENV && (
        <EnvActions
          action={action}
          duplicateAction={duplicateAction}
          hasError={hasError}
          removeAction={removeAction}
          selected={selected}
          setCurrentActionIndex={setCurrentActionIndex}
        />
      )}
      {action.actionSource === ActionSource.MONITORFISH && <FishActions action={action} />}
    </Action>
  )
}
