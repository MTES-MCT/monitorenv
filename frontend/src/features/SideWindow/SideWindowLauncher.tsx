import { NewWindow, useForceUpdate } from '@mtes-mct/monitor-ui'
import { MutableRefObject, useCallback, useEffect, useMemo, useRef } from 'react'
import { StyleSheetManager } from 'styled-components'

import { SideWindow } from '.'
import { setMultiMissionsState } from '../../domain/shared_slices/MultiMissionsState'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { editMissionPageRoute, newMissionPageRoute } from '../../utils/isEditOrNewMissionPage'
import { SideWindowStatus, sideWindowActions } from './slice'

export function SideWindowLauncher() {
  const dispatch = useAppDispatch()
  const newWindowRef = useRef() as MutableRefObject<HTMLDivElement>
  const { forceUpdate } = useForceUpdate()

  const {
    missionState,
    multiMissionsState: { multiMissionsState },
    sideWindow
  } = useAppSelector(state => state)
  const isEditMissionPage = !!editMissionPageRoute(sideWindow.currentPath)

  const isCreateMissionPage = !!newMissionPageRoute(sideWindow.currentPath)

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

  const isMissionsFormsAreDirty = useMemo(
    () => !!multiMissionsState.find(mission => mission.isFormDirty),
    [multiMissionsState]
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
          dispatch(setMultiMissionsState([]))
        }}
        shouldHaveFocus={sideWindow.status === SideWindowStatus.VISIBLE}
        showPrompt={(isEditMissionPage || isCreateMissionPage) && (isMissionsFormsAreDirty || missionState.isFormDirty)}
        title="MonitorEnv"
      >
        <SideWindow ref={newWindowRef} />
      </NewWindow>
    </StyleSheetManager>
  )
}
