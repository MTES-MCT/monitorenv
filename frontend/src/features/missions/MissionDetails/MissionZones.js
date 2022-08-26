import React from 'react'
import styled from 'styled-components';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { Form, Button } from 'rsuite'
import {  useField } from 'formik';
import { boundingExtent } from 'ol/extent';
import { transformExtent } from 'ol/proj'

import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../../domain/entities/map';

import { addMissionZone } from '../../../domain/use_cases/missions/missionAndControlLocalisation';
import { MissionZone } from './MissionZone';
import { setFitToExtent } from '../../../domain/shared_slices/Map';

export const MissionZones = ({name}) => {
  const [field, , helpers] = useField(name);
  const { value } = field;
  const { setValue } = helpers;
  const dispatch = useDispatch()
  const handleAddMissionZone = () => {
    dispatch(addMissionZone({callback: setValue, geom: value}))
  }
  
  const handleDeleteZone = (index) => () => {
    const newCoordinates = [...value.coordinates]
    newCoordinates.splice(index,1)
    setValue({...value, coordinates: newCoordinates})
  }
  const handleCenterOnMap = (coordinates) => () => {
    const extent = transformExtent(boundingExtent(coordinates[0]), WSG84_PROJECTION, OPENLAYERS_PROJECTION)
    dispatch(setFitToExtent({extent}))
  }
  return (
    <FormGroupMission>
      <Form.ControlLabel htmlFor={name}>Localisations : </Form.ControlLabel>
      <SizedButton appearance='ghost' block  size='sm' onClick={handleAddMissionZone}>
          + Ajouter une zone de mission
      </SizedButton>
      <ZoneList>
        {_.map(value?.coordinates, (coordinates,i)=>{
        return (
          <MissionZone
            key={i}
            zone={coordinates}
            name={`Polygone dessiné ${i+1}`}
            handleDelete={handleDeleteZone(i)}
            handleCenterOnMap={handleCenterOnMap(coordinates)}
            />
        )}
        )}
      </ZoneList>
    </FormGroupMission>
  )
}

const FormGroupMission = styled(Form.Group)``

const SizedButton = styled(Button)`
  max-width: 416px;
`

const ZoneList = styled.div`
  margin-top: 8px;
  margin-bottom: 16px;
`