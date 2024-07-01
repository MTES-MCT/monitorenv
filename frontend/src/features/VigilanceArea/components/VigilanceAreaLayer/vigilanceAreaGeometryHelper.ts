import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { Feature } from 'ol'
import { GeoJSON } from 'ol/format'

import type { VigilanceArea } from '@features/VigilanceArea/types'

export const getVigilanceAreaZoneFeature = (vigilanceArea: VigilanceArea.VigilanceArea, layername: string) => {
  const geoJSON = new GeoJSON()
  const geometry = geoJSON.readGeometry(vigilanceArea.geom, {
    dataProjection: WSG84_PROJECTION,
    featureProjection: OPENLAYERS_PROJECTION
  })

  const feature = new Feature({
    geometry
  })
  feature.setId(`${layername}:${vigilanceArea.id}`)
  feature.setProperties({
    comments: vigilanceArea.comments,
    createdBy: vigilanceArea.createdBy,
    endDatePeriod: vigilanceArea.endDatePeriod,
    endingCondition: vigilanceArea.endingCondition,
    endingOccurrenceDate: vigilanceArea.endingOccurrenceDate,
    endingOccurrencesNumber: vigilanceArea.endingOccurrencesNumber,
    frequency: vigilanceArea.frequency,
    geom: vigilanceArea.geom,
    id: vigilanceArea.id,
    isDraft: vigilanceArea.isDraft,
    links: vigilanceArea.links,
    name: vigilanceArea.name,
    source: vigilanceArea.source,
    startDatePeriod: vigilanceArea.startDatePeriod,
    themes: vigilanceArea.themes,
    visibility: vigilanceArea.visibility
  })

  return feature
}
