import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import GeoJSON from 'ol/format/GeoJSON'
import { Vector } from 'ol/layer'
import VectorSource from 'ol/source/Vector'
import Layers from '../domain/entities/layers'
import { OPENLAYERS_PROJECTION } from '../domain/entities/map'
import zoomInLayer from '../domain/use_cases/zoomInLayer'
import { regulatoryPreviewStyle } from './styles/regulatoryPreview.style'

const RegulatoryPreviewLayer = ({ map }) => {
  const dispatch = useDispatch()
  const { regulatoryGeometriesToPreview } = useSelector(state => state.regulatory)
  const vectorSourceRef = useRef(null)
  function getVectorSource () {
    if (!vectorSourceRef.current) {
      vectorSourceRef.current = new VectorSource({
        features: []
      })
    }
    return vectorSourceRef.current
  }
  const layerRef = useRef(null)
  function getLayer () {
    if (!layerRef.current) {
      layerRef.current = new Vector({
        renderBuffer: 4,
        source: getVectorSource(),
        updateWhileAnimating: true,
        updateWhileInteracting: true,
        style: regulatoryPreviewStyle
      })
    }
    return layerRef.current
  }

  useEffect(() => {
    if (map) {
      getVectorSource().clear()

      if (regulatoryGeometriesToPreview) {
        const features = regulatoryGeometriesToPreview.map(regulatorylayer => new GeoJSON({
          featureProjection: OPENLAYERS_PROJECTION
        }).readFeature(regulatorylayer))
        getVectorSource().addFeatures(features)
        dispatch(zoomInLayer({ feature: features[0] }))
      }
    }
  }, [map, regulatoryGeometriesToPreview])

  useEffect(() => {
    if (map) {
      getLayer().name = Layers.REGULATORY_PREVIEW.code
      map.getLayers().push(getLayer())
    }

    return () => {
      if (map) {
        map.removeLayer(getLayer())
      }
    }
  }, [map])

  return null
}

export default RegulatoryPreviewLayer
