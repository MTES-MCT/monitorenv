import { regulatoryAreasAPI } from '@api/regulatoryAreasAPI'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '@features/BackOffice/components/BackofficeMenu/constants'
import { addBackOfficeBanner } from '@features/BackOffice/useCases/addBackOfficeBanner'
import { Level } from '@mtes-mct/monitor-ui'

import type { RegulatoryArea } from '../types'
import type { HomeAppThunk } from '@store/index'
import type { NavigateFunction } from 'react-router'

export const createOrUpdateRegulatoryArea =
  (regulatoryArea: RegulatoryArea.RegulatoryAreaFromAPI, navigate: NavigateFunction): HomeAppThunk =>
  async dispatch => {
    const regulatoryAreaEndpoint = regulatoryAreasAPI.endpoints.saveRegulatoryArea
    try {
      const response = await dispatch(regulatoryAreaEndpoint.initiate(regulatoryArea))
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
        navigate(`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.REGULATORY_AREA_LIST]}`)
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
  }
