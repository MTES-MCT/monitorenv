import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const controlThemesAPI = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/bff/v1' }),
  endpoints: build => ({
    getControlTheme: build.query({
      query: ({ id }) => `controlthemes/${id}`
    }),
    getControlThemes: build.query({
      providesTags: result =>
        result
          ? // successful query
            [...result.map(({ id }) => ({ id, type: 'ControlTheme' })), { id: 'LIST', type: 'ControlTheme' }]
          : // an error occurred, but we still want to refetch this query when `{ type: 'ControlTheme', id: 'LIST' }` is invalidated
            [{ id: 'LIST', type: 'ControlTheme' }],
      query: () => `controlthemes`
    })
  }),
  reducerPath: 'controlThemes'
})

export const { useGetControlThemesQuery } = controlThemesAPI
