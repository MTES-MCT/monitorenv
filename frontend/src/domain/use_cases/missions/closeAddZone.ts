import { resetInteraction } from '../../shared_slices/Draw'
import { closeDrawLayerModal } from './addZone'

export const closeAddZone = () => dispatch => {
  dispatch(closeDrawLayerModal)
  dispatch(resetInteraction())
}
