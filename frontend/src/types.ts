import type { Feature } from 'ol'
import type { GeoJSONGeometry } from 'ol/format/GeoJSON'
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

export type Native = boolean | null | number | string | undefined
export type NativeAny = boolean | NativeArray | NativeObject | null | number | string | undefined
export type NativeArray = Array<NativeAny>
export type NativeObject = { [x: string]: NativeAny } | {}

interface VectorSourceType extends VectorSource<Geometry> {}

export type MonitorEnvVectorImageLayer = VectorImageLayer<VectorSourceType> & {
  layerId: number
  name?: string
}

export type RegulatoryAreaProperties = {
  entity_name: string
  facade: string
  layer_name: string
  ref_reg: string
  thematique: string
  thematiques?: string[]
  type: string
}

export type RegulatoryLayerType = {
  bbox: number[]
  geometry: GeoJSONGeometry
  geometry_name: 'geom'
  id: number
  properties: RegulatoryAreaProperties
  type: 'Feature'
}

export type MonitorEnum = {
  [key: string]: {
    code: string
    libelle: string
  }
}

export type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>

/**
 * Mark all the prop types of an interface/type as `prop: <MyType> | undefined` while preserving array props.
 *
 * @description
 * When `exactOptionalPropertyTypes` is enabled in tsconfig.json,
 * this is useful to create objects allowing undefined prop values while keeping all their props required.
 *
 * Opposite of `Defined`.
 *
 * @example
 * ```
 * type MyType {
 *   aRequiredProp: string
 *   anOptionalProp?: string
 *   anArrayProp: number[]
 * }
 *
 * // `type MyPartialType = UndefineExceptArrays<MyType>` is the same as typing:
 * type MyPartialType {
 *   aRequiredProp: string | undefined
 *   anOptionalProp?: string | undefined
 *   anArrayProp: number[]
 * }
 * ```
 */
export type UndefineExceptArrays<T> = {
  [K in keyof T]: T[K] extends (infer U)[] ? U[] : T[K] | undefined
}
