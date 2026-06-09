import { missionTagsAPI } from '@api/missionTagsAPI'
import { addBackOfficeBanner } from '@features/BackOffice/useCases/addBackOfficeBanner'
import { Level } from '@mtes-mct/monitor-ui'

import type { MissionTagFromAPI, MissionTagToAPI } from '../../../../domain/entities/missionTags'
import type { HomeAppThunk } from '@store/index'

export const saveMissionTag =
  (tag: MissionTagToAPI): HomeAppThunk<Promise<MissionTagFromAPI | undefined>> =>
  async dispatch => {
    const { data, error } = await dispatch(missionTagsAPI.endpoints.saveMissionTag.initiate(tag))
    if (data) {
      dispatch(
        addBackOfficeBanner({
          children: "L'étiquette de mission a bien été enregistrée",
          isClosable: true,
          isFixed: true,
          level: Level.SUCCESS,
          withAutomaticClosing: true
        })
      )
    }
    if (error) {
      dispatch(
        addBackOfficeBanner({
          children: "L'étiquette de mission n'a pas pu être enregistrée",
          isClosable: true,
          isFixed: true,
          level: Level.ERROR,
          withAutomaticClosing: true
        })
      )
    }

    return data
  }
