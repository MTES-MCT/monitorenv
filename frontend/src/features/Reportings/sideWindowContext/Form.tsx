import { skipToken } from '@reduxjs/toolkit/dist/query'
import { Form, Formik } from 'formik'
import { useContext, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { SideWindowReportingFormVisibility, SideWindowReportingsContext } from './context'
import { useGetReportingQuery } from '../../../api/reportingsAPI'
import { saveReporting } from '../../../domain/use_cases/reportings/saveReporting'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { ReportingForm } from '../ReportingForm'
import { ReportingSchema } from '../ReportingForm/Schema'
import { getReportingInitialValues, isNewReporting } from '../utils'

export function ReportingFormOnSideWindow({ totalTableReportings }) {
  const {
    multiReportings: { activeReportingId, selectedReportings }
  } = useAppSelector(state => state)

  const reportingFormVisibility = useContext(SideWindowReportingsContext)
  const { contextVisibility } = reportingFormVisibility

  const dispatch = useDispatch()
  const [shouldValidateOnChange, setShouldValidateOnChange] = useState(false)

  const isReportingNew = useMemo(() => activeReportingId && isNewReporting(activeReportingId), [activeReportingId])

  const { data: reportingToEdit } = useGetReportingQuery(isReportingNew ? skipToken : Number(activeReportingId))

  const submitReportForm = async values => {
    await dispatch(saveReporting(values))
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

  return (
    <>
      <FormContainer $position={totalTableReportings} $reportingFormVisibility={contextVisibility}>
        {contextVisibility !== SideWindowReportingFormVisibility.NONE && (
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
      {contextVisibility === SideWindowReportingFormVisibility.VISIBLE && <Wrapper />}
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
const FormContainer = styled.div<{ $position: number; $reportingFormVisibility?: SideWindowReportingFormVisibility }>`
  background-color: ${p => p.theme.color.white};
  position: absolute;
  top: 0;
  width: 500px;
  overflow: hidden;
  display: flex;
  transition: right 0.5s ease-out, top 0.5s ease-out;
  z-index: 6;

  ${p => {
    switch (p.$reportingFormVisibility) {
      case SideWindowReportingFormVisibility.VISIBLE:
        return 'right: 0px;'
      case SideWindowReportingFormVisibility.REDUCED:
        return `right: 0px; top: calc(100vh - ${p.$position * 52}px);`
      case SideWindowReportingFormVisibility.NONE:
      default:
        return 'right: -500px;'
    }
  }}
`

const StyledForm = styled(Form)`
  width: 100%;
`
