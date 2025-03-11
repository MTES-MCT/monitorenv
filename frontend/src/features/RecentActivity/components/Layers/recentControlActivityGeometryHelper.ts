import { RecentActivity } from '@features/RecentActivity/types'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { Layers } from 'domain/entities/layers/constants'
import { Feature } from 'ol'
import { GeoJSON } from 'ol/format'
import { getArea } from 'ol/sphere'

export const getRecentControlActivityGeometry = (
  control: RecentActivity.RecentControlsActivity,
  distinctionFilter: RecentActivity.DistinctionFilterEnum
) => {
  const geoJSON = new GeoJSON()
  const geometry = geoJSON.readGeometry(control.geom, {
    dataProjection: WSG84_PROJECTION,
    featureProjection: OPENLAYERS_PROJECTION
  })
  const area = geometry && getArea(geometry)

  const feature = new Feature({
    geometry
  })

  feature.setId(`${Layers.RECENT_CONTROLS_ACTIVITY.code}:${control.id}`)
  feature.setProperties({
    area,
    hasInfraction: control.infractions.length > 0,
    withDistinction: distinctionFilter === RecentActivity.DistinctionFilterEnum.WITH_DISTINCTION,
    ...control
  })

  return feature
}
