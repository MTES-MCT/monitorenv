import { vigilanceAreaActions } from '@features/VigilanceArea/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Accent, Icon, IconButton, OPENLAYERS_PROJECTION } from '@mtes-mct/monitor-ui'
import { setFitToExtent } from 'domain/shared_slices/Map'
import { GeoJSON as GeoJsonOpenLayer } from 'ol/format'
import styled from 'styled-components'

import type { GeoJSON } from 'domain/types/GeoJSON'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'

export function LocalizeCell({ geom, id }: { geom?: GeoJSON.MultiPolygon; id: number }) {
  const dispatch = useAppDispatch()

  if (!geom) {
    return <StyledEmptyContainer>-</StyledEmptyContainer>
  }

  const handleZoomToVigilanceArea = () => {
    dispatch(vigilanceAreaActions.setSelectedVigilanceAreaId(id))
    const feature = new GeoJsonOpenLayer({
      featureProjection: OPENLAYERS_PROJECTION
    }).readFeature(geom) as Feature<Geometry>

    const extent = feature?.getGeometry()?.getExtent()
    if (extent) {
      dispatch(setFitToExtent(extent))
    }
  }

  return <StyledIconButton accent={Accent.TERTIARY} Icon={Icon.FocusZones} onClick={handleZoomToVigilanceArea} />
}

const StyledIconButton = styled(IconButton)`
  display: inherit;
  margin: auto;
`
const StyledEmptyContainer = styled.div`
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`
