import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { setReportingFormVisibility } from '../../../domain/shared_slices/Global'
import { ReportingFormVisibility } from '../../../domain/shared_slices/ReportingState'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { useClickOutsideWhenOpened } from '../../../hooks/useClickOutsideWhenOpened'

export function RightMenuOnHoverArea() {
  const dispatch = useDispatch()
  const { reportingFormVisibility } = useAppSelector(state => state.global)

  const isReportingFormVisible =
    reportingFormVisibility === ReportingFormVisibility.VISIBLE ||
    reportingFormVisibility === ReportingFormVisibility.VISIBLE_LEFT

  const areaRef = useRef(null)

  const clickedOutsideComponent = useClickOutsideWhenOpened(areaRef, isReportingFormVisible)
  useEffect(() => {
    if (clickedOutsideComponent && reportingFormVisibility === ReportingFormVisibility.VISIBLE_LEFT) {
      dispatch(setReportingFormVisibility(ReportingFormVisibility.VISIBLE))
    }

    // to prevent re-render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickedOutsideComponent])

  const onMouseEnter = () => {
    if (reportingFormVisibility === ReportingFormVisibility.VISIBLE) {
      dispatch(setReportingFormVisibility(ReportingFormVisibility.VISIBLE_LEFT))
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
