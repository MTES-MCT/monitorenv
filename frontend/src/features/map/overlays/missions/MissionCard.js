import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { format, isValid } from 'date-fns'
import { fr } from 'date-fns/locale'

import { editMissionFromMap } from '../../../../domain/use_cases/missions/editMissionFromMap'
import { COLORS } from '../../../../constants/constants'
import { missionTypeEnum } from '../../../../domain/entities/missions'
import { clearSelectedMissionOnMap } from '../../../../domain/use_cases/missions/selectMissionOnMap'

export const MissionCard = ({feature, selected}) => {
  const dispatch = useDispatch()
  const { 
    missionId,
    inputStartDatetimeUtc,
    missionType,
    unit,
    administration,
    numberOfActions,
    missionStatus,
  } = feature.getProperties()
  const parsedInputStartDatetimeUtc = new Date(inputStartDatetimeUtc)

  const handleEditMission = useCallback(() => {
    dispatch(editMissionFromMap(missionId))
  }, [dispatch, missionId])

  const handleCloseOverlay = useCallback(() => {
    dispatch(clearSelectedMissionOnMap())
  }, [dispatch])

  return (<>
  <MissionCardHeader>
    <Col1>
      <MissionDate>
        {isValid(parsedInputStartDatetimeUtc) && format(parsedInputStartDatetimeUtc, "dd MMM yyyy", {locale: fr})}
      </MissionDate>
    </Col1>
    <Col2>
      <MissionType>Mission {missionTypeEnum[missionType]?.libelle}</MissionType>
      <MissionReources>{administration} ({unit})</MissionReources>
      <Actions>{numberOfActions} actions réalisées</Actions>
      <MissionStatus>{missionStatus}</MissionStatus>
      {selected && <EditMissionButton onClick={handleEditMission}>Editer</EditMissionButton>}
    </Col2>
    {selected && <CloseButton onClick={handleCloseOverlay}>X</CloseButton>}
  </MissionCardHeader>
  </>)
}

const MissionCardHeader = styled.div`
background: ${COLORS.white};
padding: 4px 5px 5px 5px;
border-top-left-radius: 2px;
border-top-right-radius: 2px;
display: flex;
`

const MissionDate = styled.div`
`

const MissionType = styled.div`
font-weight: bold;
`

const MissionReources = styled.div`
`
const Actions = styled.div`
`
const MissionStatus = styled.div`
`

const Col1 = styled.div``
const Col2 = styled.div``

const EditMissionButton = styled.button``
const CloseButton = styled.button`
  float: right;
`