import { Accent, Icon, IconButton, THEME } from '@mtes-mct/monitor-ui'
import { ActionTypeEnum, type EnvActionForTimeline } from 'domain/entities/missions'

import { ControlCard } from './ControlCard'
import { NoteCard } from './NoteCard'
import { ReportingCard } from './ReportingCard'
import { ReportingHistory } from './ReportingHistory'
import { SurveillanceCard } from './SurveillanceCard'
import {
  ActionButtons,
  ActionSummaryWrapper,
  ButtonsWrapper,
  Card,
  ContentContainer,
  StyledTag,
  TagsContainer
} from '../style'

import type { FishMissionAction } from '@features/Mission/fishActions.types'
import type { DetachedReportingForTimeline, ReportingForTimeline } from 'domain/entities/reporting'
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
              {action.actionType === ActionTypeEnum.CONTROL && <ControlCard action={action} />}
              {action.actionType === ActionTypeEnum.SURVEILLANCE && <SurveillanceCard action={action} />}
              {action.actionType === ActionTypeEnum.NOTE && <NoteCard action={action} />}
              {action.actionType === ActionTypeEnum.REPORTING && (
                <ReportingCard action={action} setCurrentActionId={setCurrentActionId} />
              )}
              {action.actionType !== ActionTypeEnum.REPORTING && (
                <>
                  <ButtonsWrapper>
                    <ActionButtons>
                      <IconButton
                        accent={Accent.TERTIARY}
                        Icon={Icon.Duplicate}
                        onClick={duplicateAction}
                        title="dupliquer"
                      />
                      <IconButton
                        accent={Accent.TERTIARY}
                        color={THEME.color.maximumRed}
                        data-cy={`actioncard-delete-button-${action.id}`}
                        Icon={Icon.Delete}
                        onClick={removeAction}
                        title="supprimer"
                      />
                    </ActionButtons>
                    {action.actionType === ActionTypeEnum.CONTROL && action.formattedReportingId && (
                      <StyledTag
                        data-cy="control-attached-reporting-tag"
                        Icon={Icon.Link}
                      >{`Signalement ${action.formattedReportingId}`}</StyledTag>
                    )}
                  </ButtonsWrapper>
                </>
              )}
            </ContentContainer>
            {action.actionType === ActionTypeEnum.SURVEILLANCE && action.formattedReportingIds.length > 0 && (
              <TagsContainer>
                {action.formattedReportingIds.map(reportingId => (
                  <StyledTag
                    key={reportingId}
                    data-cy="surveillance-attached-reportings-tags"
                    Icon={Icon.Link}
                  >{`Signalement ${reportingId}`}</StyledTag>
                ))}
              </TagsContainer>
            )}
          </ActionSummaryWrapper>
        </Card>
      )}
    </>
  )
}
