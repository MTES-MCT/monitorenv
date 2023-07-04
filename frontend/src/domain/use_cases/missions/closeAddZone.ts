import { closeDrawLayerModal } from './addZone'
import { resetInteraction } from '../../shared_slices/Draw'

export const closeAddZone = () => dispatch => {
  dispatch(closeDrawLayerModal)
  dispatch(resetInteraction())
}
