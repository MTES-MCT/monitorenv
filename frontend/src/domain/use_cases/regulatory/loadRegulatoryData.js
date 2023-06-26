import { getAllRegulatoryLayersFromAPI } from '../../../api/regulatoryLayersAPI'
import { setToast } from '../../shared_slices/Global'
import { setRegulatoryLayers } from '../../shared_slices/Regulatory'

export const loadRegulatoryData = () => async dispatch =>
  getAllRegulatoryLayersFromAPI()
    .then(features => dispatch(setRegulatoryLayers(features)))
    .catch(error => {
      // eslint-disable-next-line no-console
      console.error(error)
      dispatch(setToast({ message: error }))
    })
