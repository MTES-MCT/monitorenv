import { dashboardActions } from '@features/Dashboard/slice'
import { missionActions } from '@features/Mission/slice'
import { reportingActions } from '@features/Reportings/slice'
import { useForceUpdate, NewWindow } from '@mtes-mct/monitor-ui'
import {
  MapInteractionListenerEnum,
  updateMapInteractionListeners
} from 'domain/use_cases/map/updateMapInteractionListeners'
import { useCallback, useEffect, useMemo } from 'react'

import { SideWindow } from '.'
import { SideWindowStatus, sideWindowActions } from './slice'
import { ReportingContext, VisibilityState, setReportingFormVisibility } from '../../domain/shared_slices/Global'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { mainWindowActions } from '../MainWindow/slice'
import { missionFormsActions } from '../Mission/components/MissionForm/slice'

export function SideWindowLauncher() {
  const dispatch = useAppDispatch()
  const { forceUpdate } = useForceUpdate()

  const missions = useAppSelector(state => state.missionForms.missions)
  const activeMissionId = useAppSelector(state => state.missionForms.activeMissionId)
  const selectedMissionIdOnMap = useAppSelector(state => state.mission.selectedMissionIdOnMap)
  const reportings = useAppSelector(state => state.reporting.reportings)
  const dashboards = useAppSelector(state => state.dashboard.dashboards)
  const sideWindowStatus = useAppSelector(state => state.sideWindow.status)
  const reportingFormVisibility = useAppSelector(state => state.global.visibility.reportingFormVisibility)

  const reportingsOpenOnSideWindow = useMemo(
    () => Object.values(reportings).filter(reporting => reporting.context === ReportingContext.SIDE_WINDOW),
    [reportings]
  )
  useEffect(() => {
    forceUpdate()
  }, [forceUpdate])

  const onChangeFocus = useCallback(
    (isFocused: boolean) => {
      const nextStatus = isFocused ? SideWindowStatus.VISIBLE : SideWindowStatus.HIDDEN
      dispatch(sideWindowActions.onChangeStatus(nextStatus))
    },
    [dispatch]
  )

  const hasAtLeastOneMissionFormDirty = useMemo(
    () => Object.values(missions).some(mission => mission.isFormDirty),
    [missions]
  )

  const hasAtLeastOneReportingFormDirty = useMemo(
    () => reportingsOpenOnSideWindow.some(reporting => reporting.isFormDirty),
    [reportingsOpenOnSideWindow]
  )

  const hasAtLeastOneDashboardFormDirty = useMemo(
    () => Object.values(dashboards).some(({ dashboard, unsavedDashboard }) => dashboard !== unsavedDashboard),
    [dashboards]
  )

  const onUnload = useCallback(() => {
    dispatch(sideWindowActions.close())
    dispatch(mainWindowActions.setHasFullHeightRightDialogOpen(false))
    dispatch(reportingActions.resetReportingsOnSideWindow(reportingsOpenOnSideWindow))
    if (activeMissionId === selectedMissionIdOnMap) {
      dispatch(missionActions.resetSelectedMissionIdOnMap())
    }
    dispatch(missionFormsActions.resetMissions())

    dispatch(dashboardActions.resetDashboards())

    dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.NONE))
    if (reportingFormVisibility.context === ReportingContext.SIDE_WINDOW) {
      dispatch(setReportingFormVisibility({ context: ReportingContext.MAP, visibility: VisibilityState.NONE }))
    }
  }, [dispatch, reportingsOpenOnSideWindow, activeMissionId, selectedMissionIdOnMap, reportingFormVisibility])

  const features = useMemo(() => ({ height: 1200, width: window.innerWidth }), [])

  if (sideWindowStatus === SideWindowStatus.CLOSED) {
    onUnload()

    return null
  }

  return (
    <NewWindow
      closeOnUnmount
      copyStyles
      features={features}
      name="MonitorEnv"
      onChangeFocus={onChangeFocus}
      onUnload={onUnload}
      shouldHaveFocus={sideWindowStatus === SideWindowStatus.VISIBLE}
      showPrompt={hasAtLeastOneMissionFormDirty || hasAtLeastOneReportingFormDirty || hasAtLeastOneDashboardFormDirty}
      title="MonitorEnv"
    >
      <SideWindow />
    </NewWindow>
  )
}
