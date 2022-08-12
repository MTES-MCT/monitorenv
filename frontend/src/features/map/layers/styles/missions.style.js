import Stroke from 'ol/style/Stroke'
import Fill from 'ol/style/Fill'
import Point from 'ol/geom/Point'
import { Icon, Style } from 'ol/style'
import { getCenter } from 'ol/extent'

import { COLORS } from '../../../../constants/constants'
import { actionTypeEnum, missionStatusEnum } from '../../../../domain/entities/missions'



export const missionZoneStyle = new Style({
  stroke: new Stroke({
    color: COLORS.shadowBlue,
  }),
  fill: new Fill({
    color: 'rgba(107,131,158, .2)'
  })

})

const missionWithCentroidStyleFactory = (color) => new Style({
  image: new Icon({
    src: 'marker-flag.svg',
    color: color,
    offset: [0, 0],
    imgSize: [30, 79]
  }),
  geometry: (feature) => {
    const extent = feature.getGeometry().getExtent()
    const center = getCenter(extent)
    return new Point(center)
  }
})

export const missionWithCentroidStyleFn = (feature) => {
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

export const selectedMissionStyleFn = (feature) => {
  const actionType = feature.get('actionType')
  if (actionType === actionTypeEnum.CONTROL.code) {
    return new Style({
      image: new Icon({
        src: 'controle_18px.svg',
        color: COLORS.red,
        scale: 1.4
      })
    })
  }
  return new Style({
    stroke: new Stroke({
      color: COLORS.shadowBlue,
    }),
    fill: new Fill({
      color: 'rgba(107,131,158, .2)'
    })
  })
}