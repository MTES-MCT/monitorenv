import { keepOnlyInitialGeometriesOfMultiGeometry } from '../../entities/layers'
import { setGeometry } from '../../shared_slices/Draw'

export const eraseDrawedGeometries = initialFeatureNumber => (dispatch, getState) => {
  const { geometry } = getState().draw
  if (!geometry) {
    return
  }

  const nextGeometry = keepOnlyInitialGeometriesOfMultiGeometry(geometry, initialFeatureNumber)
  if (nextGeometry) {
    dispatch(setGeometry(nextGeometry))
  }
}
