import { Form, Formik } from 'formik'
import { useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { ReportingForm } from './Form'
import { ReportingSchema } from './Schema'
import { ReportingContext, VisibilityState } from '../../../domain/shared_slices/Global'
import { saveReporting } from '../../../domain/use_cases/reportings/saveReporting'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { SideWindowBackground, FormContainer } from '../style'
import { getReportingInitialValues } from '../utils'

export function ReportingFormWithContext({ context, totalMapReportings }) {
  const {
    global: { reportingFormVisibility },
    multiReportings: { activeReportingId, selectedReportings }
  } = useAppSelector(state => state)
  const dispatch = useDispatch()

  const [shouldValidateOnChange, setShouldValidateOnChange] = useState(false)

  const submitReportForm = values => {
    dispatch(saveReporting(values, context))
  }

  const selectedReporting = useMemo(
    () => (activeReportingId && selectedReportings ? selectedReportings[activeReportingId] : undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeReportingId]
  )

  const reportingInitialValues = useMemo(() => {
    if (selectedReporting && selectedReporting.reporting) {
      return getReportingInitialValues(selectedReporting.reporting)
    }

    return {}
  }, [selectedReporting])

  return (
    <>
      <FormContainer
        $context={context}
        $position={totalMapReportings + 1}
        $reportingFormVisibility={reportingFormVisibility.visibility}
      >
        {activeReportingId &&
          reportingFormVisibility.context === context &&
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
                  reducedReportingsOnContext={totalMapReportings}
                  selectedReporting={selectedReporting}
                  setShouldValidateOnChange={setShouldValidateOnChange}
                />
              </StyledForm>
            </Formik>
          )}
      </FormContainer>
      {reportingFormVisibility.context === ReportingContext.SIDE_WINDOW &&
        reportingFormVisibility.visibility === VisibilityState.VISIBLE && <SideWindowBackground />}
    </>
  )
}

const StyledForm = styled(Form)`
  width: 100%;
`
