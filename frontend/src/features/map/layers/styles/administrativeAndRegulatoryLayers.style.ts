import { THEME } from '@mtes-mct/monitor-ui'
import { Style } from 'ol/style'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import Text from 'ol/style/Text'

import { Layers } from '../../../../domain/entities/layers/constants'
import { getColorWithAlpha, stringToColorInGroup } from '../../../../utils/utils'
/**
 *
 * @param {string} code
 * @returns
 */
export const getAdministrativeLayersStyle = code => {
  switch (code) {
    case Layers.EEZ.code:
      return feature =>
        new Style({
          stroke: new Stroke({
            color: '#767AB2',
            width: 1
          }),
          text: new Text({
            fill: new Fill({ color: THEME.color.gunMetal }),
            font: '12px Marianne',
            stroke: new Stroke({ color: 'rgba(255,255,255,0.9)', width: 2 }),
            text: `${feature.get(Layers.EEZ.subZoneFieldKey) ? feature.get(Layers.EEZ.subZoneFieldKey) : ''}`
          })
        })
    case Layers.FAO.code:
      return feature =>
        new Style({
          stroke: new Stroke({
            color: '#767AB2',
            width: 1
          }),
          text: new Text({
            fill: new Fill({ color: THEME.color.gunMetal }),
            font: '12px Marianne',
            overflow: true,
            stroke: new Stroke({ color: 'rgba(255,255,255,0.4)', width: 2 }),
            text: Layers.FAO.getZoneName && Layers.FAO.getZoneName(feature)
          })
        })
    case Layers.AEM.code:
      return feature =>
        new Style({
          stroke: new Stroke({
            color: '#767AB2',
            width: 1
          }),
          text: new Text({
            fill: new Fill({ color: THEME.color.gunMetal }),
            font: '12px Marianne',
            stroke: new Stroke({ color: 'rgba(255,255,255,0.4)', width: 2 }),
            text: `${feature.get(Layers.AEM.subZoneFieldKey) ? feature.get(Layers.AEM.subZoneFieldKey) : ''}`
          })
        })
    case Layers.THREE_MILES.code:
      return () =>
        new Style({
          stroke: new Stroke({
            color: 'rgba(5, 5, 94, 0.5)',
            width: 2
          })
        })
    case Layers.SIX_MILES.code:
      return () =>
        new Style({
          stroke: new Stroke({
            color: 'rgba(5, 5, 94, 0.5)',
            width: 2
          })
        })
    case Layers.TWELVE_MILES.code:
      return () =>
        new Style({
          stroke: new Stroke({
            color: 'rgba(5, 5, 94, 0.5)',
            width: 2
          })
        })
    default:
      return () =>
        new Style({
          fill: new Fill({
            color: getColorWithAlpha('#7B9FCC', 0.2)
          }),
          stroke: new Stroke({
            color: getColorWithAlpha('#7B9FCC', 0.6),
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
