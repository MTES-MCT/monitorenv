import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const missionsAPI = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/bff/v1' }),
  reducerPath: 'missions',
  endpoints: (build) => ({
    getMission: build.query({
      query: ({id}) => `missions/${id}`
    }),
    getMissions: build.query({
      query: () => `missions`,
      providesTags: result =>
        result
          ? // successful query
            [
              ...result.map(({ id }) => ({ type: 'Missions', id })),
              { type: 'Missions', id: 'LIST' },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Missions', id: 'LIST' }` is invalidated
            [{ type: 'Missions', id: 'LIST' }]
    }),
    updateMission: build.mutation({
      query: ({ id, ...patch }) => ({
        url: `missions/${id}`,
        method: 'PUT',
        body: {id, ...patch},
      }),
      invalidatesTags: ['Missions'],
      // onQueryStarted is useful for optimistic updates
      // The 2nd parameter is the destructured `MutationLifecycleApi`
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          missionsAPI.util.updateQueryData('getMission', id, (draft) => {
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
    createMission: build.mutation({
      query: ({...create}) => ({
        url: `missions`,
        method: 'PUT',
        body: {...create}
      }),
      invalidatesTags: ['Missions'],
      // onQueryStarted is useful for optimistic updates
      // The 2nd parameter is the destructured `MutationLifecycleApi`
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          missionsAPI.util.updateQueryData('getMission', id, (draft) => {
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
    deleteMission: build.mutation({
      query: ({id}) => ({
        url: `missions/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Missions'],
    }),
  }),
})

export const { useCreateMissionMutation, useGetMissionsQuery, useUpdateMissionMutation, useDeleteMissionMutation } = missionsAPI