import { THEME } from '@mtes-mct/monitor-ui'
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
    case Layers.LOW_WATER_LINE.code:
    case Layers.STRAIGHT_BASELINE.code:
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
      return feature =>
        new Style({
          stroke: new Stroke({
            color: darkPeriwinkle,
            width: 2
          }),
          text: new Text({
            fill: new Fill({ color: darkPeriwinkle }),
            font: '16px Marianne',
            overflow: true,
            stroke: new Stroke({ color: getColorWithAlpha(THEME.color.white, 0.9), width: 2 }),
            text: `${feature.get(Layers.DEPARTMENTS.zoneFieldKey) ? feature.get(Layers.DEPARTMENTS.zoneFieldKey) : ''}`
          })
        })
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
  const colorWithAlpha = getRegulatoryEnvColorWithAlpha(feature.get('thematique'), feature.get('entity_name'))

  return getStyle(colorWithAlpha, feature.get('metadataIsShowed'))
}

const getStyle = (color, metadataIsShowed) =>
  new Style({
    fill: new Fill({
      color
    }),
    stroke: new Stroke({
      color: getColorWithAlpha(THEME.color.charcoal, 0.7),
      width: metadataIsShowed ? 3 : 1
    })
  })

/**
 *
 * @param {string} group
 * @param {string} layername
 * @returns
 */
export const getRegulatoryEnvColorWithAlpha = (group = '', layername = '') =>
  getColorWithAlpha(stringToColorInGroup(`${group}`, `${layername}`), 0.6)
