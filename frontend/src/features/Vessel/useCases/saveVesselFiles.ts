import { vesselsApi } from '@api/vesselsApi'
import { addMainWindowBanner } from '@features/MainWindow/useCases/addMainWindowBanner'
import { Vessel } from '@features/Vessel/types'
import { type FileApi, Level } from '@mtes-mct/monitor-ui'

import type { HomeAppThunk } from '@store/index'

export const saveVesselFiles =
  (vesselId: Vessel.VesselId, files: FileApi[]): HomeAppThunk<Promise<FileApi[] | undefined>> =>
  async dispatch => {
    const { data, error } = await dispatch(vesselsApi.endpoints.saveVesselFile.initiate({ files, vesselId }))
    if (error) {
      dispatch(
        addMainWindowBanner({
          children: "Les fichiers n'ont pas pu être enregistrés",
          isClosable: true,
          isFixed: true,
          level: Level.ERROR,
          withAutomaticClosing: true
        })
      )
    }

    return data
  }
