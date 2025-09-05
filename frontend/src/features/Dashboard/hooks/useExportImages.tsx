import { useGetAMPsQuery } from '@api/ampsAPI'
import { useGetRegulatoryLayersQuery } from '@api/regulatoryLayersAPI'
import { useGetReportingsByIdsQuery } from '@api/reportingsAPI'
import { useGetVigilanceAreasByIdsQuery, useGetVigilanceAreasQuery } from '@api/vigilanceAreasAPI'
import { getDashboardById } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { extractFeatures } from '@features/Dashboard/utils'
import { CENTERED_ON_FRANCE } from '@features/map/BaseMap'
import { measurementStyle } from '@features/map/layers/styles/measurement.style'
import { recentControlActivityStyle } from '@features/RecentActivity/components/Layers/style'
import { RecentActivity } from '@features/RecentActivity/types'
import { getRecentActivityFeatures } from '@features/RecentActivity/utils'
import { getReportingZoneFeature } from '@features/Reportings/components/ReportingLayer/Reporting/reportingsGeometryHelpers'
import { useAppSelector } from '@hooks/useAppSelector'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { getFeature } from '@utils/getFeature'
import { BaseLayer } from 'domain/entities/layers/BaseLayer'
import { Feature, View } from 'ol'
import { buffer, createEmpty, extend, type Extent, getHeight, getWidth } from 'ol/extent'
import { type Geometry } from 'ol/geom'
import { fromExtent } from 'ol/geom/Polygon'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import OpenLayerMap from 'ol/Map'
import { transform } from 'ol/proj'
import { OSM, TileWMS, XYZ } from 'ol/source'
import VectorSource from 'ol/source/Vector'
import { Stroke, Style } from 'ol/style'
import { type MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { getDashboardStyle } from '../components/Layers/style'

const resolution = { height: '480px', width: '720px' }

const getBaseSource = (backgroundMap: BaseLayer | undefined) => {
  switch (backgroundMap) {
    case BaseLayer.OSM:
      return new OSM({
        attributions:
          '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
        crossOrigin: 'anonymous'
      })

    case BaseLayer.SATELLITE:
      return new XYZ({
        crossOrigin: 'anonymous',
        maxZoom: 19,
        url: `https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.jpg90?access_token=${
          import.meta.env.FRONTEND_MAPBOX_KEY
        }`
      })

    case BaseLayer.SHOM:
      return new TileWMS({
        crossOrigin: 'anonymous',
        params: { LAYERS: 'RASTER_MARINE_3857_WMSR', TILED: true },
        serverType: 'geoserver',
        // Countries have transparency, so do not fade tiles:
        transition: 0,
        url: `https://services.data.shom.fr/${import.meta.env.FRONTEND_SHOM_KEY}/wms/r`
      })
    case BaseLayer.LIGHT:
    default:
      return new XYZ({
        crossOrigin: 'anonymous',
        maxZoom: 19,
        urls: ['a', 'b', 'c', 'd'].map(
          subdomain => `https://${subdomain}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png`
        )
      })
  }
}

const initialMap = new OpenLayerMap({
  layers: [
    new TileLayer({
      source: new XYZ({
        crossOrigin: 'anonymous',
        maxZoom: 19,
        urls: ['a', 'b', 'c', 'd'].map(
          subdomain => `https://${subdomain}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png`
        )
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

export function useExportImages() {
  const [loading, setLoading] = useState(false)
  const mapRef = useRef(null) as MutableRefObject<OpenLayerMap | null>

  const activeDashboardId = useAppSelector(state => state.dashboard.activeDashboardId)

  const dashboard = useAppSelector(state => getDashboardById(state.dashboard, activeDashboardId))
  const { data: reportings } = useGetReportingsByIdsQuery(dashboard?.dashboard.reportingIds ?? [], {
    skip: !dashboard
  })

  const activeDashboard = dashboard?.dashboard
  const backgroundMap = dashboard?.backgroundMap

  const { data: regulatoryLayers } = useGetRegulatoryLayersQuery(undefined, { skip: !dashboard })
  const { data: ampLayers } = useGetAMPsQuery(undefined, { skip: !dashboard })
  const { data: allVigilanceAreas } = useGetVigilanceAreasQuery(undefined, { skip: !dashboard })
  const { data: vigilanceAreas } = useGetVigilanceAreasByIdsQuery(activeDashboard?.vigilanceAreaIds ?? [], {
    skip: !activeDashboard?.vigilanceAreaIds
  })
  const [allLinkedAMPIds, allLinkedRegulatoryAreaIds] = useMemo(
    () => [
      Array.from(new Set(vigilanceAreas?.flatMap(vigilanceArea => vigilanceArea.linkedAMPs ?? []))),
      Array.from(new Set(vigilanceAreas?.flatMap(vigilanceArea => vigilanceArea.linkedRegulatoryAreas ?? [])))
    ],
    [vigilanceAreas]
  )

  const layersVectorSourceRef = useRef(new VectorSource())
  const layersVectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      renderOrder: (a, b) => b.get('area') - a.get('area'),
      source: layersVectorSourceRef.current,
      style: feature =>
        getDashboardStyle(feature, { viewCenter: mapRef.current?.getView().getCenter(), withReportingOverlay: true })
    })
  )

  const zoomToFeatures = async (features: Feature[], padding?: [number, number, number, number]) =>
    new Promise<void>(resolve => {
      const inMemoryMap = mapRef.current
      const extent = combineExtent(features)
      if (!extent || !inMemoryMap) {
        return
      }

      const view = inMemoryMap.getView()

      view.fit(extent, {
        padding: padding ?? [30, 30, 30, 200]
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

  useEffect(() => {
    const switchBackground = () => {
      if (mapRef.current?.getAllLayers()[0]) {
        mapRef.current?.getAllLayers()[0]?.setSource(getBaseSource(backgroundMap))
      }
    }
    switchBackground()
  }, [backgroundMap])

  function compressCanvas(canvas: HTMLCanvasElement): Promise<string> {
    return new Promise(resolve => {
      canvas.toBlob(
        async blob => {
          const arrayBuffer = await blob?.arrayBuffer()
          if (!arrayBuffer) {
            return
          }
          const base64 = btoa(new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''))
          resolve(`data:image/jpeg;base64,${base64}`)
        },
        'image/jpeg',
        0.8
      )
    })
  }
  const exportImages = useCallback(
    async (
      features: Feature[],
      recentActivityFeatures: Feature[],
      controlUnitIds: number[],
      isLight: boolean,
      dashboardFeature?: Feature
    ) => {
      const allImages: ExportImageType[] = []
      const mapCanvas = mapRef.current?.getViewport().querySelector('canvas')

      const mapContext = mapCanvas?.getContext('2d')

      if (!mapRef.current || !mapCanvas || !mapContext || !dashboardFeature) {
        return allImages
      }

      const filteredFeatures = isLight
        ? features.filter(
            feature =>
              !feature.getId()?.toString()?.includes(Dashboard.featuresCode.DASHBOARD_REGULATORY_AREAS) &&
              !feature.getId()?.toString()?.includes(Dashboard.featuresCode.DASHBOARD_AMP)
          )
        : features

      // eslint-disable-next-line no-restricted-syntax
      for (const feature of filteredFeatures) {
        mapContext.clearRect(0, 0, mapCanvas.width, mapCanvas.height)
        layersVectorSourceRef.current.clear(true)
        layersVectorSourceRef.current.addFeature(feature)

        // eslint-disable-next-line no-await-in-loop
        await zoomToFeatures([feature])

        const canvases = mapRef.current.getViewport().querySelectorAll('canvas')
        // eslint-disable-next-line no-restricted-syntax
        for (const canvas of canvases) {
          mapContext.drawImage(canvas, 0, 0)
          // eslint-disable-next-line no-await-in-loop
          const image = await compressCanvas(mapCanvas)
          allImages.push({
            featureId: feature.getId(),
            image
          })
        }
      }

      const minimapFeatures = features.map(feature => {
        const minimapFeature = new Feature(feature.getGeometry())
        minimapFeature.setId(feature.getId())
        minimapFeature.setProperties({ ...feature.getProperties(), asMinimap: true })

        return minimapFeature
      })

      // eslint-disable-next-line no-restricted-syntax
      for (const minimapFeature of minimapFeatures) {
        mapContext.clearRect(0, 0, mapCanvas.width, mapCanvas.height)

        layersVectorSourceRef.current.clear()
        layersVectorSourceRef.current.addFeature(minimapFeature)
        layersVectorSourceRef.current.addFeature(dashboardFeature)
        const featureGeom = minimapFeature.getGeometry()?.getExtent()
        if (featureGeom) {
          const width = getWidth(featureGeom)
          const height = getHeight(featureGeom)
          const marginRatio = 0.1
          const margin = Math.max(width, height) * marginRatio
          const extendWithMargin = buffer(featureGeom, margin)
          const square = new Feature(fromExtent(extendWithMargin))
          square.setStyle(
            new Style({
              stroke: new Stroke({
                color: 'red',
                width: 4
              })
            })
          )
          layersVectorSourceRef.current.addFeature(square)
        }

        // eslint-disable-next-line no-await-in-loop
        await zoomToFeatures([dashboardFeature, minimapFeature])

        const canvases = mapRef.current.getViewport().querySelectorAll('canvas')
        // eslint-disable-next-line no-restricted-syntax
        for (const canvas of canvases) {
          mapContext.drawImage(canvas, 0, 0)
          // eslint-disable-next-line no-await-in-loop
          const image = await compressCanvas(mapCanvas)
          allImages.push({
            featureId: `MINIMAP:${minimapFeature.getId()}`,
            image
          })
        }
      }

      extractReportingFeatures(features)

      layersVectorSourceRef.current.clear(true)

      dashboardFeature.setStyle([measurementStyle()])
      layersVectorSourceRef.current.addFeatures([...features, dashboardFeature])
      await zoomToFeatures([dashboardFeature])
      mapRef.current
        ?.getTargetElement()
        .querySelectorAll('canvas')
        .forEach(canvas => {
          mapContext?.drawImage(canvas, 0, 0)
        })
      allImages.push({
        featureId: 'WHOLE_DASHBOARD',
        image: await compressCanvas(mapCanvas)
      })

      mapRef.current?.getAllLayers()[0]?.setSource(getBaseSource(BaseLayer.LIGHT))
      layersVectorSourceRef.current.clear()
      dashboardFeature.setStyle([measurementStyle()])
      layersVectorSourceRef.current.addFeatures([...recentActivityFeatures, dashboardFeature])
      await zoomToFeatures([dashboardFeature], [30, 200, 30, 30])
      mapRef.current
        ?.getTargetElement()
        .querySelectorAll('canvas')
        .forEach(canvas => {
          mapContext?.drawImage(canvas, 0, 0)
        })
      allImages.push({
        featureId: Dashboard.featuresCode.DASHBOARD_ALL_RECENT_ACTIVITY,
        image: await compressCanvas(mapCanvas)
      })

      // eslint-disable-next-line no-restricted-syntax
      for (const controlUnitId of controlUnitIds) {
        const recentActivityFeaturesByControlUnit = recentActivityFeatures.filter(feature =>
          feature.get('controlUnitIds').some(id => id === controlUnitId)
        )
        mapContext.clearRect(0, 0, mapCanvas.width, mapCanvas.height)
        layersVectorSourceRef.current.clear(true)
        dashboardFeature.setStyle([measurementStyle()])
        layersVectorSourceRef.current.addFeatures([...recentActivityFeaturesByControlUnit, dashboardFeature])

        // eslint-disable-next-line no-await-in-loop
        await zoomToFeatures([dashboardFeature], [30, 200, 30, 30])

        const canvases = mapRef.current.getViewport().querySelectorAll('canvas')
        // eslint-disable-next-line no-restricted-syntax
        for (const canvas of canvases) {
          mapContext.drawImage(canvas, 0, 0)
          // eslint-disable-next-line no-await-in-loop
          const image = await compressCanvas(mapCanvas)
          allImages.push({
            featureId: `${Dashboard.featuresCode.DASHBOARD_RECENT_ACTIVITY_BY_UNIT}:${controlUnitId}`,
            image
          })
        }
      }

      mapRef.current?.getAllLayers()[0]?.setSource(getBaseSource(backgroundMap))

      return allImages
    },
    [extractReportingFeatures, backgroundMap]
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

  const getImages = (
    recentActivity: RecentActivity.RecentControlsActivity[],
    controlUnitIds: number[],
    isLight: boolean
  ) => {
    if (!mapRef.current) {
      return undefined
    }

    const features = extractFeatures(
      activeDashboard,
      regulatoryLayers,
      ampLayers,
      allVigilanceAreas,
      allLinkedAMPIds,
      allLinkedRegulatoryAreaIds
    )
    const dashboardFeature = dashboard?.dashboard.geom ? getFeature(dashboard.dashboard.geom) : undefined
    if (dashboardFeature) {
      dashboardFeature.setStyle([measurementStyle({ filled: true })])
    }

    let recentActivityFeatures: Feature[]
    if (recentActivity) {
      recentActivityFeatures = getRecentActivityFeatures(
        recentActivity,
        Dashboard.featuresCode.DASHBOARD_ALL_RECENT_ACTIVITY
      )
      recentActivityFeatures.forEach(feature => {
        feature.setStyle(recentControlActivityStyle)
      })
    }

    const generateImages = async () => {
      setLoading(true)
      const allImages = await exportImages(features, recentActivityFeatures, controlUnitIds, isLight, dashboardFeature)
      setLoading(false)

      return allImages
    }

    return generateImages()
  }

  return { getImages, loading }
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
