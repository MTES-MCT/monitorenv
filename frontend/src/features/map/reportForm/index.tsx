import { Form, Formik } from 'formik'
import { useMemo } from 'react'
import styled from 'styled-components'

import { useAppSelector } from '../../../hooks/useAppSelector'
import { ReportForm } from './ReportForm'
import { getReportingInitialValues } from './utils'

export function Report() {
  const {
    global: { isReportFormOpen },
    reportingState: { reporting }
  } = useAppSelector(state => state)

  const submitReportForm = () => {
    // eslint-disable-next-line no-console
    console.log('coucou')
  }

  const reportingInitialValues = useMemo(() => getReportingInitialValues(reporting), [reporting])

  return (
    <StyledContainer className={isReportFormOpen ? 'open' : undefined}>
      <Formik enableReinitialize initialValues={reportingInitialValues} onSubmit={submitReportForm}>
        <StyledForm>
          <ReportForm />
        </StyledForm>
      </Formik>
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
  transition: right 0.5s ease-out;
  z-index: 100000;
  &.open {
    right: 12px;
    overflow-y: auto;
  }
`
const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
`
