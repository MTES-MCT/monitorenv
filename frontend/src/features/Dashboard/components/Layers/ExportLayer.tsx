import { dashboardActions } from '@features/Dashboard/slice'
import { CENTERED_ON_FRANCE, type BaseMapChildrenProps } from '@features/map/BaseMap'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { Layers } from 'domain/entities/layers/constants'
import { Feature, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import OpenLayerMap from 'ol/Map'
import { transform } from 'ol/proj'
import { XYZ } from 'ol/source'
import VectorSource from 'ol/source/Vector'
import { useEffect, useRef, type MutableRefObject } from 'react'

import { wait } from '../../../../../puppeteer/e2e/utils'

import type { VectorLayerWithName } from 'domain/types/layer'

const initialMap = new OpenLayerMap({
  layers: [
    new TileLayer({
      className: Layers.BASE_LAYER.code,
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

export function ExportLayer({ map }: BaseMapChildrenProps) {
  const mapRef = useRef(null) as MutableRefObject<OpenLayerMap | null>

  const dispatch = useAppDispatch()

  const activeDashboardId = useAppSelector(state => state.dashboard.activeDashboardId)

  const isGeneratingBrief = useAppSelector(state =>
    activeDashboardId ? state.dashboard.dashboards?.[activeDashboardId]?.isGeneratingBrief : false
  )

  const zoomToFeature = (feature: Feature) => {
    const inMemoryMap = mapRef.current
    const geometry = feature.getGeometry()

    if (!geometry || !inMemoryMap) {
      return
    }

    const extent = geometry.getExtent()
    const view = inMemoryMap.getView()

    // Zoom et centrage avec animation
    view.fit(extent)
  }

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

  useEffect(() => {
    if (mapRef.current && isGeneratingBrief === 'loading') {
      // console.log('and again')

      mapRef.current.renderSync()

      const dashboardFeatures = map
        .getLayers()
        .getArray()
        .find((layer): layer is VectorLayerWithName => 'name' in layer && layer.name === Layers.DASHBOARD.code)
        ?.getSource()
        ?.getFeatures()

      mapRef.current.renderSync()

      // dashboardFeatures?.forEach(feat => console.log(feat.getProperties()))

      const layerVector = new VectorLayer({
        source: new VectorSource({
          features: dashboardFeatures
        })
      }) as VectorLayerWithName

      mapRef.current.renderSync()

      layerVector.name = 'EXPORT_PDF'

      mapRef.current.getLayers().push(layerVector)

      mapRef.current.renderSync()

      // Exporter le canvas en image
      const allImages: string[] = []
      const mapCanvas = mapRef.current.getViewport().querySelector('canvas')!
      const mapContext = mapCanvas.getContext('2d')

      mapRef.current.renderSync()

      const feature = mapRef.current
        .getLayers()
        .getArray()
        .find((layer): layer is VectorLayerWithName => 'name' in layer && layer.name === 'EXPORT_PDF')
        ?.getSource()
        ?.getFeatureById('testgeo')!
      // mapRef.current.getView().fit(feature?.getGeometry()?.getExtent()!)
      zoomToFeature(feature) // Attendre la fin du zoom

      mapRef.current
        .getViewport()
        .querySelectorAll('canvas')
        .forEach(canvas => {
          allImages.push(canvas.toDataURL('image/png'))
          // mapContext?.drawImage(canvas, 0, 0)
        })

      // dispatch(dashboardActions.setBriefImages([mapCanvas.toDataURL('image/png')]))
      dispatch(dashboardActions.setBriefImages(allImages))
      dispatch(dashboardActions.setIsGeneratingBrief('imagesToUpdate'))
    }
  }, [dispatch, isGeneratingBrief, map])

  // useEffect(() => {
  //   if (isGeneratingBrief === 'loading') {
  //     const activeDashboardSource = map
  //       .getLayers()
  //       .getArray()
  //       .find((layer): layer is VectorLayerWithName => 'name' in layer && layer.name === Layers.DASHBOARD.code)
  //       ?.getSource()
  //     const memoryMap = new OpenLayerMap({
  //       layers: [
  //         new TileLayer({
  //           source: new XYZ({
  //             crossOrigin: 'anonymous',
  //             maxZoom: 19,
  //             urls: ['a', 'b', 'c', 'd'].map(
  //               subdomain => `https://${subdomain}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png`
  //             )
  //           }),
  //           zIndex: 0
  //         }),
  //         new VectorLayer({
  //           source: new VectorSource({
  //             features: activeDashboardSource?.getFeatures()
  //           })
  //         })
  //       ],
  //       target: undefined
  //     })

  //     memoryMap.renderSync()

  //     // Zoom sur la région spécifique
  //     // map.getView().fit(targetExtent, { size: [800, 600] }) // Taille arbitraire du canvas

  //     // Forcer le rendu et récupérer le canvas
  //     const canvas = memoryMap.getViewport().querySelector('canvas')
  //     if (canvas) {
  //       dispatch(dashboardActions.setBriefImages([canvas.toDataURL('image/png')]))
  //       dispatch(dashboardActions.setIsGeneratingBrief('ready'))
  //     }

  //     // Déclencher le rendu forcé

  //     // return () => {
  //     //   // inmemoryMap.setTarget(undefined) // Nettoyer la carte
  //     // }
  //   }

  //   // return undefined
  // }, [dispatch, isGeneratingBrief, map])

  // useEffect(() => {
  //   if (isGeneratingBrief === 'loading') {
  //     const width = Math.round((297 * 72) / 25.4)
  //     const height = Math.round((210 * 72) / 25.4)
  //     const mapCanvas = document.createElement('canvas')
  //     mapCanvas.width = width
  //     mapCanvas.height = height
  //     const mapContext = mapCanvas.getContext('2d')
  //     const allCanvas = map.getViewport().querySelectorAll('canvas')
  //     const activeDashboardSource = map
  //       .getLayers()
  //       .getArray()
  //       .find((layer): layer is VectorLayerWithName => 'name' in layer && layer.name === Layers.DASHBOARD.code)
  //       ?.getSource()

  //     if (activeDashboardSource) {
  //       activeDashboardSource.forEachFeature(feature => {
  //         const extent = feature.getGeometry()?.getExtent()
  //         const center = extent && getCenter(extent)
  //         const centerLatLon = center && transform(center, OPENLAYERS_PROJECTION, WSG84_PROJECTION)

  //         if (centerLatLon) {
  //           dispatch(setFitToExtent(extent))
  //         }
  //       })

  //       // if (allCanvas) {
  //       //   allCanvas.forEach(canvas => {
  //       //     mapContext?.drawImage(canvas, 0, 0)
  //       //   })
  //       dispatch(dashboardActions.setBriefImages([mapCanvas.toDataURL('image/png')]))
  //       dispatch(dashboardActions.setIsGeneratingBrief('ready'))
  //       // }
  //     }
  //   }
  // }, [map, isGeneratingBrief, dispatch])

  return null
}
