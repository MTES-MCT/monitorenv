import { DrawedPolygonWithCenterButton } from '@components/ZonePicker/DrawedPolygonWithCenterButton'
import { dashboardActions } from '@features/Dashboard/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useListenForDrawedGeometry } from '@hooks/useListenForDrawing'
import { Accent, Icon, IconButton, OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { InteractionListener } from 'domain/entities/map/constants'
import { setFitToExtent } from 'domain/shared_slices/Map'
import { drawCircle } from 'domain/use_cases/draw/drawGeometry'
import { boundingExtent } from 'ol/extent'
import { transformExtent } from 'ol/proj'
import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import type { GeoJSON } from 'domain/types/GeoJSON'
import type { Coordinate } from 'ol/coordinate'

type EditAreaProps = {
  dashboardKey: string
  geometry: GeoJSON.Geometry | undefined
  onValidate: (geometry: GeoJSON.Geometry) => void
}
export function EditArea({ dashboardKey, geometry, onValidate }: EditAreaProps) {
  const [geometryToSave, setGeometryToSave] = useState<GeoJSON.Geometry | undefined>(undefined)
  const { geometry: geometryInProgress, interactionType } = useListenForDrawedGeometry(
    InteractionListener.DASHBOARD_ZONE
  )
  const coordinates = (geometry as GeoJSON.MultiPolygon).coordinates.flat().flat() as Coordinate[]
  const dispatch = useAppDispatch()

  const handleCenterOnMap = () => {
    const extent = transformExtent(boundingExtent(coordinates), WSG84_PROJECTION, OPENLAYERS_PROJECTION)
    dispatch(setFitToExtent(extent))
  }

  const handleEditArea = useCallback(() => {
    dispatch(drawCircle(geometry, InteractionListener.DASHBOARD_ZONE))
  }, [dispatch, geometry])

  useEffect(() => {
    if (interactionType) {
      setGeometryToSave(geometryInProgress)
      dispatch(dashboardActions.setDisplayGeometry({ key: dashboardKey, visible: false }))
    }
  }, [dashboardKey, dispatch, geometryInProgress, interactionType])

  useEffect(() => {
    if (geometryToSave && (geometryToSave as GeoJSON.MultiPolygon).coordinates.length > 0 && !interactionType) {
      onValidate(geometryToSave)
      dispatch(dashboardActions.setDisplayGeometry({ key: dashboardKey, visible: true }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactionType, geometryToSave])

  return (
    <Row>
      <StyledDrawedPolygonWithCenterButton onCenterOnMap={() => handleCenterOnMap()} />

      <IconButton accent={Accent.SECONDARY} Icon={Icon.EditUnbordered} onClick={handleEditArea} />
    </Row>
  )
}

const Row = styled.div`
  align-items: center;
  display: flex;

  > button {
    margin: 0 0 0 4px;
  }
`
const StyledDrawedPolygonWithCenterButton = styled(DrawedPolygonWithCenterButton)`
  gap: 64px;
`
