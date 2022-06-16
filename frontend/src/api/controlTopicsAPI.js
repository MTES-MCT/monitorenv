import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const controlTopicsAPI = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/bff/v1' }),
  reducerPath: 'controlTopics',
  endpoints: (build) => ({
    getControlTopic: build.query({
      query: ({id}) => `controltopics/${id}`
    }),
    getControlTopics: build.query({
      query: () => `controltopics`,
      providesTags: result =>
        result
          ? // successful query
            [
              ...result.map(({ id }) => ({ type: 'ControlTopics', id })),
              { type: 'ControlTopics', id: 'LIST' },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'ControlTopics', id: 'LIST' }` is invalidated
            [{ type: 'ControlTopics', id: 'LIST' }]
    })
  }),
})

export const { useGetControlTopicsQuery } = controlTopicsAPI