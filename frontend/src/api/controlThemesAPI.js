import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const controlThemesAPI = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/bff/v1' }),
  reducerPath: 'controlThemes',
  endpoints: (build) => ({
    getControlTheme: build.query({
      query: ({id}) => `controlthemes/${id}`
    }),
    getControlThemes: build.query({
      query: () => `controlthemes`,
      providesTags: result =>
        result
          ? // successful query
            [
              ...result.map(({ id }) => ({ type: 'ControlTheme', id })),
              { type: 'ControlTheme', id: 'LIST' },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'ControlTheme', id: 'LIST' }` is invalidated
            [{ type: 'ControlTheme', id: 'LIST' }]
    })
  }),
})

export const { useGetControlThemesQuery } = controlThemesAPI