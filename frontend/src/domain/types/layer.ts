import type VectorLayer from 'ol/layer/Vector'
import type VectorSource from 'ol/source/Vector'

export type LayerToFeatures = {
  area: number
  center: number[]
  features: Object[]
  name: string
  simplifiedFeatures: Object[]
}

export type VectorLayerWithName = VectorLayer<VectorSource> & {
  name?: string
}
