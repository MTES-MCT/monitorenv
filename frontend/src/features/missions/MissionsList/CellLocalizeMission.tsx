import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import GeoJSON from 'ol/format/GeoJSON'
import { useDispatch } from 'react-redux'

import { OPENLAYERS_PROJECTION } from '../../../domain/entities/map/constants'
import { setFitToExtent } from '../../../domain/shared_slices/Map'

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

  return <IconButton accent={Accent.TERTIARY} Icon={Icon.FocusZones} onClick={handleZoomToMission} />
}
