import { getAllRegulatoryLayersFromAPI } from '../../api/regulatoryLayersAPI'
import { setError } from '../shared_slices/Global'
import { setRegulatoryLayers } from '../shared_slices/Regulatory'

export const loadRegulatoryData = () => async (dispatch, getState) => {

  return getAllRegulatoryLayersFromAPI(getState().global.inBackofficeMode)
    .then(features => {
      return dispatch(setRegulatoryLayers(features))
    })
    .catch(error => {
      console.error(error)
      dispatch(setError(error))
    })
}

