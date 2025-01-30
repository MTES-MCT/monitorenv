import { useGetAMPsQuery } from '@api/ampsAPI'
import { useGetRegulatoryLayersQuery } from '@api/regulatoryLayersAPI'
import { useGetReportingsByIdsQuery } from '@api/reportingsAPI'
import { useGetVigilanceAreasQuery } from '@api/vigilanceAreasAPI'
import { getDashboardById } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { extractFeatures } from '@features/Dashboard/utils'
import { CENTERED_ON_FRANCE } from '@features/map/BaseMap'
import { measurementStyle, measurementStyleWithCenter } from '@features/map/layers/styles/measurement.style'
import { getReportingZoneFeature } from '@features/Reportings/components/ReportingLayer/Reporting/reportingsGeometryHelpers'
import { useAppSelector } from '@hooks/useAppSelector'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { getFeature } from '@utils/getFeature'
import { Layers } from 'domain/entities/layers/constants'
import { Feature, View } from 'ol'
import { createEmpty, extend, type Extent } from 'ol/extent'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import OpenLayerMap from 'ol/Map'
import { transform } from 'ol/proj'
import { ImageTile } from 'ol/source'
import VectorSource from 'ol/source/Vector'
import { createXYZ } from 'ol/tilegrid'
import { useCallback, useEffect, useRef, useState, type MutableRefObject } from 'react'

import { getDashboardStyle } from '../components/Layers/style'

import type { VectorLayerWithName } from 'domain/types/layer'
import type { ImageLike } from 'ol/DataTile'
import type { Geometry } from 'ol/geom'

const resolution = { height: '780px', width: '1280px' }

function loadImage(src: string) {
  return new Promise<ImageLike>((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.addEventListener('load', () => resolve(img))
    img.addEventListener('error', () => reject(new Error('load failed')))
    img.src = src
  })
}

const initialMap = new OpenLayerMap({
  layers: [
    new TileLayer({
      source: new ImageTile({
        async loader(z, x, y) {
          const subdomains = ['a', 'b', 'c', 'd']
          const subdomain = subdomains[Math.abs(x + y) % subdomains.length]
          const url = `https://${subdomain}.basemaps.cartocdn.com/light_all/${z}/${x}/${y}.png`
          const image = await loadImage(url)

          return image
        },
        tileGrid: createXYZ({
          maxZoom: 19,
          minZoom: 3,
          tileSize: 256
        })
      })
    })
  ],

  view: new View({
    center: transform(CENTERED_ON_FRANCE, WSG84_PROJECTION, OPENLAYERS_PROJECTION),
    minZoom: 3,
    projection: OPENLAYERS_PROJECTION,
    zoom: 6
  })
})

export type ExportImageType = {
  featureId: string | number | undefined
  image: string
}

type ExportLayerProps = {
  triggerExport: boolean
}

export function useExportImages({ triggerExport }: ExportLayerProps) {
  const [images, setImages] = useState<ExportImageType[]>()
  const [loading, setLoading] = useState(false)
  const mapRef = useRef(null) as MutableRefObject<OpenLayerMap | null>

  const activeDashboardId = useAppSelector(state => state.dashboard.activeDashboardId)

  const dashboard = useAppSelector(state => getDashboardById(state.dashboard, activeDashboardId))
  const { data: reportings } = useGetReportingsByIdsQuery(dashboard?.dashboard.reportingIds ?? [], {
    skip: !dashboard
  })
  const { data: regulatoryLayers } = useGetRegulatoryLayersQuery(undefined, { skip: !dashboard })
  const { data: ampLayers } = useGetAMPsQuery(undefined, { skip: !dashboard })
  const { data: vigilanceAreas } = useGetVigilanceAreasQuery(undefined, { skip: !dashboard })

  const activeDashboard = dashboard?.dashboard

  const layersVectorSourceRef = useRef(new VectorSource()) as React.MutableRefObject<VectorSource<Feature<Geometry>>>
  const layersVectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      renderOrder: (a, b) => b.get('area') - a.get('area'),
      source: layersVectorSourceRef.current,
      style: feature => getDashboardStyle(feature),
      zIndex: Layers.EXPORT_PDF.zIndex
    })
  ) as React.MutableRefObject<VectorLayerWithName>
  layersVectorLayerRef.current.name = Layers.EXPORT_PDF.code

  const zoomToFeatures = async (features: Feature[]) =>
    new Promise<void>(resolve => {
      const inMemoryMap = mapRef.current
      const extent = combineExtent(features)
      if (!extent || !inMemoryMap) {
        return
      }

      const view = inMemoryMap.getView()

      view.fit(extent, {
        padding: [30, 30, 30, 200]
      })
      inMemoryMap.once('rendercomplete', () => {
        resolve()
      })
    })

  const extractReportingFeatures = useCallback(
    (allFeatures: Feature<Geometry>[]) => {
      if (reportings) {
        Object.values(reportings?.entities ?? []).forEach(reporting => {
          if (reporting.geom) {
            const feature = getReportingZoneFeature(reporting, Dashboard.featuresCode.DASHBOARD_REPORTINGS)
            allFeatures.push(feature)
          }
        })
      }
    },
    [reportings]
  )

  useEffect(() => {
    const hiddenDiv = document.createElement('div')
    hiddenDiv.style.width = resolution.width
    hiddenDiv.style.height = resolution.height
    hiddenDiv.style.position = 'absolute'
    hiddenDiv.style.visibility = 'hidden'
    document.body.appendChild(hiddenDiv)

    const memoryMap = initialMap

    memoryMap.setTarget(hiddenDiv)
    mapRef.current = memoryMap

    return () => {
      document.body.removeChild(hiddenDiv)
      hiddenDiv.remove()
    }
  }, [])

  const exportImages = useCallback(
    async (features: Feature[], dashboardFeature?: Feature) => {
      const allImages: ExportImageType[] = []
      const mapCanvas = mapRef.current?.getViewport().querySelector('canvas')
      const mapContext = mapCanvas?.getContext('2d')

      if (!mapRef.current || !mapCanvas || !mapContext || !dashboardFeature) {
        return allImages
      }

      // eslint-disable-next-line no-restricted-syntax
      for (const feature of features) {
        mapContext.clearRect(0, 0, mapCanvas.width, mapCanvas.height)
        layersVectorSourceRef.current.clear()
        layersVectorSourceRef.current.addFeature(feature)

        dashboardFeature.setStyle([measurementStyle, measurementStyleWithCenter])
        layersVectorSourceRef.current.addFeature(dashboardFeature)

        // eslint-disable-next-line no-await-in-loop
        await zoomToFeatures([dashboardFeature, feature])

        mapRef.current
          .getViewport()
          .querySelectorAll('canvas')
          .forEach(canvas => {
            mapContext.drawImage(canvas, 0, 0)
            allImages.push({
              featureId: feature.getId(),
              image: mapCanvas.toDataURL('image/png')
            })
          })
      }
      extractReportingFeatures(features)

      layersVectorSourceRef.current.clear(true)

      layersVectorSourceRef.current.addFeatures([...features, dashboardFeature])

      await zoomToFeatures([...features, dashboardFeature])

      mapRef.current
        ?.getTargetElement()
        .querySelectorAll('canvas')
        .forEach(canvas => {
          mapContext?.drawImage(canvas, 0, 0)
        })
      allImages.push({
        featureId: 'WHOLE_DASHBOARD',
        image: mapCanvas.toDataURL('image/png')
      })

      return allImages
    },
    [extractReportingFeatures]
  )

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.getLayers().push(layersVectorLayerRef.current)
    }

    return () => {
      if (mapRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        mapRef.current.removeLayer(layersVectorLayerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current || !triggerExport) {
      setImages(undefined)

      return
    }

    const features = extractFeatures(activeDashboard, regulatoryLayers, ampLayers, vigilanceAreas)
    const dashboardFeature = dashboard?.dashboard.geom ? getFeature(dashboard.dashboard.geom) : undefined

    const generateImages = async () => {
      setLoading(true)
      const allImages = await exportImages(features, dashboardFeature)
      setImages(allImages)
      setLoading(false)
    }

    generateImages()
  }, [
    activeDashboard,
    ampLayers,
    regulatoryLayers,
    reportings,
    vigilanceAreas,
    triggerExport,
    dashboard?.dashboard.geom,
    exportImages
  ])

  return { images, loading }
}

function combineExtent(features: Feature[]): Extent {
  const combinedExtent = createEmpty()

  // Étendre l'étendue pour inclure chaque feature
  features.forEach(feature => {
    const geometry = feature.getGeometry()
    if (geometry) {
      extend(combinedExtent, geometry.getExtent())
    }
  })

  return combinedExtent
}
