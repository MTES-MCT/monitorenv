import { getAllRegulatoryLayersFromAPI } from '../../api/fetch'
import { setError } from '../shared_slices/Global'
import { setRegulatoryLayers } from '../shared_slices/Regulatory'

export const loadRegulatoryData = () => async (dispatch, getState) => {

  return getAllRegulatoryLayersFromAPI(getState().global.inBackofficeMode)
    .then(features => {
      console.log(features)
      return dispatch(setRegulatoryLayers(features))
    })
    .catch(error => {
      console.error(error)
      dispatch(setError(error))
    })
}

