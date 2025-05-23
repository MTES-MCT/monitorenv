import { THEME } from '@mtes-mct/monitor-ui'
import { displayTags } from '@utils/getTagsAsOptions'
import { getCenter } from 'ol/extent'
import { Point } from 'ol/geom'
import { Style } from 'ol/style'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import Text from 'ol/style/Text'

import { Layers } from '../../../../domain/entities/layers/constants'
import { getColorWithAlpha, stringToColorInGroup } from '../../../../utils/utils'

const blueMarine = '#7B9FCC'
const darkPeriwinkle = '#767AB2'

export const getAdministrativeLayersStyle = (code: String) => {
  switch (code) {
    case Layers.FAO.code:
      return feature =>
        new Style({
          stroke: new Stroke({
            color: darkPeriwinkle,
            width: 1
          }),
          text: new Text({
            fill: new Fill({ color: THEME.color.gunMetal }),
            font: '12px Marianne',
            overflow: true,
            stroke: new Stroke({ color: getColorWithAlpha(THEME.color.white, 0.9), width: 2 }),
            text: Layers.FAO.getZoneName && Layers.FAO.getZoneName(feature)
          })
        })
    case Layers.AEM.code:
      return feature =>
        new Style({
          stroke: new Stroke({
            color: darkPeriwinkle,
            width: 1
          }),
          text: new Text({
            fill: new Fill({ color: THEME.color.gunMetal }),
            font: '12px Marianne',
            stroke: new Stroke({ color: getColorWithAlpha(THEME.color.white, 0.9), width: 2 }),
            text: `${feature.get(Layers.AEM.subZoneFieldKey) ? feature.get(Layers.AEM.subZoneFieldKey) : ''}`
          })
        })
    case Layers.EEZ.code:
      return feature =>
        new Style({
          stroke: new Stroke({
            color: darkPeriwinkle,
            width: 1
          }),
          text: new Text({
            fill: new Fill({ color: THEME.color.gunMetal }),
            font: '12px Marianne',
            stroke: new Stroke({ color: getColorWithAlpha(THEME.color.white, 0.9), width: 2 }),
            text: `${feature.get(Layers.EEZ.subZoneFieldKey) ? feature.get(Layers.EEZ.subZoneFieldKey) : ''}`
          })
        })
    case Layers.MARPOL.code:
      return feature =>
        new Style({
          stroke: new Stroke({
            color: darkPeriwinkle,
            width: 1
          }),
          text: new Text({
            fill: new Fill({ color: THEME.color.gunMetal }),
            font: '12px Marianne',
            stroke: new Stroke({ color: getColorWithAlpha(THEME.color.white, 0.9), width: 2 }),
            text: `${feature.get(Layers.MARPOL.subZoneFieldKey) ? feature.get(Layers.MARPOL.subZoneFieldKey) : ''}`
          })
        })
    case Layers.THREE_HUNDRED_METERS.code:
    case Layers.THREE_MILES.code:
    case Layers.SIX_MILES.code:
    case Layers.TWELVE_MILES.code:
      return () =>
        new Style({
          stroke: new Stroke({
            color: darkPeriwinkle,
            width: 2
          })
        })
    case Layers.FACADES.code:
      return feature =>
        new Style({
          stroke: new Stroke({
            color: darkPeriwinkle,
            width: 2
          }),
          text: new Text({
            fill: new Fill({ color: THEME.color.gunMetal }),
            font: '12px Marianne',
            stroke: new Stroke({ color: getColorWithAlpha(THEME.color.white, 0.9), width: 2 }),
            text: `${feature.get(Layers.FACADES.zoneFieldKey) ? feature.get(Layers.FACADES.zoneFieldKey) : ''}`
          })
        })
    case Layers.DEPARTMENTS.code:
      return feature => {
        const geometry = feature.getGeometry()
        const center = geometry.getExtent()
        const point = new Point(getCenter(center))

        return [
          new Style({
            stroke: new Stroke({
              color: darkPeriwinkle,
              width: 2
            })
          }),
          new Style({
            geometry: point,
            text: new Text({
              fill: new Fill({ color: THEME.color.gunMetal }),
              font: '16px Marianne',
              overflow: true,
              stroke: new Stroke({ color: getColorWithAlpha(THEME.color.white, 0.9), width: 2 }),
              text: `${feature.get(Layers.DEPARTMENTS.zoneFieldKey) ?? ''}`
            })
          })
        ]
      }

    case Layers.SALTWATER_LIMIT_AREAS.code:
    case Layers.TRANSVERSAL_SEA_LIMIT_AREAS.code:
      return () =>
        new Style({
          stroke: new Stroke({
            color: getColorWithAlpha(THEME.color.maximumRed, 0.6),
            width: 4
          })
        })
    case Layers.TERRITORIAL_SEAS.code:
      return () =>
        new Style({
          fill: new Fill({
            color: getColorWithAlpha(darkPeriwinkle, 0.25)
          }),
          stroke: new Stroke({
            color: darkPeriwinkle,
            width: 2
          })
        })
    case Layers.COMPETENCE_CROSS_AREA.code:
      return feature => {
        const geometry = feature.getGeometry()
        const extent = geometry?.getExtent()
        const center = extent && getCenter(extent)

        return [
          new Style({
            fill: new Fill({
              color: getColorWithAlpha(darkPeriwinkle, 0.25)
            }),
            stroke: new Stroke({
              color: getColorWithAlpha(blueMarine, 0.6),
              width: 2
            })
          }),
          new Style({
            geometry: center && new Point(center),
            text: new Text({
              fill: new Fill({ color: THEME.color.gunMetal }),
              font: '12px Marianne',
              stroke: new Stroke({ color: getColorWithAlpha(THEME.color.white, 0.9), width: 2 }),
              text:
                Layers.COMPETENCE_CROSS_AREA.zoneFieldKey &&
                `${feature.get(Layers.COMPETENCE_CROSS_AREA.zoneFieldKey) ?? ''}`
            })
          })
        ]
      }
    default:
      return () =>
        new Style({
          fill: new Fill({
            color: getColorWithAlpha(blueMarine, 0.2)
          }),
          stroke: new Stroke({
            color: getColorWithAlpha(blueMarine, 0.6),
            width: 2
          })
        })
  }
}

export const getRegulatoryLayerStyle = feature => {
  const colorWithAlpha = getRegulatoryEnvColorWithAlpha(displayTags(feature.get('tags')), feature.get('entityName'))

  return getStyle(colorWithAlpha, feature.get('metadataIsShowed'), feature.get('isFilled'), feature.get('asMinimap'))
}

const getStyle = (color: string, metadataIsShowed: boolean, isLayerFilled: boolean, asMinimap: boolean) => {
  const strokeColor = () => {
    if (asMinimap) {
      return getColorWithAlpha(THEME.color.charcoal, 1)
    }

    return metadataIsShowed ? getColorWithAlpha('#85FBFD', 0.7) : getColorWithAlpha(THEME.color.charcoal, 0.7)
  }

  return new Style({
    fill: new Fill({
      color: isLayerFilled ? color : 'transparent'
    }),
    stroke: new Stroke({
      color: strokeColor(),
      width: metadataIsShowed || asMinimap ? 3 : 1
    })
  })
}

export const getRegulatoryEnvColorWithAlpha = (
  type: string | null = '',
  name: string | null = '',
  isDisabled = false
) => {
  if (isDisabled) {
    return THEME.color.white
  }

  return getColorWithAlpha(stringToColorInGroup(`${type}`, `${name}`), 0.6)
}
