import { useCallback, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import { Icon, Style } from 'ol/style'
import { getCenter } from 'ol/extent'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'


import { useGetMissionsQuery } from '../api/missionsAPI'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../domain/entities/map'
import { COLORS } from '../constants/constants'
import { selectMissionOnMap } from '../domain/use_cases/selectMissionOnMap'
import Layers from '../domain/entities/layers'

const style = new Style({
  image: new Icon({
    src: 'marker-flag.svg',
    color: COLORS.missingGreen,
    offset: [0, 0],
    imgSize: [30, 79]
  })
})

const getMissionCentroid = (mission) => {
  const geoJSON = new GeoJSON()
  const {geom} = mission
  const geometry = geoJSON.readGeometry(geom, {
    dataProjection: WSG84_PROJECTION,
    featureProjection: OPENLAYERS_PROJECTION
  })
  const center = getCenter(geometry?.getExtent())
  const pointFeature =  new Feature({
    geometry: new Point(center)
  })
  pointFeature.setId(`mission:${mission.id}`)
  pointFeature.setProperties({missionId: mission.id})
  return  pointFeature
}

export const MissionsLayer = ({ map, mapClickEvent }) => {
  const dispatch = useDispatch()
  const { data } = useGetMissionsQuery()
  const getMissionsCentroids = useCallback(()=>{
    return data?.filter(f=>!!f.geom).map(d => getMissionCentroid(d))
  }, [data])
  
  const vectorSourceRef = useRef(null)
  const GetVectorSource = () => {
    if (vectorSourceRef.current === null) {
      vectorSourceRef.current = new VectorSource()
       
    }
    return vectorSourceRef.current
  }

  const vectorLayerRef = useRef(null)
  

  useEffect(() => {
    const GetVectorLayer = () => {
      if (vectorLayerRef.current === null) {
        vectorLayerRef.current = new VectorLayer({
          source: GetVectorSource(),
          style: style,
          renderBuffer: 7,
          updateWhileAnimating: true,
          updateWhileInteracting: true,
          zIndex: Layers.MISSIONS.zIndex,
        })
        vectorLayerRef.current.name = Layers.MISSIONS.code
      }
      return vectorLayerRef.current
    }

    map && map.getLayers().push(GetVectorLayer())

    return () => map && map.removeLayer(GetVectorLayer())
  }, [map])

  useEffect(() => {
    GetVectorSource()?.clear(true)
    if (getMissionsCentroids()) {
      GetVectorSource()?.addFeatures(getMissionsCentroids())
    }
  }, [getMissionsCentroids])

  useEffect(()=>{
    if (mapClickEvent?.feature) {
      const feature = mapClickEvent?.feature
      if(feature.getId()?.toString()?.includes('mission')) {
        const missionId = feature.getProperties().missionId
        dispatch(selectMissionOnMap(missionId))
      }
    }
  }, [mapClickEvent])

  return null
}
