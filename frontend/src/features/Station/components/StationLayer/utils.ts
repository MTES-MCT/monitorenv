import { THEME } from '@mtes-mct/monitor-ui'
import { uniq } from 'lodash/fp'
import { Feature } from 'ol'
import { GeoJSON } from 'ol/format'
import { Fill, Icon, Style, Text } from 'ol/style'
import CircleStyle from 'ol/style/Circle'

import { Layers } from '../../../../domain/entities/layers/constants'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../../../domain/entities/map/constants'

import type { Station } from '../../../../domain/entities/station'
import type { StyleFunction } from 'ol/style/Style'

export const getFeatureStyle = ((feature: Feature) => {
  const featureProps = feature.getProperties()

  const iconStyle = new Style({
    image: new Icon({
      displacement: [0, 19],
      src: `/icons/station-layer-icon${featureProps.isHighlighted ? '-highlighted' : ''}.svg`
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

export function getStationPointFeature(station: Station.Station) {
  const controlUnitsCount = uniq(station.controlUnitResources.map(({ controlUnitId }) => controlUnitId)).length

  const geoJSON = new GeoJSON()
  const geometry = geoJSON.readGeometry(
    {
      coordinates: [station.longitude, station.latitude],
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
  feature.setId(`${Layers.STATIONS.code}:${station.id}`)
  feature.setProperties({
    controlUnitsCount,
    isHighlighted: false,
    isSelected: false,
    station
  })

  return feature
}
