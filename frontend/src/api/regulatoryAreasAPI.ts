import { FrontendApiError } from '@libs/FrontendApiError'
import { createSelector } from '@reduxjs/toolkit'
import { getQueryString } from '@utils/getQueryStringFormatted'
import { boundingExtent } from 'ol/extent'

import { monitorenvPrivateApi } from './api'

import type { RegulatoryArea } from '@features/RegulatoryArea/types'
import type { Coordinate } from 'ol/coordinate'
import type { StringDigit } from 'type-fest/source/internal'

const GET_REGULATORY_AREAS_ERROR_MESSAGE = "Nous n'avons pas pu récupérer la/les zones réglementaires"
const GET_REGULATORY_AREA_ERROR_MESSAGE = "Nous n'avons pas pu récupérer la zones réglementaire"
const GET_LAYER_NAMES_ERROR_MESSAGE = "Nous n'avons pas pu récupérer les noms de groupes de zones réglementaires"
type Filters = {
  groupBy?: 'CONTROL_PLAN' | 'SEA_FRONT'
  seaFronts?: string[]
  searchQuery?: string
  tags?: number[]
  themes?: number[]
}

export const regulatoryAreasAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: builder => ({
    getLayerNames: builder.query<{ layerNames: string[] }, void>({
      query: () => '/regulatory-areas/layer-names',
      transformErrorResponse: response => new FrontendApiError(GET_LAYER_NAMES_ERROR_MESSAGE, response)
    }),
    getRegulatoryAreaById: builder.query<RegulatoryArea.RegulatoryAreaWithBbox, number>({
      providesTags: (_, __, id) => [{ id, type: 'RegulatoryAreas' }],
      query: id => `/regulatory-areas/${id}`,
      transformErrorResponse: response => new FrontendApiError(GET_REGULATORY_AREA_ERROR_MESSAGE, response),
      transformResponse: (response: RegulatoryArea.RegulatoryAreaFromAPI) => {
        const bbox = boundingExtent(response.geom?.coordinates.flat().flat() as Coordinate[])

        return {
          ...response,
          bbox
        }
      }
    }),
    getRegulatoryAreas: builder.query<RegulatoryArea.RegulatoryAreasGroup[], Filters | void>({
      providesTags: result =>
        result
          ? // successful query
            [
              ...result.flatMap(({ regulatoryAreas }) =>
                regulatoryAreas.map(({ id }) => ({ id, type: 'RegulatoryAreas' as const }))
              ),
              { id: 'LIST', type: 'RegulatoryAreas' }
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'RegulatoryAreas', id: 'LIST' }` is invalidated
            [{ id: 'LIST', type: 'RegulatoryAreas' }],
      query: filters => getQueryString('/regulatory-areas', filters),
      transformErrorResponse: response => new FrontendApiError(GET_REGULATORY_AREAS_ERROR_MESSAGE, response),
      transformResponse: (response: RegulatoryArea.RegulatoryAreasGroup[]): RegulatoryArea.RegulatoryAreasGroup[] =>
        response.map(group => ({
          group: group.group,
          regulatoryAreas: group.regulatoryAreas.map(area => ({
            ...area,
            bbox: boundingExtent(area.geom?.coordinates.flat().flat() as Coordinate[])
          }))
        }))
    }),
    getRegulatoryAreasToCreate: builder.query<RegulatoryArea.RegulatoryAreaToCreate[], void>({
      providesTags: () => [{ id: 'TO_CREATE', type: 'RegulatoryAreas' }],
      query: () => '/regulatory-areas/to-create',
      transformErrorResponse: response =>
        new FrontendApiError("Nous n'avons pas pu récupérer les zones réglementaires à créer", response)
    }),
    saveRegulatoryArea: builder.mutation<
      RegulatoryArea.RegulatoryAreaFromAPI,
      Partial<RegulatoryArea.RegulatoryAreaFromAPI>
    >({
      invalidatesTags: (_, __, { id }) => [
        { id, type: 'RegulatoryAreas' },
        { id: 'LIST', type: 'RegulatoryAreas' },
        { id: 'TO_CREATE', type: 'RegulatoryAreas' }
      ],
      query: regulatoryArea => ({
        body: regulatoryArea,
        method: 'PUT',
        url: '/regulatory-areas'
      })
    })
  })
})

export const {
  useGetLayerNamesQuery,
  useGetRegulatoryAreaByIdQuery,
  useGetRegulatoryAreasQuery,
  useGetRegulatoryAreasToCreateQuery
} = regulatoryAreasAPI

export const getregulatoryAreasByControlPlan = createSelector(
  [(state, filters: Filters) => regulatoryAreasAPI.endpoints.getRegulatoryAreas.select(filters)(state)],
  regulatoryAreas => {
    const groups = regulatoryAreas?.data

    if (!groups) {
      return {}
    }

    return groups.reduce((acc, group) => {
      group.regulatoryAreas.forEach(area => {
        const { layerName, plan } = area

        if (!layerName || !plan) {
          return
        }

        const plans = plan.split(',').map(p => p.trim())

        plans.forEach(planRaw => {
          acc[planRaw] ??= {}
          acc[planRaw][layerName] ??= []
          acc[planRaw][layerName].push(area)
        })
      })

      return acc
    }, {} as Record<'PIRC' | 'PSCEM', Record<string, RegulatoryArea.RegulatoryAreaWithBbox[]>>)
  }
)

export const getregulatoryAreasBySeaFront = createSelector(
  [(state, filters: Filters) => regulatoryAreasAPI.endpoints.getRegulatoryAreas.select(filters)(state)],

  regulatoryAreas => {
    const groups = regulatoryAreas?.data

    if (!groups) {
      return {}
    }

    return groups.reduce((acc, group) => {
      group.regulatoryAreas.forEach(area => {
        const { facade, plan } = area

        if (!facade || !plan) {
          return
        }

        const plans = plan.split(',').map(p => p.trim())

        plans.forEach(planRaw => {
          acc[planRaw] ??= {}
          acc[planRaw][facade] ??= []
          acc[planRaw][facade].push(area)
        })
      })

      return acc
    }, {} as Record<StringDigit, Record<string, RegulatoryArea.RegulatoryAreaWithBbox[]>>)
  }
)
