import { RecentActivity } from '@features/RecentActivity/types'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { Feature } from 'ol'
import { GeoJSON } from 'ol/format'

type RecentControlActivityGeometryProps = {
  control: RecentActivity.RecentControlsActivity
  iconSize: number
  layerName: string
  ratioInfractionsInControls: number
}

export const getRecentControlActivityGeometry = ({
  control,
  iconSize,
  layerName,
  ratioInfractionsInControls
}: RecentControlActivityGeometryProps): Feature => {
  const geoJSON = new GeoJSON()
  const geometry = geoJSON.readGeometry(control.geom, {
    dataProjection: WSG84_PROJECTION,
    featureProjection: OPENLAYERS_PROJECTION
  })

  const feature = new Feature({
    geometry
  })

  feature.setId(`${layerName}:${control.id}`)

  feature.setProperties({
    hasInfraction: control.infractions.length > 0,
    iconSize,
    ratioInfractionsInControls,
    ...control,
    geom: null
  })

  return feature
}
