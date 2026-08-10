import { FishMissionAction } from '@features/Mission/fishActions.types'

import { EnvActions } from './EnvActions'
import { FishActions } from './FishActions'
import { Action, TimeLine } from './style'
import { ActionSource, type EnvActionForTimeline } from '../../../../../../domain/entities/missions'
import { getDateAsLocalizedStringExpanded } from '../../../../../../utils/getDateAsLocalizedString'
import { CompletionStatusIcon } from '../CompletionStatusIcon'

import type { DetachedReportingForTimeline, ReportingForTimeline } from '../../../../../../domain/entities/reporting'
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
  setCurrentActionId: (actionId: string) => void
}

export function ActionCard({
  action,
  duplicateAction,
  hasError,
  removeAction,
  selectAction,
  selected,
  setCurrentActionId
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
        {action.actionSource === ActionSource.MONITORENV && <CompletionStatusIcon action={action} />}
      </TimeLine>

      {action.actionSource === ActionSource.MONITORENV && (
        <EnvActions
          action={action}
          duplicateAction={duplicateAction}
          hasError={hasError}
          removeAction={removeAction}
          selected={selected}
          setCurrentActionId={setCurrentActionId}
        />
      )}
      {action.actionSource === ActionSource.MONITORFISH && <FishActions action={action} />}
    </Action>
  )
}
