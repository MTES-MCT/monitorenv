import { format, isValid } from 'date-fns'
import { fr } from 'date-fns/locale'
import { IconButton } from 'rsuite'
import styled from 'styled-components'

import { COLORS } from '../../../constants/constants'
import { actionTargetTypeEnum, actionTypeEnum } from '../../../domain/entities/missions'
import { ControlInfractionsTags } from '../../../ui/ControlInfractionsTags'
import { ReactComponent as ControlIconSVG } from '../../../uiMonitor/icons/Control.svg'
import { ReactComponent as DeleteSVG } from '../../../uiMonitor/icons/Delete.svg'
import { ReactComponent as DuplicateSVG } from '../../../uiMonitor/icons/Duplicate.svg'
import { ReactComponent as NoteSVG } from '../../../uiMonitor/icons/Note_libre.svg'
import { ReactComponent as SurveillanceIconSVG } from '../../../uiMonitor/icons/Observation.svg'

export function ActionCard({ action, duplicateAction, removeAction, selectAction, selected }) {
  const parsedActionStartDatetimeUtc = new Date(action.actionStartDatetimeUtc)

  return (
    <Action onClick={selectAction}>
      <TimeLine>
        <DateTimeWrapper>
          {isValid(parsedActionStartDatetimeUtc) && (
            <>
              <DateWrapper>{format(parsedActionStartDatetimeUtc, 'dd MMM', { locale: fr })}</DateWrapper>
              <Time>à {format(parsedActionStartDatetimeUtc, 'HH:mm', { locale: fr })}</Time>
            </>
          )}
        </DateTimeWrapper>
      </TimeLine>
      <ActionSummaryWrapper $type={action.actionType} selected={selected}>
        {action.actionType === actionTypeEnum.CONTROL.code && (
          <>
            <ControlIcon />
            <SummaryContent>
              <Title>
                Contrôles{' '}
                {action.actionTheme ? (
                  <Accented>{`${action.actionTheme} ${
                    action.actionSubTheme ? ` - ${action.actionSubTheme}` : ''
                  }`}</Accented>
                ) : (
                  'à renseigner'
                )}
              </Title>
              {action.actionNumberOfControls && (
                <ControlSummary>
                  <Accented>{action.actionNumberOfControls}</Accented>
                  {` contrôles réalisés sur des cibles de type `}
                  <Accented>{actionTargetTypeEnum[action.actionTargetType]?.libelle || 'non spécifié'}</Accented>
                </ControlSummary>
              )}
              {action.actionNumberOfControls && (
                <ControlInfractionsTags
                  actionNumberOfControls={action.actionNumberOfControls}
                  infractions={action?.infractions}
                />
              )}
            </SummaryContent>
          </>
        )}
        {action.actionType === actionTypeEnum.SURVEILLANCE.code && (
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
              {action.duration && (
                <DurationWrapper>
                  <Accented>{action.duration} heure(s)&nbsp;</Accented>
                  de surveillance
                </DurationWrapper>
              )}
            </SummaryContent>
          </>
        )}

        {action.actionType === actionTypeEnum.NOTE.code && (
          <>
            <NoteIcon />
            <NoteContent>{action.observations || 'Observation à renseigner'}</NoteContent>
          </>
        )}

        <ButtonsWrapper>
          <IconButton
            icon={<DuplicateSVG className="rs-icon" />}
            onClick={duplicateAction}
            size="sm"
            title="dupliquer"
          />
          <IconButton icon={<DeleteIcon className="rs-icon" />} onClick={removeAction} size="sm" title="supprimer" />
        </ButtonsWrapper>
      </ActionSummaryWrapper>
    </Action>
  )
}

const Action = styled.div`
  display: flex;
  margin-top: ${props => (props.selected ? `1px` : '4px')};
  margin-bottom: ${props => (props.selected ? `1px` : '4px')};
`
const TimeLine = styled.div`
  display: flex;
  align-items: center;
  width: 50px;
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
const ActionSummaryWrapper = styled.div`
  display: flex;
  flex: 1;
  border: ${props => (props.selected ? `3px solid ${COLORS.blueGray}` : `1px solid ${COLORS.lightGray}`)};
  background: ${props =>
    props.$type === actionTypeEnum.CONTROL.code
      ? COLORS.white
      : props.$type === actionTypeEnum.SURVEILLANCE.code
      ? COLORS.gainsboro
      : COLORS.blueGray25};
  padding: ${props => (props.selected ? `4px` : '6px')};
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
  margin-top: 18px;
  margin-left: 18px;
  margin-right: 8px;
`

const NoteIcon = styled(NoteSVG)`
  color: ${COLORS.gunMetal};
  width: 16px;
  height: 16px;
  margin-top: 18px;
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
