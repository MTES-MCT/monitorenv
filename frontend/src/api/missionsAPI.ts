import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import type { Mission } from '../domain/entities/missions'

type MissionsResponse = Mission[]
type MissionsFilter = {
  missionNature?: string[]
  missionStatus?: string[]
  missionTypes?: string[]
  startedAfterDateTime?: string
  startedBeforeDateTime?: string
}

const getStartDateFilter = startedAfterDateTime =>
  startedAfterDateTime && `startedAfterDateTime=${encodeURIComponent(startedAfterDateTime)}`
const getEndDateFilter = startedBeforeDateTime =>
  startedBeforeDateTime && `startedBeforeDateTime=${encodeURIComponent(startedBeforeDateTime)}`
const getMissionNatureFilter = missionNature =>
  missionNature && missionNature?.length > 0 && `missionNature=${encodeURIComponent(missionNature)}`
const getMissionStatusFilter = missionStatus =>
  missionStatus && missionStatus?.length > 0 && `missionStatus=${encodeURIComponent(missionStatus)}`
const getMissionTypesFilter = missionTypes =>
  missionTypes && missionTypes?.length > 0 && `missionTypes=${encodeURIComponent(missionTypes)}`

export const missionsAPI = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/bff/v1' }),
  endpoints: build => ({
    createMission: build.mutation<Mission, Partial<Mission>>({
      invalidatesTags: [{ id: 'LIST', type: 'Missions' }],
      query: mission => ({
        body: mission,
        method: 'PUT',
        url: `missions`
      })
    }),
    deleteMission: build.mutation({
      invalidatesTags: [{ id: 'LIST', type: 'Missions' }],
      query: ({ id }) => ({
        method: 'DELETE',
        url: `missions/${id}`
      })
    }),
    getMission: build.query<Mission, number>({
      query: id => `missions/${id}`
    }),
    getMissions: build.query<MissionsResponse, MissionsFilter | void>({
      providesTags: result =>
        result
          ? // successful query
            [...result.map(({ id }) => ({ id, type: 'Missions' as const })), { id: 'LIST', type: 'Missions' }]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Missions', id: 'LIST' }` is invalidated
            [{ id: 'LIST', type: 'Missions' }],
      query: filter =>
        [
          'missions?',
          getStartDateFilter(filter?.startedAfterDateTime),
          getEndDateFilter(filter?.startedBeforeDateTime),
          getMissionNatureFilter(filter?.missionNature),
          getMissionStatusFilter(filter?.missionStatus),
          getMissionTypesFilter(filter?.missionTypes)
        ]
          .filter(v => v)
          .join('&')
    }),
    updateMission: build.mutation<Mission, Mission>({
      invalidatesTags: [{ id: 'LIST', type: 'Missions' }],
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
  reducerPath: 'missions',
  tagTypes: ['Missions']
})

export const {
  useCreateMissionMutation,
  useDeleteMissionMutation,
  useGetMissionQuery,
  useGetMissionsQuery,
  useUpdateMissionMutation
} = missionsAPI
