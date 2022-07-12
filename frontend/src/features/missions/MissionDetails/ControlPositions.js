import React from 'react'
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import {  useField } from 'formik';

import { addControlPositions } from '../../../domain/use_cases/missions/missionAndControlLocalisation';

import { COLORS } from '../../../constants/constants';
import _ from 'lodash';
import { PrimaryButton } from '../../commonStyles/Buttons.style';

export const ControlPositions = ({name}) => {
  const [field, , helpers] = useField(name);
  const { value } = field;
  const { setValue } = helpers;
  const dispatch = useDispatch()
  const handleAddControlPositions = () => {
    dispatch(addControlPositions({callback: setValue, geom: value}))
  }
  
  return (
    <>
    <AddControlPositionButton background={COLORS.shadowBlue} color={COLORS.white} onClick={handleAddControlPositions}>
        + Ajouter un point de contrôle
    </AddControlPositionButton>
    <ZoneList>
      {_.map(value?.coordinates, (v,i)=><Zone key={i}>Point dessiné {i+1}</Zone>)}
    </ZoneList>
    </>
  )
}

const AddControlPositionButton = styled(PrimaryButton)`
  width: 419px;
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