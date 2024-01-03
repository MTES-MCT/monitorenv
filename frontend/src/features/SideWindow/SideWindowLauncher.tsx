import { useForceUpdate, NewWindow } from '@mtes-mct/monitor-ui'
import { useCallback, useEffect, useMemo } from 'react'

import { SideWindow } from '.'
import { SideWindowStatus, sideWindowActions } from './slice'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { missionFormsActions } from '../missions/MissionForm/slice'

export function SideWindowLauncher() {
  const dispatch = useAppDispatch()
  const { forceUpdate } = useForceUpdate()

  const selectedMissions = useAppSelector(state => state.missionForms.missions)
  const sideWindow = useAppSelector(state => state.sideWindow)

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
    () => !!Object.values(selectedMissions).find(mission => mission.isFormDirty),
    [selectedMissions]
  )

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
      onUnload={() => {
        dispatch(sideWindowActions.close())
        dispatch(missionFormsActions.resetMissions())
      }}
      shouldHaveFocus={sideWindow.status === SideWindowStatus.VISIBLE}
      showPrompt={hasAtLeastOneMissionFormDirty}
      title="MonitorEnv"
    >
      <SideWindow />
    </NewWindow>
  )
}
