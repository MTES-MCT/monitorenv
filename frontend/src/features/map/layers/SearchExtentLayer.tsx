import { useAppSelector } from '@hooks/useAppSelector'
import { useMapContext } from 'context/map/MapContext'
import { Feature } from 'ol'
import { fromExtent } from 'ol/geom/Polygon'
import { Vector } from 'ol/layer'
import VectorSource from 'ol/source/Vector'
import { type MutableRefObject, memo, useEffect, useRef } from 'react'

import { dottedLayerStyle } from './styles/dottedLayer.style'

import type { Geometry } from 'ol/geom'

export const metadataIsShowedPropertyName = 'metadataIsShowed'

export const SearchExtentLayer = memo(() => {
  const { map } = useMapContext()

  const searchExtent = useAppSelector(state => state.layerSearch.searchExtent)

  const isLayerVisible = !!searchExtent

  const searchExtentVectorSourceRef = useRef(new VectorSource()) as MutableRefObject<VectorSource<Feature<Geometry>>>
  const searchExtentLayerRef = useRef(
    new Vector({
      source: searchExtentVectorSourceRef.current,
      style: dottedLayerStyle
    })
  ) as MutableRefObject<Vector<VectorSource>>

  useEffect(() => {
    if (map) {
      searchExtentVectorSourceRef.current.clear(true)
      if (searchExtent) {
        const feature = new Feature(fromExtent(searchExtent))
        searchExtentVectorSourceRef.current.addFeature(feature)
      }
    }
  }, [map, searchExtent])

  useEffect(() => {
    if (map) {
      searchExtentLayerRef.current?.setVisible(isLayerVisible)
    }
  }, [map, isLayerVisible])

  useEffect(() => {
    if (map) {
      map.getLayers().push(searchExtentLayerRef.current)

      return () => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        map.removeLayer(searchExtentLayerRef.current)
      }
    }

    return () => {}
  }, [map])

  return null
})
