import { useAppDispatch } from '@hooks/useAppDispatch'
import { Accent, Icon, IconButton, OPENLAYERS_PROJECTION } from '@mtes-mct/monitor-ui'
import { setFitToExtent } from 'domain/shared_slices/Map'
import { GeoJSON } from 'ol/format'
import styled from 'styled-components'

export function LocalizeCell({ geom }: { geom: any }) {
  const dispatch = useAppDispatch()

  if (!geom) {
    return <StyledEmptyContainer>-</StyledEmptyContainer>
  }
  const handleZoomToMission = () => {
    const feature = new GeoJSON({
      featureProjection: OPENLAYERS_PROJECTION
    }).readFeature(geom)

    const extent = feature?.getGeometry()?.getExtent()
    if (extent) {
      dispatch(setFitToExtent(extent))
    }
  }

  return <StyledIconButton accent={Accent.TERTIARY} Icon={Icon.FocusZones} onClick={handleZoomToMission} />
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
