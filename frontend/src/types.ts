import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'
import type BaseLayer from 'ol/layer/Base'
import type VectorImageLayer from 'ol/layer/VectorImage'
import type VectorSource from 'ol/source/Vector'

export type MapClickEvent = {
  ctrlKeyPressed: boolean
  feature?: Feature
}

export type MonitorEnvBaseLayer = BaseLayer & {
  layerId?: number
  type?: string
}

interface VectorSourceType extends VectorSource<Feature<Geometry>> {}

export type MonitorEnvVectorImageLayer = VectorImageLayer<VectorSourceType> & {
  layerId: number
  name?: string
}

export type MonitorEnum = {
  [key: string]: {
    code: string
    libelle: string
  }
}

export type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>
