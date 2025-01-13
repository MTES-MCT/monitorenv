import { OverlayPositionOnCentroid } from '@features/map/overlays/OverlayPositionOnCentroid'
import { useAppSelector } from '@hooks/useAppSelector'
import { Layers } from 'domain/entities/layers/constants'
import { isOverlayOpened } from 'domain/shared_slices/Global'
import { convertToFeature } from 'domain/types/map'
import { useState } from 'react'

import { MissionCard } from './MissionCard'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'
import type { VectorLayerWithName } from 'domain/types/layer'

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

export function MissionOverlays({ currentFeatureOver, map, mapClickEvent }: BaseMapChildrenProps) {
  const selectedMissionId = useAppSelector(state => state.mission.selectedMissionIdOnMap)

  const [hoveredOptions, setHoveredOptions] = useState(OPTIONS)
  const [selectedOptions, setSelectedOptions] = useState(OPTIONS)

  const feature = map
    ?.getLayers()
    ?.getArray()
    ?.find(
      (l): l is VectorLayerWithName =>
        Object.prototype.hasOwnProperty.call(l, 'name') && (l as VectorLayerWithName).name === Layers.MISSIONS.code
    )
    ?.getSource()
    ?.getFeatureById(`${Layers.MISSIONS.code}:${selectedMissionId}`)

  const canOverlayBeOpened = useAppSelector(state => isOverlayOpened(state.global, String(feature?.getId())))

  const hoveredFeature = convertToFeature(currentFeatureOver)
  const currentfeatureId = hoveredFeature?.getId()
  const displayHoveredFeature =
    typeof currentfeatureId === 'string' &&
    currentfeatureId.startsWith(Layers.MISSIONS.code) &&
    currentfeatureId !== `${Layers.MISSIONS.code}:${selectedMissionId}`

  const updateHoveredMargins = (cardHeight: number) => {
    if (OPTIONS.margins.yTop - cardHeight !== hoveredOptions.margins.yTop) {
      setHoveredOptions({ margins: { ...hoveredOptions.margins, yTop: OPTIONS.margins.yTop - cardHeight } })
    }
  }

  const updateSelectedMargins = (cardHeight: number) => {
    if (OPTIONS.margins.yTop - cardHeight !== selectedOptions.margins.yTop) {
      setSelectedOptions({ margins: { ...selectedOptions.margins, yTop: OPTIONS.margins.yTop - cardHeight } })
    }
  }

  return (
    <>
      <OverlayPositionOnCentroid
        appClassName="overlay-mission-selected"
        feature={canOverlayBeOpened ? feature : undefined}
        map={map}
        mapClickEvent={mapClickEvent}
        options={selectedOptions}
        zIndex={6500}
      >
        <MissionCard feature={feature} selected updateMargins={updateSelectedMargins} />
      </OverlayPositionOnCentroid>
      <OverlayPositionOnCentroid
        appClassName="overlay-mission-hover"
        feature={displayHoveredFeature ? hoveredFeature : undefined}
        map={map}
        mapClickEvent={mapClickEvent}
        options={hoveredOptions}
        zIndex={6000}
      >
        <MissionCard feature={hoveredFeature} updateMargins={updateHoveredMargins} />
      </OverlayPositionOnCentroid>
    </>
  )
}
