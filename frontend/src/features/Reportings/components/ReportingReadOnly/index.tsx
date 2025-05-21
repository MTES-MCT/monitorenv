import { reduceOrCollapseReportingForm } from '@features/Reportings/useCases/reduceOrCollapseReportingForm'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { type Reporting } from 'domain/entities/reporting'
import { hideAllDialogs, ReportingContext, VisibilityState } from 'domain/shared_slices/Global'
import styled from 'styled-components'

import { FormContent } from './FormContent'
import { Header } from '../ReportingForm/Header'

export function ReportingReadOnly({
  reducedReportingsOnContext,
  reporting
}: {
  reducedReportingsOnContext: number
  reporting?: Reporting
}) {
  const dispatch = useAppDispatch()

  const reportingFormVisibility = useAppSelector(state => state.global.visibility.reportingFormVisibility)
  const activeReportingId = useAppSelector(state => state.reporting.activeReportingId)
  const reportingContext =
    useAppSelector(state => (activeReportingId ? state.reporting.reportings[activeReportingId]?.context : undefined)) ??
    ReportingContext.MAP

  if (!reporting) {
    return null
  }

  const reduceOrCollapseReporting = () => {
    dispatch(hideAllDialogs())

    dispatch(reduceOrCollapseReportingForm(reportingContext))
  }

  return (
    <>
      <Header
        isExpanded={
          reportingFormVisibility.context === reportingContext &&
          reportingFormVisibility.visibility === VisibilityState.REDUCED
        }
        reduceOrCollapseReporting={reduceOrCollapseReporting}
        reporting={reporting}
      />
      <Wrapper $totalReducedReportings={reducedReportingsOnContext}>
        <FormContent reporting={reporting} />
      </Wrapper>
    </>
  )
}

const Wrapper = styled.div<{ $totalReducedReportings: number }>`
  padding: 16px 32px 32px 31px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: calc(100vh - 52px - ${p => p.$totalReducedReportings * 52}px);
  overflow-y: auto;
`
