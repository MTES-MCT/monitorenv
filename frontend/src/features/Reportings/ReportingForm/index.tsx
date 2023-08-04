import { skipToken } from '@reduxjs/toolkit/dist/query'
import { Form, Formik } from 'formik'
import { useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { ReportingForm } from './ReportingForm'
import { ReportingSchema } from './Schema'
import { useGetReportingQuery } from '../../../api/reportingsAPI'
import { ReportingFormVisibility } from '../../../domain/shared_slices/ReportingState'
import { saveReporting } from '../../../domain/use_cases/reportings/saveReporting'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { getReportingInitialValues } from '../utils'

export function Reporting() {
  const {
    global: { reportingFormVisibility },
    multiReportings: { selectedReportings },
    reportingState: { selectedReportingId }
  } = useAppSelector(state => state)

  const dispatch = useDispatch()
  const [shouldValidateOnChange, setShouldValidateOnChange] = useState(false)

  const { data: reportingToEdit } = useGetReportingQuery(selectedReportingId || skipToken)

  const submitReportForm = async values => {
    await dispatch(saveReporting(values))
  }

  const reportingInitialValues = useMemo(() => {
    if (selectedReportings[0]?.reporting) {
      return getReportingInitialValues(selectedReportings[0]?.reporting)
    }

    return getReportingInitialValues(reportingToEdit)
  }, [reportingToEdit, selectedReportings])

  return (
    <StyledContainer reportingFormVisibility={reportingFormVisibility}>
      {reportingFormVisibility !== ReportingFormVisibility.NONE && (
        <Formik
          enableReinitialize
          initialValues={reportingInitialValues}
          onSubmit={submitReportForm}
          validateOnChange={shouldValidateOnChange}
          validationSchema={ReportingSchema}
        >
          <StyledForm>
            <ReportingForm setShouldValidateOnChange={setShouldValidateOnChange} />
          </StyledForm>
        </Formik>
      )}
    </StyledContainer>
  )
}

const StyledContainer = styled.div<{ reportingFormVisibility: ReportingFormVisibility }>`
  background-color: ${p => p.theme.color.white};
  position: absolute;
  top: 0;
  width: 500px;
  overflow: hidden;
  display: flex;
  transition: right 0.5s ease-out, top 0.5s ease-out;
  z-index: 100;

  ${p => {
    switch (p.reportingFormVisibility) {
      case ReportingFormVisibility.VISIBLE:
        return 'right: 8px;'
      case ReportingFormVisibility.VISIBLE_LEFT:
        return 'right: 56px;'
      case ReportingFormVisibility.REDUCED:
        return 'right: 12px; top: calc(100vh - 52px);'
      default:
        return 'right: -500px;'
    }
  }}
`
const StyledForm = styled(Form)`
  width: 100%;
`
