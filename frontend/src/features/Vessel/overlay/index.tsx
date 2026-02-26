import { OverlayPositionOnCentroid } from '@features/map/overlays/OverlayPositionOnCentroid'
import { Card } from '@features/Vessel/overlay/Card'
import { vesselAction } from '@features/Vessel/slice'
import { Vessel } from '@features/Vessel/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { findMapFeatureById } from '@utils/findMapFeatureById'
import { Layers } from 'domain/entities/layers/constants'
import { convertToFeature } from 'domain/types/map'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { isOverlayOpened, removeOverlayStroke } from '../../../domain/shared_slices/Global'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'

const OPTIONS = {
  margins: {
    xLeft: 200,
    xMiddle: 0,
    xRight: 0,
    yBottom: 50,
    yMiddle: 0,
    yTop: -220
  }
}

export function PositionOverlay({ currentFeatureOver, map, mapClickEvent }: BaseMapChildrenProps) {
  const dispatch = useAppDispatch()
  const { featureId: selectedFeatureId } = useAppSelector(state => state.vessel.selectedPosition)
  const [missionHoveredOptions, setMissionHoveredOptions] = useState(OPTIONS)
  const [missionSelectedOptions, setMissionSelectedOptions] = useState(OPTIONS)

  const layerName = Layers.VESSEL_POSITIONS.code

  const hoveredFeature = useMemo(() => convertToFeature(currentFeatureOver), [currentFeatureOver])

  const selectedFeature = useMemo(() => {
    const { feature } = mapClickEvent

    return findMapFeatureById(map, layerName, `${layerName}:${feature?.properties.id}`)
  }, [layerName, map, mapClickEvent])

  const canOverlayBeOpened = useAppSelector(state => isOverlayOpened(state.global, String(selectedFeature?.getId())))

  const canDisplayHoveredFeature =
    !!hoveredFeature?.getId()?.toString().startsWith(layerName) && hoveredFeature?.getId() !== selectedFeatureId

  useEffect(() => {
    dispatch(vesselAction.setSelectedFeatureId(selectedFeature?.getId()))
  }, [dispatch, selectedFeature])

  const updateHoveredMargins = useCallback(
    (cardHeight: number) => {
      if (OPTIONS.margins.yTop - cardHeight !== missionHoveredOptions.margins.yTop) {
        setMissionHoveredOptions({
          margins: { ...missionHoveredOptions.margins, yTop: OPTIONS.margins.yTop - cardHeight }
        })
      }
    },
    [missionHoveredOptions.margins]
  )

  const updateSelectedMargins = useCallback(
    (cardHeight: number) => {
      if (OPTIONS.margins.yTop - cardHeight !== missionSelectedOptions.margins.yTop) {
        setMissionSelectedOptions({
          margins: { ...missionSelectedOptions.margins, yTop: OPTIONS.margins.yTop - cardHeight }
        })
      }
    },
    [missionSelectedOptions.margins]
  )

  const close = () => {
    dispatch(vesselAction.setSelectedFeatureId(undefined))
    dispatch(removeOverlayStroke())
  }

  return (
    <>
      {/* To display position after click */}
      <OverlayPositionOnCentroid
        appClassName="overlay-vessel-selected"
        feature={canOverlayBeOpened ? selectedFeature : undefined}
        map={map}
        mapClickEvent={mapClickEvent}
        options={OPTIONS}
        zIndex={5000}
      >
        {selectedFeature && selectedFeatureId && (
          <Card
            isSelected
            onClose={close}
            position={selectedFeature.getProperties() as Vessel.Position}
            updateMargins={updateSelectedMargins}
          />
        )}
      </OverlayPositionOnCentroid>

      <OverlayPositionOnCentroid
        appClassName="overlay-vessel-hovered"
        feature={canDisplayHoveredFeature ? hoveredFeature : undefined}
        map={map}
        mapClickEvent={mapClickEvent}
        options={OPTIONS}
        zIndex={5000}
      >
        {hoveredFeature && (
          <Card position={hoveredFeature.getProperties() as Vessel.Position} updateMargins={updateHoveredMargins} />
        )}
      </OverlayPositionOnCentroid>
    </>
  )
}
