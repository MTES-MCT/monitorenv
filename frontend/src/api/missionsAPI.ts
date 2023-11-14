import { logSoftError } from '@mtes-mct/monitor-ui'
import ReconnectingEventSource from 'reconnecting-eventsource'

import { monitorenvPrivateApi, monitorenvPublicApi } from './api'
import { ControlUnit } from '../domain/entities/controlUnit'

import type { Mission } from '../domain/entities/missions'

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
  endpoints: build => ({
    createMission: build.mutation<Mission, Partial<Mission>>({
      invalidatesTags: [{ id: 'LIST', type: 'Missions' }],
      query: mission => ({
        body: mission,
        method: 'PUT',
        url: `/v1/missions`
      })
    }),
    deleteMission: build.mutation({
      invalidatesTags: [{ id: 'LIST', type: 'Missions' }],
      query: ({ id }) => ({
        method: 'DELETE',
        url: `/v1/missions/${id}`
      })
    }),
    getMission: build.query<Mission, number>({
      async onCacheEntryAdded(id, { cacheDataLoaded, cacheEntryRemoved, updateCachedData }) {
        const url = `/api/v1/missions/${id}/sse`

        try {
          const eventSource = new ReconnectingEventSource(url)
          // eslint-disable-next-line no-console
          console.log(`SSE: listening for updates of mission id ${id}...`)

          // wait for the initial query to resolve before proceeding
          await cacheDataLoaded

          const listener = (event: MessageEvent) => {
            const mission = JSON.parse(event.data) as Mission
            // eslint-disable-next-line no-console
            console.log(`SSE: received an update for mission id ${mission.id}.`)

            updateCachedData(draft => {
              const { envActions } = draft

              return {
                ...mission,
                envActions
              }
            })
          }

          eventSource.addEventListener('MISSION_UPDATE', listener)

          // cacheEntryRemoved will resolve when the cache subscription is no longer active
          await cacheEntryRemoved

          // perform cleanup steps once the `cacheEntryRemoved` promise resolves
          eventSource.close()
        } catch (e) {
          logSoftError({
            context: {
              url
            },
            isSideWindowError: true,
            message: "SSE: Can't connect or receive messages",
            originalError: e
          })
        }
      },
      providesTags: (_, __, id) => [{ id, type: 'Missions' }],
      query: id => `/v1/missions/${id}`
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
          '/v1/missions?',
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
    updateMission: build.mutation<Mission, Mission>({
      invalidatesTags: (_, __, { id }) => [
        { id, type: 'Missions' },
        { id: 'LIST', type: 'Missions' }
      ],

      query: ({ id, ...patch }) => ({
        body: { id, ...patch },
        method: 'PUT',
        url: `/v1/missions/${id}`
      })
    })
  })
})

export const publicMissionsAPI = monitorenvPublicApi.injectEndpoints({
  endpoints: builder => ({
    getEngagedControlUnits: builder.query<ControlUnit.EngagedControlUnits, void>({
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
