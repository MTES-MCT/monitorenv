import { resetInteraction } from '../../shared_slices/Draw'
import { closeDrawLayerModal } from '../draw/drawGeometry'

export const closeAddZone = () => dispatch => {
  dispatch(closeDrawLayerModal)
  dispatch(resetInteraction())
}
