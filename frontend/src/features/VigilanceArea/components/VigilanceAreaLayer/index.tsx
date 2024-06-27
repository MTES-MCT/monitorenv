import { useGetVigilanceAreasQuery } from '@api/vigilanceAreasAPI'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Layers } from 'domain/entities/layers/constants'
import { convertToFeature } from 'domain/types/map'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useEffect, useMemo, useRef } from 'react'

import { getVigilanceAreaLayerStyle } from './style'
import { getVigilanceAreaZoneFeature } from './vigilanceAreaGeomatryHelper'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'
import type { VectorLayerWithName } from 'domain/types/layer'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'

export function VigilanceAreasLayer({ map, mapClickEvent }: BaseMapChildrenProps) {
  const dispatch = useAppDispatch()
  const isLayerVisible = true
  const vectorSourceRef = useRef(new VectorSource()) as React.MutableRefObject<VectorSource<Feature<Geometry>>>

  const { data: vigilanceAreas } = useGetVigilanceAreasQuery()

  const vigilanceAreasFeatures = useMemo(() => {
    if (!vigilanceAreas || vigilanceAreas?.length === 0) {
      return []
    }

    return vigilanceAreas
      .filter(vigilanceArea => vigilanceArea?.geom && vigilanceArea?.geom?.coordinates.length > 0)
      .map(vigilanceArea => getVigilanceAreaZoneFeature(vigilanceArea, Layers.VIGILANCE_AREA.code))
  }, [vigilanceAreas])

  const vectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      source: vectorSourceRef.current,
      style: getVigilanceAreaLayerStyle,
      updateWhileAnimating: true,
      updateWhileInteracting: true,
      zIndex: Layers.VIGILANCE_AREA.zIndex
    })
  ) as React.MutableRefObject<VectorLayerWithName>

  ;(vectorLayerRef.current as VectorLayerWithName).name = Layers.VIGILANCE_AREA.code

  useEffect(() => {
    map.getLayers().push(vectorLayerRef.current)

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      map.removeLayer(vectorLayerRef.current)
    }
  }, [map])

  useEffect(() => {
    vectorSourceRef.current?.clear(true)
    if (vigilanceAreasFeatures) {
      vectorSourceRef.current?.addFeatures(vigilanceAreasFeatures)
    }
  }, [vigilanceAreasFeatures])

  useEffect(() => {
    vectorLayerRef.current?.setVisible(isLayerVisible)
  }, [isLayerVisible])

  useEffect(() => {
    const feature = convertToFeature(mapClickEvent?.feature)
    if (feature && feature.getId()?.toString()?.includes(Layers.VIGILANCE_AREA.code)) {
      //  const { id } = feature.getProperties()
      // TODO  27/07/2024 open vigilanceAreaMetadataModal
    }
  }, [dispatch, mapClickEvent])

  return null
}
