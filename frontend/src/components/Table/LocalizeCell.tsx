import { useAppDispatch } from '@hooks/useAppDispatch'
import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import { getFeature } from '@utils/getFeature'
import { setFitToExtent } from 'domain/shared_slices/Map'
import styled from 'styled-components'

export function LocalizeCell({ geom }: { geom: any }) {
  const dispatch = useAppDispatch()

  if (!geom) {
    return <StyledEmptyContainer>-</StyledEmptyContainer>
  }
  const handleZoomToMission = () => {
    const feature = getFeature(geom)

    const extent = feature?.getGeometry()?.getExtent()
    if (extent) {
      dispatch(setFitToExtent(extent))
    }
  }

  return <IconButton accent={Accent.TERTIARY} Icon={Icon.FocusZones} onClick={handleZoomToMission} />
}

const StyledEmptyContainer = styled.div`
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`
