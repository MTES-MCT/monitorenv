import { tagsAPI } from '@api/tagsAPI'
import { addBackOfficeBanner } from '@features/BackOffice/useCases/addBackOfficeBanner'
import { Level } from '@mtes-mct/monitor-ui'

import type { TagFromAPI, TagToAPI } from '../../../../domain/entities/tags'
import type { HomeAppThunk } from '@store/index'

export const saveTag =
  (tag: TagToAPI): HomeAppThunk<Promise<TagFromAPI | undefined>> =>
  async dispatch => {
    const { data, error } = await dispatch(tagsAPI.endpoints.saveTag.initiate(tag))
    if (data) {
      dispatch(
        addBackOfficeBanner({
          children: 'Le tag a bien été enregistré',
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
          children: "Le tag n'a pas pu être enregistré",
          isClosable: true,
          isFixed: true,
          level: Level.ERROR,
          withAutomaticClosing: true
        })
      )
    }

    return data
  }
