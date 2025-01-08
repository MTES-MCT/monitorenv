import { useGetAMPsQuery } from '@api/ampsAPI'
import { useGetRegulatoryLayersQuery } from '@api/regulatoryLayersAPI'
import { useGetReportingsByIdsQuery } from '@api/reportingsAPI'
import { useGetVigilanceAreasQuery } from '@api/vigilanceAreasAPI'
import { getDashboardById } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { CENTERED_ON_FRANCE } from '@features/map/BaseMap'
import { getAMPFeature } from '@features/map/layers/AMP/AMPGeometryHelpers'
import { getRegulatoryFeature } from '@features/map/layers/Regulatory/regulatoryGeometryHelpers'
import { measurementStyle, measurementStyleWithCenter } from '@features/map/layers/styles/measurement.style'
import { getReportingZoneFeature } from '@features/Reportings/components/ReportingLayer/Reporting/reportingsGeometryHelpers'
import { getVigilanceAreaZoneFeature } from '@features/VigilanceArea/components/VigilanceAreaLayer/vigilanceAreaGeometryHelper'
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
import { useEffect, useRef, type MutableRefObject } from 'react'

import { getDashboardStyle } from './style'

import type { VectorLayerWithName } from 'domain/types/layer'
import type { ImageLike } from 'ol/DataTile'
import type { Geometry } from 'ol/geom'

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
  onImagesReady: (images: ExportImageType[]) => void
  shouldLoadImages: boolean
}
// const waitForTilesAfterZoom = async (map: Map) =>
//   new Promise<void>(resolve => {
//     const source = map
//       .getAllLayers()
//       .map(layer => layer.getSource && layer.getSource()) // Vérifie si getSource existe
//       .find(s => s instanceof XYZ)

//     if (!source) {
//       resolve()

//       return
//     }

//     let loadingCount = 0

//     const handleTileLoadStart = () => {
//       console.log('loading tile')

//       loadingCount += 1
//     }

//     const handleTileLoadEnd = () => {
//       loadingCount = Math.max(loadingCount - 1, 0) // Éviter des compteurs négatifs
//       if (loadingCount === 0) {
//         cleanup()
//         resolve()
//       }
//     }

//     const cleanup = () => {
//       source.un('tileloadstart', handleTileLoadStart)
//       source.un('tileloadend', handleTileLoadEnd)
//       source.un('tileloaderror', handleTileLoadEnd)
//     }

//     const onMoveEnd = () => {
//       source.on('tileloadstart', handleTileLoadStart)
//       source.on('tileloadend', handleTileLoadEnd)
//       source.on('tileloaderror', handleTileLoadEnd)

//       if (loadingCount === 0) {
//         handleTileLoadEnd()
//       }
//     }

//     // const view = map.getView()
//     // view.on('change:resolution', onMoveEnd)
//     map.on('moveend', onMoveEnd)

//     if (!map.getView().getAnimating() && !map.getView().getInteracting()) {
//       onMoveEnd()
//     }
//   })

export function ExportLayer({ onImagesReady, shouldLoadImages }: ExportLayerProps) {
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
      zIndex: Layers.DASHBOARD.zIndex
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
        callback: () => {
          setTimeout(() => {
            resolve()
          }, 300)
        },
        padding: [10, 10, 10, 150]
      })
    })

  useEffect(() => {
    const hiddenDiv = document.createElement('div')
    hiddenDiv.style.width = '800px'
    hiddenDiv.style.height = '600px'
    hiddenDiv.style.position = 'absolute'
    hiddenDiv.style.visibility = 'hidden'
    document.body.appendChild(hiddenDiv)

    const memoryMap = initialMap

    memoryMap.setTarget(hiddenDiv)
    mapRef.current = memoryMap

    return () => {
      document.body.removeChild(hiddenDiv)
    }
  }, [])

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
    function extractRegulatoryAreaFeatures(allFeatures: Feature<Geometry>[]) {
      if (regulatoryLayers?.entities) {
        const regulatoryLayersIds = activeDashboard?.regulatoryAreaIds
        regulatoryLayersIds?.forEach(layerId => {
          const layer = regulatoryLayers.entities[layerId]

          if (layer && layer?.geom && layer?.geom?.coordinates.length > 0) {
            const feature = getRegulatoryFeature({
              code: Dashboard.featuresCode.DASHBOARD_REGULATORY_AREAS,
              isolatedLayer: undefined,
              layer
            })
            if (feature) {
              allFeatures.push(feature)
            }
          }
        })
      }
    }

    function extractAMPFeatures(allFeatures: Feature<Geometry>[]) {
      if (ampLayers?.entities) {
        const ampLayerIds = activeDashboard?.ampIds

        ampLayerIds?.forEach(layerId => {
          const layer = ampLayers.entities[layerId]

          if (layer?.geom && layer?.geom?.coordinates.length > 0) {
            const feature = getAMPFeature({
              code: Dashboard.featuresCode.DASHBOARD_AMP,
              isolatedLayer: undefined,
              layer
            })

            if (feature) {
              allFeatures.push(feature)
            }
          }
        })
      }
    }

    function extractReportingFeatures(allFeatures: Feature<Geometry>[]) {
      if (reportings) {
        Object.values(reportings?.entities ?? []).forEach(reporting => {
          if (reporting.geom) {
            const feature = getReportingZoneFeature(reporting, Dashboard.featuresCode.DASHBOARD_REPORTINGS)
            allFeatures.push(feature)
          }
        })
      }
    }

    function extractVigilanceAreaFeatures(allFeatures: Feature<Geometry>[]) {
      if (vigilanceAreas?.entities) {
        const vigilanceAreaLayersIds = activeDashboard?.vigilanceAreaIds
        vigilanceAreaLayersIds?.forEach(layerId => {
          const layer = vigilanceAreas.entities[layerId]
          if (layer && layer?.geom && layer?.geom?.coordinates.length > 0) {
            const feature = getVigilanceAreaZoneFeature(
              layer,
              Dashboard.featuresCode.DASHBOARD_VIGILANCE_AREAS,
              undefined
            )
            if (feature) {
              allFeatures.push(feature)
            }
          }
        })
      }
    }

    if (mapRef.current && shouldLoadImages) {
      // Exporter le canvas en image
      const allImages: ExportImageType[] = []
      const allFeatures: Feature[] = []
      const mapCanvas = mapRef.current.getViewport().querySelector('canvas')!
      const mapContext = mapCanvas.getContext('2d')
      mapContext?.save()
      let dashboardAreaFeature: Feature | undefined

      layersVectorSourceRef.current.clear(true)

      if (activeDashboard) {
        extractRegulatoryAreaFeatures(allFeatures)

        extractAMPFeatures(allFeatures)

        extractVigilanceAreaFeatures(allFeatures)

        extractReportingFeatures(allFeatures)
      }

      // TODO: Wait for designer review (shall we had the dashboard geometry to exported images?)
      if (dashboard?.dashboard.geom) {
        dashboardAreaFeature = getFeature(dashboard.dashboard.geom)
        if (!dashboardAreaFeature) {
          return
        }
        dashboardAreaFeature?.setStyle([measurementStyle, measurementStyleWithCenter])
      }

      const generateImages = async () => {
        if (!mapRef.current || allFeatures.length === 0) {
          onImagesReady([])
        }

        layersVectorSourceRef.current.clear(true)

        if (dashboardAreaFeature) {
          // TODO: Wait for designer review (shall we had the dashboard geometry to exported images?)
          layersVectorSourceRef.current.addFeature(dashboardAreaFeature)

          layersVectorSourceRef.current.addFeatures(allFeatures)

          await zoomToFeatures([dashboardAreaFeature])

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
        }

        // eslint-disable-next-line no-restricted-syntax
        for (const feature of allFeatures) {
          mapContext?.restore()
          layersVectorSourceRef.current.clear(true)
          layersVectorSourceRef.current.addFeature(feature)

          // TODO: Wait for designer review (shall we had the dashboard geometry to exported images?)
          // layersVectorSourceRef.current.addFeature(dashboardAreaFeature)
          // eslint-disable-next-line no-await-in-loop
          await zoomToFeatures([feature])
          // eslint-disable-next-line no-await-in-loop
          // await waitForTilesAfterZoom(mapRef.current!)

          mapRef.current
            ?.getTargetElement()
            .querySelectorAll('canvas')
            .forEach(canvas => {
              mapContext?.drawImage(canvas, 0, 0)
              allImages.push({
                featureId: feature.getId(),
                image: mapCanvas.toDataURL('image/png')
              })
            })
        }

        onImagesReady(allImages)
      }

      generateImages()
    }
  }, [
    activeDashboard,
    ampLayers?.entities,
    dashboard?.dashboard.geom,
    onImagesReady,
    regulatoryLayers?.entities,
    reportings,
    shouldLoadImages,
    vigilanceAreas?.entities
  ])

  return null
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
