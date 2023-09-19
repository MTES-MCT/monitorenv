import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { setReportingFormVisibility, ReportingContext, VisibilityState } from '../../../domain/shared_slices/Global'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { useClickOutsideWhenOpened } from '../../../hooks/useClickOutsideWhenOpened'

export function RightMenuOnHoverArea() {
  const dispatch = useDispatch()
  const {
    reportingFormVisibility: { context, visibility }
  } = useAppSelector(state => state.global)

  const isReportingFormVisible = visibility === VisibilityState.VISIBLE || visibility === VisibilityState.VISIBLE_LEFT

  const areaRef = useRef(null)

  const clickedOutsideComponent = useClickOutsideWhenOpened(areaRef, isReportingFormVisible)
  useEffect(() => {
    if (clickedOutsideComponent && context === ReportingContext.MAP && visibility === VisibilityState.VISIBLE_LEFT) {
      dispatch(
        setReportingFormVisibility({
          context: ReportingContext.MAP,
          visibility: VisibilityState.VISIBLE
        })
      )
    }

    // to prevent re-render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickedOutsideComponent])

  const onMouseEnter = () => {
    if (context === ReportingContext.MAP && visibility === VisibilityState.VISIBLE) {
      dispatch(
        setReportingFormVisibility({
          context: ReportingContext.MAP,
          visibility: VisibilityState.VISIBLE_LEFT
        })
      )
    }
  }

  return isReportingFormVisible ? <Area ref={areaRef} onMouseEnter={onMouseEnter} /> : null
}

const Area = styled.div`
  height: 500px;
  right: 0;
  width: 60px;
  opacity: 0;
  position: absolute;
  top: 56px;
`
