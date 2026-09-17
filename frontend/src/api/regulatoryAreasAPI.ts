import { FrontendApiError } from '@libs/FrontendApiError'
import { customDayjs } from '@mtes-mct/monitor-ui'
import { createSelector } from '@reduxjs/toolkit'
import { getQueryString } from '@utils/getQueryStringFormatted'
import { boundingExtent } from 'ol/extent'

import { monitorenvPrivateApi } from './api'

import type { RegulatoryArea } from '@features/RegulatoryArea/types'
import type { HomeRootState } from '@store/index'
import type { Coordinate } from 'ol/coordinate'
import type { StringDigit } from 'type-fest/source/internal'

const GET_REGULATORY_AREAS_ERROR_MESSAGE = "Nous n'avons pas pu récupérer la/les zones réglementaires"
const GET_REGULATORY_AREA_ERROR_MESSAGE = "Nous n'avons pas pu récupérer la zones réglementaire"
const GET_LAYER_NAMES_ERROR_MESSAGE = "Nous n'avons pas pu récupérer les noms de groupes de zones réglementaires"
type Filters = {
  controlPlan?: string
  lastModificationFrom?: string
  lastModificationTo?: string
  onlyRecentsAreas?: boolean
  seaFronts?: string[]
  searchQuery?: string
  sortBy?: string
  tags?: number[]
  themes?: number[]
}

export const regulatoryAreasAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: builder => ({
    getLayerNames: builder.query<RegulatoryArea.RegulatoryAreaGroupWithTotal[], void>({
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
      providesTags: () => [{ id: 'GROUP_BY_ID', type: 'RegulatoryAreas' }],
      query: id => `v1/regulatory-areas/groups/${id}`,
      transformErrorResponse: response =>
        new FrontendApiError("Nous n'avons pas pu récupérer le groupe de reglementation", response),
      transformResponse: (response: RegulatoryArea.RegulatoryAreaGroup): RegulatoryArea.RegulatoryAreaGroup => ({
        group: {
          ...response.group
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
            ...group.group
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
        { id: 'GROUP_BY_ID', type: 'RegulatoryAreas' },
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
        { id: 'GROUP_BY_ID', type: 'RegulatoryAreas' },
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

export const getBackofficeFilters = (state: HomeRootState) => state.regulatoryAreaTable.filtersState

export const getBackofficeFilteredRegulatoryAreas = createSelector(
  [
    state => getBackofficeFilters(state),
    (state, filters) => regulatoryAreasAPI.endpoints.getRegulatoryAreas.select(filters)(state)
  ],
  (filters, result) => {
    const { data } = result
    if (!filters.regHelper) {
      return data
    }
    switch (filters.regHelper) {
      case 'WITHOUT_THEME':
        return {
          ...data,
          regulatoryAreasByLayer: data?.regulatoryAreasByLayer.map(group => ({
            ...group,
            regulatoryAreas: group.regulatoryAreas.filter(regArea => !regArea.themes || regArea.themes.length === 0)
          }))
        }
      case 'WITHOUT_TAG':
        return {
          ...data,
          regulatoryAreasByLayer: data?.regulatoryAreasByLayer.map(group => ({
            ...group,
            regulatoryAreas: group.regulatoryAreas.filter(regArea => !regArea.tags || regArea.tags.length === 0)
          }))
        }
      case 'OUTDATED':
        return {
          ...data,
          regulatoryAreasByLayer: data?.regulatoryAreasByLayer.filter(
            group => group.group.dateFin && customDayjs().startOf('day').isAfter(customDayjs(group.group.dateFin))
          )
        }
      default:
        return data
    }
  }
)

export const getRegulatoryAreasByControlPlan = createSelector(
  [getBackofficeFilteredRegulatoryAreas],
  regulatoryAreas => {
    const groups = regulatoryAreas?.regulatoryAreasByLayer

    if (!groups) {
      return undefined
    }

    return groups.reduce(
      (acc, group) => {
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
      },
      {} as Record<
        RegulatoryArea.RegulatoryAreaControlPlan.PIRC | RegulatoryArea.RegulatoryAreaControlPlan.PSCEM,
        RegulatoryArea.RegulatoryAreaGroup[]
      >
    )
  }
)

export const getRegulatoryAreasBySeaFront = createSelector([getBackofficeFilteredRegulatoryAreas], regulatoryAreas => {
  const groups = regulatoryAreas?.regulatoryAreasByLayer

  if (!groups) {
    return undefined
  }

  return groups.reduce(
    (acc, group) => {
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
    },
    {} as Record<StringDigit, RegulatoryArea.RegulatoryAreaGroup[]>
  )
})

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
