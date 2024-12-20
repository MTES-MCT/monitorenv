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
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { getFeature } from '@utils/getFeature'
import { Layers } from 'domain/entities/layers/constants'
import { Feature, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import OpenLayerMap from 'ol/Map'
import { transform } from 'ol/proj'
import { XYZ } from 'ol/source'
import VectorSource from 'ol/source/Vector'
import { useCallback, useEffect, useRef, type MutableRefObject } from 'react'

import { getDashboardStyle } from './style'

import type { VectorLayerWithName } from 'domain/types/layer'
import type { Geometry } from 'ol/geom'

const initialMap = new OpenLayerMap({
  layers: [
    new TileLayer({
      source: new XYZ({
        crossOrigin: 'anonymous',
        maxZoom: 19,
        urls: ['a', 'b', 'c', 'd'].map(
          subdomain => `https://${subdomain}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png`
        )
      }),
      zIndex: 0
    })
  ],

  view: new View({
    center: transform(CENTERED_ON_FRANCE, WSG84_PROJECTION, OPENLAYERS_PROJECTION),
    minZoom: 3,
    projection: OPENLAYERS_PROJECTION,
    zoom: 6
  })
})

type ExportLayerProps = {
  onImagesReady: (images: string[]) => void
  shouldLoadImage: boolean
}
export function ExportLayer2({ onImagesReady, shouldLoadImage }: ExportLayerProps) {
  const mapRef = useRef(null) as MutableRefObject<OpenLayerMap | null>

  const dispatch = useAppDispatch()

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
  layersVectorLayerRef.current.name = 'EXPORT_PDF'

  const zoomToFeature = async (feature: Feature) =>
    new Promise<void>(resolve => {
      const inMemoryMap = mapRef.current
      const geometry = feature.getGeometry()

      if (!geometry || !inMemoryMap) {
        return
      }

      const extent = geometry.getExtent()
      const view = inMemoryMap.getView()

      const onMoveEnd = () => {
        inMemoryMap.un('moveend', onMoveEnd) // Supprimer l'écouteur une fois appelé
        resolve() // Terminer la promesse
      }

      inMemoryMap.on('moveend', onMoveEnd)

      // Zoom et centrage avec animation
      view.fit(extent)
    })

  useEffect(() => {
    const hiddenDiv = document.createElement('div')
    hiddenDiv.style.width = '800px'
    hiddenDiv.style.height = '600px'
    hiddenDiv.style.position = 'absolute' // Hors du flux DOM visible
    hiddenDiv.style.visibility = 'hidden' // Invisible mais dans le DOM
    document.body.appendChild(hiddenDiv) // Nécessaire pour permettre le rendu

    const memoryMap = initialMap

    memoryMap.setTarget(hiddenDiv)
    mapRef.current = memoryMap

    return () => {
      document.body.removeChild(hiddenDiv)
    }
  }, [])

  // const getFeatures = useCallback(() => {
  //   if (mapRef.current) {
  //     layersVectorSourceRef.current.clear(true)

  //     if (activeDashboard) {
  //       // Regulatory Areas
  //       if (regulatoryLayers?.entities) {
  //         const regulatoryLayersIds = activeDashboard.regulatoryAreaIds
  //         // we don't want to display the area twice
  //         const features = regulatoryLayersIds.reduce((feats: Feature[], layerId) => {
  //           const layer = regulatoryLayers.entities[layerId]

  //           if (layer && layer?.geom && layer?.geom?.coordinates.length > 0) {
  //             const feature = getRegulatoryFeature({
  //               code: Dashboard.featuresCode.DASHBOARD_REGULATORY_AREAS,
  //               isolatedLayer: undefined,
  //               layer
  //             })
  //             if (!feature) {
  //               return feats
  //             }
  //             feats.push(feature)
  //           }

  //           return feats
  //         }, [])

  //         layersVectorSourceRef.current.addFeatures(features)
  //       }

  //       // AMP
  //       if (ampLayers?.entities) {
  //         const ampLayerIds = activeDashboard.ampIds

  //         const features = ampLayerIds?.reduce((feats: Feature[], layerId) => {
  //           const layer = ampLayers.entities[layerId]

  //           if (layer && layer?.geom && layer?.geom?.coordinates.length > 0) {
  //             const feature = getAMPFeature({
  //               code: Dashboard.featuresCode.DASHBOARD_AMP,
  //               isolatedLayer: undefined,
  //               layer
  //             })

  //             if (!feature) {
  //               return feats
  //             }

  //             feats.push(feature)
  //           }

  //           return feats
  //         }, [])

  //         layersVectorSourceRef.current.addFeatures(features)
  //       }

  //       // Vigilance Areas
  //       if (vigilanceAreas?.entities) {
  //         const vigilanceAreaLayersIds = activeDashboard.vigilanceAreaIds
  //         const features = vigilanceAreaLayersIds.reduce((feats: Feature[], layerId) => {
  //           const layer = vigilanceAreas.entities[layerId]
  //           if (layer && layer?.geom && layer?.geom?.coordinates.length > 0) {
  //             const feature = getVigilanceAreaZoneFeature(
  //               layer,
  //               Dashboard.featuresCode.DASHBOARD_VIGILANCE_AREAS,
  //               undefined
  //             )
  //             feats.push(feature)
  //           }

  //           return feats
  //         }, [])

  //         layersVectorSourceRef.current.addFeatures(features)
  //       }

  //       // Reportings
  //       if (reportings) {
  //         const features = Object.values(reportings?.entities ?? []).reduce((feats: Feature[], reporting) => {
  //           if (reporting.geom) {
  //             const feature = getReportingZoneFeature(reporting, Dashboard.featuresCode.DASHBOARD_REPORTINGS)
  //             feats.push(feature)
  //           }

  //           return feats
  //         }, [])

  //         layersVectorSourceRef.current.addFeatures(features)
  //       }
  //     }

  //     if (dashboard?.dashboard.geom) {
  //       const dashboardAreaFeature = getFeature(dashboard.dashboard.geom)
  //       if (!dashboardAreaFeature) {
  //         return
  //       }
  //       dashboardAreaFeature.setId('testgeo')
  //       dashboardAreaFeature?.setStyle([measurementStyle, measurementStyleWithCenter])

  //       layersVectorSourceRef.current.addFeature(dashboardAreaFeature)
  //     }
  //   }
  // }, [
  //   activeDashboard,
  //   ampLayers?.entities,
  //   dashboard?.dashboard.geom,
  //   regulatoryLayers?.entities,
  //   reportings,
  //   vigilanceAreas?.entities
  // ])

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
    if (mapRef.current?.isRendered && shouldLoadImage) {
      // Exporter le canvas en image
      const allImages: string[] = []
      const mapCanvas = mapRef.current.getViewport().querySelector('canvas')!
      const mapContext = mapCanvas.getContext('2d')

      layersVectorSourceRef.current.clear(true)

      if (activeDashboard) {
        // Regulatory Areas
        if (regulatoryLayers?.entities) {
          const regulatoryLayersIds = activeDashboard.regulatoryAreaIds
          // we don't want to display the area twice
          regulatoryLayersIds.forEach(layerId => {
            const layer = regulatoryLayers.entities[layerId]

            if (layer && layer?.geom && layer?.geom?.coordinates.length > 0) {
              const feature = getRegulatoryFeature({
                code: Dashboard.featuresCode.DASHBOARD_REGULATORY_AREAS,
                isolatedLayer: undefined,
                layer
              })
              layersVectorSourceRef.current.clear(true)
              if (feature) {
                layersVectorSourceRef.current.addFeature(feature)
                zoomToFeature(feature)
                setTimeout(() => {
                  mapRef.current
                    ?.getViewport()
                    .querySelectorAll('canvas')
                    .forEach(canvas => {
                      // allImages.push(canvas.toDataURL('image/png'))
                      mapContext?.drawImage(canvas, 0, 0)
                      allImages.push(mapCanvas.toDataURL('image/png'))
                      mapContext?.reset()
                    })

                  onImagesReady(allImages)
                }, 2000)
              }
            }
          })
        }

        // AMP
        if (ampLayers?.entities) {
          const ampLayerIds = activeDashboard.ampIds

          const features = ampLayerIds?.reduce((feats: Feature[], layerId) => {
            const layer = ampLayers.entities[layerId]

            if (layer && layer?.geom && layer?.geom?.coordinates.length > 0) {
              const feature = getAMPFeature({
                code: Dashboard.featuresCode.DASHBOARD_AMP,
                isolatedLayer: undefined,
                layer
              })

              if (!feature) {
                return feats
              }

              feats.push(feature)
            }

            return feats
          }, [])

          layersVectorSourceRef.current.addFeatures(features)
        }

        // Vigilance Areas
        if (vigilanceAreas?.entities) {
          const vigilanceAreaLayersIds = activeDashboard.vigilanceAreaIds
          const features = vigilanceAreaLayersIds.reduce((feats: Feature[], layerId) => {
            const layer = vigilanceAreas.entities[layerId]
            if (layer && layer?.geom && layer?.geom?.coordinates.length > 0) {
              const feature = getVigilanceAreaZoneFeature(
                layer,
                Dashboard.featuresCode.DASHBOARD_VIGILANCE_AREAS,
                undefined
              )
              feats.push(feature)
            }

            return feats
          }, [])

          layersVectorSourceRef.current.addFeatures(features)
        }

        // Reportings
        if (reportings) {
          const features = Object.values(reportings?.entities ?? []).reduce((feats: Feature[], reporting) => {
            if (reporting.geom) {
              const feature = getReportingZoneFeature(reporting, Dashboard.featuresCode.DASHBOARD_REPORTINGS)
              feats.push(feature)
            }

            return feats
          }, [])

          layersVectorSourceRef.current.addFeatures(features)
        }
      }

      if (dashboard?.dashboard.geom) {
        const dashboardAreaFeature = getFeature(dashboard.dashboard.geom)
        if (!dashboardAreaFeature) {
          return
        }
        dashboardAreaFeature.setId('testgeo')
        dashboardAreaFeature?.setStyle([measurementStyle, measurementStyleWithCenter])

        layersVectorSourceRef.current.addFeature(dashboardAreaFeature)
      }

      // to do faire la boucle ici

      // const feature = mapRef.current
      //   .getLayers()
      //   .getArray()
      //   .find((layer): layer is VectorLayerWithName => 'name' in layer && layer.name === 'EXPORT_PDF')
      //   ?.getSource()
      //   ?.getFeatureById('testgeo')!

      // zoomToFeature(feature)

      // TODO: refacto to wait for the zoom to end
      // setTimeout(() => {
      //   mapRef.current
      //     ?.getViewport()
      //     .querySelectorAll('canvas')
      //     .forEach(canvas => {
      //       // allImages.push(canvas.toDataURL('image/png'))
      //       mapContext?.drawImage(canvas, 0, 0)
      //       allImages.push(mapCanvas.toDataURL('image/png'))
      //       mapContext?.reset()
      //     })

      //   onImagesReady(allImages)
      // }, 200)
    }
  }, [
    activeDashboard,
    ampLayers?.entities,
    dashboard?.dashboard.geom,
    dispatch,
    onImagesReady,
    regulatoryLayers?.entities,
    reportings,
    shouldLoadImage,
    vigilanceAreas?.entities
  ])

  return null
}
