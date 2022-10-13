import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const missionsAPI = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/bff/v1' }),
  endpoints: build => ({
    createMission: build.mutation({
      invalidatesTags: ['Missions'],
      // onQueryStarted is useful for optimistic updates
      // The 2nd parameter is the destructured `MutationLifecycleApi`
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          missionsAPI.util.updateQueryData('getMission', id, draft => {
            Object.assign(draft, patch)
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },

      query: ({ ...create }) => ({
        body: { ...create },
        method: 'PUT',
        url: `missions`
      })
    }),
    deleteMission: build.mutation({
      invalidatesTags: ['Missions'],
      query: ({ id }) => ({
        method: 'DELETE',
        url: `missions/${id}`
      })
    }),
    getMission: build.query({
      query: ({ id }) => `missions/${id}`
    }),
    getMissions: build.query({
      providesTags: result =>
        result
          ? // successful query
            [...result.map(({ id }) => ({ id, type: 'Missions' })), { id: 'LIST', type: 'Missions' }]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Missions', id: 'LIST' }` is invalidated
            [{ id: 'LIST', type: 'Missions' }],
      query: () => `missions`
    }),
    updateMission: build.mutation({
      invalidatesTags: ['Missions'],
      // onQueryStarted is useful for optimistic updates
      // The 2nd parameter is the destructured `MutationLifecycleApi`
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          missionsAPI.util.updateQueryData('getMission', id, draft => {
            Object.assign(draft, patch)
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },

      query: ({ id, ...patch }) => ({
        body: { id, ...patch },
        method: 'PUT',
        url: `missions/${id}`
      })
    })
  }),
  reducerPath: 'missions'
})

export const { useCreateMissionMutation, useDeleteMissionMutation, useGetMissionsQuery, useUpdateMissionMutation } =
  missionsAPI
