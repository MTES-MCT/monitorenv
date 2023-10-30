import { monitorenvPrivateApi } from './api'

import type { ControlTheme } from '../domain/entities/controlThemes'

export const controlThemesAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: build => ({
    getControlTheme: build.query<ControlTheme, { id: number }>({
      query: ({ id }) => `/v1/controlthemes/${id}`
    }),
    getControlThemes: build.query<ControlTheme[], void>({
      query: () => `/v1/controlthemes`
    })
  })
})

export const { useGetControlThemesQuery } = controlThemesAPI
