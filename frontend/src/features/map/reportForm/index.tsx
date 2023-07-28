import { Form, Formik } from 'formik'
import styled from 'styled-components'

import { useAppSelector } from '../../../hooks/useAppSelector'
import { ReportForm } from './ReportForm'

export function Report() {
  const { isReportFormOpen } = useAppSelector(state => state.global)

  const submitReportForm = () => {
    // eslint-disable-next-line no-console
    console.log('coucou')
  }

  return (
    <StyledContainer className={isReportFormOpen ? 'open' : undefined}>
      <Formik
        enableReinitialize
        initialValues={{ needControl: undefined, theme: { subthemes: null, theme: null } }}
        onSubmit={submitReportForm}
      >
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
    right: 0;
    overflow-y: auto;
  }
`
const StyledForm = styled(Form)`
  display: flex;
  flex: 1;
`
