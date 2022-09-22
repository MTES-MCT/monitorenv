import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const infractionsAPI = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/bff/v1' }),
  endpoints: build => ({
    getInfractions: build.query({
      providesTags: result =>
        result
          ? // successful query
            [...result.map(({ id }) => ({ id, type: 'Natinfs' })), { id: 'LIST', type: 'Natinfs' }]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Natinfs', id: 'LIST' }` is invalidated
            [{ id: 'LIST', type: 'Natinfs' }],
      query: () => `natinfs`
    })
  }),
  reducerPath: 'natinfs'
})

export const { useGetInfractionsQuery } = infractionsAPI
