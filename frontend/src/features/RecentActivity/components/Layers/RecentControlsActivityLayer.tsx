import { useGetRecentControlsActivityMutation } from '@api/recentActivity'
import { RecentActivity } from '@features/RecentActivity/types'
import { useAppSelector } from '@hooks/useAppSelector'
import { useHasMapInteraction } from '@hooks/useHasMapInteraction'
import { customDayjs } from '@mtes-mct/monitor-ui'
import { Layers } from 'domain/entities/layers/constants'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useEffect, useRef } from 'react'

import { getRecentControlActivityGeometry } from './recentControlActivityGeometryHelper'
import { recentControlActivityStyle } from './style'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'
import type { VectorLayerWithName } from 'domain/types/layer'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'

export function RecentControlsActivityLayer({ map }: BaseMapChildrenProps) {
  const displayRecentActivityLayer = useAppSelector(state => state.global.layers.displayRecentActivityLayer)
  const hasMapInteraction = useHasMapInteraction()
  const isLayerVisible = displayRecentActivityLayer && !hasMapInteraction
  const filters = useAppSelector(state => state.recentActivity.filters)

  const [getRecentControlsActivity, { data: recentControlsActivity }] = useGetRecentControlsActivityMutation()

  useEffect(() => {
    let startAfterFilter = filters.startedAfter
    let startBeforeFilter = filters.startedBefore

    if (
      filters.periodFilter === RecentActivity.RecentActivityDateRangeEnum.CUSTOM &&
      !filters.startedAfter &&
      !filters.startedBefore
    ) {
      return
    }

    switch (filters.periodFilter) {
      case RecentActivity.RecentActivityDateRangeEnum.THREE_LAST_DAYS:
        startAfterFilter = customDayjs().utc().subtract(3, 'day').startOf('day').toISOString()
        startBeforeFilter = customDayjs().utc().endOf('day').toISOString()
        break
      case RecentActivity.RecentActivityDateRangeEnum.THIRTY_LAST_DAYS:
        startAfterFilter = customDayjs().utc().subtract(30, 'day').startOf('day').toISOString()
        startBeforeFilter = customDayjs().utc().endOf('day').toISOString()
        break
      case RecentActivity.RecentActivityDateRangeEnum.THREE_LAST_MONTHS:
        startAfterFilter = customDayjs().utc().subtract(3, 'month').startOf('day').toISOString()
        startBeforeFilter = customDayjs().utc().endOf('day').toISOString()
        break
      case RecentActivity.RecentActivityDateRangeEnum.CUSTOM:
        break
      default:
        break
    }
    getRecentControlsActivity({
      administrationIds: filters.administrationIds,
      controlUnitIds: filters.controlUnitIds,
      infractionsStatus: filters.infractionsStatus,
      startedAfter: startAfterFilter,
      startedBefore: startBeforeFilter,
      themeIds: filters.themeIds
    })
  }, [filters, getRecentControlsActivity])

  const vectorSourceRef = useRef(new VectorSource()) as React.MutableRefObject<VectorSource<Feature<Geometry>>>
  const vectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      renderOrder: (a, b) => b.get('area') - a.get('area'),
      source: vectorSourceRef.current,
      style: recentControlActivityStyle,
      zIndex: Layers.RECENT_CONTROLS_ACTIVITY.zIndex
    })
  ) as React.MutableRefObject<VectorLayerWithName>
  vectorLayerRef.current.name = Layers.RECENT_CONTROLS_ACTIVITY.code

  useEffect(() => {
    if (map) {
      vectorSourceRef.current.clear(true)

      if (recentControlsActivity) {
        const features = recentControlsActivity.map(control => getRecentControlActivityGeometry(control))

        vectorSourceRef.current.addFeatures(features)
      }
    }
  }, [map, recentControlsActivity])

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

  return null
}
