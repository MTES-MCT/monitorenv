import { getLocalizedAreaColorWithAlpha } from '@features/LocalizedArea/utils'
import { Fill, Stroke, Style, Text } from 'ol/style'

export const localizedAreaStyle = feature =>
  new Style({
    fill: new Fill({
      color: getLocalizedAreaColorWithAlpha(feature.get('groupName'))
    }),
    stroke: new Stroke({
      color: '#3F6247',
      width: 2
    }),
    text: new Text({
      text: feature.get('name')
    })
  })
