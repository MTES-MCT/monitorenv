import { THEME } from '@mtes-mct/monitor-ui'
import { getCenter } from 'ol/extent'
import Point from 'ol/geom/Point'
import { Stroke, Style, Circle } from 'ol/style'

import { selectedMissionStyle } from '../../../map/layers/Missions/missions.style'

export const selectedMissionToAttachStyle = new Style({
  geometry: feature => {
    const extent = feature?.getGeometry()?.getExtent()
    const center = extent && getCenter(extent)

    if (!center) {
      throw new Error('No center found')
    }

    return new Point(center)
  },
  image: new Circle({
    radius: 20,
    stroke: new Stroke({
      color: THEME.color.charcoal,
      width: 2
    })
  })
})

export const attachedMissionStyle = feature => [...selectedMissionStyle(feature), selectedMissionToAttachStyle]
