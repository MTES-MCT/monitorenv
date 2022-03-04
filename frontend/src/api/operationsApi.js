import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
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
              ...result.operations.map(({ id }) => ({ type: 'Posts', id })),
              { type: 'Posts', id: 'LIST' },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{ type: 'Posts', id: 'LIST' }]
    }),
    updateOperation: build.mutation({
      query: ({ id, ...patch }) => ({
        url: `operation/${id}`,
        method: 'PUT',
        body: {operation: {id, ...patch}},
      }),
      transformResponse: (response,) => response.data,
      invalidatesTags: ['Operation'],
      // onQueryStarted is useful for optimistic updates
      // The 2nd parameter is the destructured `MutationLifecycleApi`
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          api.util.updateQueryData('getOperation', id, (draft) => {
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

export const { useGetOperationsQuery, useUpdateOperationMutation } = api