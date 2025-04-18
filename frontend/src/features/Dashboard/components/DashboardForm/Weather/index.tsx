import { Icon, OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { getFeature } from '@utils/getFeature'
import { getCenter } from 'ol/extent'
import { transform } from 'ol/proj'
import { forwardRef, useMemo } from 'react'
import styled from 'styled-components'

import type { GeoJSON } from 'domain/types/GeoJSON'

type WeatherProps = {
  geom: GeoJSON.Geometry | undefined
}

export const Weather = forwardRef<HTMLDivElement, WeatherProps>(({ geom }, ref) => {
  const coordinates = useMemo(() => {
    if (!geom) {
      return ''
    }
    const feature = getFeature(geom)

    const extent = feature?.getGeometry()?.getExtent()
    const center = extent && getCenter(extent)
    const centerLatLon = center && transform(center, OPENLAYERS_PROJECTION, WSG84_PROJECTION)

    if (!centerLatLon) {
      return undefined
    }

    return {
      latitude: centerLatLon[1]?.toFixed(3),
      longitude: centerLatLon[0]?.toFixed(3)
    }
  }, [geom])

  return (
    <WeatherBlock>
      <WeatherTitle ref={ref}>
        <span>Météo</span>
        {coordinates && (
          <StyledLink
            href={`https://www.windy.com/${coordinates.latitude}/${coordinates.longitude}`}
            rel="noreferrer"
            target="_blank"
          >
            <Icon.ExternalLink size={16} />
          </StyledLink>
        )}
      </WeatherTitle>
      {coordinates ? (
        <WindyContainer>
          <iframe
            allowFullScreen
            height="100%"
            src={`https://embed.windy.com/embed2.html?lat=${coordinates.latitude}&lon=${coordinates.longitude}&zoom=7`}
            title="windy weather"
            width="100%"
          />
        </WindyContainer>
      ) : (
        <CoordinatesError>Nous n&apos;avons pas pu calculer l&apos;emplacement </CoordinatesError>
      )}
    </WeatherBlock>
  )
})

const WeatherBlock = styled.div`
  box-shadow: 0px 3px 6px #70778540;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 21px 24px;
`
const WeatherTitle = styled.h2`
  display: flex;
  font-size: 16px;
  font-weight: 500;
  gap: 16px;
`
const CoordinatesError = styled.div`
  color: ${p => p.theme.color.slateGray};
  font-size: 11px;
  font-style: italic;
`
const WindyContainer = styled.div`
  width: 100%;
  height: 300px;
`
const StyledLink = styled.a`
  align-items: center;
  color: #295edb;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  word-break: break-all;
`
