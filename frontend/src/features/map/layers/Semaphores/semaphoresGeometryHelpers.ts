import { Feature } from 'ol'
import { GeoJSON } from 'ol/format'

import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../../../domain/entities/map/constants'

import type { Semaphore } from '../../../../domain/entities/semaphore'

export const getSemaphoreZoneFeature = (semaphore: Semaphore, layername: string) => {
  const geoJSON = new GeoJSON()
  const geometry = geoJSON.readGeometry(semaphore.geom, {
    dataProjection: WSG84_PROJECTION,
    featureProjection: OPENLAYERS_PROJECTION
  })

  const feature = new Feature({
    geometry
  })
  feature.setId(`${layername}:${semaphore.id}`)
  feature.setProperties({
    base: semaphore.base,
    email: semaphore.email,
    id: semaphore.id,
    isSelected: false,
    nom: semaphore.nom,
    overlayPosition: undefined,
    telephone: semaphore.telephone,
    unite: semaphore.unite
  })

  return feature
}
