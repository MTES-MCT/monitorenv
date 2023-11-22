import { forwardRef } from 'react'
import styled from 'styled-components'

import { ReportingContext, VisibilityState } from '../../../../domain/shared_slices/Global'
import { useAppSelector } from '../../../../hooks/useAppSelector'

type ButtonWrapperProps = {
  children: React.ReactNode
  topPosition: number
}
export function ButtonWrapperWithRef({ children, topPosition }: ButtonWrapperProps, ref: React.Ref<HTMLDivElement>) {
  const reportingFormVisibility = useAppSelector(state => state.global.reportingFormVisibility)

  return (
    <Wrapper
      ref={ref}
      reportingFormVisibility={
        reportingFormVisibility.context === ReportingContext.MAP
          ? reportingFormVisibility.visibility
          : VisibilityState.NONE
      }
      topPosition={topPosition}
    >
      {children}
    </Wrapper>
  )
}

const Wrapper = styled.div<{ reportingFormVisibility: VisibilityState; topPosition: number }>`
  position: absolute;
  top: ${p => p.topPosition}px;
  right: ${p => (p.reportingFormVisibility === VisibilityState.VISIBLE ? '0' : '10')}px;
  display: flex;
  justify-content: flex-end;
  transition: right 0.3s ease-out;
`

export const ButtonWrapper = forwardRef(ButtonWrapperWithRef)
