import { FrontendApiError } from '@libs/FrontendApiError'
import { createSelector } from '@reduxjs/toolkit'
import { getQueryString } from '@utils/getQueryStringFormatted'
import { boundingExtent } from 'ol/extent'

import { monitorenvPrivateApi } from './api'

import type { RegulatoryArea } from '@features/RegulatoryArea/types'
import type { HomeRootState } from '@store/index'
import type { Coordinate } from 'ol/coordinate'

const GET_REGULATORY_AREAS_ERROR_MESSAGE = "Nous n'avons pas pu récupérer la/les zones réglementaires"
const GET_REGULATORY_AREA_ERROR_MESSAGE = "Nous n'avons pas pu récupérer la zones réglementaire"
const GET_LAYER_NAMES_ERROR_MESSAGE = "Nous n'avons pas pu récupérer les noms de groupes de zones réglementaires"
type Filters = {
  controlPlan?: string
  onlyRecentsAreas?: boolean
  seaFronts?: string[]
  searchQuery?: string
  tags?: number[]
  themes?: number[]
}

export const regulatoryAreasAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: builder => ({
    getLayerNames: builder.query<{ layerNames: { [key: string]: number }[] }, void>({
      providesTags: () => [{ id: 'LAYERS_NAME', type: 'RegulatoryAreas' }],
      query: () => 'v1/regulatory-areas/layer-names',
      transformErrorResponse: response => new FrontendApiError(GET_LAYER_NAMES_ERROR_MESSAGE, response)
    }),
    getRegulatoryAreaById: builder.query<RegulatoryArea.RegulatoryAreaWithBbox, number>({
      providesTags: (_, __, id) => [{ id, type: 'RegulatoryAreas' }],
      query: id => `v1/regulatory-areas/${id}`,
      transformErrorResponse: response => new FrontendApiError(GET_REGULATORY_AREA_ERROR_MESSAGE, response),
      transformResponse: (response: RegulatoryArea.RegulatoryAreaFromAPI) => {
        const bbox = boundingExtent(response.geom?.coordinates.flat().flat() as Coordinate[])

        return {
          ...response,
          bbox
        }
      }
    }),
    getRegulatoryAreaGroupById: builder.query<RegulatoryArea.RegulatoryAreaGroup, number>({
      providesTags: () => [{ id: 'GROUP', type: 'RegulatoryAreas' }],
      query: id => `v1/regulatory-areas/groups/${id}`,
      transformErrorResponse: response =>
        new FrontendApiError("Nous n'avons pas pu récupérer le groupe de reglementation", response),
      transformResponse: (response: RegulatoryArea.RegulatoryAreaGroup): RegulatoryArea.RegulatoryAreaGroup => ({
        group: {
          ...response.group,
          bbox: boundingExtent(response.group.geom?.coordinates.flat().flat() as Coordinate[])
        },
        regulatoryAreas: response.regulatoryAreas.map(area => ({
          ...area,
          bbox: boundingExtent(area.geom?.coordinates.flat().flat() as Coordinate[])
        }))
      })
    }),
    getRegulatoryAreaGroupByName: builder.query<RegulatoryArea.RegulatoryAreaGroup, string>({
      providesTags: () => [{ id: 'GROUP', type: 'RegulatoryAreas' }],
      query: name => `v1/regulatory-areas/groups?name=${name}`,
      transformErrorResponse: response =>
        new FrontendApiError("Nous n'avons pas pu récupérer le groupe de reglementation", response),
      transformResponse: (response: RegulatoryArea.RegulatoryAreaGroup): RegulatoryArea.RegulatoryAreaGroup => ({
        group: {
          ...response.group,
          bbox: boundingExtent(response.group.geom?.coordinates.flat().flat() as Coordinate[])
        },
        regulatoryAreas: response.regulatoryAreas.map(area => ({
          ...area,
          bbox: boundingExtent(area.geom?.coordinates.flat().flat() as Coordinate[])
        }))
      })
    }),
    getRegulatoryAreas: builder.query<RegulatoryArea.RegulatoryAreasFromApi, Filters | void>({
      providesTags: result =>
        result?.regulatoryAreasByLayer
          ? // successful query
            [
              ...result.regulatoryAreasByLayer.flatMap(({ regulatoryAreas }) =>
                regulatoryAreas.map(({ id }) => ({ id, type: 'RegulatoryAreas' as const }))
              ),
              { id: 'LIST', type: 'RegulatoryAreas' }
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'RegulatoryAreas', id: 'LIST' }` is invalidated
            [{ id: 'LIST', type: 'RegulatoryAreas' }],
      query: filters => getQueryString('v1/regulatory-areas', filters),
      transformErrorResponse: response => new FrontendApiError(GET_REGULATORY_AREAS_ERROR_MESSAGE, response),
      transformResponse: (response: RegulatoryArea.RegulatoryAreasFromApi): RegulatoryArea.RegulatoryAreasFromApi => ({
        regulatoryAreasByLayer: response.regulatoryAreasByLayer.map(group => ({
          group: {
            ...group.group,
            bbox: boundingExtent(group.group.geom?.coordinates.flat().flat() as Coordinate[])
          },
          regulatoryAreas: group.regulatoryAreas.map(area => ({
            ...area,
            bbox: boundingExtent(area.geom?.coordinates.flat().flat() as Coordinate[])
          }))
        })),
        totalCount: response.totalCount
      })
    }),
    getRegulatoryAreasByIds: builder.query<
      RegulatoryArea.RegulatoryAreaWithBbox[],
      RegulatoryArea.RegulatoryAreaByIdsForApi
    >({
      query: body => ({ body, method: 'POST', url: 'v1/regulatory-areas' }),
      transformErrorResponse: response => new FrontendApiError(GET_REGULATORY_AREAS_ERROR_MESSAGE, response)
    }),
    getRegulatoryAreasToComplete: builder.query<RegulatoryArea.RegulatoryAreaToComplete[], void>({
      providesTags: () => [{ id: 'TO_COMPLETE', type: 'RegulatoryAreas' }],
      query: () => 'v1/regulatory-areas/to-complete',
      transformErrorResponse: response =>
        new FrontendApiError("Nous n'avons pas pu récupérer les zones réglementaires à compléter", response)
    }),
    saveRegulatoryArea: builder.mutation<
      RegulatoryArea.RegulatoryAreaFromAPI,
      Partial<RegulatoryArea.RegulatoryAreaFromAPI>
    >({
      invalidatesTags: (_, __, { id }) => [
        { id, type: 'RegulatoryAreas' },
        { id: 'LIST', type: 'RegulatoryAreas' },
        { id: 'TO_COMPLETE', type: 'RegulatoryAreas' },
        { id: 'GROUP', type: 'RegulatoryAreas' },
        { id: 'LAYERS_NAME', type: 'RegulatoryAreas' }
      ],
      query: regulatoryArea => ({
        body: regulatoryArea,
        method: 'PUT',
        url: 'v1/regulatory-areas'
      })
    }),
    saveRegulatoryAreaGroup: builder.mutation<
      RegulatoryArea.RegulatoryAreaGroup,
      RegulatoryArea.RegulatoryAreaGroupToApi
    >({
      invalidatesTags: () => [
        { id: 'LIST', type: 'RegulatoryAreas' },
        { id: 'TO_COMPLETE', type: 'RegulatoryAreas' },
        { id: 'GROUP', type: 'RegulatoryAreas' },
        { id: 'LAYERS_NAME', type: 'RegulatoryAreas' }
      ],
      query: regulatoryAreaGroup => ({
        body: regulatoryAreaGroup,
        method: 'PUT',
        transformErrorResponse: response =>
          new FrontendApiError("Nous n'avons pas pu enregistrer la groupe de réglementations", response),
        url: 'v1/regulatory-areas/groups'
      })
    })
  })
})

export const {
  useGetLayerNamesQuery,
  useGetRegulatoryAreaByIdQuery,
  useGetRegulatoryAreaGroupByIdQuery,
  useGetRegulatoryAreasByIdsQuery,
  useGetRegulatoryAreasQuery,
  useGetRegulatoryAreasToCompleteQuery
} = regulatoryAreasAPI

export const getRegulatoryAreasByControlPlan = createSelector(
  [(state, filters: Filters) => regulatoryAreasAPI.endpoints.getRegulatoryAreas.select(filters)(state)],
  regulatoryAreas => {
    const groups = regulatoryAreas?.data?.regulatoryAreasByLayer

    if (!groups) {
      return undefined
    }

    return groups.reduce((acc, group) => {
      const areasByPlan = new Map<string, RegulatoryArea.RegulatoryAreaWithBbox[]>()

      group.regulatoryAreas?.forEach(regulatoryArea => {
        const { plan } = regulatoryArea

        if (!plan) {
          return
        }

        const plans = plan.split(',').map(p => p.trim())

        plans.forEach(planRaw => {
          const areas = areasByPlan.get(planRaw) ?? []
          areas.push(regulatoryArea)
          areasByPlan.set(planRaw, areas)
        })
      })

      areasByPlan.forEach((areas, planRaw) => {
        acc[planRaw] ??= []
        acc[planRaw].push({
          ...group,
          regulatoryAreas: areas
        })
      })

      return acc
    }, {} as Record<RegulatoryArea.RegulatoryAreaControlPlan.PIRC | RegulatoryArea.RegulatoryAreaControlPlan.PSCEM, RegulatoryArea.RegulatoryAreaGroup[]>)
  }
)

export const getRegulatoryAreasBySeaFront = createSelector(
  [(state, filters: Filters) => regulatoryAreasAPI.endpoints.getRegulatoryAreas.select(filters)(state)],
  regulatoryAreas => {
    const groups = regulatoryAreas?.data?.regulatoryAreasByLayer

    if (!groups) {
      return undefined
    }

    return groups.reduce((acc, group) => {
      const areasByFacade = new Map<string, RegulatoryArea.RegulatoryAreaWithBbox[]>()

      group.regulatoryAreas?.forEach(regulatoryArea => {
        const { facade } = regulatoryArea

        if (!facade) {
          return
        }

        const areas = areasByFacade.get(facade) ?? []
        areas.push(regulatoryArea)
        areasByFacade.set(facade, areas)
      })

      areasByFacade.forEach((areas, facade) => {
        acc[facade] ??= []
        acc[facade].push({
          ...group,
          regulatoryAreas: areas
        })
      })

      return acc
    }, {} as Record<string, RegulatoryArea.RegulatoryAreaGroup[]>)
  }
)

export const getSelectedRegulatoryAreas = createSelector(
  [
    regulatoryAreasAPI.endpoints.getRegulatoryAreas.select(),
    (state: HomeRootState) => state.regulatory.selectedRegulatoryLayerIds
  ],
  (regulatoryLayers, selectedRegulatoryLayerIds) => {
    const emptyArray = []

    const flattenedRegulatoryAreas =
      regulatoryLayers?.data?.regulatoryAreasByLayer.flatMap(group => group.regulatoryAreas) ?? []

    return (
      selectedRegulatoryLayerIds
        .map(id => flattenedRegulatoryAreas.find(area => area.id === id))
        .filter((layer): layer is RegulatoryArea.RegulatoryAreaWithBbox => !!layer) ?? emptyArray
    )
  }
)
