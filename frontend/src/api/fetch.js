/** @namespace API */
const API = null // eslint-disable-line

import Layers from '../domain/entities/layers'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../domain/entities/map'
import { GEOSERVER_NAMESPACE, GEOSERVER_REMOTE_URL, GEOSERVER_BACKOFFICE_URL } from '../env'


const OK = 200
// const CREATED = 201
// const NOT_FOUND = 404
// const ACCEPTED = 202

const REGULATORY_ZONES_ZONE_SELECTION_ERROR_MESSAGE = 'Nous n\'avons pas pu filtrer les zones réglementaires par zone'
export const REGULATORY_ZONE_METADATA_ERROR_MESSAGE = 'Nous n\'avons pas pu récupérer la couche réglementaire'
const HEALTH_CHECK_ERROR_MESSAGE = 'Nous n\'avons pas pu vérifier si l\'application est à jour'


function getIrretrievableRegulatoryZoneError (e, regulatoryZone) {
  return Error(`Nous n'avons pas pu récupérer la zone réglementaire ${regulatoryZone.topic}/${regulatoryZone.zone} : ${e}`)
}

function throwIrretrievableAdministrativeZoneError (e, type) {
  throw Error(`Nous n'avons pas pu récupérer la zone ${type} : ${e}`)
}



function getRegulatoryZoneFromAPI (type, regulatoryZone, fromBackoffice) {
  try {
    const geoserverURL = fromBackoffice ? GEOSERVER_BACKOFFICE_URL : GEOSERVER_REMOTE_URL

    return fetch(getRegulatoryZoneURL(type, regulatoryZone, geoserverURL))
      .then(response => {
        if (response.status === OK) {
          return response.json().then(response => {
            return getFirstFeature(response)
          }).catch(e => {
            throw getIrretrievableRegulatoryZoneError(e, regulatoryZone)
          })
        } else {
          response.text().then(response => {
            throw getIrretrievableRegulatoryZoneError(response, regulatoryZone)
          })
        }
      }).catch(e => {
        throw getIrretrievableRegulatoryZoneError(e, regulatoryZone)
      })
  } catch (e) {
    return Promise.reject(getIrretrievableRegulatoryZoneError(e, regulatoryZone))
  }
}

function getRegulatoryZoneURL (type, regulatoryZone, geoserverURL) {
  if (!regulatoryZone.topic) {
    throw new Error('Le nom de la couche n\'est pas renseigné')
  }
  if (!regulatoryZone.zone) {
    throw new Error('Le nom de la zone n\'est pas renseigné')
  }

  const filter = `layer_name='${encodeURIComponent(regulatoryZone.topic).replace(/'/g, '\'\'')}' AND zones='${encodeURIComponent(regulatoryZone.zone).replace(/'/g, '\'\'')}'`
  return (
    `${geoserverURL}/geoserver/wfs?service=WFS` +
    `&version=1.1.0&request=GetFeature&typename=${GEOSERVER_NAMESPACE}:${type}` +
    '&outputFormat=application/json&CQL_FILTER=' +
    filter.replace(/'/g, '%27').replace(/ /g, '%20')
  )
}

/**
 * Get the regulatory zones GeoJSON feature filtered with the OpenLayers extent (the BBOX)
 * @memberOf API
 * @param {string[]|null} extent
 * @param {boolean} fromBackoffice
 * @returns {Promise<GeoJSON>} The feature GeoJSON
 * @throws {Error}
 */
export function getRegulatoryZonesInExtentFromAPI (extent, fromBackoffice) {
  try {
    const geoserverURL = fromBackoffice ? GEOSERVER_BACKOFFICE_URL : GEOSERVER_REMOTE_URL

    return fetch(`${geoserverURL}/geoserver/wfs?service=WFS` +
      `&version=1.1.0&request=GetFeature&typename=${GEOSERVER_NAMESPACE}:${Layers.REGULATORY.code}` +
      `&outputFormat=application/json&srsname=${WSG84_PROJECTION}` +
      `&bbox=${extent.join(',')},${OPENLAYERS_PROJECTION}` +
      `&propertyName=law_type,layer_name,engins,engins_interdits,especes,especes_interdites,references_reglementaires,zones,facade,region`
        .replace(/'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/ /g, '%20'))
      .then(response => {
        if (response.status === OK) {
          return response.json().then(response => {
            return response
          }).catch(error => {
            console.error(error)
            throw REGULATORY_ZONES_ZONE_SELECTION_ERROR_MESSAGE
          })
        } else {
          response.text().then(response => {
            console.error(response)
          })
          throw REGULATORY_ZONES_ZONE_SELECTION_ERROR_MESSAGE
        }
      }).catch(error => {
        console.error(error)
        throw REGULATORY_ZONES_ZONE_SELECTION_ERROR_MESSAGE
      })
  } catch (error) {
    console.error(error)
    return Promise.reject(REGULATORY_ZONES_ZONE_SELECTION_ERROR_MESSAGE)
  }
}

function getFirstFeature (response) {
  // There must be only one feature per regulation
  const FIRST_FEATURE = 0

  if (response.features.length === 1 && response.features[FIRST_FEATURE]) {
    return response.features[FIRST_FEATURE]
  } else {
    throw Error('We found multiple features for this zone')
  }
}

function getRegulatoryFeatureMetadataFromAPI (regulatorySubZone, fromBackoffice) {
  let url
  try {
    const geoserverURL = fromBackoffice ? GEOSERVER_BACKOFFICE_URL : GEOSERVER_REMOTE_URL

    url = getRegulatoryZoneURL(Layers.REGULATORY.code, regulatorySubZone, geoserverURL)
  } catch (e) {
    return Promise.reject(e)
  }

  return fetch(url)
    .then(response => {
      if (response.status === OK) {
        return response.json().then(response => {
          return getFirstFeature(response)
        })
      } else {
        response.text().then(text => {
          console.error(text)
        })
        throw Error(REGULATORY_ZONE_METADATA_ERROR_MESSAGE)
      }
    }).catch(error => {
      console.error(error)
      throw Error(REGULATORY_ZONE_METADATA_ERROR_MESSAGE)
    })
}

function getAdministrativeSubZonesFromAPI (type, fromBackoffice) {
  const geoserverURL = fromBackoffice ? GEOSERVER_BACKOFFICE_URL : GEOSERVER_REMOTE_URL

  let query
  if (type === Layers.FAO.code) {
    const filter = 'f_level=\'DIVISION\''

    query = `${geoserverURL}/geoserver/wfs?service=WFS&` +
      `version=1.1.0&request=GetFeature&typename=${GEOSERVER_NAMESPACE}:${type}&` +
      `outputFormat=application/json&srsname=${WSG84_PROJECTION}&CQL_FILTER=` +
      filter.replace(/'/g, '%27').replace(/ /g, '%20')
  } else {
    query = `${geoserverURL}/geoserver/wfs?service=WFS&` +
      `version=1.1.0&request=GetFeature&typename=${GEOSERVER_NAMESPACE}:${type}&` +
      `outputFormat=application/json&srsname=${WSG84_PROJECTION}`
  }

  return fetch(query)
    .then(response => {
      if (response.status === OK) {
        return response.json().then(response => {
          return response
        }).catch(e => {
          throwIrretrievableAdministrativeZoneError(e, type)
        })
      } else {
        response.text().then(response => {
          throwIrretrievableAdministrativeZoneError(response, type)
        })
      }
    }).catch(e => {
      throwIrretrievableAdministrativeZoneError(e, type)
    })
}

/**
 * Get application healthcheck
 * @memberOf API
 * @returns {Promise<Healthcheck>} The healthcheck dates of positions and ers messages
 * @throws {Error}
 */
function getHealthcheckFromAPI () {
  return fetch('/bff/v1/healthcheck')
    .then(response => {
      if (response.status === OK) {
        return response.json()
      } else {
        response.text().then(text => {
          console.error(text)
        })
        throw Error(HEALTH_CHECK_ERROR_MESSAGE)
      }
    }).catch(error => {
      console.error(error)
      throw Error(HEALTH_CHECK_ERROR_MESSAGE)
    })
}

export {
  getRegulatoryZoneFromAPI,
  getRegulatoryZoneURL,
  getRegulatoryFeatureMetadataFromAPI,
  getAdministrativeSubZonesFromAPI,
  getHealthcheckFromAPI,
}
