import { Accent, FieldError, Icon, IconButton, THEME, Tag } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { ControlCard } from './ControlCard'
import { NoteCard } from './NoteCard'
import { ReportingCard } from './ReportingCard'
import { Action, ActionButtons, ActionSummaryWrapper, ButtonsWrapper, Card, TimeLine } from './style'
import { SurveillanceCard } from './SurveillanceCard'
import { ActionTypeEnum, type EnvActionForTimeline } from '../../../../domain/entities/missions'
import { getDateAsLocalizedStringExpanded } from '../../../../utils/getDateAsLocalizedString'

import type { ReportingForTimeline } from '../../../../domain/entities/reporting'
import type { MouseEventHandler } from 'react'

type ActionCardProps = {
  action: EnvActionForTimeline | ReportingForTimeline
  duplicateAction: MouseEventHandler
  hasError: boolean
  removeAction: MouseEventHandler
  selectAction: MouseEventHandler
  selected: boolean
  setCurrentActionIndex: (string) => void
}

export function ActionCards({
  action,
  duplicateAction,
  hasError,
  removeAction,
  selectAction,
  selected,
  setCurrentActionIndex
}: ActionCardProps) {
  return (
    <Action data-cy="action-card" onClick={selectAction}>
      <TimeLine>{getDateAsLocalizedStringExpanded(action.timelineDate)}</TimeLine>
      <Card>
        <ActionSummaryWrapper $hasError={hasError} $selected={selected} $type={action.actionType}>
          {action.actionType === ActionTypeEnum.CONTROL && <ControlCard action={action} />}
          {action.actionType === ActionTypeEnum.SURVEILLANCE && <SurveillanceCard action={action} />}
          {action.actionType === ActionTypeEnum.NOTE && <NoteCard action={action} />}
          {action.actionType === ActionTypeEnum.REPORTING && (
            <ReportingCard action={action} setCurrentActionIndex={setCurrentActionIndex} />
          )}

          {action.actionType !== ActionTypeEnum.REPORTING && (
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
                  Icon={Icon.Delete}
                  onClick={removeAction}
                  title="supprimer"
                />
              </ActionButtons>
              {action.actionType === ActionTypeEnum.CONTROL && action.attachedReportingId && (
                <StyledTag Icon={Icon.Link}>{`Signalement ${action.formattedReportingId}`}</StyledTag>
              )}
            </ButtonsWrapper>
          )}
        </ActionSummaryWrapper>
        {hasError && <FieldError>Veuillez compléter les champs manquants dans cette action</FieldError>}
      </Card>
    </Action>
  )
}

const StyledTag = styled(Tag)`
  background-color: ${p => p.theme.color.maximumRed15};
`
