import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const controlResourcesAPI = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/bff/v1' }),
  reducerPath: 'controlResources',
  endpoints: (build) => ({
    getControlResources: build.query({
      query: () => `controlresources`,
      providesTags: result =>
        result
          ? // successful query
            [
              ...result.map(({ id }) => ({ type: 'ControlResources', id })),
              { type: 'ControlResources', id: 'LIST' },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'ControlResources', id: 'LIST' }` is invalidated
            [{ type: 'ControlResources', id: 'LIST' }]
    })
  }),
})

export const { useGetControlResourcesQuery } = controlResourcesAPI