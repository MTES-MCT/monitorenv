import { useGetRecentControlsActivityMutation } from '@api/recentActivity'
import { RecentActivity } from '@features/RecentActivity/types'
import { getFeature } from '@utils/getFeature'
import { Layers } from 'domain/entities/layers/constants'
import { Feature } from 'ol'
import VectorLayer from 'ol/layer/Vector'
import OpenLayerMap from 'ol/Map'
import VectorSource from 'ol/source/Vector'
import React, { useEffect, useMemo, useRef } from 'react'

import { recentControlActivityStyle } from '../components/Layers/style'
import { getDatesFromFilters, getRecentActivityFeatures } from '../utils'

import type { RecentActivityFilters } from '../slice'
import type { OverlayCoordinates } from 'domain/shared_slices/Global'
import type { GeoJSON } from 'domain/types/GeoJSON'
import type { VectorLayerWithName } from 'domain/types/layer'
import type { Geometry } from 'ol/geom'

type UseRecentActivityLayerProps = {
  drawedGeometry?: GeoJSON.MultiPolygon
  filters: RecentActivityFilters | undefined
  geometry?: GeoJSON.MultiPolygon
  isLayerVisible: boolean
  layerName: string
  map: OpenLayerMap
  overlayCoordinates?: OverlayCoordinates
  selectedControlId?: string
}

export function useRecentActivitylayer({
  drawedGeometry,
  filters,
  geometry,
  isLayerVisible,
  layerName,
  map,
  overlayCoordinates,
  selectedControlId
}: UseRecentActivityLayerProps) {
  const [getRecentControlsActivity, { data: recentControlsActivity }] = useGetRecentControlsActivityMutation()

  useEffect(() => {
    if (!filters) {
      return
    }
    const startAfterFilter = filters.startedAfter
    const startBeforeFilter = filters.startedBefore

    if (
      filters.periodFilter === RecentActivity.RecentActivityDateRangeEnum.CUSTOM &&
      !filters.startedAfter &&
      !filters.startedBefore
    ) {
      return
    }

    const { startAfter, startBefore } = getDatesFromFilters({
      periodFilter: filters.periodFilter as RecentActivity.RecentActivityDateRangeEnum,
      startAfterFilter,
      startBeforeFilter
    })

    getRecentControlsActivity({
      administrationIds: filters?.administrationIds,
      controlUnitIds: filters?.controlUnitIds,
      geometry: geometry ?? filters?.geometry,
      startedAfter: startAfter,
      startedBefore: startBefore,
      themeIds: filters?.themeIds
    })
  }, [filters, geometry, getRecentControlsActivity])

  const vectorSourceRef = useRef(new VectorSource()) as React.MutableRefObject<VectorSource<Feature<Geometry>>>
  const vectorLayerRef = useRef(
    new VectorLayer({
      source: vectorSourceRef.current,
      style: recentControlActivityStyle,
      zIndex: Layers[layerName].zIndex
    })
  ) as React.MutableRefObject<VectorLayerWithName>
  vectorLayerRef.current.name = Layers[layerName].code

  const controlUnitsWithInfraction = useMemo(
    () => recentControlsActivity?.filter(control => control.infractions.length > 0) ?? [],
    [recentControlsActivity]
  )

  useEffect(() => {
    if (map) {
      vectorSourceRef.current.clear(true)

      if (recentControlsActivity && isLayerVisible) {
        const features = getRecentActivityFeatures(recentControlsActivity, layerName)
        vectorSourceRef.current.addFeatures(features)
      }

      if (drawedGeometry) {
        const feature = getFeature(drawedGeometry)

        if (!feature) {
          return
        }
        feature.setId(`${Layers[layerName].code}:DRAWED_GEOMETRY`)

        vectorSourceRef.current.addFeature(feature)
      }
    }
  }, [map, controlUnitsWithInfraction.length, recentControlsActivity, drawedGeometry, layerName, isLayerVisible])

  useEffect(() => {
    const feature = vectorSourceRef.current.getFeatureById(`${layerName}:${selectedControlId}`)
    feature?.setProperties({ overlayCoordinates })
  }, [overlayCoordinates, selectedControlId, layerName])

  useEffect(() => {
    map.getLayers().push(vectorLayerRef.current)

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      map.removeLayer(vectorLayerRef.current)
    }
  }, [map])

  useEffect(() => {
    vectorLayerRef.current?.setVisible(isLayerVisible)
  }, [isLayerVisible])

  return {
    controls: recentControlsActivity
  }
}
