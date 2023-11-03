import { noop } from 'lodash/fp'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useEffect, useMemo, useRef } from 'react'

import { getBasePointFeature, getFeatureStyle } from './utils'
import { useGetBasesQuery } from '../../../../api/basesAPI'
import { Layers } from '../../../../domain/entities/layers/constants'
import { setOverlayCoordinates } from '../../../../domain/shared_slices/Global'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { FrontendError } from '../../../../libs/FrontendError'
import { controlUnitListDialogActions } from '../../../ControlUnit/components/ControlUnitListDialog/slice'
import { baseActions } from '../../slice'

import type { BaseMapChildrenProps } from '../../../map/BaseMap'

export function BaseLayer({ map, mapClickEvent }: BaseMapChildrenProps) {
  const vectorSourceRef = useRef(new VectorSource())
  const vectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      source: vectorSourceRef.current,
      style: getFeatureStyle,
      updateWhileAnimating: true,
      updateWhileInteracting: true,
      zIndex: Layers.BASES.zIndex
    })
  )
  ;(vectorLayerRef.current as any).name = Layers.BASES.code

  const dispatch = useAppDispatch()
  const global = useAppSelector(state => state.global)
  const base = useAppSelector(state => state.base)
  const listener = useAppSelector(state => state.draw.listener)

  const { data: bases } = useGetBasesQuery()

  const basesAsFeatures = useMemo(() => (bases || []).map(getBasePointFeature), [bases])

  // ---------------------------------------------------------------------------
  // Features Events

  useEffect(() => {
    const feature = mapClickEvent?.feature
    if (!feature) {
      return
    }

    const featureId = mapClickEvent?.feature?.getId()?.toString()
    if (!featureId?.startsWith(Layers.BASES.code)) {
      return
    }

    const featureProps = feature.getProperties()

    dispatch(baseActions.selectBaseFeatureId(featureId))
    dispatch(baseActions.hightlightFeatureIds([featureId]))
    dispatch(setOverlayCoordinates(undefined))
    dispatch(
      controlUnitListDialogActions.setFilter({
        key: 'baseId',
        value: featureProps.base.id
      })
    )
  }, [dispatch, mapClickEvent])

  // ---------------------------------------------------------------------------
  // Features Hightlight & Selection

  useEffect(() => {
    if (!vectorSourceRef.current) {
      return
    }

    vectorSourceRef.current.forEachFeature(feature => {
      const featureId = feature.getId()
      if (typeof featureId !== 'string') {
        throw new FrontendError('`featureId` is undefined.')
      }

      feature.setProperties({
        isHighlighted: base.highlightedFeatureIds.includes(featureId),
        isSelected: featureId === base.selectedBaseFeatureId,
        overlayCoordinates: featureId === base.selectedBaseFeatureId ? global.overlayCoordinates : undefined
      })
    })
  }, [base.highlightedFeatureIds, base.selectedBaseFeatureId, global.overlayCoordinates])

  // ---------------------------------------------------------------------------
  // Features Visibility

  useEffect(() => {
    vectorLayerRef.current?.setVisible(global.displayBaseLayer && !listener)
  }, [global.displayBaseLayer, listener])

  useEffect(() => {
    vectorSourceRef.current.clear(true)
    vectorSourceRef.current.addFeatures(basesAsFeatures)
  }, [basesAsFeatures])

  // ---------------------------------------------------------------------------
  // Layer Attachment

  useEffect(() => {
    if (!map) {
      return noop
    }

    map.getLayers().push(vectorLayerRef.current)

    const scopedVectorLayer = vectorLayerRef.current

    return () => map.removeLayer(scopedVectorLayer)
  }, [map])

  return null
}
