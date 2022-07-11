import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../domain/entities/map'

import { GEOSERVER_REMOTE_URL, GEOSERVER_NAMESPACE } from '../env'

const OK = 200


export function throwIrretrievableAdministrativeZoneError (e, type) {
  throw Error(`Nous n'avons pas pu récupérer la zone ${type} : ${e}`)
}

/**
 * Get the administrative zone Geoserver URL
 * @memberOf API
 * @param {string} type
 * @param {string[]|null} extent
 * @param {string|null} subZone
 * @param {string} geoserverURL
 * @returns {string} - the zone URL WFS request
 */
 function getAdministrativeZoneURL (type, extent, subZone, geoserverURL) {
  if (subZone) {
    const filter = `${subZone.replace(/'/g, '\'\'')}`

    const subZoneFilter = '&featureID=' + filter
      .replace(/'/g, '%27')
      .replace(/ /g, '%20')
      return (
        `${geoserverURL}/geoserver/wfs?service=WFS&` +
        `version=1.1.0&request=GetFeature&typename=${GEOSERVER_NAMESPACE}:${type}&` +
        `outputFormat=application/json&srsname=${WSG84_PROJECTION}` + 
        subZoneFilter
      )
  }

  if (extent) {
    const extentFilter = `&bbox=${extent.join(',')},${OPENLAYERS_PROJECTION}`
    return (
      `${geoserverURL}/geoserver/wfs?service=WFS&` +
      `version=1.1.0&request=GetFeature&typename=${GEOSERVER_NAMESPACE}:${type}&` +
      `outputFormat=application/json&srsname=${WSG84_PROJECTION}` + 
      extentFilter
    )
  }
  return `${geoserverURL}/geoserver/wfs?service=WFS&` +
    `version=1.1.0&request=GetFeature&typename=${GEOSERVER_NAMESPACE}:${type}&` +
    `outputFormat=application/json&srsname=${WSG84_PROJECTION}`
  
}
/**
 * Get the administrative zone GeoJSON feature
 * @memberOf API
 * @param {string} administrativeZone
 * @param {string[]|null} extent
 * @param {string|null} subZone
 * @returns {Promise<GeoJSON>} The feature GeoJSON
 * @throws {Error}
 */
 export function getAdministrativeZoneFromAPI (administrativeZone, extent, subZone) {
  const geoserverURL = GEOSERVER_REMOTE_URL

  return fetch(getAdministrativeZoneURL(administrativeZone, extent, subZone, geoserverURL))
    .then(response => {
      if (response.status === OK) {
        return response.json().then(response => {
          return response
        }).catch(e => {
          throwIrretrievableAdministrativeZoneError(e, administrativeZone)
        })
      } else {
        response.text().then(response => {
          throwIrretrievableAdministrativeZoneError(response, administrativeZone)
        })
      }
    }).catch(e => {
      throwIrretrievableAdministrativeZoneError(e, administrativeZone)
    })
}

