import { FishMissionAction } from '@features/Mission/fishActions.types'
import { Mission } from '@features/Mission/mission.type'

import { EnvActions } from './EnvActions'
import { FishActions } from './FishActions'
import { Action, TimeLine } from './style'
import { getDateAsLocalizedStringExpanded } from '../../../../../../utils/getDateAsLocalizedString'
import { CompletionStatusIcon } from '../CompletionStatusIcon'

import type { DetachedReportingForTimeline, ReportingForTimeline } from '../../../../../../domain/entities/reporting'
import type { MouseEventHandler } from 'react'

type ActionCardProps = {
  action:
    | Mission.EnvActionForTimeline
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
    if (action.actionSource !== Mission.ActionSource.MONITORENV) {
      return
    }
    selectAction(id)
  }

  return (
    <Action data-cy="action-card" onClick={onClickCard}>
      <TimeLine $isFishAction={action.actionSource === Mission.ActionSource.MONITORFISH}>
        {getDateAsLocalizedStringExpanded(action.timelineDate)}
        {action.actionSource === Mission.ActionSource.MONITORENV && <CompletionStatusIcon action={action} />}
      </TimeLine>

      {action.actionSource === Mission.ActionSource.MONITORENV && (
        <EnvActions
          action={action}
          duplicateAction={duplicateAction}
          hasError={hasError}
          removeAction={removeAction}
          selected={selected}
          setCurrentActionIndex={setCurrentActionIndex}
        />
      )}
      {action.actionSource === Mission.ActionSource.MONITORFISH && <FishActions action={action} />}
    </Action>
  )
}
