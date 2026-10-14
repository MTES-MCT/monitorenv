import { FrontendApiError } from '@libs/FrontendApiError'
import { createSelector } from '@reduxjs/toolkit'
import { getQueryString } from '@utils/getQueryStringFormatted'
import { groupBy } from 'lodash'
import { createCachedSelector } from 're-reselect'

import { monitorenvPrivateApi } from './api'

import type { AMP } from '../domain/entities/AMPs'

const GET_AMP_ERROR_MESSAGE = "Nous n'avons pas pu récupérer l'AMP"
const GET_AMPS_ERROR_MESSAGE = "Nous n'avons pas pu récupérer les Zones AMP"

type Filters = {
  onlyRecentsAreas?: boolean
  searchQuery?: string
}

export const ampsAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: builder => ({
    getAMPById: builder.query<AMP, number>({
      query: id => `v1/amps/${id}`,
      transformErrorResponse: response => new FrontendApiError(GET_AMP_ERROR_MESSAGE, response)
    }),
    getAMPs: builder.query<AMP[], Filters | void>({
      query: filters => getQueryString('v1/amps', filters),
      transformErrorResponse: response => new FrontendApiError(GET_AMPS_ERROR_MESSAGE, response)
    }),
    getAMPsByIds: builder.query<AMP[], { axis: string; ids: number[] }>({
      query: body => ({ body, method: 'POST', url: '/v1/amps' }),
      transformErrorResponse: response => new FrontendApiError(GET_AMPS_ERROR_MESSAGE, response)
    })
  })
})

export const { useGetAMPByIdQuery, useGetAMPsByIdsQuery, useGetAMPsQuery } = ampsAPI

export const getAMPsIdsGroupedByName = createSelector([ampsAPI.endpoints.getAMPs.select()], ampsQuery =>
  groupBy(ampsQuery.data ?? [], amp => amp.name)
)

export const getNumberOfAMPByGroupName = createCachedSelector(
  [getAMPsIdsGroupedByName, (_, groupName: string) => groupName],
  (ampIdsByName, groupName) => (ampIdsByName && ampIdsByName[groupName]?.length) ?? 0
)((_, groupName: string) => groupName)
