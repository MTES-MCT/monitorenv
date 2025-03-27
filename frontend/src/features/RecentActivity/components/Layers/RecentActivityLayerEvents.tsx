import { layerListIconStyle } from '@features/layersSelector/overlays/style'
import { getClickedFeatures } from '@features/map/utils'
import { selectFeaturesList } from '@features/RecentActivity/useCases/selectFeaturesList'
import { updateSelectedControlId } from '@features/RecentActivity/useCases/updateSelectedControlId'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Layers } from 'domain/entities/layers/constants'
import { getOverlayCoordinates } from 'domain/shared_slices/Global'
import { type OverlayItem } from 'domain/types/map'
import { closeAreaOverlay } from 'domain/use_cases/map/closeAreaOverlay'
import { Feature } from 'ol'
import { Point } from 'ol/geom'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useEffect, useRef } from 'react'

import { FEATURE_ID } from '../Overlays'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'
import type { RecentActivity } from '@features/RecentActivity/types'

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
    const clickedFeatures = getClickedFeatures({
      isRegulatoryOrAmp: false,
      mapClickEvent,
      typesList: [Layers.RECENT_CONTROLS_ACTIVITY.code]
    })
    const numberOfClickedFeatures = clickedFeatures?.length ?? 0

    if (numberOfClickedFeatures === 0) {
      return
    }

    if (numberOfClickedFeatures === 1) {
      dispatch(updateSelectedControlId(clickedFeatures?.[0]?.properties.id))

      return
    }

    if (numberOfClickedFeatures > 1 && mapClickEvent.coordinates) {
      // close AMP and regulatory areas list
      dispatch(closeAreaOverlay())

      const items = mapClickEvent?.featureList?.reduce((acc, recentActivityFeature) => {
        const type = String(recentActivityFeature.id).split(':')[0]

        if (type === Layers.RECENT_CONTROLS_ACTIVITY.code) {
          const { properties } = recentActivityFeature

          acc.push({
            layerType: type,
            properties: properties as RecentActivity.RecentControlsActivity
          })
        }

        return acc
      }, [] as OverlayItem<string, RecentActivity.RecentControlsActivity>[])
      dispatch(selectFeaturesList({ coordinates: mapClickEvent.coordinates, items }))
    }

    // we don't want to listen editingVigilanceAreaId changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, mapClickEvent])

  return null
}
