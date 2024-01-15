import { REGULATORY_ZONES_ERROR_MESSAGE, regulatoryLayersAPI } from '../../../api/regulatoryLayersAPI'
import { setToast } from '../../shared_slices/Global'
import { setRegulatoryLayers } from '../../shared_slices/Regulatory'

import type { HomeAppThunk } from '../../../store'

export const loadRegulatoryData = (): HomeAppThunk => async dispatch => {
  try {
    const layersRequest = dispatch(regulatoryLayersAPI.endpoints.getRegulatoryLayers.initiate({}))
    const layersResponse = await layersRequest.unwrap()
    if (!layersResponse) {
      throw Error()
    }

    dispatch(setRegulatoryLayers(layersResponse))
  } catch {
    dispatch(setToast({ message: REGULATORY_ZONES_ERROR_MESSAGE }))
  }
}
