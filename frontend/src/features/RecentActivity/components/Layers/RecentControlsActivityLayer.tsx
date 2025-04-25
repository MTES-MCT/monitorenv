import { useGetRecentControlsActivityMutation } from '@api/recentActivity'
import { getRecentActivityFilters } from '@features/Dashboard/components/DashboardForm/slice'
import { dashboardActions, getActiveDashboardId } from '@features/Dashboard/slice'
import { MAX_CONTROLS, MIN_CONTROLS } from '@features/RecentActivity/constants'
import { RecentActivity } from '@features/RecentActivity/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { useHasMapInteraction } from '@hooks/useHasMapInteraction'
import { customDayjs } from '@mtes-mct/monitor-ui'
import { getFeature } from '@utils/getFeature'
import { Layers } from 'domain/entities/layers/constants'
import { getOverlayCoordinates } from 'domain/shared_slices/Global'
import { Feature } from 'ol'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useEffect, useMemo, useRef } from 'react'

import { getRecentControlActivityGeometry } from './recentControlActivityGeometryHelper'
import { recentControlActivityStyle } from './style'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'
import type { VectorLayerWithName } from 'domain/types/layer'
import type { Geometry } from 'ol/geom'

export function calculateDotSize(totalControls: number): number {
  const minPixel = Number(import.meta.env.FRONTEND_RECENT_ACTIVITY_MIN_PIXEL)
  const maxPixel = Number(import.meta.env.FRONTEND_RECENT_ACTIVITY_MAX_PIXEL)
  const coefficient = Number(import.meta.env.FRONTEND_RECENT_ACTIVITY_COEFFICIENT)

  return (
    minPixel +
    ((Math.log(totalControls + coefficient) - Math.log(MIN_CONTROLS + coefficient)) /
      (Math.log(MAX_CONTROLS + coefficient) - Math.log(MIN_CONTROLS + coefficient))) *
      (maxPixel - minPixel)
  )
}

export function RecentControlsActivityLayer({ map }: BaseMapChildrenProps) {
  const dispatch = useAppDispatch()

  const displayRecentActivityLayer = useAppSelector(state => state.global.layers.displayRecentActivityLayer)
  const hasMapInteraction = useHasMapInteraction()

  const filters = useAppSelector(state => state.recentActivity.filters)
  const drawedGeometry = useAppSelector(state => state.recentActivity.drawedGeometry)
  const selectedControlId = useAppSelector(state => state.recentActivity.layersAndOverlays.selectedControlId)

  const activeDashboardId = useAppSelector(state => getActiveDashboardId(state.dashboard))
  const dashboardFilters = useAppSelector(state => getRecentActivityFilters(state.dashboardFilters, activeDashboardId))

  const overlayCoordinates = useAppSelector(state =>
    getOverlayCoordinates(state.global, `${Layers.RECENT_CONTROLS_ACTIVITY.code}:${selectedControlId}`)
  )

  const [getRecentControlsActivity, { data: recentControlsActivity }] = useGetRecentControlsActivityMutation()

  const isLayerVisible = (displayRecentActivityLayer || !!activeDashboardId) && !hasMapInteraction
  const filtersToUse = useMemo(() => {
    if (activeDashboardId) {
      return dashboardFilters
    }

    return filters
  }, [activeDashboardId, filters, dashboardFilters])

  useEffect(() => {
    let startAfterFilter = filtersToUse?.startedAfter
    let startBeforeFilter = filtersToUse?.startedBefore

    if (
      filtersToUse?.periodFilter === RecentActivity.RecentActivityDateRangeEnum.CUSTOM &&
      !filtersToUse?.startedAfter &&
      !filtersToUse?.startedBefore
    ) {
      return
    }

    switch (filtersToUse?.periodFilter) {
      case RecentActivity.RecentActivityDateRangeEnum.SEVEN_LAST_DAYS:
        startAfterFilter = customDayjs().utc().subtract(7, 'day').startOf('day').toISOString()
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
      case RecentActivity.RecentActivityDateRangeEnum.CURRENT_YEAR:
        startAfterFilter = customDayjs().utc().startOf('year').toISOString()
        startBeforeFilter = customDayjs().utc().endOf('day').toISOString()
        break
      case RecentActivity.RecentActivityDateRangeEnum.CUSTOM:
        break
      default:
        break
    }

    getRecentControlsActivity({
      administrationIds: filtersToUse?.administrationIds,
      controlUnitIds: filtersToUse?.controlUnitIds,
      geometry: filtersToUse && 'geometry' in filtersToUse ? filtersToUse.geometry : undefined,
      startedAfter: startAfterFilter,
      startedBefore: startBeforeFilter,
      themeIds: filtersToUse?.themeIds
    })
  }, [filtersToUse, getRecentControlsActivity])

  const vectorSourceRef = useRef(new VectorSource()) as React.MutableRefObject<VectorSource<Feature<Geometry>>>
  const vectorLayerRef = useRef(
    new VectorLayer({
      source: vectorSourceRef.current,
      style: recentControlActivityStyle,
      zIndex: Layers.RECENT_CONTROLS_ACTIVITY.zIndex
    })
  ) as React.MutableRefObject<VectorLayerWithName>
  vectorLayerRef.current.name = Layers.RECENT_CONTROLS_ACTIVITY.code

  const controlUnitsWithInfraction = useMemo(
    () => recentControlsActivity?.filter(control => control.infractions.length > 0) ?? [],
    [recentControlsActivity]
  )

  useEffect(() => {
    if (map) {
      vectorSourceRef.current.clear(true)

      if (recentControlsActivity) {
        if (activeDashboardId) {
          dispatch(
            dashboardActions.setTotalOfControls({
              key: activeDashboardId,
              totalOfControls: recentControlsActivity.length
            })
          )
        }
        const features = recentControlsActivity.flatMap(control => {
          if (control.actionNumberOfControls === 0 || !control.actionNumberOfControls) {
            return []
          }
          // total number of controls in action
          const totalControls = control.actionNumberOfControls

          // total number of persons controlled in all infractions
          const totalControlsInInfractions = control.infractions.reduce(
            (acc, infraction) => acc + infraction.nbTarget,
            0
          )

          const ratioInfractionsInControls = (totalControlsInInfractions / totalControls) * 100

          const iconSize = calculateDotSize(totalControls)

          return getRecentControlActivityGeometry({
            control,
            iconSize,
            ratioInfractionsInControls
          })
        })
        vectorSourceRef.current.addFeatures(features)
      }

      if (drawedGeometry) {
        const feature = getFeature(drawedGeometry)

        if (!feature) {
          return
        }
        feature.setId(`${Layers.RECENT_CONTROLS_ACTIVITY.code}:DRAWED_GEOMETRY`)

        vectorSourceRef.current.addFeature(feature)
      }
    }
  }, [map, dispatch, controlUnitsWithInfraction.length, recentControlsActivity, drawedGeometry, activeDashboardId])

  useEffect(() => {
    const feature = vectorSourceRef.current.getFeatureById(
      `${Layers.RECENT_CONTROLS_ACTIVITY.code}:${selectedControlId}`
    )
    feature?.setProperties({ overlayCoordinates })
  }, [overlayCoordinates, selectedControlId, dispatch])

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
