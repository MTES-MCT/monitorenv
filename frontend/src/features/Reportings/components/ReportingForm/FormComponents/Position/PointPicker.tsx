import { ZoneWrapper } from '@components/ZonePicker/DrawedPolygonWithCenterButton'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { useListenForDrawedGeometry } from '@hooks/useListenForDrawing'
import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import { formatCoordinates } from '@utils/coordinates'
import { InteractionListener, OLGeometryType } from 'domain/entities/map/constants'
import { drawPoint } from 'domain/use_cases/draw/drawGeometry'
import { centerOnMap } from 'domain/use_cases/map/centerOnMap'
import { useField } from 'formik'
import { isEqual } from 'lodash'
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
    if (geometry?.type === OLGeometryType.MULTIPOINT && !isEqual(geometry, value)) {
      setValue(geometry)
    }
  }, [geometry, setValue, value])

  const handleCenterOnMap = () => {
    const { coordinates } = value
    dispatch(centerOnMap([coordinates[0]]))
  }

  const handleAddPoint = useCallback(() => {
    dispatch(drawPoint(value, InteractionListener.REPORTING_POINT))
  }, [dispatch, value])

  const handleDeletePoint = useCallback(() => {
    if (value) {
      setValue(undefined)
    }
  }, [setValue, value])

  return (
    <Field>
      {value?.coordinates?.length > 0 && value.type === OLGeometryType.MULTIPOINT && (
        <Row>
          <ZoneWrapper>
            <span>{formatCoordinates(value.coordinates[0] as Coordinate, coordinatesFormat)}</span>
            <IconButton
              accent={Accent.TERTIARY}
              Icon={Icon.FocusZones}
              onClick={handleCenterOnMap}
              title="Centrer sur la carte"
            />
          </ZoneWrapper>

          <IconButton
            accent={Accent.SECONDARY}
            disabled={isAddingAPoint}
            Icon={Icon.Edit}
            onClick={handleAddPoint}
            title="Ajouter un point"
          />
          <IconButton
            accent={Accent.SECONDARY}
            disabled={isAddingAPoint}
            Icon={Icon.Delete}
            onClick={handleDeletePoint}
            title="Supprimer ce point"
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
