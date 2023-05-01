import GeoJSON from 'ol/format/GeoJSON'
import { useDispatch } from 'react-redux'
import { IconButton } from 'rsuite'
import styled from 'styled-components'

import { OPENLAYERS_PROJECTION } from '../../../domain/entities/map/constants'
import { setFitToExtent } from '../../../domain/shared_slices/Map'
import { ReactComponent as LocalizeIconSVG } from '../../../uiMonitor/icons/Focus_zones.svg'

export function CellLocalizeMission({ geom }: { geom: any }) {
  const dispatch = useDispatch()

  if (!geom) {
    return <span>-</span>
  }
  const handleZoomToMission = () => {
    const feature = new GeoJSON({
      featureProjection: OPENLAYERS_PROJECTION
    }).readFeature(geom)

    const extent = feature?.getGeometry()?.getExtent()
    dispatch(setFitToExtent(extent))
  }

  return <IconButton icon={<LocalizeIcon className="rs-icon" />} onClick={handleZoomToMission} size="md" />
}

const LocalizeIcon = styled(LocalizeIconSVG)`
  width: 20px;
`
