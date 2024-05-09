import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import GeoJSON from 'ol/format/GeoJSON'
import styled from 'styled-components'

import { OPENLAYERS_PROJECTION } from '../../../../domain/entities/map/constants'
import { setFitToExtent } from '../../../../domain/shared_slices/Map'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'

export function CellLocalizeMission({ geom }: { geom: any }) {
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
`
const StyledEmptyContainer = styled.div`
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`
