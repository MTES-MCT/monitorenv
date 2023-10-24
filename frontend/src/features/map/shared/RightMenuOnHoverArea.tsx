import { useEffect, useRef } from 'react'
import styled from 'styled-components'

import { globalActions, ReportingContext, VisibilityState } from '../../../domain/shared_slices/Global'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { useClickOutsideWhenOpened } from '../../../hooks/useClickOutsideWhenOpened'
import { mainWindowActions } from '../../MainWindow/slice'

// TODO Refactor this entire concept to make it more generic.
export function RightMenuOnHoverArea() {
  const dispatch = useAppDispatch()
  const global = useAppSelector(state => state.global)
  const mainWindow = useAppSelector(state => state.mainWindow)

  const isReportingFormVisible = global.reportingFormVisibility.visibility !== VisibilityState.NONE

  const areaRef = useRef(null)

  const clickedOutsideComponent = useClickOutsideWhenOpened(
    areaRef,
    isReportingFormVisible || global.isControlUnitDialogVisible
  )

  const handleMouseEnter = () => {
    dispatch(mainWindowActions.enterSideMenu())

    if (
      global.reportingFormVisibility.context === ReportingContext.MAP &&
      global.reportingFormVisibility.visibility === VisibilityState.VISIBLE
    ) {
      dispatch(
        globalActions.setReportingFormVisibility({
          context: ReportingContext.MAP,
          visibility: VisibilityState.VISIBLE_LEFT
        })
      )
    }
  }

  const handleMouseLeave = () => {
    dispatch(mainWindowActions.leaveSideMenu())
  }

  useEffect(() => {
    if (
      clickedOutsideComponent &&
      global.reportingFormVisibility.context === ReportingContext.MAP &&
      global.reportingFormVisibility.visibility === VisibilityState.VISIBLE_LEFT
    ) {
      dispatch(
        globalActions.setReportingFormVisibility({
          context: ReportingContext.MAP,
          visibility: VisibilityState.VISIBLE
        })
      )
    }

    // to prevent re-render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickedOutsideComponent])

  return global.isControlUnitDialogVisible || isReportingFormVisible ? (
    <Area
      ref={areaRef}
      $isHovered={mainWindow.isRightMenuHovered}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  ) : null
}

const Area = styled.div<{
  $isHovered: boolean
}>`
  background-color: green;
  height: 500px;
  position: absolute;
  right: 0;
  top: 56px;
  width: ${p => (p.$isHovered ? '60px' : '8px')};
  z-index: ${p => (p.$isHovered ? 0 : 999)};
`
