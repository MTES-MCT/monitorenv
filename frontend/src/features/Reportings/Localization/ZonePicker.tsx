import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import { useField } from 'formik'
import _ from 'lodash'
import { boundingExtent } from 'ol/extent'
import { transformExtent } from 'ol/proj'
import { useCallback, useEffect, useMemo } from 'react'
import styled from 'styled-components'

import { COLORS } from '../../../constants/constants'
import {
  InteractionListener,
  OLGeometryType,
  OPENLAYERS_PROJECTION,
  WSG84_PROJECTION
} from '../../../domain/entities/map/constants'
import { setFitToExtent } from '../../../domain/shared_slices/Map'
import { addZone } from '../../../domain/use_cases/missions/addZone'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { useListenForDrawedGeometry } from '../../../hooks/useListenForDrawing'

import type { Coordinate } from 'ol/coordinate'

export function ZonePicker() {
  const dispatch = useAppDispatch()
  const interactionListener = InteractionListener.REPORTING_ZONE
  const { geometry } = useListenForDrawedGeometry(interactionListener)
  const [field, , helpers] = useField('geom')
  const { value } = field

  const { listener } = useAppSelector(state => state.draw)
  const isEditingZone = useMemo(() => listener === InteractionListener.REPORTING_ZONE, [listener])

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
    dispatch(addZone(value, interactionListener))
  }, [dispatch, value, interactionListener])

  const deleteZone = useCallback(() => {
    if (value) {
      helpers.setValue(undefined)
    }
  }, [helpers, value])

  return (
    <Field>
      {value?.coordinates && value.type === OLGeometryType.MULTIPOLYGON && (
        <Row>
          <ZoneWrapper>
            Polygone dessiné
            <Center onClick={() => handleCenterOnMap(value.coordinates as Coordinate[][])}>
              <Icon.SelectRectangle />
              Centrer sur la carte
            </Center>
          </ZoneWrapper>

          <IconButton accent={Accent.SECONDARY} disabled={isEditingZone} Icon={Icon.Edit} onClick={handleAddZone} />
          <IconButton
            accent={Accent.SECONDARY}
            aria-label="Supprimer cette zone"
            disabled={isEditingZone}
            Icon={Icon.Delete}
            onClick={deleteZone}
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
const Center = styled.a`
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
  align-items: center;
  display: flex;
  margin: 0.5rem 0 0;
  width: 100%;

  > button {
    margin: 0 0 0 0.5rem;
  }
`

const ZoneWrapper = styled.div<{ isLight?: boolean }>`
  background-color: ${p => p.theme.color.gainsboro};
  display: flex;
  flex-grow: 1;
  font-size: 13px;
  justify-content: space-between;
  padding: 5px 0.75rem 4px;
`
