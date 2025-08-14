import { Icon, OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { getFeature } from '@utils/getFeature'
import { getCenter } from 'ol/extent'
import { transform } from 'ol/proj'
import { forwardRef, useMemo } from 'react'
import styled from 'styled-components'

import { Accordion, Title, TitleContainer } from '../Accordion'

import type { GeoJSON } from 'domain/types/GeoJSON'

type WeatherProps = {
  geom: GeoJSON.Geometry | undefined
  isExpanded: boolean
  setExpandedAccordion: () => void
}

export const Weather = forwardRef<HTMLDivElement, WeatherProps>(({ geom, isExpanded, setExpandedAccordion }, ref) => {
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
    <Accordion
      controls={
        coordinates && (
          <StyledLink
            href={`https://www.windy.com/${coordinates.latitude}/${coordinates.longitude}`}
            onClick={e => e.stopPropagation()}
            rel="noreferrer"
            target="_blank"
            title="Ouvrir Windy"
          >
            <Icon.ExternalLink size={16} />
          </StyledLink>
        )
      }
      isExpanded={isExpanded}
      setExpandedAccordion={setExpandedAccordion}
      title={
        <TitleContainer>
          <Title>Météo</Title>
        </TitleContainer>
      }
      titleRef={ref}
    >
      {coordinates ? (
        <WindyContainer>
          <iframe
            allowFullScreen
            height="100%"
            src={`https://embed.windy.com/embed2.html?lat=${coordinates.latitude}&lon=${coordinates.longitude}&zoom=7`}
            style={{
              border: 'none'
            }}
            title="windy weather"
            width="100%"
          />
        </WindyContainer>
      ) : (
        <CoordinatesError>Nous n&apos;avons pas pu calculer l&apos;emplacement </CoordinatesError>
      )}
    </Accordion>
  )
})

const CoordinatesError = styled.div`
  color: ${p => p.theme.color.slateGray};
  font-size: 11px;
  font-style: italic;
`
const WindyContainer = styled.div`
  width: 100%;
  height: 300px;
  padding: 16px;
`
const StyledLink = styled.a`
  align-items: center;
  color: #295edb;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  word-break: break-all;
`
