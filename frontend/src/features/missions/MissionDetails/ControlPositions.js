import React from 'react'
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import {  useField } from 'formik';
import _ from 'lodash';
import { Button, Form } from 'rsuite';

import { addControlPositions } from '../../../domain/use_cases/missions/missionAndControlLocalisation';

import { COLORS } from '../../../constants/constants';

export const ControlPositions = ({name}) => {
  const [field, , helpers] = useField(name);
  const { value } = field;
  const { setValue } = helpers;
  const dispatch = useDispatch()
  const handleAddControlPositions = () => {
    dispatch(addControlPositions({callback: setValue, geom: value}))
  }
  
  return (
    <ControlPositionsWrapper>
      <Form.ControlLabel>
        Lieu du contrôle
      </Form.ControlLabel>
      <Button appearance='ghost' size='sm' block onClick={handleAddControlPositions}>
          + Ajouter un point de contrôle
      </Button>
      <ZoneList>
        {_.map(value?.coordinates, (v,i)=><Zone key={i}>Point dessiné {i+1}</Zone>)}
      </ZoneList>
    </ControlPositionsWrapper>
  )
}

const ControlPositionsWrapper = styled.div`
  width: 100%;
`
const ZoneList = styled.div`
  margin-bottom: 10px;
`
const Zone = styled.div`
  width: 419px;
  line-height: 30px;
  margin-bottom: 4px;
  background: ${COLORS.gainsboro};
  color: ${COLORS.charcoal};

`