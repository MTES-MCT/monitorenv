import { vigilanceAreasAPI } from '@api/vigilanceAreasAPI'

import type { VigilanceArea } from '../types'
import type { HomeAppThunk } from '@store/index'

export const saveVigilanceAreaDocuments =
  (documents: VigilanceArea.ImageProps[]): HomeAppThunk =>
  async dispatch => {
    try {
      const response = await dispatch(vigilanceAreasAPI.endpoints.saveVigilanceAreaDocuments.initiate(documents))
      console.log('response', response)
      if ('data' in response) {
        console.log('Documents saved')
      }
    } catch (error) {
      console.error('Error saving documents', error)
    }
  }
