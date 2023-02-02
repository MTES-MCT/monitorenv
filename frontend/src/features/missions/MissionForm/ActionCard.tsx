import { format, isValid } from 'date-fns'
import { fr } from 'date-fns/locale'
import { IconButton } from 'rsuite'
import styled from 'styled-components'

import { COLORS } from '../../../constants/constants'
import { actionTargetTypeEnum, ActionTypeEnum, actionTypeEnum, EnvAction } from '../../../domain/entities/missions'
import { ControlInfractionsTags } from '../../../ui/ControlInfractionsTags'
import { ReactComponent as ControlIconSVG } from '../../../uiMonitor/icons/Control.svg'
import { ReactComponent as DeleteSVG } from '../../../uiMonitor/icons/Delete.svg'
import { ReactComponent as DuplicateSVG } from '../../../uiMonitor/icons/Duplicate.svg'
import { ReactComponent as NoteSVG } from '../../../uiMonitor/icons/Note_libre.svg'
import { ReactComponent as SurveillanceIconSVG } from '../../../uiMonitor/icons/Observation.svg'

import type { MouseEventHandler } from 'react'

type ActionCardProps = {
  action: EnvAction
  duplicateAction: MouseEventHandler
  removeAction: MouseEventHandler
  selectAction: MouseEventHandler
  selected: boolean
}
export function ActionCard({ action, duplicateAction, removeAction, selectAction, selected }: ActionCardProps) {
  const parsedActionStartDateTimeUtc = action.actionStartDateTimeUtc
    ? new Date(action.actionStartDateTimeUtc)
    : undefined

  return (
    <Action onClick={selectAction}>
      <TimeLine>
        <DateTimeWrapper>
          {parsedActionStartDateTimeUtc && isValid(parsedActionStartDateTimeUtc) && (
            <>
              <DateWrapper>{format(parsedActionStartDateTimeUtc, 'dd MMM', { locale: fr })}</DateWrapper>
              <Time>à {format(parsedActionStartDateTimeUtc, 'HH:mm', { locale: fr })}</Time>
            </>
          )}
        </DateTimeWrapper>
      </TimeLine>
      <ActionSummaryWrapper $type={action.actionType} selected={selected}>
        {action.actionType === ActionTypeEnum.CONTROL && (
          <>
            <ControlIcon />
            <SummaryContent>
              <Title>
                Contrôle{!!action.actionNumberOfControls && action.actionNumberOfControls > 1 ? 's ' : ' '}
                {action.actionTheme ? (
                  <Accented>{`${action.actionTheme} ${
                    action.actionSubTheme ? ` - ${action.actionSubTheme}` : ''
                  }`}</Accented>
                ) : (
                  'à renseigner'
                )}
              </Title>
              {!!action.actionNumberOfControls && action.actionNumberOfControls > 0 && (
                <ControlSummary>
                  <Accented>{action.actionNumberOfControls}</Accented>
                  {` contrôle${action.actionNumberOfControls > 1 ? 's' : ''} réalisé${
                    action.actionNumberOfControls > 1 ? 's' : ''
                  } sur des cibles de type `}
                  <Accented>
                    {(!!action.actionTargetType && actionTargetTypeEnum[action.actionTargetType]?.libelle) ||
                      'non spécifié'}
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
                {action.actionTheme ? (
                  <Accented>{`${action.actionTheme} ${
                    action.actionSubTheme ? ` - ${action.actionSubTheme}` : ''
                  }`}</Accented>
                ) : (
                  'à renseigner'
                )}
              </Title>
              {!!action.duration && action.duration > 0 && (
                <DurationWrapper>
                  <Accented>{action.duration} heure(s)&nbsp;</Accented>
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
    </Action>
  )
}

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
  margin-bottom: 4px;
  margin-top: 4px;
`
const DateWrapper = styled.div`
  font-weight: bold;
  font-size: 13px;
`
const Time = styled.div`
  font-size: 13px;
`
const ActionSummaryWrapper = styled.div<{ $type: string; selected: boolean }>`
  display: flex;
  flex: 1;
  border: ${p => (p.selected ? `3px solid ${COLORS.blueYonder}` : `1px solid ${COLORS.lightGray}`)};
  background: ${p => {
    switch (p.$type) {
      case actionTypeEnum.CONTROL.code:
        return COLORS.white
      case actionTypeEnum.SURVEILLANCE.code:
        return COLORS.gainsboro
      case actionTypeEnum.NOTE.code:
        return COLORS.blueGray25
      default:
        return COLORS.white
    }
  }};
  padding: ${p => (p.selected ? `4px` : '6px')};
  margin-left: auto;
`

const Title = styled.span`
  font: normal normal normal 14px/20px Marianne;
`
const ControlIcon = styled(ControlIconSVG)`
  color: ${COLORS.gunMetal};
  width: 20px;
  height: 20px;
  margin-top: 18px;
  margin-left: 18px;
  margin-right: 8px;
`
const SurveillanceIcon = styled(SurveillanceIconSVG)`
  color: ${COLORS.gunMetal};
  width: 16px;
  height: 16px;
  margin-top: 20px;
  margin-left: 18px;
  margin-right: 8px;
`

const NoteIcon = styled(NoteSVG)`
  color: ${COLORS.gunMetal};
  width: 16px;
  height: 16px;
  margin-top: 20px;
  margin-left: 18px;
  margin-right: 8px;
  flex: 0 0 18px;
`
const ControlSummary = styled.div`
  font: normal normal normal 13px/18px Marianne;
  color: ${COLORS.slateGray};
  margin-bottom: 16px;
`

const SummaryContent = styled.div`
  margin-top: 18px;
  margin-bottom: 18px;
  flex: 1;
  color: ${COLORS.gunMetal};
`

const NoteContent = styled.div`
  margin-top: 18px;
  margin-bottom: 18px;
  max-height: 54px;
  overflow: hidden;
  font: normal normal normal 14px/20px Marianne;
  color: ${COLORS.gunMetal};
`

const ButtonsWrapper = styled.div`
  width: 50px;
  margin-top: 6px;
  margin-left: auto;
`

const Accented = styled.span`
  font-weight: bold;
`

const DeleteIcon = styled(DeleteSVG)`
  color: ${COLORS.maximumRed};
`
const DurationWrapper = styled.div`
  font: normal normal normal 13px/18px Marianne;
  color: ${COLORS.slateGray};
`
