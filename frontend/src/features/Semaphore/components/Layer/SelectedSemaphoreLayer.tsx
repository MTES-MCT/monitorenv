import { useGetFilteredReportingsQuery } from '@features/Reportings/hooks/useGetFilteredReportingsQuery'
import { useGetCurrentUserAuthorizationQueryOverride } from '@hooks/useGetCurrentUserAuthorizationQueryOverride'
import { getOverlayCoordinates } from 'domain/shared_slices/Global'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useEffect, useMemo, useRef, type MutableRefObject } from 'react'

import { getSemaphoreZoneFeature } from './semaphoresGeometryHelpers'
import { getSelectedSemaphoreStyle } from './style'
import { getReportingsBySemaphoreId } from './utils'
import { useGetSemaphoresQuery } from '../../../../api/semaphoresAPI'
import { Layers } from '../../../../domain/entities/layers/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { useHasMapInteraction } from '../../../../hooks/useHasMapInteraction'

import type { BaseMapChildrenProps } from '../../../map/BaseMap'
import type { VectorLayerWithName } from 'domain/types/layer'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'

export function SelectedSemaphoreLayer({ map }: BaseMapChildrenProps) {
  const { displaySemaphoresLayer } = useAppSelector(state => state.global.layers)
  const isSemaphoreHighlighted = useAppSelector(state => state.semaphoresSlice.isSemaphoreHighlighted)
  const selectedSemaphoreId = useAppSelector(state => state.semaphoresSlice.selectedSemaphoreId)
  // we don't want to display sempahores on the map if the user so decides (displaySemaphoresLayer variable)
  // or if user have interaction on map (edit mission zone, attach reporting or mission)
  const hasMapInteraction = useHasMapInteraction()
  const isLayerVisible = useMemo(
    () => displaySemaphoresLayer && !hasMapInteraction && !!selectedSemaphoreId,
    [displaySemaphoresLayer, hasMapInteraction, selectedSemaphoreId]
  )

  const result = useGetCurrentUserAuthorizationQueryOverride()
  const isSuperUser = result?.isSuperUser ?? true

  const { data: semaphores } = useGetSemaphoresQuery()
  const { reportings } = useGetFilteredReportingsQuery()

  const semaphore = useMemo(() => {
    const semaphoresList = semaphores?.entities
    if (!selectedSemaphoreId || !semaphoresList) {
      return undefined
    }

    return semaphoresList[selectedSemaphoreId]
  }, [semaphores, selectedSemaphoreId])

  const reportingsBySemaphoreId = getReportingsBySemaphoreId(reportings)

  const selectedSemaphoreVectorSourceRef = useRef(new VectorSource()) as MutableRefObject<
    VectorSource<Feature<Geometry>>
  >
  const selectedSemaphoreVectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      source: selectedSemaphoreVectorSourceRef.current,
      style: feature => getSelectedSemaphoreStyle(feature, isSuperUser),
      zIndex: Layers.SEMAPHORES.zIndex
    })
  ) as MutableRefObject<VectorLayerWithName>
  selectedSemaphoreVectorLayerRef.current.name = Layers.SEMAPHORES.code

  const selectedSemaphore = `${Layers.SEMAPHORES.code}:${selectedSemaphoreId}`

  const feature = selectedSemaphoreVectorSourceRef.current.getFeatureById(selectedSemaphore)
  const overlayCoordinates = useAppSelector(state => getOverlayCoordinates(state.global, String(feature?.getId())))

  const semaphorePoint = useMemo(() => {
    if (!selectedSemaphoreId || !semaphore) {
      return undefined
    }
    const semaphoreFeature = getSemaphoreZoneFeature(semaphore, Layers.SEMAPHORES.code)

    semaphoreFeature.setProperties({
      isHighlighted: semaphoreFeature.getId() === selectedSemaphore && isSemaphoreHighlighted,
      isSelected: true,
      overlayCoordinates: semaphoreFeature.getId() === selectedSemaphore ? overlayCoordinates : undefined,
      reportingsAttachedToSemaphore: reportingsBySemaphoreId[selectedSemaphoreId]
    })

    return semaphoreFeature
  }, [
    selectedSemaphoreId,
    semaphore,
    selectedSemaphore,
    isSemaphoreHighlighted,
    overlayCoordinates,
    reportingsBySemaphoreId
  ])

  useEffect(() => {
    if (map) {
      map.getLayers().push(selectedSemaphoreVectorLayerRef.current)

      // eslint-disable-next-line react-hooks/exhaustive-deps
      return () => map.removeLayer(selectedSemaphoreVectorLayerRef.current)
    }

    return () => {}
  }, [map])

  useEffect(() => {
    selectedSemaphoreVectorSourceRef.current?.clear(true)
    if (semaphorePoint) {
      selectedSemaphoreVectorSourceRef.current?.addFeature(semaphorePoint)
    }
  }, [semaphorePoint])

  useEffect(() => {
    selectedSemaphoreVectorLayerRef.current?.setVisible(isLayerVisible)
  }, [isLayerVisible])

  return null
}
