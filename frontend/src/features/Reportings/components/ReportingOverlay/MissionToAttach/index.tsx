import { OverlayPositionOnCentroid } from '@features/map/overlays/OverlayPositionOnCentroid'
import { MissionCard } from '@features/Mission/components/Overlays/MissionCard'
import { useAppSelector } from '@hooks/useAppSelector'
import { useMapContext } from 'context/map/MapContext'
import { Layers } from 'domain/entities/layers/constants'
import { convertToFeature } from 'domain/types/map'
import { memo } from 'react'

const OPTIONS = {
  margins: {
    xLeft: 20,
    xMiddle: 120,
    xRight: 20,
    yBottom: 20,
    yMiddle: 20,
    yTop: 20
  }
}

export const MissionToAttachOverlays = memo(() => {
  const { currentFeatureOver, map, mapClickEvent } = useMapContext()

  const displayMissionToAttachLayer = useAppSelector(state => state.global.layers.displayMissionToAttachLayer)
  const feature = convertToFeature(currentFeatureOver)
  const currentfeatureId = feature?.getId()
  const displayHoveredFeature =
    typeof currentfeatureId === 'string' && currentfeatureId.startsWith(Layers.MISSION_TO_ATTACH_ON_REPORTING.code)

  return (
    <OverlayPositionOnCentroid
      appClassName="overlay-mission-to-attach-hover"
      feature={displayMissionToAttachLayer && displayHoveredFeature ? feature : undefined}
      map={map}
      mapClickEvent={mapClickEvent}
      options={OPTIONS}
      zIndex={6000}
    >
      <MissionCard feature={feature} isOnlyHoverable />
    </OverlayPositionOnCentroid>
  )
})
