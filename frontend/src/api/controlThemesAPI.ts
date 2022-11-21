import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import type { ControlTheme } from '../domain/entities/controlThemes'

export const controlThemesAPI = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/bff/v1' }),
  endpoints: build => ({
    getControlTheme: build.query<ControlTheme, { id: number }>({
      query: ({ id }) => `controlthemes/${id}`
    }),
    getControlThemes: build.query<ControlTheme[], void>({
      query: () => `controlthemes`
    })
  }),
  reducerPath: 'controlThemes'
})

export const { useGetControlThemesQuery } = controlThemesAPI
