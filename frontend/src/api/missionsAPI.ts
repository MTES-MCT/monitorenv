import { monitorenvPrivateApi, monitorenvPublicApi } from './api'
import { ApiErrorCode } from './types'
import { ControlUnit } from '../domain/entities/controlUnit'
import { MissionSourceEnum, type Mission, type MissionData } from '../domain/entities/missions'
import { FrontendApiError } from '../libs/FrontendApiError'

const CAN_DELETE_MISSION_ERROR_MESSAGE = "Nous n'avons pas pu vérifier si cette mission est supprimable."

type MissionsResponse = Mission[]
type MissionsFilter = {
  missionSource?: string
  missionStatus?: string[]
  missionTypes?: string[]
  seaFronts?: string[]
  startedAfterDateTime?: string
  startedBeforeDateTime?: string
}

type CanDeleteMissionResponseType = {
  canDelete: boolean
  sources: MissionSourceEnum[]
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
    canDeleteMission: builder.query<CanDeleteMissionResponseType, number>({
      forceRefetch: () => true,
      query: id => ({
        method: 'GET',
        url: `/v1/missions/${id}/can_delete?source=${MissionSourceEnum.MONITORENV}`
      }),
      transformErrorResponse: error => new FrontendApiError(CAN_DELETE_MISSION_ERROR_MESSAGE, error),
      transformResponse: (response: CanDeleteMissionResponseType) => {
        // this means that the api to get fish actions is not responding correctly.
        if (!response.canDelete && response.sources.length === 0) {
          throw new FrontendApiError(CAN_DELETE_MISSION_ERROR_MESSAGE, {
            data: {
              code: ApiErrorCode.EXISTING_MISSION_ACTION,
              data: response,
              type: ApiErrorCode.EXISTING_MISSION_ACTION
            },
            status: 'FETCH_ERROR'
          })
        }

        return response
      }
    }),
    createMission: builder.mutation<Mission, MissionData>({
      invalidatesTags: (_, __, { attachedReportingIds = [] }) => [
        { id: 'LIST', type: 'Missions' },
        { id: 'LIST', type: 'Reportings' },
        ...attachedReportingIds.map(reportingId => ({ id: reportingId, type: 'Reportings' as const }))
      ],
      query: mission => ({
        body: mission,
        method: 'PUT',
        url: `/v1/missions`
      })
    }),
    deleteMission: builder.mutation({
      invalidatesTags: [
        { id: 'LIST', type: 'Missions' },
        { id: 'LIST', type: 'Reportings' }
      ],
      query: ({ id }) => ({
        method: 'DELETE',
        url: `/v1/missions/${id}`
      })
    }),
    getMission: builder.query<Mission, number>({
      providesTags: (_, __, id) => [{ id, type: 'Missions' }],
      query: id => `/v1/missions/${id}`
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
    updateMission: builder.mutation<Mission, MissionData>({
      invalidatesTags: (_, __, { attachedReportingIds = [], detachedReportingIds = [], id }) => [
        { id, type: 'Missions' },
        { id: 'LIST', type: 'Missions' },
        { id: 'LIST', type: 'Reportings' },
        ...attachedReportingIds.map(reportingId => ({ id: reportingId, type: 'Reportings' as const })),
        ...detachedReportingIds.map(reportingId => ({ id: reportingId, type: 'Reportings' as const }))
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
    getEngagedControlUnits: builder.query<Array<ControlUnit.EngagedControlUnit>, void>({
      forceRefetch: () => true,
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
