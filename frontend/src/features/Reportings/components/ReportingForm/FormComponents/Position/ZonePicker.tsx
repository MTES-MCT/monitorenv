import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { useListenForDrawedGeometry } from '@hooks/useListenForDrawing'
import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import { InteractionListener, OLGeometryType } from 'domain/entities/map/constants'
import { drawPolygon } from 'domain/use_cases/draw/drawGeometry'
import { centerOnMapFromZonePicker } from 'domain/use_cases/map/centerOnMapFromZonePicker'
import { useField } from 'formik'
import _ from 'lodash'
import { useCallback, useEffect, useMemo } from 'react'
import styled from 'styled-components'

export function ZonePicker() {
  const dispatch = useAppDispatch()
  const { geometry } = useListenForDrawedGeometry(InteractionListener.REPORTING_ZONE)
  const [field, , helpers] = useField('geom')
  const { value } = field

  const listener = useAppSelector(state => state.draw.listener)
  const isEditingZone = useMemo(() => listener === InteractionListener.REPORTING_ZONE, [listener])

  useEffect(() => {
    if (geometry?.type === OLGeometryType.MULTIPOLYGON && !_.isEqual(geometry, value)) {
      helpers.setValue(geometry)
    }
  }, [geometry, helpers, value])

  const handleCenterOnMap = () => {
    const firstPolygon = value?.coordinates[0]
    const firstRing = firstPolygon?.[0]

    dispatch(centerOnMapFromZonePicker(firstRing))
  }

  const handleAddZone = useCallback(() => {
    dispatch(drawPolygon(value, InteractionListener.REPORTING_ZONE))
  }, [dispatch, value])

  const deleteZone = useCallback(() => {
    if (value) {
      helpers.setValue(undefined)
    }
  }, [helpers, value])

  return (
    <Field>
      {value?.coordinates?.length > 0 && value.type === OLGeometryType.MULTIPOLYGON && (
        <Row>
          <ZoneWrapper>
            Polygone dessiné
            <Center onClick={handleCenterOnMap}>
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
  background-color: ${p => p.theme.color.gainsboro};
  display: flex;
  flex-grow: 1;
  font-size: 13px;
  justify-content: space-between;
  padding: 4px 8px 4px;
`
