import { resetInteraction } from '../../shared_slices/Draw'
import { closeDrawLayerModal } from './addZone'

export const validateZone = () => dispatch => {
  dispatch(closeDrawLayerModal)
  dispatch(resetInteraction())
}
