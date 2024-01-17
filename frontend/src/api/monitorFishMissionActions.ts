import { monitorFishPublicApi } from './api'

export const monitorFishMissionActions = monitorFishPublicApi.injectEndpoints({
  endpoints: builder => ({
    getFishMissionActions: builder.query<any, number>({
      query: missionId => `/v1/mission_actions/${missionId}`
    })
  })
})

export const { useGetFishMissionActionsQuery } = monitorFishMissionActions
