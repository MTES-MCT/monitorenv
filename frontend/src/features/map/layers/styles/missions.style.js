import { getCenter } from 'ol/extent'
import Point from 'ol/geom/Point'
import { Icon, Style } from 'ol/style'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'

import { COLORS } from '../../../../constants/constants'
import { missionStatusEnum } from '../../../../domain/entities/missions'

export const missionZoneStyle = new Style({
  fill: new Fill({
    color: 'rgba(107,131,158, .2)'
  }),
  stroke: new Stroke({
    color: COLORS.shadowBlue
  })
})

const missionWithCentroidStyleFactory = color =>
  new Style({
    geometry: feature => {
      const extent = feature.getGeometry().getExtent()
      const center = getCenter(extent)

      return new Point(center)
    },
    image: new Icon({
      color,
      src: 'marker-flag.svg'
    })
  })

export const missionWithCentroidStyleFn = feature => {
  const missionStatus = feature.get('missionStatus')
  switch (missionStatus) {
    case missionStatusEnum.PENDING.code:
      return missionWithCentroidStyleFactory(COLORS.mediumSeaGreen)
    case missionStatusEnum.ENDED.code:
      return missionWithCentroidStyleFactory(COLORS.charcoal)
    case missionStatusEnum.CLOSED.code:
      return missionWithCentroidStyleFactory(COLORS.opal)
    default:
      return missionWithCentroidStyleFactory(COLORS.opal)
  }
}

export const selectedMissionActionsStyle = new Style({
  image: new Icon({
    color: COLORS.maximumRed,
    scale: 1.4,
    src: 'controle_18px.svg'
  })
})

export const selectedMissionStyle = new Style({
  fill: new Fill({
    color: 'rgba(107,131,158, .2)'
  }),
  stroke: new Stroke({
    color: COLORS.shadowBlue
  })
})
