import { THEME } from '@mtes-mct/monitor-ui'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Icon, Style } from 'ol/style'
import { useEffect, useMemo, useRef } from 'react'

import { getBasePointFeature } from './utils'
import { useGetBasesQuery } from '../../../../api/basesAPI'
import { Layers } from '../../../../domain/entities/layers/constants'
import { setOverlayCoordinates } from '../../../../domain/shared_slices/Global'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { baseActions } from '../../slice'

import type { BaseMapChildrenProps } from '../../../map/BaseMap'

export function BaseLayer({ map, mapClickEvent }: BaseMapChildrenProps) {
  const vectorSourceRef = useRef(new VectorSource())
  const vectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      source: vectorSourceRef.current,
      style: FeatureStyle,
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

  useEffect(() => {
    if (!vectorSourceRef.current) {
      return
    }

    vectorSourceRef.current.forEachFeature(feature => {
      feature.setProperties({
        isSelected: feature.getId() === base.selectedBaseFeatureId,
        overlayCoordinates: feature.getId() === base.selectedBaseFeatureId ? global.overlayCoordinates : undefined
      })
    })
  }, [base.selectedBaseFeatureId, global.overlayCoordinates])

  useEffect(() => {
    if (map) {
      map.getLayers().push(vectorLayerRef.current)

      const scopedVectorLayer = vectorLayerRef.current

      return () => map.removeLayer(scopedVectorLayer)
    }

    return () => {}
  }, [map])

  useEffect(() => {
    vectorLayerRef.current?.setVisible(global.displayBaseLayer && !listener)
  }, [global.displayBaseLayer, listener])

  useEffect(() => {
    const feature = mapClickEvent?.feature
    if (!feature) {
      return
    }

    const featureId = feature.getId()?.toString()
    if (!featureId?.includes(Layers.BASES.code)) {
      return
    }

    if (feature.getId()?.toString()?.startsWith(Layers.BASES.code)) {
      dispatch(baseActions.selectBaseFeatureId(featureId))
      dispatch(setOverlayCoordinates(undefined))
    }
  }, [dispatch, mapClickEvent])

  useEffect(() => {
    vectorSourceRef.current.clear(true)
    vectorSourceRef.current.addFeatures(basesAsFeatures)
  }, [basesAsFeatures])

  return null
}

export const FeatureStyle = new Style({
  image: new Icon({
    color: THEME.color.charcoal,
    src: 'control-unit.svg'
  })
})
