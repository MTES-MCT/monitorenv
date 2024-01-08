import { geoserverApi } from './api'
import { Layers } from '../domain/entities/layers/constants'
import { GEOSERVER_NAMESPACE, GEOSERVER_REMOTE_URL } from '../env'

const REGULATORY_ZONES_ERROR_MESSAGE = "Nous n'avons pas pu récupérer les zones réglementaires"
const OK = 200

export function getAllRegulatoryLayersFromAPI() {
  const geoserverURL = GEOSERVER_REMOTE_URL

  return fetch(
    `${geoserverURL}/geoserver/wfs?service=WFS&version=2.24.1&request=GetFeature&typename=${GEOSERVER_NAMESPACE}:` +
      `${Layers.REGULATORY_ENV.name}&format_options=id_policy:id&outputFormat=application/json&propertyName=entity_name,layer_name,facade,ref_reg,thematique,type,geom&maxFeatures=1000`
  )
    .then(response => {
      if (response.status === OK) {
        return response.json()
      }
      throw Error(REGULATORY_ZONES_ERROR_MESSAGE)
    })
    .catch(() => {
      throw Error(REGULATORY_ZONES_ERROR_MESSAGE)
    })
}

export const regulatoryLayersAPI = geoserverApi.injectEndpoints({
  endpoints: build => ({
    getRegulatoryLayer: build.query({
      query: ({ id }) => ({
        params: {
          featureID: id,
          format_options: 'id_policy:id',
          outputFormat: 'application/json',
          request: 'GetFeature',
          service: 'WFS',
          typename: `${GEOSERVER_NAMESPACE}:${Layers.REGULATORY_ENV.name}`,
          version: '2.24.1'
        },
        url: 'wfs'
      }),
      // TODO Type that.
      transformResponse: (response: any) => response?.features[0]
    })
  })
})

export const { useGetRegulatoryLayerQuery } = regulatoryLayersAPI
