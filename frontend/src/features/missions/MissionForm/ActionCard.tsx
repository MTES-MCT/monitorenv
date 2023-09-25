import { IconButton } from 'rsuite'
import styled from 'styled-components'

import { ActionTypeEnum, EnvAction } from '../../../domain/entities/missions'
import { TargetTypeLabels } from '../../../domain/entities/targetType'
import { ControlInfractionsTags } from '../../../ui/ControlInfractionsTags'
import { ReactComponent as ControlIconSVG } from '../../../uiMonitor/icons/Control.svg'
import { ReactComponent as DeleteSVG } from '../../../uiMonitor/icons/Delete.svg'
import { ReactComponent as DuplicateSVG } from '../../../uiMonitor/icons/Duplicate.svg'
import { ReactComponent as NoteSVG } from '../../../uiMonitor/icons/Note_libre.svg'
import { ReactComponent as SurveillanceIconSVG } from '../../../uiMonitor/icons/Observation.svg'
import { dateDifferenceInHours } from '../../../utils/dateDifferenceInHours'
import { extractThemesAsText } from '../../../utils/extractThemesAsText'
import { getDateAsLocalizedStringExpanded } from '../../../utils/getDateAsLocalizedString'

import type { MouseEventHandler } from 'react'

type ActionCardProps = {
  action: EnvAction
  duplicateAction: MouseEventHandler
  hasError: boolean
  removeAction: MouseEventHandler
  selectAction: MouseEventHandler
  selected: boolean
}

export function ActionCard({
  action,
  duplicateAction,
  hasError,
  removeAction,
  selectAction,
  selected
}: ActionCardProps) {
  return (
    <Action data-cy="action-card" onClick={selectAction}>
      <TimeLine>
        <DateTimeWrapper>{getDateAsLocalizedStringExpanded(action.actionStartDateTimeUtc)}</DateTimeWrapper>
      </TimeLine>
      <Card>
        <ActionSummaryWrapper $type={action.actionType} hasError={hasError} selected={selected}>
          {action.actionType === ActionTypeEnum.CONTROL && (
            <>
              <ControlIcon />
              <SummaryContent>
                <Title>
                  Contrôle{!!action.actionNumberOfControls && action.actionNumberOfControls > 1 ? 's ' : ' '}
                  {action.themes?.length > 0 && action.themes[0]?.theme ? (
                    <Accented>{extractThemesAsText(action.themes)}</Accented>
                  ) : (
                    'à renseigner'
                  )}
                </Title>
                {!!action.actionNumberOfControls && action.actionNumberOfControls > 0 && (
                  <ControlSummary>
                    <Accented>{action.actionNumberOfControls}</Accented>
                    {` contrôle${action.actionNumberOfControls > 1 ? 's' : ''}`}
                    {` réalisé${action.actionNumberOfControls > 1 ? 's' : ''} sur des cibles de type `}
                    <Accented>
                      {(!!action.actionTargetType && TargetTypeLabels[action.actionTargetType]) || 'non spécifié'}
                    </Accented>
                  </ControlSummary>
                )}
                {!!action.actionNumberOfControls && action.actionNumberOfControls > 0 && (
                  <ControlInfractionsTags
                    actionNumberOfControls={action.actionNumberOfControls}
                    infractions={action?.infractions}
                  />
                )}
              </SummaryContent>
            </>
          )}
          {action.actionType === ActionTypeEnum.SURVEILLANCE && (
            <>
              <SurveillanceIcon />
              <SummaryContent>
                <Title>
                  Surveillance{' '}
                  {action.themes && action.themes?.length > 0 ? (
                    <Accented>{extractThemesAsText(action.themes)}</Accented>
                  ) : (
                    'à renseigner'
                  )}
                </Title>
                {action.actionStartDateTimeUtc && action.actionEndDateTimeUtc && (
                  <DurationWrapper>
                    <Accented>
                      {dateDifferenceInHours(action.actionStartDateTimeUtc, action.actionEndDateTimeUtc)} heure(s)&nbsp;
                    </Accented>
                    de surveillance
                  </DurationWrapper>
                )}
              </SummaryContent>
            </>
          )}

          {action.actionType === ActionTypeEnum.NOTE && (
            <>
              <NoteIcon />
              <NoteContent>{action.observations || 'Observation à renseigner'}</NoteContent>
            </>
          )}

          <ButtonsWrapper>
            <IconButton
              appearance="subtle"
              icon={<DuplicateSVG className="rs-icon" />}
              onClick={duplicateAction}
              size="md"
              title="dupliquer"
            />
            <IconButton
              appearance="subtle"
              icon={<DeleteIcon className="rs-icon" />}
              onClick={removeAction}
              size="md"
              title="supprimer"
            />
          </ButtonsWrapper>
        </ActionSummaryWrapper>
        {hasError && <ErrorMessage>Veuillez compléter les champs manquants dans cette action</ErrorMessage>}
      </Card>
    </Action>
  )
}

const Card = styled.div`
  flex: 1;
`

const Action = styled.div`
  display: flex;
  margin-top: 4px;
  margin-bottom: 4px;
`
const TimeLine = styled.div`
  display: flex;
  align-items: center;
  width: 54px;
  margin-right: 16px;
`

const DateTimeWrapper = styled.div`
  font-size: 13px;
  margin-bottom: 4px;
  margin-top: 4px;
`

const ActionSummaryWrapper = styled.div<{ $type: string; hasError: boolean; selected: boolean }>`
  display: flex;
  border-color: ${p =>
    // eslint-disable-next-line no-nested-ternary
    p.hasError
      ? `${p.theme.color.maximumRed}`
      : p.selected
      ? `${p.theme.color.blueYonder}`
      : `${p.theme.color.lightGray}`};
  border-size: ${p => (p.selected ? `3px` : `1px`)};
  border-style: solid;
  background: ${p => {
    switch (p.$type) {
      case ActionTypeEnum.CONTROL:
        return p.theme.color.white
      case ActionTypeEnum.SURVEILLANCE:
        return p.theme.color.gainsboro
      case ActionTypeEnum.NOTE:
        return p.theme.color.blueGray25
      default:
        return p.theme.color.white
    }
  }};
  padding: ${p => (p.selected ? `4px` : '6px')};
`

const Title = styled.span`
  font: normal normal normal 14px/20px Marianne;
`
const ControlIcon = styled(ControlIconSVG)`
  color: ${p => p.theme.color.gunMetal};
  width: 20px;
  height: 20px;
  margin-top: 18px;
  margin-left: 18px;
  margin-right: 8px;
`
const SurveillanceIcon = styled(SurveillanceIconSVG)`
  color: ${p => p.theme.color.gunMetal};
  width: 16px;
  height: 16px;
  margin-top: 20px;
  margin-left: 18px;
  margin-right: 8px;
`

const NoteIcon = styled(NoteSVG)`
  color: ${p => p.theme.color.gunMetal};
  width: 16px;
  height: 16px;
  margin-top: 20px;
  margin-left: 18px;
  margin-right: 8px;
  flex: 0 0 18px;
`
const ControlSummary = styled.div`
  font: normal normal normal 13px/18px Marianne;
  color: ${p => p.theme.color.slateGray};
  margin-bottom: 16px;
`

const SummaryContent = styled.div`
  margin-top: 18px;
  margin-bottom: 18px;
  flex: 1;
  color: ${p => p.theme.color.gunMetal};
`

const NoteContent = styled.div`
  margin-top: 18px;
  margin-bottom: 18px;
  max-height: 54px;
  overflow: hidden;
  font: normal normal normal 14px/20px Marianne;
  color: ${p => p.theme.color.gunMetal};
`

const ButtonsWrapper = styled.div`
  width: 50px;
  margin-top: 6px;
  margin-left: auto;
`

const Accented = styled.span`
  font-weight: bolder;
`

const DeleteIcon = styled(DeleteSVG)`
  color: ${p => p.theme.color.maximumRed};
`
const DurationWrapper = styled.div`
  font: normal normal normal 13px/18px Marianne;
  color: ${p => p.theme.color.slateGray};
`

const ErrorMessage = styled.div`
  color: ${p => p.theme.color.maximumRed};
`
