import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import type { ControlResources } from '../domain/entities/controlResources'

export const controlResourcesAPI = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/bff/v1' }),
  endpoints: build => ({
    getControlResources: build.query<ControlResources[], void>({
      query: () => `controlresources`
    })
  }),
  reducerPath: 'controlResources'
})

export const { useGetControlResourcesQuery } = controlResourcesAPI
