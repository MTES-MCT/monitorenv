import type { SerializedFeature } from 'domain/types/map'

export const hasAlreadyFeature = (
  currentFeatureOver: SerializedFeature<Record<string, any>> | undefined,
  layersId: string[]
) => layersId.some(layerId => typeof currentFeatureOver?.id === 'string' && currentFeatureOver.id.includes(layerId))
