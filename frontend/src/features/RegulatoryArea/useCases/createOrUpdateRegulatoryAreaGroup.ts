import { regulatoryAreasAPI } from '@api/regulatoryAreasAPI'
import { addBackOfficeBanner } from '@features/BackOffice/useCases/addBackOfficeBanner'
import { Level } from '@mtes-mct/monitor-ui'

import type { RegulatoryArea } from '../types'
import type { HomeAppThunk } from '@store/index'

export const createOrUpdateRegulatoryAreaGroup =
  (regulatoryAreaGroup: RegulatoryArea.RegulatoryAreaGroupToApi): HomeAppThunk =>
  async dispatch => {
    try {
      const response = await dispatch(
        regulatoryAreasAPI.endpoints.saveRegulatoryAreaGroup.initiate(regulatoryAreaGroup)
      )
      if ('data' in response) {
        dispatch(
          addBackOfficeBanner({
            children: `Le groupe de réglementations "${regulatoryAreaGroup.type} ${regulatoryAreaGroup.place}" a bien été enregistré.`,
            isClosable: true,
            isFixed: true,
            level: Level.SUCCESS,
            withAutomaticClosing: true
          })
        )
      }
    } catch (error) {
      dispatch(
        addBackOfficeBanner({
          children: `Nous n'avons pas pu enregistrer la groupe de réglementations "${regulatoryAreaGroup.type} ${regulatoryAreaGroup.place}".`,
          isClosable: true,
          isFixed: true,
          level: Level.ERROR,
          withAutomaticClosing: true
        })
      )
    }
  }
