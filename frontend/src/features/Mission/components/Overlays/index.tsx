import { OverlayPositionOnCentroid } from '@features/map/overlays/OverlayPositionOnCentroid'
import { useAppSelector } from '@hooks/useAppSelector'
import { findMapFeatureById } from '@utils/findMapFeatureById'
import { useMapContext } from 'context/map/MapContext'
import { Layers } from 'domain/entities/layers/constants'
import { isOverlayOpened } from 'domain/shared_slices/Global'
import { convertToFeature } from 'domain/types/map'
import { memo, useCallback, useMemo, useState } from 'react'

import { MissionCard } from './MissionCard'

const OPTIONS = {
  margins: {
    xLeft: 50,
    xMiddle: 30,
    xRight: -55,
    yBottom: 50,
    yMiddle: 50,
    yTop: -55
  }
}

export const MissionOverlays = memo(() => {
  const { currentFeatureOver, map, mapClickEvent } = useMapContext()

  const selectedMissionId = useAppSelector(state => state.mission.selectedMissionIdOnMap)

  const [missionHoveredOptions, setMissionHoveredOptions] = useState(OPTIONS)
  const [missionSelectedOptions, setMissionSelectedOptions] = useState(OPTIONS)

  const feature = useMemo(
    () => findMapFeatureById(map, Layers.MISSIONS.code, `${Layers.MISSIONS.code}:${selectedMissionId}`),
    [map, selectedMissionId]
  )

  const canOverlayBeOpened = useAppSelector(state => isOverlayOpened(state.global, String(feature?.getId())))

  const hoveredFeature = convertToFeature(currentFeatureOver)
  const currentfeatureId = hoveredFeature?.getId()
  const displayHoveredFeature =
    typeof currentfeatureId === 'string' &&
    currentfeatureId.startsWith(Layers.MISSIONS.code) &&
    currentfeatureId !== `${Layers.MISSIONS.code}:${selectedMissionId}`

  const updateMissionHoveredMargins = useCallback(
    (cardHeight: number) => {
      if (OPTIONS.margins.yTop - cardHeight !== missionHoveredOptions.margins.yTop) {
        setMissionHoveredOptions({
          margins: { ...missionHoveredOptions.margins, yTop: OPTIONS.margins.yTop - cardHeight }
        })
      }
    },
    [missionHoveredOptions.margins]
  )

  const updateMissionSelectedMargins = useCallback(
    (cardHeight: number) => {
      if (OPTIONS.margins.yTop - cardHeight !== missionSelectedOptions.margins.yTop) {
        setMissionSelectedOptions({
          margins: { ...missionSelectedOptions.margins, yTop: OPTIONS.margins.yTop - cardHeight }
        })
      }
    },
    [missionSelectedOptions.margins]
  )

  return (
    <>
      <OverlayPositionOnCentroid
        appClassName="overlay-mission-selected"
        feature={canOverlayBeOpened ? feature : undefined}
        map={map}
        mapClickEvent={mapClickEvent}
        options={missionSelectedOptions}
        zIndex={6500}
      >
        <MissionCard feature={feature} selected updateMargins={updateMissionSelectedMargins} />
      </OverlayPositionOnCentroid>
      <OverlayPositionOnCentroid
        appClassName="overlay-mission-hover"
        feature={displayHoveredFeature ? hoveredFeature : undefined}
        map={map}
        mapClickEvent={mapClickEvent}
        options={missionHoveredOptions}
        zIndex={6000}
      >
        <MissionCard feature={hoveredFeature} updateMargins={updateMissionHoveredMargins} />
      </OverlayPositionOnCentroid>
    </>
  )
})
