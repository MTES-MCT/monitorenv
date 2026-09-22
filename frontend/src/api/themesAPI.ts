import { FrontendApiError } from '@libs/FrontendApiError'
import { type EntityState } from '@reduxjs/toolkit'

import { monitorenvPublicApi } from './api'

import type { DateAsStringRange } from '@mtes-mct/monitor-ui'
import type { ThemeFromAPI, ThemeToAPI } from 'domain/entities/themes'

const GET_THEMES_ERROR_MESSAGE = "Nous n'avons pas pu récupérer les thèmes."

export const themesAPI = monitorenvPublicApi.injectEndpoints({
  endpoints: builder => ({
    getThemes: builder.query<EntityState<ThemeFromAPI, number>, DateAsStringRange | void>({
      providesTags: () => [{ type: 'Themes' }],
      query: dateRange =>
        dateRange
          ? `/v1/themes?startedAt=${encodeURIComponent(dateRange[0])}&endedAt=${encodeURIComponent(dateRange[1])}`
          : 'v1/themes',
      transformErrorResponse: response => new FrontendApiError(GET_THEMES_ERROR_MESSAGE, response)
    }),
    saveTheme: builder.mutation<ThemeFromAPI, ThemeToAPI>({
      invalidatesTags: () => [{ type: 'Themes' }],
      query: theme => ({
        body: theme,
        method: 'PUT',
        url: `/v1/themes`
      }),
      transformErrorResponse: response => new FrontendApiError("Le thème n'a pas pu être enregistré", response)
    })
  })
})

export const { useGetThemesQuery } = themesAPI
