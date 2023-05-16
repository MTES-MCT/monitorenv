import { setSelectedSemaphore } from '../../shared_slices/Semaphores'

export const selectSemaphoreOnMap = semaphoreId => dispatch => {
  dispatch(setSelectedSemaphore(semaphoreId))
}
