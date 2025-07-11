import { DrawedPolygonWithCenterButton } from '@components/ZonePicker/DrawedPolygonWithCenterButton'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { useListenForDrawedGeometry } from '@hooks/useListenForDrawing'
import { Accent, Button, Icon, IconButton, Label } from '@mtes-mct/monitor-ui'
import { InteractionListener, OLGeometryType } from 'domain/entities/map/constants'
import { drawPolygon } from 'domain/use_cases/draw/drawGeometry'
import { centerOnMap } from 'domain/use_cases/map/centerOnMap'
import { useField } from 'formik'
import { isEqual } from 'lodash-es'
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
    if (geometry?.type === OLGeometryType.MULTIPOLYGON && !isEqual(geometry, value)) {
      helpers.setValue(geometry)
    }
  }, [geometry, helpers, value])

  const handleCenterOnMap = (coordinates: Coordinate[][]) => {
    dispatch(centerOnMap(coordinates[0]))
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
            <StyledDrawedPolygonWithCenterButton
              className="surveillance-zones"
              index={index}
              onCenterOnMap={() => handleCenterOnMap(polygonCoordinates)}
            />

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
const StyledDrawedPolygonWithCenterButton = styled(DrawedPolygonWithCenterButton)`
  background-color: ${p => p.theme.color.white};
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
