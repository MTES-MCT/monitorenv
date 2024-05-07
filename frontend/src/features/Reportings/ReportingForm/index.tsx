import { Form, Formik } from 'formik'
import { noop } from 'lodash'
import { useMemo } from 'react'
import styled from 'styled-components'

import { FormContent } from './FormContent'
import { ReportingSchema } from './Schema'
import { ReportingContext, VisibilityState } from '../../../domain/shared_slices/Global'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { SideWindowBackground, FormContainer } from '../style'
import { getReportingInitialValues, isNewReporting } from '../utils'

type ReportingFormProps = {
  context: ReportingContext
  totalReportings: number
}
export function ReportingFormWithContext({ context, totalReportings }: ReportingFormProps) {
  const isRightMenuOpened = useAppSelector(state => state.mainWindow.isRightMenuOpened)
  const reportingFormVisibility = useAppSelector(state => state.global.reportingFormVisibility)
  const activeReportingId = useAppSelector(state => state.reporting.activeReportingId)
  const reportingContext = useAppSelector(state =>
    activeReportingId ? state.reporting.reportings[activeReportingId]?.context : undefined
  )

  const selectedReporting = useAppSelector(state =>
    activeReportingId ? state.reporting.reportings[activeReportingId]?.reporting : undefined
  )

  const isReportingNew = useMemo(() => isNewReporting(activeReportingId), [activeReportingId])

  const reportingInitialValues = useMemo(() => {
    if (isReportingNew && activeReportingId) {
      return getReportingInitialValues({
        createdAt: selectedReporting?.createdAt,
        id: activeReportingId
      })
    }
    if (selectedReporting) {
      return getReportingInitialValues(selectedReporting)
    }

    return {}
    // we just want to listen to the activeReportingId change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeReportingId])

  return (
    <>
      <FormContainer
        $context={reportingContext ?? ReportingContext.MAP}
        $isRightMenuOpened={isRightMenuOpened}
        $position={totalReportings + 1}
        $reportingFormVisibility={reportingFormVisibility.visibility}
      >
        {activeReportingId &&
          reportingFormVisibility.context === context &&
          reportingFormVisibility.visibility !== VisibilityState.NONE && (
            <Formik
              key={activeReportingId}
              enableReinitialize
              initialValues={reportingInitialValues}
              onSubmit={noop}
              validationSchema={ReportingSchema}
            >
              <StyledForm>
                <FormContent reducedReportingsOnContext={totalReportings} selectedReporting={selectedReporting} />
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
