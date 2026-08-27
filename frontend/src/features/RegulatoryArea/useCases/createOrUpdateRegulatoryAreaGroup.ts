import { regulatoryAreasAPI } from '@api/regulatoryAreasAPI'
import { addBackOfficeBanner } from '@features/BackOffice/useCases/addBackOfficeBanner'
import { Level } from '@mtes-mct/monitor-ui'

import { formatLayerName } from '../utils'

import type { RegulatoryArea } from '../types'
import type { HomeAppThunk } from '@store/index'

export const createOrUpdateRegulatoryAreaGroup =
  (
    regulatoryAreaGroup: RegulatoryArea.RegulatoryAreaGroupToApi
  ): HomeAppThunk<Promise<RegulatoryArea.RegulatoryAreaGroup | undefined>> =>
  async dispatch => {
    try {
      const response = await dispatch(
        regulatoryAreasAPI.endpoints.saveRegulatoryAreaGroup.initiate(regulatoryAreaGroup)
      )
      if ('data' in response) {
        dispatch(
          addBackOfficeBanner({
            children: `Le groupe de réglementations "${formatLayerName(
              regulatoryAreaGroup.layerName,
              regulatoryAreaGroup.location
            )}" a bien été enregistré.`,
            isClosable: true,
            isFixed: true,
            level: Level.SUCCESS,
            withAutomaticClosing: true
          })
        )

        return response.data
      }
      if ('error' in response) {
        dispatch(
          addBackOfficeBanner({
            children: `Nous n'avons pas pu enregistrer la groupe de réglementations "${regulatoryAreaGroup.layerName} ${regulatoryAreaGroup.location}".`,
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
          children: `Nous n'avons pas pu enregistrer la groupe de réglementations "${regulatoryAreaGroup.layerName} ${regulatoryAreaGroup.location}".`,
          isClosable: true,
          isFixed: true,
          level: Level.ERROR,
          withAutomaticClosing: true
        })
      )
    }

    return undefined
  }
