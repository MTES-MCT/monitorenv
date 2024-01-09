import { getAllRegulatoryLayersFromAPI } from '../../../api/regulatoryLayersAPI'
import { setToast } from '../../shared_slices/Global'
import { setRegulatoryLayers } from '../../shared_slices/Regulatory'

import type { HomeAppThunk } from '../../../store'

export const loadRegulatoryData = (): HomeAppThunk => dispatch =>
  getAllRegulatoryLayersFromAPI()
    .then(features => dispatch(setRegulatoryLayers(features)))
    .catch(error => {
      // eslint-disable-next-line no-console
      console.error(error)
      dispatch(setToast({ message: error }))
    })
