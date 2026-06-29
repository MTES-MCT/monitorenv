import { vesselsApi } from '@api/vesselsApi'
import { addMainWindowBanner } from '@features/MainWindow/useCases/addMainWindowBanner'
import { Vessel } from '@features/Vessel/types'
import { Level } from '@mtes-mct/monitor-ui'

import type { HomeAppThunk } from '@store/index'

export const saveVesselAdditionalInformation =
  (
    vesselId: Vessel.VesselId,
    additionalInformation: Vessel.AdditionalInformation
  ): HomeAppThunk<Promise<Vessel.AdditionalInformation | undefined>> =>
  async dispatch => {
    const { data, error } = await dispatch(
      vesselsApi.endpoints.saveVesselAdditionalInformation.initiate({ additionalInformation, vesselId })
    )
    if (error) {
      dispatch(
        addMainWindowBanner({
          children: "Les informations additionelles n'ont pu être enregistré",
          isClosable: true,
          isFixed: true,
          level: Level.ERROR,
          withAutomaticClosing: true
        })
      )
    }

    return data
  }
