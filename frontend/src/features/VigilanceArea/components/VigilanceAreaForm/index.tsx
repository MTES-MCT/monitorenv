import { Formik } from 'formik'
import { noop } from 'lodash'
import styled from 'styled-components'

import { Form } from './Form'
import { VigilanceAreaSchema } from './Schema'
import { getVigilanceAreaInitialValues } from './utils'

export function VigilanceAreaForm({ isOpen }) {
  const initialValues = getVigilanceAreaInitialValues()

  return (
    <Wrapper $isOpen={isOpen}>
      <Header>
        <Square />
        <Title>Création d&apos;une zone de vigilance</Title>
      </Header>

      <Formik initialValues={initialValues} onSubmit={noop} validationSchema={VigilanceAreaSchema}>
        <Form />
      </Formik>
    </Wrapper>
  )
}

const Wrapper = styled.div<{ $isOpen: boolean }>`
  border-radius: 2px;
  width: 400px;
  display: block;
  color: ${p => p.theme.color.charcoal};
  opacity: ${p => (p.$isOpen ? 1 : 0)};
  padding: 0;
  transition: all 0.5s;
  height: calc(100vh - 65px);
`

const Header = styled.header`
  align-items: center;
  background-color: ${p => p.theme.color.blueGray25};
  display: flex;
  padding: 11px 16px;
`
const Title = styled.span`
  font-size: 15px;
  color: ${p => p.theme.color.gunMetal};
`
const Square = styled.div`
  width: 18px;
  height: 18px;
  background: #d6df64; /* TODO: add color inmonitor-ui */
  border: 1px solid ${p => p.theme.color.slateGray};
  display: inline-block;
  margin-right: 10px;
  flex-shrink: 0;
`
