import { useGetRecentControlsActivityMutation } from '@api/recentActivity'
import { recentActivityActions } from '@features/RecentActivity/slice'
import { RecentActivity } from '@features/RecentActivity/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { useHasMapInteraction } from '@hooks/useHasMapInteraction'
import { customDayjs } from '@mtes-mct/monitor-ui'
import { getFeature } from '@utils/getFeature'
import { Layers } from 'domain/entities/layers/constants'
import { Feature } from 'ol'
import { WebGLVector } from 'ol/layer'
import VectorSource from 'ol/source/Vector'
import { useEffect, useMemo, useRef } from 'react'

import { getRecentControlActivityGeometry } from './recentControlActivityGeometryHelper'
import { recentControlActivityStyle } from './style'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'
import type { WebGLVectorLayerWithName } from 'domain/types/layer'
import type { Geometry } from 'ol/geom'

export function RecentControlsActivityLayer({ map }: BaseMapChildrenProps) {
  const dispatch = useAppDispatch()

  const displayRecentActivityLayer = useAppSelector(state => state.global.layers.displayRecentActivityLayer)
  const hasMapInteraction = useHasMapInteraction()
  const isLayerVisible = displayRecentActivityLayer && !hasMapInteraction
  const filters = useAppSelector(state => state.recentActivity.filters)
  const distinctionFilter = useAppSelector(state => state.recentActivity.distinctionFilter)
  const drawedGeometry = useAppSelector(state => state.recentActivity.drawedGeometry)

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
      geometry: filters.geometry,
      infractionsStatus: filters.infractionsStatus,
      startedAfter: startAfterFilter,
      startedBefore: startBeforeFilter,
      themeIds: filters.themeIds
    })
  }, [filters, getRecentControlsActivity])

  const vectorSourceRef = useRef(new VectorSource()) as React.MutableRefObject<VectorSource<Feature<Geometry>>>
  const vectorLayerRef = useRef(
    new WebGLVector({
      source: vectorSourceRef.current,
      style: recentControlActivityStyle,
      variables: {
        drawedGeometryId: ''
      },
      zIndex: Layers.RECENT_CONTROLS_ACTIVITY.zIndex
    })
  ) as React.MutableRefObject<WebGLVectorLayerWithName>
  vectorLayerRef.current.name = Layers.RECENT_CONTROLS_ACTIVITY.code

  const controlUnitsWithInfraction = useMemo(
    () => recentControlsActivity?.filter(control => control.infractions.length > 0) ?? [],
    [recentControlsActivity]
  )

  useEffect(() => {
    if (map) {
      vectorSourceRef.current.clear(true)

      if (recentControlsActivity) {
        // we save total of controls with or without infraction  in store
        dispatch(
          recentActivityActions.updateDistinctionFiltersItems({
            infractions: {
              withInfraction: controlUnitsWithInfraction.length,
              withoutInfraction: recentControlsActivity.length - controlUnitsWithInfraction.length
            }
          })
        )

        const features = recentControlsActivity.map(control =>
          getRecentControlActivityGeometry(control, distinctionFilter)
        )

        vectorSourceRef.current.addFeatures(features)
      }

      if (drawedGeometry) {
        const feature = getFeature(drawedGeometry)

        if (!feature) {
          return
        }
        feature.setId(`${Layers.RECENT_CONTROLS_ACTIVITY.code}:DRAWED_GEOMETRY`)

        vectorSourceRef.current.addFeature(feature)

        const id = feature.getId() ?? ''
        vectorLayerRef.current.updateStyleVariables({ drawedGeometryId: id })
      }
    }
  }, [map, distinctionFilter, dispatch, controlUnitsWithInfraction.length, recentControlsActivity, drawedGeometry])

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
