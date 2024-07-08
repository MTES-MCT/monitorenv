import { vigilanceAreasAPI } from '@api/vigilanceAreasAPI'
import { addMainWindowBanner } from '@features/MainWindow/useCases/addMainWindowBanner'
import { Level } from '@mtes-mct/monitor-ui'

import { vigilanceAreaActions } from '../slice'

import type { HomeAppThunk } from '@store/index'

export const deleteVigilanceArea =
  (id: number): HomeAppThunk =>
  async (dispatch, getState) => {
    const { editingVigilanceAreaId, selectedVigilanceAreaId } = getState().vigilanceArea

    const vigilanceAreaEnpoint = vigilanceAreasAPI.endpoints.deleteVigilanceArea
    try {
      const response = await dispatch(vigilanceAreaEnpoint.initiate(id))

      if ('data' in response) {
        dispatch(
          addMainWindowBanner({
            children: 'La zone de vigilance a bien été supprimée',
            isClosable: true,
            isFixed: true,
            level: Level.SUCCESS,
            withAutomaticClosing: true
          })
        )

        if (selectedVigilanceAreaId === editingVigilanceAreaId) {
          dispatch(vigilanceAreaActions.resetState())

          return
        }

        if (id === editingVigilanceAreaId) {
          dispatch(vigilanceAreaActions.setEditingVigilanceAreaId(undefined))

          return
        }

        if (id === selectedVigilanceAreaId) {
          dispatch(vigilanceAreaActions.setSelectedVigilanceAreaId(editingVigilanceAreaId))
        }
      }
    } catch (error) {
      dispatch(
        addMainWindowBanner({
          children: 'Une erreur est survenue lors de la suppression',
          isClosable: true,
          isFixed: true,
          level: Level.ERROR,
          withAutomaticClosing: true
        })
      )
    }
  }
