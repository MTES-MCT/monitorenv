import type { IsolatedLayerType } from 'domain/shared_slices/Map'
import type { SerializedFeature } from 'domain/types/map'

export const hasAlreadyFeature = (
  currentFeatureOver: SerializedFeature<Record<string, any>> | undefined,
  layersId: string[]
) => layersId.some(layerId => typeof currentFeatureOver?.id === 'string' && currentFeatureOver.id.includes(layerId))

export const getIsolatedLayerIsRegulatoryArea = (isolatedLayer: IsolatedLayerType | undefined): boolean =>
  isolatedLayer?.type.includes('REGULATORY') ?? false

export const getIsolatedLayerIsAmp = (isolatedLayer: IsolatedLayerType | undefined): boolean =>
  isolatedLayer?.type.includes('AMP') ?? false

export const getIsolatedLayerIsVigilanceArea = (isolatedLayer: IsolatedLayerType | undefined): boolean =>
  isolatedLayer?.type.includes('VIGILANCE_AREA') ?? false
