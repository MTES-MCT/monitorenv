import { FrontendApiError } from '@libs/FrontendApiError'
import { type EntityState } from '@reduxjs/toolkit'

import { monitorenvPublicApi } from './api'

import type { DateAsStringRange } from '@mtes-mct/monitor-ui'
import type { ThemeFromAPI } from 'domain/entities/themes'

const GET_THEMES_ERROR_MESSAGE = "Nous n'avons pas pu récupérer les thèmes."

export const themeAPI = monitorenvPublicApi.injectEndpoints({
  endpoints: builder => ({
    getThemes: builder.query<EntityState<ThemeFromAPI, number>, DateAsStringRange | void>({
      keepUnusedDataFor: 0,
      query: dateRange =>
        dateRange
          ? `/v1/themes?startedAt=${encodeURIComponent(dateRange[0])}&endedAt=${encodeURIComponent(dateRange[1])}`
          : 'v1/themes',
      transformErrorResponse: response => new FrontendApiError(GET_THEMES_ERROR_MESSAGE, response)
    })
  })
})

export const { useGetThemesQuery } = themeAPI
