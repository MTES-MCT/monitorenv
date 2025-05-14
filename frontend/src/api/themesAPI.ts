import { FrontendApiError } from '@libs/FrontendApiError'
import { type EntityState } from '@reduxjs/toolkit'

import { monitorenvPublicApi } from './api'

import type { ThemeFromAPI } from 'domain/entities/themes'

const GET_THEMES_ERROR_MESSAGE = "Nous n'avons pas pu récupérer les thèmes."

export const themeAPI = monitorenvPublicApi.injectEndpoints({
  endpoints: builder => ({
    getThemes: builder.query<EntityState<ThemeFromAPI, number>, void>({
      query: () => `/v1/themes`,
      transformErrorResponse: response => new FrontendApiError(GET_THEMES_ERROR_MESSAGE, response)
    }),
    getThemesByRegulatoryAreaIds: builder.query<EntityState<ThemeFromAPI, number>, number[]>({
      query: ids => ({ body: ids, method: 'POST', url: '/v1/themes/regulatoryAreas' }),
      transformErrorResponse: response => new FrontendApiError(GET_THEMES_ERROR_MESSAGE, response)
    })
  })
})

export const { useGetThemesByRegulatoryAreaIdsQuery, useGetThemesQuery } = themeAPI
