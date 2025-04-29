import { FrontendApiError } from '@libs/FrontendApiError'
import { type EntityState } from '@reduxjs/toolkit'

import { monitorenvPrivateApi } from './api'

import type { TagFromAPI } from 'domain/entities/tags'

const GET_TAGS_ERROR_MESSAGE = "Nous n'avons pas pu récupérer les tags."

export const tagAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: builder => ({
    getTags: builder.query<EntityState<TagFromAPI, number>, void>({
      query: () => `/v1/tags`,
      transformErrorResponse: response => new FrontendApiError(GET_TAGS_ERROR_MESSAGE, response)
    }),
    getTagsByRegulatoryAreaIds: builder.query<EntityState<TagFromAPI, number>, number[]>({
      query: ids => ({ body: ids, method: 'POST', url: '/v1/tags/regulatoryAreas' }),
      transformErrorResponse: response => new FrontendApiError(GET_TAGS_ERROR_MESSAGE, response)
    })
  })
})

export const { useGetTagsByRegulatoryAreaIdsQuery, useGetTagsQuery } = tagAPI
