import { layerListIconStyle } from '@features/layersSelector/overlays/style'
import { getClickedRecentActivityFeatures } from '@features/map/utils'
import { recentActivityActions } from '@features/RecentActivity/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Layers } from 'domain/entities/layers/constants'
import { getOverlayCoordinates } from 'domain/shared_slices/Global'
import { type OverlayItem } from 'domain/types/map'
import { Feature } from 'ol'
import { Point } from 'ol/geom'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useEffect, useRef } from 'react'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'
import type { RecentActivity } from '@features/RecentActivity/types'

const FEATURE_ID = 'RecentActivityAreaIconFeature'

export function RecentActivityLayerEvents({ map, mapClickEvent }: BaseMapChildrenProps) {
  const dispatch = useAppDispatch()

  const isControlsListClicked = useAppSelector(state => state.recentActivity.layersAndOverlays.isControlsListClicked)
  const vectorSource = useRef(new VectorSource({}))
  const vectorLayer = useRef(
    new VectorLayer({
      source: vectorSource.current,
      style: (_, resolution) => layerListIconStyle(resolution),
      zIndex: Layers.RECENT_ACTIVITY_AREA_ICON.zIndex
    })
  )
  const feature = vectorSource.current?.getFeatureById(`${Layers.RECENT_ACTIVITY_AREA_ICON}:${FEATURE_ID}`)
  const overlayCoordinates = useAppSelector(state => getOverlayCoordinates(state.global, String(feature?.getId())))

  useEffect(() => {
    if (!isControlsListClicked) {
      if (feature) {
        vectorSource.current?.removeFeature(feature)
      }

      return
    }

    const iconFeature = new Feature({
      geometry: new Point(mapClickEvent.coordinates ?? [0, 0])
    })
    iconFeature.setId(`${Layers.RECENT_ACTIVITY_AREA_ICON}:${FEATURE_ID}`)

    vectorSource.current?.addFeature(iconFeature)

    // we just want to listen isAreaSelected changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isControlsListClicked])

  useEffect(() => {
    feature?.setProperties({ overlayCoordinates })
  }, [feature, overlayCoordinates])

  useEffect(() => {
    if (map) {
      const layersCollection = map.getLayers()
      layersCollection.push(vectorLayer.current)
    }

    return () => {
      if (map) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        map.removeLayer(vectorLayer.current)
      }
    }
  }, [map, vectorLayer])

  useEffect(() => {
    const clickedFeatures = getClickedRecentActivityFeatures(mapClickEvent)
    const numberOfClickedFeatures = clickedFeatures?.length ?? 0

    if (numberOfClickedFeatures === 0) {
      return
    }

    if (numberOfClickedFeatures === 1) {
      dispatch(recentActivityActions.setSelectedControl(clickedFeatures?.[0]?.properties.id))

      return
    }

    if (numberOfClickedFeatures > 1 && mapClickEvent.coordinates) {
      const items = mapClickEvent?.featureList?.reduce((acc, recentActivityFeature) => {
        const type = String(recentActivityFeature.id).split(':')[0]

        if (type === Layers.RECENT_ACTIVITY_AREA_ICON.code) {
          const { properties } = recentActivityFeature

          acc.push({
            layerType: type,
            properties: properties as RecentActivity.RecentControlsActivity
          })
        }

        return acc
      }, [] as OverlayItem<string, RecentActivity.RecentControlsActivity>[])

      dispatch(recentActivityActions.setLayerOverlayItems(items))
      dispatch(recentActivityActions.setLayerOverlayCoordinates(mapClickEvent.coordinates))
      dispatch(recentActivityActions.setIsControlsListClicked(true))
    }

    // we don't want to listen editingVigilanceAreaId changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, mapClickEvent])

  return null
}
