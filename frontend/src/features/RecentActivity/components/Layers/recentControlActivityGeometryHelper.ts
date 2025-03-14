import { RecentActivity } from '@features/RecentActivity/types'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { Layers } from 'domain/entities/layers/constants'
import { Feature } from 'ol'
import { GeoJSON } from 'ol/format'

type RecentControlActivityGeometryProps = {
  control: RecentActivity.RecentControlsActivity
  totalControls?: number
  totalControlsWithInfractions?: number
  totalControlsWithoutInfractions?: number
  withInfractions?: boolean
}

export const getRecentControlActivityGeometry = ({
  control,
  totalControls = 0,
  totalControlsWithInfractions = 0,
  totalControlsWithoutInfractions = 0,
  withInfractions = false
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
  if (withInfractions) {
    feature.setId(`${Layers.RECENT_CONTROLS_ACTIVITY.code}:${control.id}-with-infractions`)
  }

  feature.setProperties({
    hasInfraction: control.infractions.length > 0,
    totalControls,
    totalControlsWithInfractions,
    totalControlsWithoutInfractions,
    ...control,
    ...(withInfractions && { withInfractions: true })
  })

  return feature
}
