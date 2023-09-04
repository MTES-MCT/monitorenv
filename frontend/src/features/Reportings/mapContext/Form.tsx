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

export function ReportingFormOnMap({ totalMapReportings }) {
  const {
    global: { reportingFormVisibility },
    multiReportings: { activeReportingId, selectedReportings }
  } = useAppSelector(state => state)
  const dispatch = useDispatch()

  const [shouldValidateOnChange, setShouldValidateOnChange] = useState(false)

  const isReportingNew = useMemo(() => activeReportingId && isNewReporting(activeReportingId), [activeReportingId])

  const { data: reportingToEdit } = useGetReportingQuery(isReportingNew ? skipToken : Number(activeReportingId))

  const submitReportForm = async values => {
    await dispatch(saveReporting(ReportingContext.MAP, values))
  }
  const selectedReporting = useMemo(
    () => selectedReportings.find(reporting => reporting.reporting.id === activeReportingId),
    [selectedReportings, activeReportingId]
  )

  const reportingInitialValues = useMemo(() => {
    if (isReportingNew) {
      return getReportingInitialValues({ id: activeReportingId })
    }

    return getReportingInitialValues(reportingToEdit)
  }, [reportingToEdit, isReportingNew, activeReportingId])

  if (reportingFormVisibility.context !== ReportingContext.MAP) {
    return null
  }

  return (
    <FormContainer $position={totalMapReportings} $reportingFormVisibility={reportingFormVisibility.visibility}>
      {reportingFormVisibility.visibility !== VisibilityState.NONE && (
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
              selectedReporting={selectedReporting}
              setShouldValidateOnChange={setShouldValidateOnChange}
            />
          </StyledForm>
        </Formik>
      )}
    </FormContainer>
  )
}

const FormContainer = styled.div<{ $position: number; $reportingFormVisibility?: VisibilityState }>`
  background-color: ${p => p.theme.color.white};
  position: absolute;
  top: 0;
  width: 500px;
  overflow: hidden;
  display: flex;
  transition: right 0.5s ease-out, top 0.5s ease-out;
  z-index: 100;

  ${p => {
    switch (p.$reportingFormVisibility) {
      case VisibilityState.VISIBLE:
        return 'right: 8px;'
      case VisibilityState.VISIBLE_LEFT:
        return 'right: 56px;'
      case VisibilityState.REDUCED:
        return `right: 12px; top: calc(100vh - ${p.$position * 52}px);`
      case VisibilityState.NONE:
      default:
        return 'right: -500px;'
    }
  }}
`

const StyledForm = styled(Form)`
  width: 100%;
`
