import { monitorenvPublicApi, monitorenvPrivateApi } from './api'
import { ControlUnit } from '../domain/entities/controlUnit'

import type { Mission, MissionForApi } from '../domain/entities/missions'

type MissionsResponse = Mission[]
type MissionsFilter = {
  missionSource?: string
  missionStatus?: string[]
  missionTypes?: string[]
  seaFronts?: string[]
  startedAfterDateTime?: string
  startedBeforeDateTime?: string
}

const getStartDateFilter = startedAfterDateTime =>
  startedAfterDateTime && `startedAfterDateTime=${encodeURIComponent(startedAfterDateTime)}`
const getEndDateFilter = startedBeforeDateTime =>
  startedBeforeDateTime && `startedBeforeDateTime=${encodeURIComponent(startedBeforeDateTime)}`
const getMissionSourceFilter = missionSource => missionSource && `missionSource=${encodeURIComponent(missionSource)}`
const getMissionStatusFilter = missionStatus =>
  missionStatus && missionStatus?.length > 0 && `missionStatus=${encodeURIComponent(missionStatus)}`
const getMissionTypesFilter = missionTypes =>
  missionTypes && missionTypes?.length > 0 && `missionTypes=${encodeURIComponent(missionTypes)}`
const getSeaFrontsFilter = seaFronts =>
  seaFronts && seaFronts?.length > 0 && `seaFronts=${encodeURIComponent(seaFronts)}`

export const missionsAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: builder => ({
    createMission: builder.mutation<Mission, MissionForApi>({
      invalidatesTags: [
        { id: 'LIST', type: 'Missions' },
        { id: 'LIST', type: 'Reportings' }
      ],
      query: mission => ({
        body: mission,
        method: 'PUT',
        url: `missions`
      })
    }),
    deleteMission: builder.mutation({
      invalidatesTags: [{ id: 'LIST', type: 'Missions' }],
      query: ({ id }) => ({
        method: 'DELETE',
        url: `missions/${id}`
      })
    }),
    getMission: builder.query<Mission, number>({
      providesTags: (_, __, id) => [{ id, type: 'Missions' }],
      query: id => `missions/${id}`
    }),
    getMissions: builder.query<MissionsResponse, MissionsFilter | void>({
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
          getMissionSourceFilter(filter?.missionSource),
          getMissionStatusFilter(filter?.missionStatus),
          getMissionTypesFilter(filter?.missionTypes),
          getSeaFrontsFilter(filter?.seaFronts)
        ]
          .filter(v => v)
          .join('&')
    }),
    updateMission: builder.mutation<Mission, MissionForApi>({
      invalidatesTags: (_, __, { id }) => [
        { id, type: 'Missions' },
        { id: 'LIST', type: 'Missions' }
      ],

      query: ({ id, ...patch }) => ({
        body: { id, ...patch },
        method: 'PUT',
        url: `missions/${id}`
      })
    })
  })
})

export const publicMissionsAPI = monitorenvPublicApi.injectEndpoints({
  endpoints: builder => ({
    getEngagedControlUnits: builder.query<ControlUnit.ControlUnit[], void>({
      query: () => `/v1/missions/engaged_control_units`
    })
  })
})

export const {
  useCreateMissionMutation,
  useDeleteMissionMutation,
  useGetMissionQuery,
  useGetMissionsQuery,
  useUpdateMissionMutation
} = missionsAPI

export const { useGetEngagedControlUnitsQuery } = publicMissionsAPI
