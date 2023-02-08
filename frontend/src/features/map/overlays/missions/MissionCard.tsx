import { format, isValid } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { IconButton } from 'rsuite'
import styled from 'styled-components'

import { COLORS } from '../../../../constants/constants'
import { getControlUnitsAsText } from '../../../../domain/entities/controlUnit'
import { missionTypeEnum } from '../../../../domain/entities/missions'
import { editMission } from '../../../../domain/use_cases/missions/editMission'
import { clearSelectedMissionOnMap } from '../../../../domain/use_cases/missions/selectMissionOnMap'
import { MissionStatusLabel } from '../../../../ui/MissionStatusLabel'
import { ReactComponent as CloseIconSVG } from '../../../../uiMonitor/icons/Close.svg'
import { ReactComponent as EditIconSVG } from '../../../../uiMonitor/icons/Edit.svg'

export function MissionCard({ feature, selected }: { feature: any; selected?: boolean }) {
  const dispatch = useDispatch()
  const { controlUnits, missionId, missionStatus, missionType, numberOfActions, startDateTimeUtc } =
    feature.getProperties()
  const parsedstartDateTimeUtc = new Date(startDateTimeUtc)

  const handleEditMission = useCallback(() => {
    dispatch(editMission(missionId))
  }, [dispatch, missionId])

  const handleCloseOverlay = useCallback(() => {
    dispatch(clearSelectedMissionOnMap())
  }, [dispatch])

  return (
    <MissionCardHeader>
      <Col1>
        <MissionDate>
          {isValid(parsedstartDateTimeUtc) && format(parsedstartDateTimeUtc, 'dd MMM yyyy', { locale: fr })}
        </MissionDate>
      </Col1>
      <Col2>
        <MissionType>Mission {missionTypeEnum[missionType]?.libelle}</MissionType>
        <MissionReources>{getControlUnitsAsText(controlUnits)}</MissionReources>
        <Actions>
          {numberOfActions || 0} action{numberOfActions > 1 ? 's' : ''} réalisée{numberOfActions > 1 ? 's' : ''}
        </Actions>
        <MissionStatusLabel missionStatus={missionStatus} />
        {selected && (
          <EditButton
            appearance="primary"
            icon={<EditIconSVG className="rs-icon" />}
            onClick={handleEditMission}
            size="sm"
          >
            Editer
          </EditButton>
        )}
      </Col2>
      <Col3>
        {selected && (
          <IconButton
            appearance="link"
            icon={<CloseIconSVG className="rs-icon" />}
            onClick={handleCloseOverlay}
            size="sm"
          />
        )}
      </Col3>
    </MissionCardHeader>
  )
}

const MissionCardHeader = styled.div`
  background: ${COLORS.white};
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  display: flex;
  width: 380px;
  height: 136px;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.3);
`

const MissionDate = styled.div`
  width: 80px;
  font-size: 12px;
  margin-right: 16px;
`

const MissionType = styled.div`
  font-weight: bold;
`

const MissionReources = styled.div`
  font-size: 12px;
  height: 34px;
  color: ${COLORS.slateGray};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`
const Actions = styled.div``

const Col1 = styled.div`
  padding: 8px 0px 5px 10px;
`
const Col2 = styled.div`
  padding: 8px 8px 4px 8px;
`
const Col3 = styled.div`
  margin-left: auto;
  padding-right: 4px;
`
const EditButton = styled(IconButton)`
  margin-top: 4px;
`
