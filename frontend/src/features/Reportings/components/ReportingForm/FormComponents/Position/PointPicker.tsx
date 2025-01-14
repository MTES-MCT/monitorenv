import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { useListenForDrawedGeometry } from '@hooks/useListenForDrawing'
import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import { formatCoordinates } from '@utils/coordinates'
import { InteractionListener, OLGeometryType } from 'domain/entities/map/constants'
import { drawPoint } from 'domain/use_cases/draw/drawGeometry'
import { centerOnMapFromZonePicker } from 'domain/use_cases/map/centerOnMapFromZonePicker'
import { useField } from 'formik'
import _ from 'lodash'
import { useCallback, useEffect, useMemo } from 'react'
import styled from 'styled-components'

import type { Coordinate } from 'ol/coordinate'

export function PointPicker() {
  const dispatch = useAppDispatch()
  const listener = useAppSelector(state => state.draw.listener)
  const coordinatesFormat = useAppSelector(state => state.map.coordinatesFormat)
  const { geometry } = useListenForDrawedGeometry(InteractionListener.REPORTING_POINT)

  const [field, , helpers] = useField('geom')
  const { value } = field
  const { setValue } = helpers

  const isAddingAPoint = useMemo(() => listener === InteractionListener.REPORTING_POINT, [listener])

  useEffect(() => {
    if (geometry?.type === OLGeometryType.MULTIPOINT && !_.isEqual(geometry, value)) {
      setValue(geometry)
    }
  }, [geometry, setValue, value])

  const handleCenterOnMap = () => {
    const { coordinates } = value
    dispatch(centerOnMapFromZonePicker([coordinates[0]]))
  }

  const handleAddPoint = useCallback(() => {
    dispatch(drawPoint(value, InteractionListener.REPORTING_POINT))
  }, [dispatch, value])

  const handleDeleteZone = useCallback(() => {
    if (value) {
      setValue(undefined)
    }
  }, [setValue, value])

  return (
    <Field>
      {value?.coordinates?.length > 0 && value.type === OLGeometryType.MULTIPOINT && (
        <Row>
          <ZoneWrapper>
            {formatCoordinates(value.coordinates[0] as Coordinate, coordinatesFormat)}
            <Center onClick={handleCenterOnMap}>
              <Icon.SelectRectangle />
              Centrer sur la carte
            </Center>
          </ZoneWrapper>

          <IconButton accent={Accent.SECONDARY} disabled={isAddingAPoint} Icon={Icon.Edit} onClick={handleAddPoint} />
          <IconButton
            accent={Accent.SECONDARY}
            aria-label="Supprimer cette zone"
            disabled={isAddingAPoint}
            Icon={Icon.Delete}
            onClick={handleDeleteZone}
          />
        </Row>
      )}
    </Field>
  )
}

const Field = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
`
const Center = styled.div`
  cursor: pointer;
  display: flex;
  margin-left: auto;
  margin-right: 8px;
  color: ${p => p.theme.color.slateGray};
  text-decoration: underline;

  > .Element-IconBox {
    margin-right: 8px;
  }
`

const Row = styled.div`
  &:first-of-type {
    margin-top: 8px;
  }
  align-items: center;
  display: flex;
  width: 100%;
  margin-bottom: 4px;

  > button {
    margin: 0 0 0 4px;
  }
`

const ZoneWrapper = styled.div`
  background-color: ${p => p.theme.color.gainsboro};
  display: flex;
  flex-grow: 1;
  font-size: 13px;
  justify-content: space-between;
  padding: 4px 8px 4px;
`
