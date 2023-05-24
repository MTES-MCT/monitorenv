import { resetSelectedSemaphore, setSelectedSemaphore } from '../../shared_slices/SemaphoresState'

export const selectSemaphoreOnMap = semaphoreId => dispatch => {
  dispatch(setSelectedSemaphore(semaphoreId))
}

export const clearSelectedSemaphoreOnMap = () => dispatch => {
  dispatch(resetSelectedSemaphore())
}
