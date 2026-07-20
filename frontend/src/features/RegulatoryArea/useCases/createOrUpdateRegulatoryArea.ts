import { regulatoryAreasAPI } from '@api/regulatoryAreasAPI'
import { addBackOfficeBanner } from '@features/BackOffice/useCases/addBackOfficeBanner'
import { customDayjs, Level } from '@mtes-mct/monitor-ui'

import { regulatoryAreaBoActions } from '../slice'

import type { RegulatoryArea } from '../types'
import type { HomeAppThunk } from '@store/index'

export const createOrUpdateRegulatoryArea =
  (
    regulatoryArea: RegulatoryArea.RegulatoryAreaFromAPI
  ): HomeAppThunk<Promise<RegulatoryArea.RegulatoryAreaFromAPI | undefined>> =>
  async dispatch => {
    const regulatoryAreaEndpoint = regulatoryAreasAPI.endpoints.saveRegulatoryArea
    try {
      const currentDate = customDayjs().toISOString()
      const regulatoryAreaToSave = {
        ...regulatoryArea,
        creation: regulatoryArea.creation ? regulatoryArea.creation : currentDate,
        editionBo: currentDate
      }

      const response = await dispatch(regulatoryAreaEndpoint.initiate(regulatoryAreaToSave))
      if ('data' in response) {
        dispatch(
          addBackOfficeBanner({
            children: `La zone réglementaire "${regulatoryArea.polyName}" a bien été enregistrée.`,
            isClosable: true,
            isFixed: true,
            level: Level.SUCCESS,
            withAutomaticClosing: true
          })
        )
        dispatch(regulatoryAreaBoActions.setNewRegulatoryAreaId(undefined))

        return response.data
      }
      if ('error' in response) {
        dispatch(
          addBackOfficeBanner({
            children: `Nous n'avons pas pu enregistrer la zone réglementaire "${regulatoryArea.polyName}".`,
            isClosable: true,
            isFixed: true,
            level: Level.ERROR,
            withAutomaticClosing: true
          })
        )
      }
    } catch (error) {
      dispatch(
        addBackOfficeBanner({
          children: `Nous n'avons pas pu enregistrer la zone réglementaire "${regulatoryArea.polyName}".`,
          isClosable: true,
          isFixed: true,
          level: Level.ERROR,
          withAutomaticClosing: true
        })
      )
    }

    return undefined
  }
