import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const infractionsAPI = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/bff/v1' }),
  reducerPath: 'natinfs',
  endpoints: (build) => ({
    getInfractions: build.query({
      query: () => `natinfs`,
      providesTags: result =>
        result
          ? // successful query
            [
              ...result.map(({ id }) => ({ type: 'Natinfs', id })),
              { type: 'Natinfs', id: 'LIST' },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Natinfs', id: 'LIST' }` is invalidated
            [{ type: 'Natinfs', id: 'LIST' }]
    })
  }),
})

export const { useGetInfractionsQuery } = infractionsAPI