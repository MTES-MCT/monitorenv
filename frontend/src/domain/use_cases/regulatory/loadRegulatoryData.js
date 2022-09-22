import { getAllRegulatoryLayersFromAPI } from '../../../api/regulatoryLayersAPI'
import { setError } from '../../shared_slices/Global'
import { setRegulatoryLayers } from '../../shared_slices/Regulatory'

export const loadRegulatoryData = () => async dispatch =>
  getAllRegulatoryLayersFromAPI()
    .then(features => dispatch(setRegulatoryLayers(features)))
    .catch(error => {
      console.error(error)
      dispatch(setError(error))
    })
