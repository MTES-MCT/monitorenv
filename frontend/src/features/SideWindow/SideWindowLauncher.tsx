import { useForceUpdate, NewWindow } from '@mtes-mct/monitor-ui'
import { useCallback, useEffect, useMemo } from 'react'

import { SideWindow } from '.'
import { SideWindowStatus, sideWindowActions } from './slice'
import { ReportingContext, VisibilityState, setReportingFormVisibility } from '../../domain/shared_slices/Global'
import { reportingActions } from '../../domain/shared_slices/reporting'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { mainWindowActions } from '../MainWindow/slice'
import { missionFormsActions } from '../missions/MissionForm/slice'

export function SideWindowLauncher() {
  const dispatch = useAppDispatch()
  const { forceUpdate } = useForceUpdate()

  const missions = useAppSelector(state => state.missionForms.missions)
  const reportings = useAppSelector(state => state.reporting.reportings)
  const sideWindow = useAppSelector(state => state.sideWindow)
  const reportingFormVisibility = useAppSelector(state => state.global.reportingFormVisibility)

  const reportingsOpenOnSideWindow = useMemo(
    () => Object.values(reportings).filter(reporting => reporting.context === ReportingContext.SIDE_WINDOW),
    [reportings]
  )
  useEffect(() => {
    forceUpdate()
  }, [forceUpdate])

  const onChangeFocus = useCallback(
    isFocused => {
      const nextStatus = isFocused ? SideWindowStatus.VISIBLE : SideWindowStatus.HIDDEN
      dispatch(sideWindowActions.onChangeStatus(nextStatus))
    },
    [dispatch]
  )

  const hasAtLeastOneMissionFormDirty = useMemo(
    () => !!Object.values(missions).find(mission => mission.isFormDirty),
    [missions]
  )

  const hasAtLeastOneReportingFormDirty = useMemo(
    () => !!reportingsOpenOnSideWindow.find(reporting => reporting.isFormDirty),
    [reportingsOpenOnSideWindow]
  )

  const onUnload = () => {
    dispatch(sideWindowActions.close())
    dispatch(mainWindowActions.setHasFullHeightRightDialogOpen(false))
    dispatch(reportingActions.resetReportingsOnSideWindow(reportingsOpenOnSideWindow))
    dispatch(missionFormsActions.resetMissions())

    if (reportingFormVisibility.context === ReportingContext.SIDE_WINDOW) {
      dispatch(setReportingFormVisibility({ context: ReportingContext.MAP, visibility: VisibilityState.NONE }))
    }
  }

  if (sideWindow.status === SideWindowStatus.CLOSED) {
    return null
  }

  return (
    <NewWindow
      closeOnUnmount
      copyStyles
      features={{ height: 1200, width: window.innerWidth }}
      name="MonitorEnv"
      onChangeFocus={onChangeFocus}
      onUnload={onUnload}
      shouldHaveFocus={sideWindow.status === SideWindowStatus.VISIBLE}
      showPrompt={hasAtLeastOneMissionFormDirty || hasAtLeastOneReportingFormDirty}
      title="MonitorEnv"
    >
      <SideWindow />
    </NewWindow>
  )
}
