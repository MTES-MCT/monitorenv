import { useGetSemaphoresQuery } from '@api/semaphoresAPI'
import { useGetFilteredReportingsQuery } from '@features/Reportings/hooks/useGetFilteredReportingsQuery'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { useGetCurrentUserAuthorizationQueryOverride } from '@hooks/useGetCurrentUserAuthorizationQueryOverride'
import { useHasMapInteraction } from '@hooks/useHasMapInteraction'
import { Layers } from 'domain/entities/layers/constants'
import { removeOverlayStroke } from 'domain/shared_slices/Global'
import { setSelectedSemaphore } from 'domain/shared_slices/SemaphoresSlice'
import { convertToFeature } from 'domain/types/map'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useEffect, useMemo, useRef, type MutableRefObject } from 'react'

import { getSemaphoreStyle } from './style'
import { getSemaphoresPoint } from './utils'

import type { BaseMapChildrenProps } from '../../../map/BaseMap'
import type { VectorLayerWithName } from 'domain/types/layer'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'

export function SemaphoresLayer({ map, mapClickEvent }: BaseMapChildrenProps) {
  const dispatch = useAppDispatch()
  const { displaySemaphoresLayer } = useAppSelector(state => state.global.layers)
  // we don't want to display sempahores on the map if the user so decides (displaySemaphoresLayer variable)
  // or if user have interaction on map (edit mission zone, attach reporting or mission)
  const hasMapInteraction = useHasMapInteraction()
  const isLayerVisible = useMemo(
    () => displaySemaphoresLayer && !hasMapInteraction,
    [displaySemaphoresLayer, hasMapInteraction]
  )

  const result = useGetCurrentUserAuthorizationQueryOverride()
  const isSuperUser = result?.isSuperUser ?? true
  const { data: semaphores } = useGetSemaphoresQuery()

  const { reportings } = useGetFilteredReportingsQuery(!isSuperUser)

  const semaphoresPoint = useMemo(() => getSemaphoresPoint(semaphores, reportings), [semaphores, reportings])

  const semaphoreVectorSourceRef = useRef(new VectorSource()) as MutableRefObject<VectorSource<Feature<Geometry>>>
  const semaphoreVectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      source: semaphoreVectorSourceRef.current,
      style: feature => getSemaphoreStyle(feature, isSuperUser),
      zIndex: Layers.SEMAPHORES.zIndex
    })
  ) as MutableRefObject<VectorLayerWithName>
  semaphoreVectorLayerRef.current.name = Layers.SEMAPHORES.code

  useEffect(() => {
    if (map) {
      map.getLayers().push(semaphoreVectorLayerRef.current)

      // eslint-disable-next-line react-hooks/exhaustive-deps
      return () => map.removeLayer(semaphoreVectorLayerRef.current)
    }

    return () => {}
  }, [map])

  useEffect(() => {
    semaphoreVectorSourceRef.current?.clear(true)
    if (semaphoresPoint) {
      semaphoreVectorSourceRef.current?.addFeatures(semaphoresPoint)
    }
  }, [semaphoresPoint])

  useEffect(() => {
    semaphoreVectorLayerRef.current?.setVisible(isLayerVisible)
  }, [isLayerVisible])

  useEffect(() => {
    const feature = convertToFeature(mapClickEvent?.feature)
    if (feature) {
      if (feature.getId()?.toString()?.includes(Layers.SEMAPHORES.code)) {
        const { id } = feature.getProperties()
        dispatch(setSelectedSemaphore(id))
        dispatch(removeOverlayStroke())
      }
    }
  }, [dispatch, mapClickEvent])

  return null
}
