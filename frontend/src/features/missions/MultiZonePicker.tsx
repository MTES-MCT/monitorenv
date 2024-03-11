import { Accent, Button, Icon, IconButton, Label } from '@mtes-mct/monitor-ui'
import { useField, useFormikContext } from 'formik'
import _ from 'lodash'
import { boundingExtent } from 'ol/extent'
import { transformExtent } from 'ol/proj'
import { remove } from 'ramda'
import { useCallback, useEffect, useMemo } from 'react'
import styled from 'styled-components'

import {
  InteractionListener,
  OLGeometryType,
  OPENLAYERS_PROJECTION,
  WSG84_PROJECTION
} from '../../domain/entities/map/constants'
import { setFitToExtent } from '../../domain/shared_slices/Map'
import { drawPolygon } from '../../domain/use_cases/draw/drawGeometry'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useListenForDrawedGeometry } from '../../hooks/useListenForDrawing'

import type { Mission } from 'domain/entities/missions'
import type { Coordinate } from 'ol/coordinate'

const MISSION_GEOM_NAME = 'geom'

export type MultiZonePickerProps = {
  addButtonLabel: string
  interactionListener: InteractionListener
  isLight?: boolean
  label?: string | undefined
  name: string
}
export function MultiZonePicker({
  addButtonLabel,
  interactionListener,
  isLight,
  label = undefined,
  name
}: MultiZonePickerProps) {
  const { setFieldValue, values } = useFormikContext<Mission>()
  const dispatch = useAppDispatch()
  const { geometry } = useListenForDrawedGeometry(interactionListener)
  const [field, meta, helpers] = useField(name)
  const { value } = field

  // TODO: Clean this component beacause it's only for mission zone
  const isDrawingPolygonVisible =
    (name === MISSION_GEOM_NAME && !values.isGeometryComputedFromControls) || name !== MISSION_GEOM_NAME
  const listener = useAppSelector(state => state.draw.listener)
  const isEditingZone = useMemo(
    () => listener === InteractionListener.MISSION_ZONE || listener === InteractionListener.SURVEILLANCE_ZONE,
    [listener]
  )

  const polygons = useMemo(() => {
    if (!value) {
      return []
    }

    return value.coordinates || []
  }, [value])

  useEffect(() => {
    if (geometry?.type === OLGeometryType.MULTIPOLYGON && !_.isEqual(geometry, value)) {
      helpers.setValue(geometry)
    }
  }, [geometry, helpers, value])

  const handleCenterOnMap = (coordinates: Coordinate[][]) => {
    const firstRing = coordinates[0]
    if (!firstRing) {
      return
    }

    const extent = transformExtent(boundingExtent(firstRing), WSG84_PROJECTION, OPENLAYERS_PROJECTION)
    dispatch(setFitToExtent(extent))
  }

  const handleAddZone = useCallback(() => {
    if (values.isGeometryComputedFromControls) {
      helpers.setValue(undefined)
      dispatch(drawPolygon(undefined, interactionListener))
      setFieldValue('isGeometryComputedFromControls', false)

      return
    }

    dispatch(drawPolygon(value, interactionListener))
  }, [dispatch, helpers, value, interactionListener, setFieldValue, values.isGeometryComputedFromControls])

  const deleteZone = useCallback(
    async (index: number) => {
      if (!value) {
        return
      }

      const nextCoordinates = remove(index, 1, value.coordinates)
      helpers.setValue({ ...value, coordinates: nextCoordinates })

      if (!nextCoordinates.length) {
        setFieldValue('isGeometryComputedFromControls', true)
      }
    },
    [value, helpers, setFieldValue]
  )

  return (
    <Field>
      {label && <Label $isRequired>{label}</Label>}

      <Button
        accent={meta.error ? Accent.ERROR : Accent.SECONDARY}
        Icon={Icon.Plus}
        isFullWidth
        onClick={handleAddZone}
      >
        {addButtonLabel}
      </Button>

      <>
        {isDrawingPolygonVisible &&
          polygons.map((polygonCoordinates, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <Row key={`zone-${index}`}>
              <ZoneWrapper isLight={isLight}>
                Polygone dessiné {index + 1}
                {/* TODO Add `Accent.LINK` accent in @mtes-mct/monitor-ui and use it here. */}
                {/* eslint-disable jsx-a11y/anchor-is-valid */}
                {/* eslint-disable jsx-a11y/click-events-have-key-events */}
                {/* eslint-disable jsx-a11y/no-static-element-interactions */}
                <Center onClick={() => handleCenterOnMap(polygonCoordinates as Coordinate[][])}>
                  <Icon.SelectRectangle />
                  Centrer sur la carte
                </Center>
              </ZoneWrapper>

              <>
                <IconButton
                  accent={Accent.SECONDARY}
                  disabled={isEditingZone}
                  Icon={Icon.Edit}
                  onClick={handleAddZone}
                />
                <IconButton
                  accent={Accent.SECONDARY}
                  aria-label="Supprimer cette zone"
                  disabled={isEditingZone}
                  Icon={Icon.Delete}
                  onClick={() => deleteZone(index)}
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
  width: 100%;
`
const Center = styled.a`
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
  align-items: center;
  display: flex;
  margin: 4px 0 0;
  width: 100%;

  > button {
    margin: 0 0 0 4px;
  }
`

const ZoneWrapper = styled.div<{
  isLight: boolean | undefined
}>`
  background-color: ${p => (p.isLight ? p.theme.color.white : p.theme.color.gainsboro)};
  display: flex;
  flex-grow: 1;
  font-size: 13px;
  justify-content: space-between;
  padding: 4px 8px 4px;
`
