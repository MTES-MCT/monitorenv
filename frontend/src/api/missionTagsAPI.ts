import { FrontendApiError } from '@libs/FrontendApiError'
import { type EntityState } from '@reduxjs/toolkit'

import { monitorenvPrivateApi } from './api'

import type { MissionTagFromAPI, MissionTagToAPI } from '../domain/entities/missionTags'

const GET_MISSIONS_TAGS_ERROR_MESSAGE = "Nous n'avons pas pu récupérer les étiquettes de mission."

export const missionTagsAPI = monitorenvPrivateApi.injectEndpoints({
  endpoints: builder => ({
    getMissionsTags: builder.query<EntityState<MissionTagFromAPI, number>, void>({
      query: () => `/v1/missions/tags`,
      transformErrorResponse: response => new FrontendApiError(GET_MISSIONS_TAGS_ERROR_MESSAGE, response)
    }),
    getUnarchivedMissionsTags: builder.query<EntityState<MissionTagFromAPI, number>, void>({
      query: () => `/v1/missions/tags/unarchived`,
      transformErrorResponse: response => new FrontendApiError(GET_MISSIONS_TAGS_ERROR_MESSAGE, response)
    }),
    saveMissionTag: builder.mutation<MissionTagFromAPI, MissionTagToAPI>({
      query: tag => ({
        body: tag,
        method: 'PUT',
        url: `/v1/missions/tags`
      }),
      transformErrorResponse: response =>
        new FrontendApiError("L'étiquette de mission n'a pas pu être enregistré", response)
    })
  })
})

export const { useGetMissionsTagsQuery, useGetUnarchivedMissionsTagsQuery } = missionTagsAPI
