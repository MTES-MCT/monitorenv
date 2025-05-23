import { FormContainer, SideWindowBackground } from '@features/Reportings/style'
import { getReportingInitialValues, isNewReporting } from '@features/Reportings/utils'
import { useAppSelector } from '@hooks/useAppSelector'
import { useGetCurrentUserAuthorizationQueryOverride } from '@hooks/useGetCurrentUserAuthorizationQueryOverride'
import { ReportingContext, VisibilityState } from 'domain/shared_slices/Global'
import { Form, Formik } from 'formik'
import { noop } from 'lodash'
import { useMemo } from 'react'
import styled from 'styled-components'

import { FormContent } from './FormContent'
import { ReportingSchema } from './Schema'
import { ReportingReadOnly } from '../ReportingReadOnly'

import type { Reporting } from 'domain/entities/reporting'

type ReportingFormProps = {
  context: ReportingContext
  totalReportings: number
}
export function ReportingFormWithContext({ context, totalReportings }: ReportingFormProps) {
  const { data: user } = useGetCurrentUserAuthorizationQueryOverride()

  const isSuperUser = useMemo(() => user?.isSuperUser, [user])
  const isRightMenuOpened = useAppSelector(state => state.mainWindow.isRightMenuOpened)
  const reportingFormVisibility = useAppSelector(state => state.global.visibility.reportingFormVisibility)
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
                {isSuperUser ? (
                  <FormContent reducedReportingsOnContext={totalReportings} selectedReporting={selectedReporting} />
                ) : (
                  <ReportingReadOnly
                    isSuperUser={isSuperUser}
                    reducedReportingsOnContext={totalReportings}
                    reporting={selectedReporting as Reporting}
                    withMissionCard
                  />
                )}
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
