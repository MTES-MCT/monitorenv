import { skipToken } from '@reduxjs/toolkit/dist/query'
import { Form, Formik } from 'formik'
import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { ReportingForm } from './ReportingForm'
import { ReportingSchema } from './Schema'
import { getReportingInitialValues } from './utils'
import { useGetReportingQuery } from '../../../api/reportingsAPI'
import { ReportingFormVisibility } from '../../../domain/shared_slices/ReportingState'
import { saveReporting } from '../../../domain/use_cases/reportings/saveReporting'
import { useAppSelector } from '../../../hooks/useAppSelector'

export function Reporting() {
  const {
    global: { reportingFormVisibility },
    reportingState: { selectedReportingId }
  } = useAppSelector(state => state)
  const dispatch = useDispatch()
  const { data: reportingToEdit } = useGetReportingQuery(selectedReportingId || skipToken)

  const submitReportForm = async values => {
    await dispatch(saveReporting(values))
  }

  const reportingInitialValues = useMemo(() => {
    if (reportingToEdit && selectedReportingId) {
      return getReportingInitialValues(reportingToEdit)
    }

    return getReportingInitialValues()
  }, [selectedReportingId, reportingToEdit])

  return (
    <StyledContainer className={reportingFormVisibility}>
      {reportingFormVisibility !== ReportingFormVisibility.NOT_VISIBLE && (
        <Formik
          enableReinitialize
          initialValues={reportingInitialValues}
          onSubmit={submitReportForm}
          validateOnChange={false}
          validationSchema={ReportingSchema}
        >
          <StyledForm>
            <ReportingForm />
          </StyledForm>
        </Formik>
      )}
    </StyledContainer>
  )
}

const StyledContainer = styled.div`
  background-color: ${p => p.theme.color.white};
  position: absolute;
  top: 0;
  bottom: 0;
  right: -500px;
  width: 500px;
  overflow: hidden;
  display: flex;
  transition: right 0.5s ease-out, top 0.5s ease-out;
  z-index: 100;
  &.visible {
    right: 8px;
  }
  &.reduce {
    right: 12px;
    top: calc(100vh - 52px);
  }
  &.visible_left {
    right: 56px;
  }
`
const StyledForm = styled(Form)`
  width: 100%;
`
