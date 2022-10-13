import { useField } from 'formik'
import _ from 'lodash'
import { transform } from 'ol/proj'
import React from 'react'
import { useDispatch } from 'react-redux'
import { Button, Form, IconButton } from 'rsuite'
import styled from 'styled-components'

import { COLORS } from '../../../constants/constants'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../../domain/entities/map'
import { setZoomToCenter } from '../../../domain/shared_slices/Map'
import { addControlPositions } from '../../../domain/use_cases/missions/missionAndControlLocalisation'
import { ReactComponent as DeleteSVG } from '../../../uiMonitor/icons/Delete.svg'
import { ReactComponent as LocalizeIconSVG } from '../../../uiMonitor/icons/Focus.svg'

export function ControlPositions({ name }) {
  const [geomField] = useField('geom')
  const [field, , helpers] = useField(name)
  const { value } = field
  const { setValue } = helpers
  const dispatch = useDispatch()

  const handleAddControlPositions = () => {
    dispatch(addControlPositions({ callback: setValue, geom: value, missionGeom: geomField?.value }))
  }

  const handleDeleteControlPosition = index => () => {
    const newCoordinates = [...value.coordinates]
    newCoordinates.splice(index, 1)
    dispatch(setValue({ ...value, coordinates: newCoordinates }))
  }

  const handleCenterOnMap = coordinates => () => {
    const center = transform(coordinates, WSG84_PROJECTION, OPENLAYERS_PROJECTION)
    dispatch(setZoomToCenter(center))
  }

  return (
    <ControlPositionsWrapper>
      <Form.ControlLabel>Lieu du contrôle</Form.ControlLabel>

      <AddButton appearance="ghost" block onClick={handleAddControlPositions} size="sm">
        + Ajouter un point de contrôle
      </AddButton>
      <ZoneList>
        {_.map(value?.coordinates, (v, i) => (
          <ZoneRow key={i}>
            <Zone>
              {`(${v[1]}, ${v[0]})`}
              <CenterOnMap onClick={handleCenterOnMap(v)}>
                <LocalizeIcon />
                Centrer
              </CenterOnMap>
            </Zone>
            <DeleteIconButton icon={<DeleteSVGIcon className="rs-icon" />} onClick={handleDeleteControlPosition(i)} />
          </ZoneRow>
        ))}
      </ZoneList>
    </ControlPositionsWrapper>
  )
}

const ControlPositionsWrapper = styled.div`
  width: 100%;
`
const AddButton = styled(Button)`
  width: 412px;
`
const ZoneList = styled.div`
  margin-top: 8px;
  margin-bottom: 10px;
`
const ZoneRow = styled.div`
  display: flex;
  margin-bottom: 4px;
`

const Zone = styled.div`
  width: 412px;
  line-height: 30px;
  background: ${COLORS.white};
  color: ${COLORS.gunMetal};
  padding-left: 12px;
  display: flex;
`
const DeleteSVGIcon = styled(DeleteSVG)`
  width: 16px;
  height: 16px;
`
const DeleteIconButton = styled(IconButton)`
  margin-left: 6px;
`
const CenterOnMap = styled.div`
  cursor: pointer;
  margin-left: auto;
  margin-right: 8px;
  color: ${COLORS.slateGray};
  text-decoration: underline;
`
const LocalizeIcon = styled(LocalizeIconSVG)`
  margin-right: 8px;
  font-size: 12px;
`
