import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const infractionsAPI = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/bff/v1' }),
  reducerPath: 'infractions',
  endpoints: (build) => ({
    getInfractions: build.query({
      query: () => `infractions`,
      providesTags: result =>
        result
          ? // successful query
            [
              ...result.map(({ id }) => ({ type: 'Infractions', id })),
              { type: 'Infractions', id: 'LIST' },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Infractions', id: 'LIST' }` is invalidated
            [{ type: 'Infractions', id: 'LIST' }]
    })
  }),
})

export const { useGetInfractionsQuery } = infractionsAPI