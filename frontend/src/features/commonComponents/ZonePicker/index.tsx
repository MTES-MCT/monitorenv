import { useAppDispatch } from '@hooks/useAppDispatch'
import { useListenForDrawedGeometry } from '@hooks/useListenForDrawing'
import { Accent, Button, Icon, IconButton, Label } from '@mtes-mct/monitor-ui'
import { InteractionListener, OLGeometryType } from 'domain/entities/map/constants'
import { centerOnMapFromZonePicker } from 'domain/use_cases/map/centerOnMapFromZonePicker'
import { useField } from 'formik'
import { isEqual } from 'lodash'
import { useEffect, useMemo } from 'react'
import styled from 'styled-components'

import { useAppSelector } from '../../../hooks/useAppSelector'

import type { Coordinate } from 'ol/coordinate'

type ZonePickerProps = {
  addLabel: string
  deleteZone: (index: number) => void
  handleAddZone: () => void
  isRequired?: boolean
  label: string
  listener: InteractionListener
  name: string
}
export function ZonePicker({
  addLabel,
  deleteZone,
  handleAddZone,
  isRequired,
  label,
  listener,
  name
}: ZonePickerProps) {
  const dispatch = useAppDispatch()
  const { geometry } = useListenForDrawedGeometry(listener)
  const [field, meta, helpers] = useField(name)
  const { value } = field

  const currentListerner = useAppSelector(state => state.draw.listener)
  const isEditingZone = useMemo(() => currentListerner === listener, [currentListerner, listener])

  const polygons = useMemo(() => {
    if (!value) {
      return []
    }

    return value.coordinates || []
  }, [value])

  const handleCenterOnMap = (coordinates: Coordinate[][]) => {
    dispatch(centerOnMapFromZonePicker(coordinates[0]))
  }

  useEffect(() => {
    if (geometry?.type === OLGeometryType.MULTIPOLYGON && !isEqual(geometry, value)) {
      helpers.setValue(geometry)
    }
  }, [geometry, helpers, value])

  return (
    <Field>
      <Label $isRequired={isRequired}>{label}</Label>

      <Button
        accent={meta.error ? Accent.ERROR : Accent.SECONDARY}
        aria-label={addLabel}
        Icon={Icon.Plus}
        isFullWidth
        onClick={handleAddZone}
      >
        {addLabel}
      </Button>

      <>
        {polygons.map((polygonCoordinates, index) => (
          <Row key={`zone-${polygonCoordinates[0][0]}`}>
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
  gap: 4px;
  margin: 4px 0 0;
  width: 100%;

  > button {
    margin: 0 0 0 4px;
  }
`

const ZoneWrapper = styled.div`
  background-color: ${p => p.theme.color.gainsboro};
  display: flex;
  flex-grow: 1;
  font-size: 13px;
  justify-content: space-between;
  padding: 4px 8px 4px;
`
