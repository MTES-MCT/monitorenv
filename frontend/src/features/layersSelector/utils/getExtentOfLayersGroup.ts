import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { createEmpty, extend, type Extent } from 'ol/extent'
import { Projection, transformExtent } from 'ol/proj'

import type { RegulatoryArea } from '@features/RegulatoryArea/types'
import type { AMP } from 'domain/entities/AMPs'

export const getExtentOfLayersGroup = (layers: RegulatoryArea.RegulatoryAreaWithBbox[] | AMP[]): Extent => {
  const extentOfLayersGroup = layers.reduce((accumulatedExtent, currentLayer) => {
    const extendedExtent = [...accumulatedExtent]
    extend(extendedExtent, currentLayer.bbox)

    return extendedExtent
  }, createEmpty())
  const extent = transformExtent(
    extentOfLayersGroup,
    new Projection({ code: WSG84_PROJECTION }),
    new Projection({ code: OPENLAYERS_PROJECTION })
  )

  return extent
}
