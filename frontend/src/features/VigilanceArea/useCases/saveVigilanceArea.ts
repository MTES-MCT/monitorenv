import { vigilanceAreasAPI } from '@api/vigilanceAreasAPI'
import { addMainWindowBanner } from '@features/MainWindow/useCases/addMainWindowBanner'
import { Level } from '@mtes-mct/monitor-ui'

import { vigilanceAreaActions } from '../slice'
import { VigilanceArea } from '../types'

import type { HomeAppThunk } from '@store/index'

export const saveVigilanceArea =
  (values: VigilanceArea.VigilanceArea, isPublished?: boolean): HomeAppThunk =>
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

        dispatch(vigilanceAreaActions.setEditingVigilanceAreaId(undefined))
        if (isNewVigilanceArea) {
          dispatch(vigilanceAreaActions.setSelectedVigilanceAreaId(vigilanceAreaResponse.id))
        }

        if (isNewVigilanceArea && !isPublished) {
          dispatch(
            addMainWindowBanner({
              children: 'La zone de vigilance a bien été créée',
              isClosable: true,
              isFixed: true,
              level: Level.SUCCESS,
              withAutomaticClosing: true
            })
          )

          return
        }

        if (isPublished) {
          dispatch(
            addMainWindowBanner({
              children: `La zone de vigilance a bien été publiée et est maintenant visible par ${
                isVigilanceAreaPublic ? 'tous' : 'le CACEM'
              }.`,
              closingDelay: 10000,
              isClosable: true,
              isFixed: true,
              level: Level.SUCCESS,
              withAutomaticClosing: true
            })
          )
        }
      }
    } catch (error) {
      dispatch(
        addMainWindowBanner({
          children: `Une erreur est survenue lors de la création/sauvegarde de la zone de vigilance.`,
          closingDelay: 10000,
          isClosable: true,
          isFixed: true,
          level: Level.ERROR,
          withAutomaticClosing: true
        })
      )
    }
  }
