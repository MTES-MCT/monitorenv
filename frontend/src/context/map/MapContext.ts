import OpenLayerMap from 'ol/Map'
import { createContext, useContext } from 'react'

import type { MapClickEvent, SerializedFeature } from 'domain/types/map'

export type MapContextValue = {
  currentFeatureListOver: SerializedFeature<Record<string, any>>[]
  currentFeatureOver?: SerializedFeature<Record<string, any>>
  map: OpenLayerMap
  mapClickEvent: MapClickEvent
  pixel?: number[]
}

export const MapContext = createContext<MapContextValue | undefined>(undefined)

export function useMapContext() {
  const ctx = useContext(MapContext)
  if (!ctx) {
    throw new Error('useMapContext must be used inside a MapContext.Provider')
  }

  return ctx
}
