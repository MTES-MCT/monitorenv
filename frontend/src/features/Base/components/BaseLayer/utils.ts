import { THEME } from '@mtes-mct/monitor-ui'
import { uniq } from 'lodash/fp'
import { Feature } from 'ol'
import { GeoJSON } from 'ol/format'
import { Fill, Icon, Style, Text } from 'ol/style'
import CircleStyle from 'ol/style/Circle'

import { Layers } from '../../../../domain/entities/layers/constants'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../../../domain/entities/map/constants'

import type { Base } from '../../../../domain/entities/base'
import type { StyleFunction } from 'ol/style/Style'

export const getFeatureStyle = ((feature: Feature) => {
  const featureProps = feature.getProperties()

  const iconStyle = new Style({
    image: new Icon({
      displacement: [0, 19],
      src: `/icons/base-layer-icon${featureProps.isHighlighted ? '-highlighted' : ''}.svg`
    })
  })

  const badgeStyle = new Style({
    image: new CircleStyle({
      displacement: [16, 36],
      fill: new Fill({
        color: THEME.color.charcoal
      }),
      radius: 9
    })
  })

  const counterStyle = new Style({
    text: new Text({
      fill: new Fill({
        color: THEME.color.white
      }),
      font: '13px Marianne',
      offsetX: featureProps.controlUnitsCount === 1 ? 16.5 : 16,
      offsetY: -35,
      text: featureProps.controlUnitsCount.toString()
    })
  })

  return [iconStyle, badgeStyle, counterStyle]
}) as StyleFunction

export function getBasePointFeature(base: Base.Base) {
  const controlUnitsCount = uniq(base.controlUnitResources.map(({ controlUnitId }) => controlUnitId)).length

  const geoJSON = new GeoJSON()
  const geometry = geoJSON.readGeometry(
    {
      coordinates: [base.longitude, base.latitude],
      type: 'Point'
    },
    {
      dataProjection: WSG84_PROJECTION,
      featureProjection: OPENLAYERS_PROJECTION
    }
  )

  const feature = new Feature({
    geometry
  })
  feature.setId(`${Layers.BASES.code}:${base.id}`)
  feature.setProperties({
    base,
    controlUnitsCount,
    isHighlighted: false,
    isSelected: false
  })

  return feature
}
