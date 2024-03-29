import { Accent, Button, Icon, IconButton, Label, type Coordinates } from '@mtes-mct/monitor-ui'
import { convertToGeoJSONGeometryObject } from 'domain/entities/layers'
import { CIRCULAR_ZONE_RADIUS, type Mission } from 'domain/entities/missions'
import { useField, useFormikContext } from 'formik'
import { isEqual } from 'lodash'
import { Feature } from 'ol'
import { boundingExtent } from 'ol/extent'
import { MultiPolygon } from 'ol/geom'
import Polygon, { circular } from 'ol/geom/Polygon'
import { transformExtent } from 'ol/proj'
import { remove } from 'ramda'
import { useCallback, useEffect, useMemo } from 'react'
import styled from 'styled-components'

import {
  InteractionListener,
  OLGeometryType,
  OPENLAYERS_PROJECTION,
  WSG84_PROJECTION
} from '../../../../../domain/entities/map/constants'
import { setFitToExtent } from '../../../../../domain/shared_slices/Map'
import { drawPoint } from '../../../../../domain/use_cases/draw/drawGeometry'
import { useAppDispatch } from '../../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../../hooks/useAppSelector'
import { useListenForDrawedGeometry } from '../../../../../hooks/useListenForDrawing'
import { formatCoordinates } from '../../../../../utils/coordinates'

import type { Coordinate } from 'ol/coordinate'

const CONTROL_INTERACTION_LISTENER = InteractionListener.CONTROL_POINT

export type MultiPointPickerProps = {
  actionIndex: number
}

export function MultiPointPicker({ actionIndex }: MultiPointPickerProps) {
  const { setFieldValue, values } = useFormikContext<Mission>()
  const dispatch = useAppDispatch()
  const listener = useAppSelector(state => state.draw.listener)
  const coordinatesFormat = useAppSelector(state => state.map.coordinatesFormat)
  const { geometry } = useListenForDrawedGeometry(CONTROL_INTERACTION_LISTENER)

  const [field, meta, helpers] = useField(`envActions[${actionIndex}].geom`)
  const { value } = field
  const { setValue } = helpers

  const isAddingAControl = useMemo(() => listener === CONTROL_INTERACTION_LISTENER, [listener])

  const points = useMemo(() => {
    if (!value) {
      return []
    }

    return value.coordinates || []
  }, [value])

  useEffect(() => {
    if (geometry?.type === OLGeometryType.MULTIPOINT && !isEqual(geometry, value)) {
      setValue(geometry)
      if ((!values.geom || values.geom?.coordinates.length === 0) && values.envActions.length === 1) {
        const circleGeometry = new Feature({
          geometry: circular(geometry.coordinates[0] as Coordinates, CIRCULAR_ZONE_RADIUS, 64).transform(
            WSG84_PROJECTION,
            OPENLAYERS_PROJECTION
          )
        }).getGeometry()
        setFieldValue('geom', convertToGeoJSONGeometryObject(new MultiPolygon([circleGeometry as Polygon])))
        setFieldValue('isGeometryComputedFromControls', true)
      }
    }
  }, [geometry, setValue, value, values.envActions.length, values.geom, setFieldValue])

  const handleCenterOnMap = coordinates => {
    if (!coordinates) {
      return
    }

    const extent = transformExtent(boundingExtent([coordinates]), WSG84_PROJECTION, OPENLAYERS_PROJECTION)
    dispatch(setFitToExtent(extent))
  }

  const handleAddPoint = useCallback(() => {
    dispatch(drawPoint(value))
  }, [dispatch, value])

  const handleDeleteZone = useCallback(
    (index: number) => {
      if (!value) {
        return
      }
      const nextCoordinates = remove(index, 1, value.coordinates)
      setValue({ ...value, coordinates: nextCoordinates })
      if (values.isGeometryComputedFromControls && values.envActions.length === 1) {
        setFieldValue('geom', undefined)
        setFieldValue('isGeometryComputedFromControls', false)
      }
    },
    [value, setValue, values.isGeometryComputedFromControls, values.envActions.length, setFieldValue]
  )

  return (
    <Field>
      <Label $isRequired>Lieu du contrôle</Label>

      <Button
        accent={meta.error ? Accent.ERROR : Accent.SECONDARY}
        disabled={points.length > 0}
        Icon={Icon.Plus}
        isFullWidth
        onClick={handleAddPoint}
      >
        Ajouter un point de contrôle
      </Button>

      <>
        {points.map((coordinates, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Row key={`zone-${index}`}>
            <ZoneWrapper>
              {formatCoordinates(coordinates, coordinatesFormat)}
              {/* TODO Add `Accent.LINK` accent in @mtes-mct/monitor-ui and use it here. */}
              {/* eslint-disable jsx-a11y/anchor-is-valid */}
              {/* eslint-disable jsx-a11y/click-events-have-key-events */}
              {/* eslint-disable jsx-a11y/no-static-element-interactions */}
              <Center onClick={() => handleCenterOnMap(coordinates as Coordinate)}>
                <Icon.SelectRectangle />
                Centrer sur la carte
              </Center>
            </ZoneWrapper>

            <>
              <IconButton
                accent={Accent.SECONDARY}
                disabled={isAddingAControl}
                Icon={Icon.Edit}
                onClick={handleAddPoint}
              />
              <IconButton
                accent={Accent.SECONDARY}
                aria-label="Supprimer cette zone"
                disabled={isAddingAControl}
                Icon={Icon.Delete}
                onClick={() => handleDeleteZone(index)}
              />
            </>
          </Row>
        ))}
      </>
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
  color: ${p => p.theme.color.slateGray};
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
    margin: 0 0 0 4px;
  }
`

const ZoneWrapper = styled.div`
  background-color: ${p => p.theme.color.white};
  display: flex;
  flex-grow: 1;
  font-size: 13px;
  justify-content: space-between;
  padding: 4px 8px 4px;
`
