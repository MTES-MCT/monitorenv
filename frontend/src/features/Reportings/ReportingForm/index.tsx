import { skipToken } from '@reduxjs/toolkit/dist/query'
import { Form, Formik } from 'formik'
import { useMemo, useState } from 'react'
import styled from 'styled-components'

import { SelectMissionModal } from './AttachMission/SelectMissionModal'
import { ReportingForm } from './Form'
import { ReportingSchema } from './Schema'
import { useGetReportingQuery } from '../../../api/reportingsAPI'
import { ReportingContext, VisibilityState } from '../../../domain/shared_slices/Global'
import { createMissionFromReporting } from '../../../domain/use_cases/reporting/createMissionFromReporting'
import { saveReporting } from '../../../domain/use_cases/reporting/saveReporting'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { SideWindowBackground, FormContainer } from '../style'
import { getReportingInitialValues, isNewReporting } from '../utils'

export function ReportingFormWithContext({ context, totalReportings }) {
  const reportingFormVisibility = useAppSelector(state => state.global.reportingFormVisibility)
  const reportings = useAppSelector(state => state.reporting.reportings)
  const activeReportingId = useAppSelector(state => state.reporting.activeReportingId)
  const reportingContext = useAppSelector(state =>
    activeReportingId ? state.reporting.reportings[activeReportingId]?.context : undefined
  )

  const dispatch = useAppDispatch()

  const [isAttachNewMission, setIsAttachNewMission] = useState(false)

  const isReportingNew = useMemo(() => isNewReporting(activeReportingId), [activeReportingId])

  const { data: reportingToEdit } = useGetReportingQuery(
    isReportingNew || !activeReportingId ? skipToken : Number(activeReportingId)
  )

  const [shouldValidateOnChange, setShouldValidateOnChange] = useState(false)

  const submitReportForm = async values => {
    if (isAttachNewMission) {
      await dispatch(createMissionFromReporting(values))
      setIsAttachNewMission(false)
    }
    dispatch(saveReporting(values, context))
  }

  const selectedReporting = useMemo(
    () => (activeReportingId && reportings ? reportings[activeReportingId]?.reporting : undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeReportingId]
  )

  const reportingInitialValues = useMemo(() => {
    if (isReportingNew && activeReportingId) {
      return getReportingInitialValues({
        createdAt: selectedReporting?.createdAt,
        id: activeReportingId
      })
    }
    if (reportingToEdit) {
      return getReportingInitialValues(reportingToEdit)
    }

    return {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportingToEdit, isReportingNew])

  return (
    <>
      <FormContainer
        $context={reportingContext || ReportingContext.MAP}
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
              onSubmit={submitReportForm}
              validateOnChange={shouldValidateOnChange}
              validationSchema={ReportingSchema}
            >
              <StyledForm>
                <ReportingForm
                  reducedReportingsOnContext={totalReportings}
                  selectedReporting={selectedReporting}
                  setIsAttachNewMission={setIsAttachNewMission}
                  setShouldValidateOnChange={setShouldValidateOnChange}
                />
              </StyledForm>
            </Formik>
          )}
      </FormContainer>
      <SelectMissionModal />
      {reportingFormVisibility.context === ReportingContext.SIDE_WINDOW &&
        reportingFormVisibility.visibility === VisibilityState.VISIBLE && <SideWindowBackground />}
    </>
  )
}

const StyledForm = styled(Form)`
  width: 100%;
`
