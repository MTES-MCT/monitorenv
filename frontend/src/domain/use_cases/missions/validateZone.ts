import { closeDrawLayerModal } from './addZone'
import { resetInteraction } from '../../shared_slices/Draw'

export const validateZone = () => dispatch => {
  dispatch(closeDrawLayerModal)
  dispatch(resetInteraction())
}
