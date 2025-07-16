import { saveVigilanceArea } from '@features/VigilanceArea/useCases/saveVigilanceArea'
import { customDayjs } from '@mtes-mct/monitor-ui'

import { VigilanceArea } from '../types'

import type { HomeAppThunk } from '@store/index'

export const publish =
  (values: VigilanceArea.VigilanceArea): HomeAppThunk =>
  async dispatch => {
    dispatch(saveVigilanceArea({ ...values, isDraft: false, validatedAt: customDayjs().utc().toISOString() }, true))
  }
