export function formatLayerName(layerName?: string, place?: string) {
  return [layerName, place].filter(Boolean).join(' - ')
}
