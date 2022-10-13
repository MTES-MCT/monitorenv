import { useField } from 'formik'
import _ from 'lodash'
import { boundingExtent } from 'ol/extent'
import { transformExtent } from 'ol/proj'
import React from 'react'
import { useDispatch } from 'react-redux'
import { Form, Button } from 'rsuite'
import styled from 'styled-components'

import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../../domain/entities/map'
import { setFitToExtent } from '../../../domain/shared_slices/Map'
import { addMissionZone } from '../../../domain/use_cases/missions/missionAndControlLocalisation'
import { MissionZone } from './MissionZone'

export function MissionZones({ name }) {
  const [field, , helpers] = useField(name)
  const { value } = field
  const { setValue } = helpers
  const dispatch = useDispatch()
  const handleAddMissionZone = () => {
    dispatch(addMissionZone({ callback: setValue, geom: value }))
  }

  const handleDeleteZone = index => () => {
    const newCoordinates = [...value.coordinates]
    newCoordinates.splice(index, 1)
    setValue({ ...value, coordinates: newCoordinates })
  }
  const handleCenterOnMap = coordinates => () => {
    const extent = transformExtent(boundingExtent(coordinates[0]), WSG84_PROJECTION, OPENLAYERS_PROJECTION)
    dispatch(setFitToExtent(extent))
  }

  return (
    <FormGroupMission>
      <Form.ControlLabel htmlFor={name}>Localisations : </Form.ControlLabel>
      <SizedButton appearance="ghost" block onClick={handleAddMissionZone}>
        + Ajouter une zone de mission
      </SizedButton>
      <ZoneList>
        {_.map(value?.coordinates, (coordinates, i) => (
          <MissionZone
            key={i}
            handleCenterOnMap={handleCenterOnMap(coordinates)}
            handleDelete={handleDeleteZone(i)}
            name={`Polygone dessiné ${i + 1}`}
            zone={coordinates}
          />
        ))}
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
