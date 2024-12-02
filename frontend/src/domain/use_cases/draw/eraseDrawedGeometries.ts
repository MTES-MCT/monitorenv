import { keepOnlyInitialGeometriesOfMultiGeometry } from '../../entities/layers'
import { setGeometry } from '../../shared_slices/Draw'

import type { HomeAppThunk } from '@store/index'

export const eraseDrawedGeometries =
  (initialFeatureNumber?: number): HomeAppThunk =>
  (dispatch, getState) => {
    const { geometry } = getState().draw
    if (!geometry) {
      return
    }

    const nextGeometry = keepOnlyInitialGeometriesOfMultiGeometry(geometry, initialFeatureNumber)
    if (nextGeometry) {
      dispatch(setGeometry(nextGeometry))
    }
  }
