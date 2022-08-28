import { useMemo, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'


import { useGetMissionsQuery } from '../../../api/missionsAPI'

import { selectMissionOnMap } from '../../../domain/use_cases/missions/selectMissionOnMap'
import Layers from '../../../domain/entities/layers'
import { getMissionZoneFeature } from './missionGeometryHelpers'
import { missionWithCentroidStyleFn } from './styles/missions.style'


export const MissionsLayer = ({ map, mapClickEvent }) => {
  const dispatch = useDispatch()
  const { displayMissionsLayer } = useSelector(state => state.global)
  const { data } = useGetMissionsQuery()

  const missionsMultiPolygons = useMemo(()=>{
    return data?.filter(f=>!!f.geom).map(f => getMissionZoneFeature(f, Layers.MISSIONS.code))
  }, [data])
  
  const vectorSourceRef = useRef(null)
  const GetVectorSource = () => {
    if (vectorSourceRef.current === null) {
      vectorSourceRef.current = new VectorSource()
       
    }
    return vectorSourceRef.current
  }

  const vectorLayerRef = useRef(null)
  const GetVectorLayer = () => {
    if (vectorLayerRef.current === null) {
      vectorLayerRef.current = new VectorLayer({
        source: GetVectorSource(),
        style: missionWithCentroidStyleFn,
        renderBuffer: 7,
        updateWhileAnimating: true,
        updateWhileInteracting: true,
        zIndex: Layers.MISSIONS.zIndex,
      })
      vectorLayerRef.current.name = Layers.MISSIONS.code
    }
    return vectorLayerRef.current
  }

  useEffect(() => {
    map && map.getLayers().push(GetVectorLayer())

    return () => map && map.removeLayer(GetVectorLayer())
  }, [map])

  useEffect(() => {
    GetVectorSource()?.clear(true)
    if (missionsMultiPolygons) {
      GetVectorSource()?.addFeatures(missionsMultiPolygons)
    }
  }, [missionsMultiPolygons])

  useEffect(() => {
    GetVectorLayer()?.setVisible(displayMissionsLayer)
  }, [displayMissionsLayer])


  useEffect(()=>{
    if (mapClickEvent?.feature) {
      const feature = mapClickEvent?.feature
      if(feature.getId()?.toString()?.includes(Layers.MISSIONS.code)) {
        const missionId = feature.getProperties().missionId
        dispatch(selectMissionOnMap(missionId))
      }
    }
  }, [dispatch, mapClickEvent])

  return null
}
