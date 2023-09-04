import { skipToken } from '@reduxjs/toolkit/dist/query'
import { Form, Formik } from 'formik'
import { useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { useGetReportingQuery } from '../../../api/reportingsAPI'
import { ReportingContext, VisibilityState } from '../../../domain/shared_slices/ReportingState'
import { saveReporting } from '../../../domain/use_cases/reportings/saveReporting'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { ReportingForm } from '../ReportingForm'
import { ReportingSchema } from '../ReportingForm/Schema'
import { getReportingInitialValues, isNewReporting } from '../utils'

export function ReportingFormOnSideWindow({ totalTableReportings }) {
  const {
    global: { reportingFormVisibility },
    multiReportings: { activeReportingId, selectedReportings }
  } = useAppSelector(state => state)

  const dispatch = useDispatch()
  const [shouldValidateOnChange, setShouldValidateOnChange] = useState(false)

  const isReportingNew = useMemo(() => isNewReporting(activeReportingId), [activeReportingId])

  const { data: reportingToEdit } = useGetReportingQuery(
    isReportingNew || !activeReportingId ? skipToken : Number(activeReportingId)
  )
  const submitReportForm = async values => {
    await dispatch(saveReporting(values, ReportingContext.SIDE_WINDOW))
  }
  const selectedReporting = useMemo(
    () => selectedReportings.find(reporting => reporting.reporting.id === activeReportingId),
    [selectedReportings, activeReportingId]
  )

  const reportingInitialValues = useMemo(() => {
    if (isReportingNew) {
      return getReportingInitialValues({ createdAt: selectedReporting?.reporting.createdAt, id: activeReportingId })
    }

    return getReportingInitialValues(reportingToEdit)
  }, [reportingToEdit, isReportingNew, selectedReporting, activeReportingId])

  return (
    <>
      <FormContainer $position={totalTableReportings + 1} $reportingFormVisibility={reportingFormVisibility.visibility}>
        {activeReportingId &&
          reportingFormVisibility.context === ReportingContext.SIDE_WINDOW &&
          reportingFormVisibility.visibility !== VisibilityState.NONE && (
            <Formik
              key={activeReportingId}
              enableReinitialize
              initialValues={reportingInitialValues}
              onSubmit={submitReportForm}
              validateOnChange={shouldValidateOnChange}
              validationSchema={ReportingSchema}
            >
              <StyledForm>
                <ReportingForm
                  reducedReportingsOnContext={totalTableReportings}
                  selectedReporting={selectedReporting}
                  setShouldValidateOnChange={setShouldValidateOnChange}
                />
              </StyledForm>
            </Formik>
          )}
      </FormContainer>
      {reportingFormVisibility.context === ReportingContext.SIDE_WINDOW &&
        reportingFormVisibility.visibility === VisibilityState.VISIBLE && <Wrapper />}
    </>
  )
}

const Wrapper = styled.div`
  position: absolute;
  background-color: ${p => p.theme.color.charcoal};
  opacity: 0.6;
  width: 100%;
  height: 100%;
  top: 0;
  z-index: 5;
`
const FormContainer = styled.div<{ $position: number; $reportingFormVisibility?: VisibilityState }>`
  background-color: ${p => p.theme.color.white};
  position: absolute;
  top: 0;
  width: 500px;
  overflow: hidden;
  display: flex;
  transition: top 0.5s ease-out;
  z-index: 6;

  ${p => {
    switch (p.$reportingFormVisibility) {
      case VisibilityState.VISIBLE:
        return 'right: 0px;'
      case VisibilityState.REDUCED:
        return `right: 0px; top: calc(100vh - ${p.$position * 52}px);`
      case VisibilityState.NONE:
      default:
        return 'right: -500px;'
    }
  }}
`

const StyledForm = styled(Form)`
  width: 100%;
`
