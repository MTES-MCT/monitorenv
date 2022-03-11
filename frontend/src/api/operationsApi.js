import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const operationsApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8880/bff/v1' }),
  reducerPath: 'operations',
  endpoints: (build) => ({
    getOperation: build.query({
      query: ({id}) => `operation/${id}`
    }),
    getOperations: build.query({
      query: () => `operations`,
      providesTags: result =>
        result
          ? // successful query
            [
              ...result.map(({ id }) => ({ type: 'Operations', id })),
              { type: 'Operations', id: 'LIST' },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Operations', id: 'LIST' }` is invalidated
            [{ type: 'Operations', id: 'LIST' }]
    }),
    updateOperation: build.mutation({
      query: ({ id, ...patch }) => ({
        url: `operations/${id}`,
        method: 'PUT',
        body: {id, ...patch},
      }),
      transformResponse: (response,) => response.data,
      invalidatesTags: ['Operations'],
      // onQueryStarted is useful for optimistic updates
      // The 2nd parameter is the destructured `MutationLifecycleApi`
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          operationsApi.util.updateQueryData('getOperation', id, (draft) => {
            Object.assign(draft, patch)
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()

        }
      },
    }),
  }),
})

export const { useGetOperationsQuery, useUpdateOperationMutation } = operationsApi