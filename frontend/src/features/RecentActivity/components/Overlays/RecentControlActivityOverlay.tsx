import { ControlCard } from '@features/map/overlays/actions/ControlCard'
import { OverlayPositionOnCentroid } from '@features/map/overlays/OverlayPositionOnCentroid'
import { useGetControlPlans } from '@hooks/useGetControlPlans'
import { convertToFeature } from 'domain/types/map'
import { useMemo } from 'react'
import styled from 'styled-components'

import { Layers } from '../../../../domain/entities/layers/constants'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'

export function RecentControlActivityOverlay({ currentFeatureOver, map, mapClickEvent }: BaseMapChildrenProps) {
  const hoveredFeature = convertToFeature(currentFeatureOver)
  const currentfeatureId = hoveredFeature?.getId()
  const layerName = Layers.RECENT_CONTROLS_ACTIVITY.code
  const displayHoveredFeature = typeof currentfeatureId === 'string' && currentfeatureId.startsWith(layerName)

  const { isLoading, themes } = useGetControlPlans()

  const controlThemeIds = hoveredFeature?.get('themeIds')
  const controlThemes = useMemo(
    () => controlThemeIds?.map(themeId => themes[themeId]?.theme).join(','),
    [controlThemeIds, themes]
  )

  if (isLoading) {
    return null
  }

  return (
    <OverlayPositionOnCentroid
      appClassName="overlay-action-hover"
      feature={displayHoveredFeature ? hoveredFeature : undefined}
      map={map}
      mapClickEvent={mapClickEvent}
      zIndex={5500}
    >
      {hoveredFeature && (
        <ControlCard feature={hoveredFeature}>
          <>
            {controlThemeIds?.length > 0 ? (
              <StyledThemes>{controlThemes}</StyledThemes>
            ) : (
              <StyledGrayText>Thématique à renseigner</StyledGrayText>
            )}
          </>
        </ControlCard>
      )}
    </OverlayPositionOnCentroid>
  )
}

const StyledThemes = styled.div`
  white-space: nowrap;
  font: normal normal bold 13px/18px Marianne;
`

const StyledGrayText = styled.p`
  color: ${p => p.theme.color.slateGray};
`
