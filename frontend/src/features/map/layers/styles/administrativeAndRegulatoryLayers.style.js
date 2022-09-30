import { Style } from 'ol/style'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import Text from 'ol/style/Text'

import { COLORS } from '../../../../constants/constants'
import { Layers } from '../../../../domain/entities/layers'
import { getColorWithAlpha } from '../../../../utils/utils'
/**
 *
 * @param {string} code
 * @returns
 */
export const getAdministrativeAndRegulatoryLayersStyle = code => {
  switch (code) {
    case Layers.EEZ.code:
      return feature =>
        new Style({
          stroke: new Stroke({
            color: '#767AB2',
            width: 1
          }),
          text: new Text({
            fill: new Fill({ color: COLORS.gunMetal }),
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
            fill: new Fill({ color: COLORS.gunMetal }),
            font: '12px Marianne',
            overflow: true,
            stroke: new Stroke({ color: 'rgba(255,255,255,0.4)', width: 2 }),
            text: Layers.FAO.getZoneName(feature)
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
            fill: new Fill({ color: COLORS.gunMetal }),
            font: '12px Marianne',
            stroke: new Stroke({ color: 'rgba(255,255,255,0.4)', width: 2 }),
            text: `${feature.get(Layers.AEM.subZoneFieldKey) ? feature.get(Layers.AEM.subZoneFieldKey) : ''}`
          })
        })
    case Layers.cormoran.code:
      return feature =>
        new Style({
          stroke: new Stroke({
            color: '#767AB2',
            width: 1
          }),
          text: new Text({
            fill: new Fill({ color: COLORS.gunMetal }),
            font: '12px Marianne',
            stroke: new Stroke({ color: 'rgba(255,255,255,0.4)', width: 2 }),
            text: `${feature.get(Layers.cormoran.subZoneFieldKey) ? feature.get(Layers.cormoran.subZoneFieldKey) : ''}`
          })
        })
    case Layers.situations.code:
      return feature =>
        new Style({
          stroke: new Stroke({
            color: '#767AB2',
            width: 2
          }),
          text: new Text({
            fill: new Fill({ color: COLORS.gunMetal }),
            font: '12px Marianne',
            stroke: new Stroke({ color: 'rgba(255,255,255,0.4)', width: 2 }),
            text: `${
              feature.get(Layers.situations.subZoneFieldKey) ? feature.get(Layers.situations.subZoneFieldKey) : ''
            }`
          })
        })
    case Layers.brexit.code:
      return feature =>
        new Style({
          stroke: new Stroke({
            color: '#767AB2',
            width: 2
          }),
          text: new Text({
            fill: new Fill({ color: COLORS.gunMetal }),
            font: '12px Marianne',
            stroke: new Stroke({ color: 'rgba(255,255,255,0.4)', width: 2 }),
            text: `${feature.get(Layers.brexit.subZoneFieldKey) ? feature.get(Layers.brexit.subZoneFieldKey) : ''}`
          })
        })
    case Layers.rectangles_stat.code:
      return feature =>
        new Style({
          stroke: new Stroke({
            color: '#767AB2',
            width: 1
          }),
          text: new Text({
            fill: new Fill({ color: COLORS.gunMetal }),
            font: '12px Marianne',
            stroke: new Stroke({ color: 'rgba(255,255,255,0.4)', width: 2 }),
            text: `${
              feature.get(Layers.rectangles_stat.subZoneFieldKey)
                ? feature.get(Layers.rectangles_stat.subZoneFieldKey)
                : ''
            }`
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
    case Layers.cgpm_areas.code:
      return feature =>
        new Style({
          stroke: new Stroke({
            color: '#767AB2',
            width: 1
          }),
          text: new Text({
            fill: new Fill({ color: COLORS.gunMetal }),
            font: '12px Marianne',
            stroke: new Stroke({ color: 'rgba(255,255,255,0.4)', width: 2 }),
            text: `${
              feature.get(Layers.cgpm_areas.subZoneFieldKey) ? feature.get(Layers.cgpm_areas.subZoneFieldKey) : ''
            }`
          })
        })
    case Layers.REGULATORY_ENV.code:
      return feature => {
        const colorWithAlpha = getRegulatoryEnvColorWithAlpha(feature.get('thematique'))

        return getStyle(colorWithAlpha, feature?.get('metadataIsShowed'))
      }
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

const getStyle = (color, metadataIsShowed) =>
  new Style({
    fill: new Fill({
      color
    }),
    stroke: new Stroke({
      color: 'rgba(5, 5, 94, 0.7)',
      width: metadataIsShowed ? 3 : 1
    })
  })

/**
 *
 * @param {string} thematique
 * @returns
 */
export const getRegulatoryEnvColorWithAlpha = thematique => {
  switch (thematique) {
    case 'Mouillage': {
      return getColorWithAlpha('#FFB199', 0.6)
    }
    default: {
      return getColorWithAlpha('#FFD3C7', 0.6)
    }
  }
}
