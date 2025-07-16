import { saveVigilanceArea } from '@features/VigilanceArea/useCases/saveVigilanceArea'

import { VigilanceArea } from '../types'

import type { HomeAppThunk } from '@store/index'

export const unpublish =
  (values: VigilanceArea.VigilanceArea): HomeAppThunk =>
  async dispatch => {
    dispatch(saveVigilanceArea({ ...values, isDraft: true }, false))
  }
