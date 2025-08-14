import { AddControlToReportingButton } from '@features/Mission/components/MissionForm/ActionsTimeLine/ActionCard/EnvActions/AddControlToReportingButton'
import { Accent, Icon, IconButton, THEME } from '@mtes-mct/monitor-ui'
import { ActionTypeEnum, type EnvActionForTimeline } from 'domain/entities/missions'
import { type DetachedReportingForTimeline, type ReportingForTimeline } from 'domain/entities/reporting'

import { ControlCard } from './ControlCard'
import { NoteCard } from './NoteCard'
import { ReportingCard } from './ReportingCard'
import { ReportingHistory } from './ReportingHistory'
import { SurveillanceCard } from './SurveillanceCard'
import { ActionButtons, ActionSummaryWrapper, ButtonsWrapper, Card, ContentContainer } from '../style'

import type { FishMissionAction } from '@features/Mission/fishActions.types'
import type { MouseEventHandler } from 'react'

type EnvActionsProps = {
  action:
    | EnvActionForTimeline
    | ReportingForTimeline
    | DetachedReportingForTimeline
    | FishMissionAction.FishActionForTimeline
  duplicateAction: MouseEventHandler
  hasError: boolean
  removeAction: MouseEventHandler
  selected: boolean
  setCurrentActionId: (id: string) => void
}

export function EnvActions({
  action,
  duplicateAction,
  hasError,
  removeAction,
  selected,
  setCurrentActionId
}: EnvActionsProps) {
  return (
    <>
      {action.actionType === ActionTypeEnum.DETACHED_REPORTING ? (
        <ReportingHistory action={action} />
      ) : (
        <Card>
          <ActionSummaryWrapper
            $hasError={hasError}
            $reportingType={action.actionType === ActionTypeEnum.REPORTING ? action.reportType : undefined}
            $selected={selected}
            $type={action.actionType}
          >
            <ContentContainer>
              {action.actionType === ActionTypeEnum.CONTROL && (
                <ControlCard action={action} attachedReportingId={action.formattedReportingId} />
              )}
              {action.actionType === ActionTypeEnum.SURVEILLANCE && (
                <SurveillanceCard action={action} attachedReportingIds={action.formattedReportingIds} />
              )}
              {action.actionType === ActionTypeEnum.NOTE && <NoteCard action={action} />}
              {action.actionType === ActionTypeEnum.REPORTING && <ReportingCard action={action} />}
            </ContentContainer>
          </ActionSummaryWrapper>
          {action.actionType !== ActionTypeEnum.REPORTING && (
            <ButtonsWrapper>
              <ActionButtons>
                <IconButton
                  accent={Accent.TERTIARY}
                  Icon={Icon.Duplicate}
                  onClick={duplicateAction}
                  title="Dupliquer l'action"
                />
                <IconButton
                  accent={Accent.TERTIARY}
                  color={THEME.color.maximumRed}
                  data-cy={`actioncard-delete-button-${action.id}`}
                  Icon={Icon.Delete}
                  onClick={removeAction}
                  title="Supprimer l'action"
                />
              </ActionButtons>
            </ButtonsWrapper>
          )}
          {action.actionType === ActionTypeEnum.REPORTING && (
            <AddControlToReportingButton action={action} setCurrentActionId={setCurrentActionId} />
          )}
        </Card>
      )}
    </>
  )
}
