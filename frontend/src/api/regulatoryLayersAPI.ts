import { geoserverApi } from './api'
import { Layers } from '../domain/entities/layers/constants'
import { GEOSERVER_NAMESPACE } from '../env'

export const REGULATORY_ZONES_ERROR_MESSAGE = "Nous n'avons pas pu récupérer les zones réglementaires"

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
    }),
    getRegulatoryLayers: build.query({
      query: () => ({
        params: {
          format_options: 'id_policy:id',
          outputFormat: 'application/json',
          propertyName: 'entity_name,layer_name,facade,ref_reg,thematique,type,geom',
          request: 'GetFeature',
          service: 'WFS',
          typename: `${GEOSERVER_NAMESPACE}:${Layers.REGULATORY_ENV.name}`,
          version: '2.24.1'
        },
        url: 'wfs'
      }),
      // TODO Type that.
      transformResponse: (response: any) => response?.features
    })
  })
})

export const { useGetRegulatoryLayerQuery } = regulatoryLayersAPI
