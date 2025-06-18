import { reportingActions } from '@features/Reportings/slice'
import { addSideWindowBanner } from '@features/SideWindow/useCases/addSideWindowBanner'
import { Level } from '@mtes-mct/monitor-ui'

import { reportingsAPI } from '../../../api/reportingsAPI'

export const archiveReportings = (ids: number[], resetSelectionFn: () => void) => async (dispatch, getState) => {
  const { reportings } = getState().reporting
  try {
    const response = await dispatch(reportingsAPI.endpoints.archiveReportings.initiate({ ids }))

    if ('error' in response) {
      throw Error("Erreur à l'archivage des signalements")
    } else {
      ids.forEach(id => {
        if (reportings[id]) {
          dispatch(
            reportingActions.setReporting({
              ...reportings[id],
              reporting: {
                ...reportings[id].reporting,
                isArchived: true
              }
            })
          )
        }
      })
      dispatch(
        addSideWindowBanner({
          children: 'Les signalements ont bien été archivés',
          isClosable: true,
          isFixed: true,
          level: Level.SUCCESS,
          withAutomaticClosing: true
        })
      )

      resetSelectionFn()
    }
  } catch (error) {
    dispatch(
      addSideWindowBanner({
        children: error instanceof Error ? error.message : String(error),
        isClosable: true,
        isFixed: true,
        level: Level.ERROR,
        withAutomaticClosing: true
      })
    )
  }
}
