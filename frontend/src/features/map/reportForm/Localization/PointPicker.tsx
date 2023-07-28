import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import { useField } from 'formik'
import _ from 'lodash'
import { boundingExtent } from 'ol/extent'
import { transformExtent } from 'ol/proj'
import { useCallback, useEffect, useMemo } from 'react'
import styled from 'styled-components'

import { COLORS } from '../../../../constants/constants'
import {
  InteractionListener,
  OLGeometryType,
  OPENLAYERS_PROJECTION,
  WSG84_PROJECTION
} from '../../../../domain/entities/map/constants'
import { setFitToExtent } from '../../../../domain/shared_slices/Map'
import { addControlPosition } from '../../../../domain/use_cases/missions/addZone'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { useListenForDrawedGeometry } from '../../../../hooks/useListenForDrawing'
import { getCoordinates } from '../../../../utils/coordinates'

import type { Coordinate } from 'ol/coordinate'

export function PointPicker() {
  const dispatch = useAppDispatch()
  const listener = useAppSelector(state => state.draw.listener)
  const { coordinatesFormat } = useAppSelector(state => state.map)
  const { geometry } = useListenForDrawedGeometry(InteractionListener.REPORTING_POINT)

  const [field, , helpers] = useField('geom')
  const { value } = field
  const { setValue } = helpers

  const isAddingAControl = useMemo(() => listener === InteractionListener.REPORTING_POINT, [listener])

  useEffect(() => {
    if (geometry?.type === OLGeometryType.MULTIPOINT && !_.isEqual(geometry, value)) {
      setValue(geometry)
    }
  }, [geometry, setValue, value])

  const getShowedCoordinates = () => {
    const { coordinates } = value

    const transformedCoordinates = getCoordinates(coordinates[0], WSG84_PROJECTION, coordinatesFormat)

    if (Array.isArray(transformedCoordinates) && transformedCoordinates.length === 2) {
      return `${transformedCoordinates[0]} ${transformedCoordinates[1]}`
    }

    return ''
  }

  const handleCenterOnMap = () => {
    const { coordinates } = value
    if (!coordinates) {
      return
    }

    const extent = transformExtent(boundingExtent([coordinates as Coordinate]), WSG84_PROJECTION, OPENLAYERS_PROJECTION)
    dispatch(setFitToExtent(extent))
  }

  const handleAddPoint = useCallback(() => {
    dispatch(addControlPosition(value, InteractionListener.REPORTING_POINT))
  }, [dispatch, value])

  const handleDeleteZone = useCallback(() => {
    if (value) {
      setValue(undefined)
    }
  }, [setValue, value])

  return (
    <Field>
      {value?.coordinates && value.type === OLGeometryType.MULTIPOINT && (
        <Row>
          <ZoneWrapper>
            {getShowedCoordinates()}
            <Center onClick={handleCenterOnMap}>
              <Icon.SelectRectangle />
              Centrer sur la carte
            </Center>
          </ZoneWrapper>

          <IconButton accent={Accent.SECONDARY} disabled={isAddingAControl} Icon={Icon.Edit} onClick={handleAddPoint} />
          <IconButton
            accent={Accent.SECONDARY}
            aria-label="Supprimer cette zone"
            disabled={isAddingAControl}
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
  margin-left: auto;
  margin-right: 8px;
  color: ${COLORS.slateGray};
  text-decoration: underline;
  > div {
    vertical-align: middle;
    padding-right: 8px;
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
    margin: 0 0 0 0.5rem;
  }
`

const ZoneWrapper = styled.div`
  background-color: ${p => p.theme.color.gainsboro};
  display: flex;
  flex-grow: 1;
  font-size: 13px;
  justify-content: space-between;
  padding: 5px 0.75rem 4px;
`
