import { Accent, Button, Icon, IconButton, Label } from '@mtes-mct/monitor-ui'
import { useField } from 'formik'
import _ from 'lodash'
import { boundingExtent } from 'ol/extent'
import { transformExtent } from 'ol/proj'
import { remove } from 'ramda'
import { useCallback, useEffect, useMemo } from 'react'
import styled from 'styled-components'

import { COLORS } from '../../constants/constants'
import {
  InteractionListener,
  OLGeometryType,
  OPENLAYERS_PROJECTION,
  WSG84_PROJECTION
} from '../../domain/entities/map/constants'
import { setFitToExtent } from '../../domain/shared_slices/Map'
import { addControlPosition } from '../../domain/use_cases/missions/addZone'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useListenForDrawedGeometry } from '../../hooks/useListenForDrawing'
import { getCoordinates } from '../../utils/coordinates'

import type { Coordinate } from 'ol/coordinate'

export type MultiPointPickerProps = {
  addButtonLabel: string
  containerName: string
  label: string
  name: string
}
export function MultiPointPicker({ addButtonLabel, containerName, label, name }: MultiPointPickerProps) {
  const dispatch = useAppDispatch()
  const { coordinatesFormat } = useAppSelector(state => state.map)
  const { geometry } = useListenForDrawedGeometry(InteractionListener.CONTROL_POINT)

  const [containerField] = useField(containerName)
  const [field, , helpers] = useField(name)
  const { value } = field
  const { setValue } = helpers

  const points = useMemo(() => {
    if (!value) {
      return []
    }

    return value.coordinates || []
  }, [value])

  useEffect(() => {
    if (geometry?.type === OLGeometryType.MULTIPOINT && !_.isEqual(geometry, value)) {
      setValue(geometry)
    }
  }, [geometry, setValue, value])

  const getShowedCoordinates = coordinates => {
    const transformedCoordinates = getCoordinates(coordinates, WSG84_PROJECTION, coordinatesFormat)

    if (Array.isArray(transformedCoordinates) && transformedCoordinates.length === 2) {
      return `${transformedCoordinates[0]} ${transformedCoordinates[1]}`
    }

    return ''
  }

  const handleCenterOnMap = coordinates => {
    if (!coordinates) {
      return
    }

    const extent = transformExtent(boundingExtent([coordinates]), WSG84_PROJECTION, OPENLAYERS_PROJECTION)
    dispatch(setFitToExtent(extent))
  }

  const handleAddPoint = useCallback(() => {
    dispatch(addControlPosition(value, containerField.value))
  }, [dispatch, value, containerField.value])

  const handleDeleteZone = useCallback(
    (index: number) => {
      if (!value) {
        return
      }
      const nextCoordinates = remove(index, 1, value.coordinates)
      setValue({ ...value, coordinates: nextCoordinates })
    },
    [value, setValue]
  )

  return (
    <Field>
      <Label>{label}</Label>
      <Button accent={Accent.SECONDARY} Icon={Icon.Plus} isFullWidth onClick={handleAddPoint}>
        {addButtonLabel}
      </Button>

      <>
        {points.map((coordinates, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Row key={`zone-${index}`}>
            <ZoneWrapper>
              {getShowedCoordinates(coordinates)}
              {/* TODO Add `Accent.LINK` accent in @mtes-mct/monitor-ui and use it here. */}
              {/* eslint-disable jsx-a11y/anchor-is-valid */}
              {/* eslint-disable jsx-a11y/click-events-have-key-events */}
              {/* eslint-disable jsx-a11y/no-static-element-interactions */}
              <Center onClick={() => handleCenterOnMap(coordinates as Coordinate)}>
                <Icon.SelectRectangle />
                Centrer sur la carte
              </Center>
            </ZoneWrapper>

            <IconButton accent={Accent.SECONDARY} Icon={Icon.Edit} onClick={handleAddPoint} />
            <IconButton
              accent={Accent.SECONDARY}
              aria-label="Supprimer cette zone"
              Icon={Icon.Delete}
              onClick={() => handleDeleteZone(index)}
            />
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
  > button {
    max-width: 416px;
  }
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

  margin-bottom: 4px;

  > button {
    margin: 0 0 0 0.5rem;
  }
`

const ZoneWrapper = styled.div`
  background-color: ${p => p.theme.color.white};
  display: flex;
  flex-grow: 1;
  font-size: 13px;
  justify-content: space-between;
  padding: 5px 0.75rem 4px;
  width: 416px;
`
