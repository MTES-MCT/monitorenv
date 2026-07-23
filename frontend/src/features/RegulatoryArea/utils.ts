export function formatLayerName(layerName?: string, place?: string) {
  if (!!place?.trim() && !layerName?.includes(place ?? '')) {
    return `${layerName} - ${place}`
  }

  return layerName
}
