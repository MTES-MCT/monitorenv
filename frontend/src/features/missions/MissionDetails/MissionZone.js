import React from 'react'
import styled from 'styled-components';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { Form, Button } from 'rsuite'
import {  useField } from 'formik';

import { addMissionZone } from '../../../domain/use_cases/missions/missionAndControlLocalisation';

import { COLORS } from '../../../constants/constants';

export const MissionZone = ({name}) => {
  const [field, , helpers] = useField(name);
  const { value } = field;
  const { setValue } = helpers;
  const dispatch = useDispatch()
  const handleAddMissionZone = () => {
    dispatch(addMissionZone({callback: setValue, geom: value}))
  }
  
  return (
    <Form.Group>
      <Form.ControlLabel htmlFor={name}>Localisations : </Form.ControlLabel>
      <Button appearance='ghost' block size='sm' onClick={handleAddMissionZone}>
          + Ajouter une zone de mission
      </Button>
      <ZoneList>
        {_.map(value?.coordinates, (v,i)=><Zone key={i}>Polygone dessiné {i+1}</Zone>)}
      </ZoneList>
    </Form.Group>
  )
}

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