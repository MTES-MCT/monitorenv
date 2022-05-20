
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import Layers from '../domain/entities/layers'
import { GEOSERVER_NAMESPACE, GEOSERVER_REMOTE_URL, GEOSERVER_BACKOFFICE_URL } from '../env'

const REGULATORY_ZONES_ERROR_MESSAGE = 'Nous n\'avons pas pu récupérer les zones réglementaires'
const OK = 200

export function getAllRegulatoryLayersFromAPI (fromBackoffice) {
  const geoserverURL = fromBackoffice ? GEOSERVER_BACKOFFICE_URL : GEOSERVER_REMOTE_URL

  return fetch(`${geoserverURL}/geoserver/wfs?service=WFS&version=1.1.0&request=GetFeature&typename=${GEOSERVER_NAMESPACE}:` +
    `${Layers.REGULATORY_ENV.code}&format_options=id_policy:id&outputFormat=application/json&propertyName=entity_name,layer_name,facade,ref_reg,geom`)
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

export const regulatoryLayersAPI = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: `${GEOSERVER_REMOTE_URL}/geoserver/` }),
  reducerPath: 'regulatoryLayers',
  endpoints: (build) => ({
    getRegulatoryLayer: build.query({
      query: ({id}) => ({
        url: "wfs",
        params: {
          'featureID': id,
          'service': 'WFS',
          'version': '1.1.0',
          'request': 'GetFeature',
          'typename': `${GEOSERVER_NAMESPACE}:${Layers.REGULATORY_ENV.code}`,
          'format_options': 'id_policy:id',
          'outputFormat': 'application/json'
        }
      }),
      transformResponse: (response) => {
        return response?.features[0]
      }
    }),
    getRegulatoryLayers: build.query({
      query: () => `&propertyName=entity_name,url,layer_name,facade,ref_reg,observation,thematique,echelle,date,duree_validite,date_fin,temporalite,action,objet,type,signataire,geom`
    })
  }),
})

export const { useGetRegulatoryLayerQuery, useGetRegulatoryLayersQuery } = regulatoryLayersAPI
