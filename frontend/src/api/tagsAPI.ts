import { FrontendApiError } from '@libs/FrontendApiError'
import { type EntityState } from '@reduxjs/toolkit'

import { monitorenvPrivateApi } from './api'

import type { DateAsStringRange } from '@mtes-mct/monitor-ui'
import type { TagFromAPI, TagToAPI } from 'domain/entities/tags'

const GET_TAGS_ERROR_MESSAGE = "Nous n'avons pas pu récupérer les tags."

export const tagsAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: builder => ({
    getTags: builder.query<EntityState<TagFromAPI, number>, DateAsStringRange | void>({
      query: dateRange =>
        dateRange
          ? `/v1/tags?startedAt=${encodeURIComponent(dateRange[0])}&endedAt=${encodeURIComponent(dateRange[1])}`
          : 'v1/tags',
      transformErrorResponse: response => new FrontendApiError(GET_TAGS_ERROR_MESSAGE, response)
    }),
    saveTag: builder.mutation<TagFromAPI, TagToAPI>({
      query: tag => ({
        body: tag,
        method: 'PUT',
        url: `/v1/tags`
      }),
      transformErrorResponse: response => new FrontendApiError("Le tag n'a pas pu être enregistré", response)
    })
  })
})

export const { useGetTagsQuery } = tagsAPI
