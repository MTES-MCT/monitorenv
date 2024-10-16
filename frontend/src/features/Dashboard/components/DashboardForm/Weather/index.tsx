import { Icon, OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { getCenter } from 'ol/extent'
import { GeoJSON as GeoJSONOL } from 'ol/format'
import { transform } from 'ol/proj'
import { useMemo } from 'react'
import styled from 'styled-components'

import type { GeoJSON } from 'domain/types/GeoJSON'

type WeatherProps = {
  geom: GeoJSON.Geometry | undefined
}

export function Weather({ geom }: WeatherProps) {
  const coordinates = useMemo(() => {
    if (!geom) {
      return ''
    }
    const feature = new GeoJSONOL({
      featureProjection: OPENLAYERS_PROJECTION
    }).readFeature(geom)

    const extent = feature?.getGeometry()?.getExtent()
    const center = extent && getCenter(extent)
    const centerLatLon = center && transform(center, OPENLAYERS_PROJECTION, WSG84_PROJECTION)

    if (!centerLatLon) {
      return undefined
    }

    return `${centerLatLon[1]?.toFixed(3)}/${centerLatLon[0]?.toFixed(3)}`
  }, [geom])

  return (
    <WeatherBlock>
      <WeatherTitle>Météo</WeatherTitle>
      {coordinates ? (
        <a href={`https://www.windy.com/${coordinates}`} rel="noreferrer" target="_blank">
          <span> {`https://www.windy.com/${coordinates}`}</span>
          <Icon.ExternalLink size={16} />
        </a>
      ) : (
        <CoordinatesError>Nous n&apos;avons pas pu calculer l&apos;emplacement </CoordinatesError>
      )}
    </WeatherBlock>
  )
}

const WeatherBlock = styled.div`
  align-items: center;
  box-shadow: 0px 3px 6px #70778540;
  display: flex;
  gap: 24px;
  padding: 21px 24px;
  > a {
    align-items: center;
    color: #295edb;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
`
const WeatherTitle = styled.h2`
  font-size: 16px;
  font-weight: 500;
`
const CoordinatesError = styled.div`
  color: ${p => p.theme.color.slateGray};
  font-size: 11px;
  font-style: italic;
`
