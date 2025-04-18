import { RecentActivity } from '@features/RecentActivity/types'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { Layers } from 'domain/entities/layers/constants'
import { Feature } from 'ol'
import { GeoJSON } from 'ol/format'

type RecentControlActivityGeometryProps = {
  control: RecentActivity.RecentControlsActivity
  iconSize: number
  ratioInfractionsInControls: number
}

export const getRecentControlActivityGeometry = ({
  control,
  iconSize,
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

  feature.setId(`${Layers.RECENT_CONTROLS_ACTIVITY.code}:${control.id}`)

  feature.setProperties({
    hasInfraction: control.infractions.length > 0,
    iconSize,
    ratioInfractionsInControls,
    ...control
  })

  return feature
}
