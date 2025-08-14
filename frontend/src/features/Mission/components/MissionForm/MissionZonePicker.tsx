import { DrawedPolygonWithCenterButton } from '@components/ZonePicker/DrawedPolygonWithCenterButton'
import { Accent, Button, Icon, IconButton, Label } from '@mtes-mct/monitor-ui'
import { centerOnMap } from 'domain/use_cases/map/centerOnMap'
import { useField, useFormikContext } from 'formik'
import _ from 'lodash'
import { remove } from 'ramda'
import { useCallback, useEffect, useMemo } from 'react'
import styled from 'styled-components'

import { InteractionListener, OLGeometryType } from '../../../../domain/entities/map/constants'
import { drawPolygon } from '../../../../domain/use_cases/draw/drawGeometry'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { useListenForDrawedGeometry } from '../../../../hooks/useListenForDrawing'

import type { Mission } from 'domain/entities/missions'
import type { Coordinate } from 'ol/coordinate'

const MISSION_INTERACTION_LISTENER = InteractionListener.MISSION_ZONE

export function MissionZonePicker() {
  const { setFieldValue, values } = useFormikContext<Mission>()
  const dispatch = useAppDispatch()
  const { geometry } = useListenForDrawedGeometry(MISSION_INTERACTION_LISTENER)
  const [field, meta, helpers] = useField('geom')
  const { value } = field

  const listener = useAppSelector(state => state.draw.listener)
  const isEditingZone = useMemo(() => listener === MISSION_INTERACTION_LISTENER, [listener])

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
    dispatch(centerOnMap(coordinates[0]))
  }

  const handleAddZone = useCallback(() => {
    if (values.isGeometryComputedFromControls) {
      setFieldValue('isGeometryComputedFromControls', false)
      helpers.setValue(undefined)
      dispatch(drawPolygon(undefined, MISSION_INTERACTION_LISTENER))

      return
    }

    dispatch(drawPolygon(value, MISSION_INTERACTION_LISTENER))
  }, [dispatch, helpers, value, setFieldValue, values.isGeometryComputedFromControls])

  const deleteZone = useCallback(
    async (index: number) => {
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
      <Label>Localisations</Label>

      <Button
        accent={meta.error ? Accent.ERROR : Accent.SECONDARY}
        Icon={Icon.Plus}
        isFullWidth
        onClick={handleAddZone}
      >
        Ajouter une zone de mission manuelle
      </Button>

      <>
        {!values.isGeometryComputedFromControls &&
          (polygons as Coordinate[][][]).map((polygonCoordinates, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <Row key={`zone-${index}`}>
              <DrawedPolygonWithCenterButton
                index={index}
                onCenterOnMap={() => handleCenterOnMap(polygonCoordinates)}
              />

              <>
                <IconButton
                  accent={Accent.SECONDARY}
                  disabled={isEditingZone}
                  Icon={Icon.Edit}
                  onClick={handleAddZone}
                  title="Ajouter une zone de mission"
                />
                <IconButton
                  accent={Accent.SECONDARY}
                  disabled={isEditingZone}
                  Icon={Icon.Delete}
                  onClick={() => deleteZone(index)}
                  title="Supprimer cette zone de mission"
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

const Row = styled.div`
  align-items: center;
  display: flex;
  margin: 4px 0 0;
  width: 100%;

  > button {
    margin: 0 0 0 4px;
  }
`
