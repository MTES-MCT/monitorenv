import { useState } from 'react'

import { MissionCard } from './MissionCard'
import { Layers } from '../../../../domain/entities/layers/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { OverlayPositionOnCentroid } from '../OverlayPositionOnCentroid'

import type { VectorLayerWithName } from '../../../../domain/types/layer'
import type { BaseMapChildrenProps } from '../../BaseMap'

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

export function MissionOverlays({ currentFeatureOver, map }: BaseMapChildrenProps) {
  const selectedMissionId = useAppSelector(state => state.mission.selectedMissionIdOnMap)
  const displayMissionsOverlay = useAppSelector(state => state.global.displayMissionsOverlay)
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
  const currentfeatureId = currentFeatureOver?.getId()
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
        feature={displayMissionsOverlay ? feature : undefined}
        featureIsShowed
        map={map}
        options={selectedOptions}
        zIndex={6500}
      >
        <MissionCard feature={feature} selected updateMargins={updateSelectedMargins} />
      </OverlayPositionOnCentroid>
      <OverlayPositionOnCentroid
        appClassName="overlay-mission-hover"
        feature={displayMissionsOverlay && displayHoveredFeature ? currentFeatureOver : undefined}
        map={map}
        options={hoveredOptions}
        zIndex={6000}
      >
        <MissionCard feature={currentFeatureOver} updateMargins={updateHoveredMargins} />
      </OverlayPositionOnCentroid>
    </>
  )
}
