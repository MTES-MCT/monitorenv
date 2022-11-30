import { useField } from 'formik'
import _ from 'lodash'
import { boundingExtent } from 'ol/extent'
import { transformExtent } from 'ol/proj'
import { useDispatch } from 'react-redux'
import { Button, Form } from 'rsuite'
import styled from 'styled-components'

import { COLORS } from '../../../constants/constants'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../../domain/entities/map'
import { setFitToExtent } from '../../../domain/shared_slices/Map'
import { addSurveillanceZone } from '../../../domain/use_cases/missions/missionAndControlLocalisation'
import { Zone } from './Zone'

export function SurveillanceZones({ name }) {
  const [missionGeomField] = useField('geom')
  const [field, , helpers] = useField(name)
  const { value } = field
  const { setValue } = helpers
  const dispatch = useDispatch()

  const handleAddSurveillanceZone = () => {
    dispatch(addSurveillanceZone({ callback: setValue, geom: value, missionGeom: missionGeomField?.value }))
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
    <SurveillanceZonesWrapper>
      <Form.ControlLabel>Zone de surveillance</Form.ControlLabel>

      <AddButton appearance="ghost" block onClick={handleAddSurveillanceZone} size="sm">
        + Ajouter une zone de surveillance
      </AddButton>
      <ZoneList>
        {_.map(value?.coordinates, (coordinates, i) => (
          <ZoneWhite
            key={i}
            data-cy="zone"
            handleCenterOnMap={handleCenterOnMap(coordinates)}
            handleDelete={handleDeleteZone(i)}
            name={`Polygone dessiné ${i + 1}`}
          />
        ))}
      </ZoneList>
    </SurveillanceZonesWrapper>
  )
}

const SurveillanceZonesWrapper = styled.div`
  width: 100%;
`
const AddButton = styled(Button)`
  width: 412px;
`
const ZoneList = styled.div`
  margin-top: 8px;
  margin-bottom: 10px;
`

const ZoneWhite = styled(Zone)`
  > div {
    background: ${COLORS.white};
  }
`
