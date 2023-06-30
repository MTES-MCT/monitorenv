import { NewWindow, useForceUpdate } from '@mtes-mct/monitor-ui'
import { MutableRefObject, useCallback, useEffect, useMemo, useRef } from 'react'
import { StyleSheetManager } from 'styled-components'

import { SideWindow } from '.'
import { multiMissionsActions } from '../../domain/shared_slices/MultiMissions'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { getMissionPageRoute } from '../../utils/getMissionPageRoute'
import { SideWindowStatus, sideWindowActions } from './slice'

export function SideWindowLauncher() {
  const dispatch = useAppDispatch()
  const newWindowRef = useRef() as MutableRefObject<HTMLDivElement>
  const { forceUpdate } = useForceUpdate()

  const {
    missionState,
    multiMissions: { selectedMissions },
    sideWindow
  } = useAppSelector(state => state)
  const routeParams = !!getMissionPageRoute(sideWindow.currentPath)

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
    () => !!selectedMissions.find(mission => mission.isFormDirty),
    [selectedMissions]
  )

  if (sideWindow.status === SideWindowStatus.CLOSED) {
    return null
  }

  return (
    <StyleSheetManager target={newWindowRef.current}>
      <NewWindow
        closeOnUnmount
        copyStyles
        features={{ height: 1200, width: window.innerWidth }}
        name="MonitorEnv"
        onChangeFocus={onChangeFocus}
        onUnload={() => {
          dispatch(sideWindowActions.close())
          dispatch(multiMissionsActions.setSelectedMissions([]))
        }}
        shouldHaveFocus={sideWindow.status === SideWindowStatus.VISIBLE}
        showPrompt={routeParams && (hasAtLeastOneMissionFormDirty || missionState.isFormDirty)}
        title="MonitorEnv"
      >
        <SideWindow ref={newWindowRef} />
      </NewWindow>
    </StyleSheetManager>
  )
}
