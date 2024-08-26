import { describe, expect, it } from '@jest/globals'
import { Geometry } from 'ol/geom'

import { hasAlreadyFeature } from './utils'

import type { SerializedFeature } from 'domain/types/map'

describe('Layer utils', () => {
  it('hasAlreadyFeature should return true when currentFeature has already one of the layer', () => {
    const layerId = 'MissionLayer:33'
    const otherLayerId = 'OtherLayer:33'

    const currentFeature: SerializedFeature<any> = { geometry: new Geometry(), id: layerId, properties: {} }

    expect(hasAlreadyFeature(currentFeature, [layerId, otherLayerId])).toBeTruthy()
  })

  it('hasAlreadyFeature should return false when currentFeature has not a layer', () => {
    const layerId = 'MissionLayer:33'
    const otherLayerId = 'OtherLayer:33'
    const otherLayerId2 = 'OtherLayer2:33'
    const currentFeature: SerializedFeature<any> = { geometry: new Geometry(), id: layerId, properties: {} }

    expect(hasAlreadyFeature(currentFeature, [otherLayerId, otherLayerId2])).toBeFalsy()
  })
})
