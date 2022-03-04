
import Layers from '../domain/entities/layers'


export const GEOSERVER_BACKOFFICE_URL = process.env.REACT_APP_GEOSERVER_LOCAL_URL
export const GEOSERVER_NAMESPACE = process.env.REACT_APP_GEOSERVER_NAMESPACE
export const GEOSERVER_URL = process.env.REACT_APP_GEOSERVER_REMOTE_URL

const REGULATORY_ZONES_ERROR_MESSAGE = 'Nous n\'avons pas pu récupérer les zones réglementaires'
const OK = 200

export function getAllRegulatoryLayersFromAPI (fromBackoffice) {
  const geoserverURL = fromBackoffice ? GEOSERVER_BACKOFFICE_URL : GEOSERVER_URL

  return fetch(`${geoserverURL}/geoserver/wfs?service=WFS&version=1.1.0&request=GetFeature&typename=${GEOSERVER_NAMESPACE}:` +
    `${Layers.REGULATORY_ENV.code}&outputFormat=application/json&propertyName=entity_name,url,layer_name,facade,ref_reg,observation,thematique,echelle,date,duree_validite,date_fin,temporalite,action,objet,type,signataire,geom`)
    .then(response => {
      if (response.status === OK) {
        return response.json()
      } else {
        response.text().then(text => {
          console.error(text)
        })
        throw Error(REGULATORY_ZONES_ERROR_MESSAGE)
      }
    })
    .catch(error => {
      console.error(error)
      throw Error(REGULATORY_ZONES_ERROR_MESSAGE)
    })
}