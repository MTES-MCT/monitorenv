import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'

const OK = 200

export function throwIrretrievableAdministrativeZoneError(e, type) {
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
function getAdministrativeZoneURL(type: string, extent: string[] | null, subZone: string | null, geoserverURL: string) {
  if (subZone) {
    const filter = `${subZone.replace(/'/g, "''")}`

    const subZoneFilter = `&featureID=${filter.replace(/'/g, '%27').replace(/ /g, '%20')}`

    return (
      `${geoserverURL}/geoserver/wfs?service=WFS&` +
      `version=1.1.0&request=GetFeature&typename=${import.meta.env.FRONTEND_GEOSERVER_NAMESPACE}:${type}&` +
      `outputFormat=application/json&srsname=${WSG84_PROJECTION}${subZoneFilter}`
    )
  }

  if (extent) {
    const extentFilter = `&bbox=${extent.join(',')},${OPENLAYERS_PROJECTION}`

    return (
      `${geoserverURL}/geoserver/wfs?service=WFS&` +
      `version=1.1.0&request=GetFeature&typename=${import.meta.env.FRONTEND_GEOSERVER_NAMESPACE}:${type}&` +
      `outputFormat=application/json&srsname=${WSG84_PROJECTION}${extentFilter}`
    )
  }

  return (
    `${geoserverURL}/geoserver/wfs?service=WFS&` +
    `version=1.1.0&request=GetFeature&typename=${import.meta.env.FRONTEND_GEOSERVER_NAMESPACE}:${type}&` +
    `outputFormat=application/json&srsname=${WSG84_PROJECTION}`
  )
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
export function getAdministrativeZoneFromAPI(administrativeZone, extent, subZone) {
  const geoserverURL = import.meta.env.FRONTEND_GEOSERVER_REMOTE_URL

  return fetch(getAdministrativeZoneURL(administrativeZone, extent, subZone, geoserverURL))
    .then(response => {
      if (response.status === OK) {
        return response
          .json()
          .then(r => r)
          .catch(e => {
            throwIrretrievableAdministrativeZoneError(e, administrativeZone)
          })
      }

      return response.text().then(responseText => {
        throwIrretrievableAdministrativeZoneError(responseText, administrativeZone)
      })
    })
    .catch(e => {
      throwIrretrievableAdministrativeZoneError(e, administrativeZone)
    })
}
