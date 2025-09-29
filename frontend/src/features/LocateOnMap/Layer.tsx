import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { THEME } from '@mtes-mct/monitor-ui'
import { useMapContext } from 'context/map/MapContext'
import { Layers } from 'domain/entities/layers/constants'
import { Feature } from 'ol'
import { type Geometry } from 'ol/geom'
import { fromExtent } from 'ol/geom/Polygon'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Fill, Stroke, Style } from 'ol/style'
import { memo, useEffect, useRef, type MutableRefObject } from 'react'

import type { VectorLayerWithName } from 'domain/types/layer'

export const LocateOnMapLayer = memo(() => {
  const { map } = useMapContext()
  const dispatch = useAppDispatch()
  const locateOnMap = useAppSelector(state => state.map.locateOnMap)
  const locateOnMapVectorSourceRef = useRef(new VectorSource()) as MutableRefObject<VectorSource<Feature<Geometry>>>
  const locateOnMapVectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      source: locateOnMapVectorSourceRef.current,
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new Stroke({
          color: THEME.color.maximumRed,
          width: 2.25
        })
      }),
      zIndex: Layers.LOCATE_ON_MAP.zIndex
    })
  ) as MutableRefObject<VectorLayerWithName>
  locateOnMapVectorLayerRef.current.name = Layers.LOCATE_ON_MAP.code

  useEffect(() => {
    if (map) {
      map.getLayers().push(locateOnMapVectorLayerRef.current)

      // eslint-disable-next-line react-hooks/exhaustive-deps
      return () => map.removeLayer(locateOnMapVectorLayerRef.current)
    }

    return () => {}
  }, [map])

  useEffect(() => {
    locateOnMapVectorSourceRef.current?.clear(true)
    if (locateOnMap) {
      const geom = fromExtent(locateOnMap.extent)
      const feature = new Feature({ geometry: geom })
      locateOnMapVectorSourceRef.current?.addFeatures([feature])
    }
  }, [locateOnMap])

  useEffect(() => {
    locateOnMapVectorLayerRef.current?.setVisible(!!locateOnMap)
  }, [dispatch, locateOnMap])

  return null
})
