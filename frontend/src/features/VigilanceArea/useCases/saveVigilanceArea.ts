import { vigilanceAreasAPI } from '@api/vigilanceAreasAPI'
import { addMainWindowBanner } from '@features/MainWindow/useCases/addMainWindowBanner'
import { Level } from '@mtes-mct/monitor-ui'

import { vigilanceAreaActions } from '../slice'
import { VigilanceArea } from '../types'

import type { HomeAppThunk } from '@store/index'

export const saveVigilanceArea =
  (values: VigilanceArea.VigilanceArea): HomeAppThunk =>
  async dispatch => {
    const isNewVigilanceArea = !values.id
    const vigilanceAreaEnpoint = isNewVigilanceArea
      ? vigilanceAreasAPI.endpoints.createVigilanceArea
      : vigilanceAreasAPI.endpoints.updateVigilanceArea
    try {
      const response = await dispatch(vigilanceAreaEnpoint.initiate(values))

      if ('data' in response) {
        const vigilanceAreaResponse = response.data as VigilanceArea.VigilanceArea
        const isVigilanceAreaPublic = vigilanceAreaResponse.visibility === VigilanceArea.Visibility.PUBLIC

        if (isNewVigilanceArea) {
          dispatch(
            addMainWindowBanner({
              children: `La zone de vigilance a bien été publiée et est maintenant visible par ${
                isVigilanceAreaPublic ? 'tous' : 'par le CACEM'
              }.`,
              isClosable: true,
              isFixed: true,
              level: Level.SUCCESS,
              withAutomaticClosing: true
            })
          )
        }

        dispatch(vigilanceAreaActions.setFormTypeOpen())
      }
    } catch (error) {
      dispatch(
        addMainWindowBanner({
          children: `Une erreur est survenue lors de la création/sauvegarde de la zone de vigilance.`,
          isClosable: true,
          isFixed: true,
          level: Level.ERROR,
          withAutomaticClosing: true
        })
      )
    }
  }
