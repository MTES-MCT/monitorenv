import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const controlResourcesAPI = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/bff/v1' }),
  endpoints: build => ({
    getControlResources: build.query({
      providesTags: result =>
        result
          ? // successful query
            [...result.map(({ id }) => ({ id, type: 'ControlResources' })), { id: 'LIST', type: 'ControlResources' }]
          : // an error occurred, but we still want to refetch this query when `{ type: 'ControlResources', id: 'LIST' }` is invalidated
            [{ id: 'LIST', type: 'ControlResources' }],
      query: () => `controlresources`
    })
  }),
  reducerPath: 'controlResources'
})

export const { useGetControlResourcesQuery } = controlResourcesAPI
