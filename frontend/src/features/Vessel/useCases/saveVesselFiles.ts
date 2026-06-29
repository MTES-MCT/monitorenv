import { vesselsApi } from '@api/vesselsApi'
import { addMainWindowBanner } from '@features/MainWindow/useCases/addMainWindowBanner'
import { Vessel } from '@features/Vessel/types'
import { Level } from '@mtes-mct/monitor-ui'

import type { HomeAppThunk } from '@store/index'

export const saveVesselFiles =
  (vesselId: Vessel.VesselId, files: Vessel.File[]): HomeAppThunk<Promise<Vessel.File[] | undefined>> =>
  async dispatch => {
    const { data, error } = await dispatch(vesselsApi.endpoints.saveVesselFile.initiate({ files, vesselId }))
    if (error) {
      dispatch(
        addMainWindowBanner({
          children: "Le fichier n'ont pu être enregistré",
          isClosable: true,
          isFixed: true,
          level: Level.ERROR,
          withAutomaticClosing: true
        })
      )
    }

    return data
  }
