import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { useListenForDrawedGeometry } from '@hooks/useListenForDrawing'
import { Accent, Button, Icon, IconButton, Label, OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { InteractionListener, OLGeometryType } from 'domain/entities/map/constants'
import { setFitToExtent } from 'domain/shared_slices/Map'
import { drawPolygon } from 'domain/use_cases/draw/drawGeometry'
import { useField } from 'formik'
import _ from 'lodash'
import { boundingExtent } from 'ol/extent'
import { transformExtent } from 'ol/proj'
import { remove } from 'ramda'
import { useCallback, useEffect, useMemo } from 'react'
import styled from 'styled-components'

import type { Coordinate } from 'ol/coordinate'

const SURVEILLANCE_INTERACTION_LISTENER = InteractionListener.SURVEILLANCE_ZONE

export type SurveillanceZonePickerProps = {
  actionIndex: number
}

export function SurveillanceZonePicker({ actionIndex }: SurveillanceZonePickerProps) {
  const dispatch = useAppDispatch()
  const { geometry } = useListenForDrawedGeometry(SURVEILLANCE_INTERACTION_LISTENER)
  const [field, meta, helpers] = useField(`envActions[${actionIndex}].geom`)
  const { value } = field

  const listener = useAppSelector(state => state.draw.listener)
  const isEditingZone = useMemo(() => listener === SURVEILLANCE_INTERACTION_LISTENER, [listener])

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
    dispatch(drawPolygon(value, SURVEILLANCE_INTERACTION_LISTENER))
  }, [dispatch, value])

  const deleteZone = useCallback(
    (index: number) => {
      if (!value) {
        return
      }

      const nextCoordinates = remove(index, 1, value.coordinates)
      helpers.setValue({ ...value, coordinates: nextCoordinates })
    },
    [value, helpers]
  )

  return (
    <Field>
      <Label $isRequired>Zone de surveillance</Label>

      <Button
        accent={meta.error ? Accent.ERROR : Accent.SECONDARY}
        Icon={Icon.Plus}
        isFullWidth
        onClick={handleAddZone}
      >
        Ajouter une zone de surveillance
      </Button>

      <>
        {polygons.map((polygonCoordinates, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Row key={`zone-${index}`}>
            <ZoneWrapper>
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
              <IconButton accent={Accent.SECONDARY} disabled={isEditingZone} Icon={Icon.Edit} onClick={handleAddZone} />
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
  align-items: center;
  display: flex;
  margin: 4px 0 0;
  width: 100%;

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
