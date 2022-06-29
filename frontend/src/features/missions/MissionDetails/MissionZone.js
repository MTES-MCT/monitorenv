import React from 'react'
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import {  useField } from 'formik';

import { addMissionZone } from '../../../domain/use_cases/missionLocalisation';

import { COLORS } from '../../../constants/constants';
import _ from 'lodash';

export const MissionZone = ({name}) => {
  const [field, , helpers] = useField(name);
  const { value } = field;
  const { setValue } = helpers;
  const dispatch = useDispatch()
  const handleAddMissionZone = () => {
    dispatch(addMissionZone({callback: setValue, geom: value}))
  }
  
  return (
    <>
    <AddMissionZoneButton type={"button"} onClick={handleAddMissionZone}>
        + Ajouter une zone de mission
    </AddMissionZoneButton>
    <ZoneList>
      {_.map(value?.coordinates, (v,i)=><Zone key={i}>Polygone dessiné {i+1}</Zone>)}
    </ZoneList>
    </>
  )
}

const AddMissionZoneButton = styled.button`
  background: ${COLORS.shadowBlue};
  width: 419px;
  color: ${COLORS.white};
  line-height: 27px;
  margin-bottom: 16px;
`
const ZoneList = styled.div`
  margin-bottom: 16px;
`
const Zone = styled.div`
  width: 419px;
  line-height: 30px;
  margin-bottom: 4px;
  background: ${COLORS.gainsboro};
  color: ${COLORS.charcoal};

`