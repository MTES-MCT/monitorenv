import type { IsolatedLayerType } from 'domain/shared_slices/Map'
import type { SerializedFeature } from 'domain/types/map'

export const hasAlreadyFeature = (
  currentFeatureOver: SerializedFeature<Record<string, any>> | undefined,
  layersId: string[]
) => layersId.some(layerId => typeof currentFeatureOver?.id === 'string' && currentFeatureOver.id.includes(layerId))

export const getIsolatedLayerIsRegulatoryArea = (isolatedLayer: IsolatedLayerType | undefined) =>
  (isolatedLayer?.type.search('REGULATORY') ?? -1) > -1

export const getRegulatoryExcludedLayers = (excludedLayers: Omit<IsolatedLayerType, 'isFilled'>[] | undefined) =>
  excludedLayers?.filter(layer => layer.type.search('REGULATORY') > -1).map(layer => layer.id) ?? []

export const getIsolatedLayerIsAmp = (isolatedLayer: IsolatedLayerType | undefined) =>
  (isolatedLayer?.type.search('AMP') ?? -1) > -1

export const getAmpExcludedLayers = (excludedLayers: Omit<IsolatedLayerType, 'isFilled'>[] | undefined) =>
  excludedLayers?.filter(layer => (layer.type.search('AMP') ?? -1) > -1).map(layer => layer.id) ?? []

export const getIsolatedLayerIsVigilanceArea = (isolatedLayer: IsolatedLayerType | undefined) =>
  (isolatedLayer?.type.search('VIGILANCE_AREA') ?? -1) > -1

export const getVigilanceAreaExcludedLayers = (excludedLayers: Omit<IsolatedLayerType, 'isFilled'>[] | undefined) =>
  excludedLayers?.filter(layer => (layer.type.search('VIGILANCE_AREA') ?? -1) > -1).map(layer => layer.id)
