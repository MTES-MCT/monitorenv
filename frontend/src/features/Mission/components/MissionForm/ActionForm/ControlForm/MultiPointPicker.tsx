import { ZoneWrapper } from '@components/ZonePicker/DrawedPolygonWithCenterButton'
import { Accent, Button, Icon, IconButton, Label, Message } from '@mtes-mct/monitor-ui'
import { formatCoordinates } from '@utils/coordinates'
import { centerOnMap } from 'domain/use_cases/map/centerOnMap'
import { useField } from 'formik'
import { isEqual } from 'lodash'
import { remove } from 'ramda'
import { useCallback, useEffect, useMemo } from 'react'
import styled from 'styled-components'

import { InteractionListener, OLGeometryType } from '../../../../../../domain/entities/map/constants'
import { drawPoint } from '../../../../../../domain/use_cases/draw/drawGeometry'
import { useAppDispatch } from '../../../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../../../hooks/useAppSelector'
import { useListenForDrawedGeometry } from '../../../../../../hooks/useListenForDrawing'

const CONTROL_INTERACTION_LISTENER = InteractionListener.CONTROL_POINT

export type MultiPointPickerProps = {
  actionIndex: number
  isGeomSameAsAttachedReportingGeom: boolean
}

export function MultiPointPicker({ actionIndex, isGeomSameAsAttachedReportingGeom }: MultiPointPickerProps) {
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
    }
  }, [geometry, setValue, value])

  const handleCenterOnMap = coordinates => {
    dispatch(centerOnMap([coordinates]))
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
    },
    [value, setValue]
  )

  return (
    <>
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
              <StyledZoneWrapper>
                <span>{formatCoordinates(coordinates, coordinatesFormat)}</span>
                <IconButton
                  accent={Accent.TERTIARY}
                  Icon={Icon.FocusZones}
                  onClick={() => handleCenterOnMap(coordinates)}
                  title="Centrer sur la carte"
                />
              </StyledZoneWrapper>

              <>
                <IconButton
                  accent={Accent.SECONDARY}
                  disabled={isAddingAControl}
                  Icon={Icon.Edit}
                  onClick={handleAddPoint}
                  title="Ajouter une zone"
                />
                <IconButton
                  accent={Accent.SECONDARY}
                  disabled={isAddingAControl}
                  Icon={Icon.Delete}
                  onClick={() => handleDeleteZone(index)}
                  title="Supprimer cette zone"
                />
              </>
            </Row>
          ))}
        </>
      </Field>
      {isGeomSameAsAttachedReportingGeom && (
        <Message withoutIcon>Le point de contrôle a été automatiquement rempli avec le point de signalement.</Message>
      )}
    </>
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
const StyledZoneWrapper = styled(ZoneWrapper)`
  background-color: ${p => p.theme.color.white};
`
