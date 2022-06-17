import React from 'react'
import styled from 'styled-components'
import { Form } from 'rsuite'
import { Field } from 'formik'

import { infractionTypeEnum, formalNoticeEnum } from '../../../domain/entities/missions'

import { FormikRadioGroup } from '../../commonComponents/CustomFormikFields/FormikRadioGroup'
import { FormikCheckbox } from '../../commonComponents/CustomFormikFields/FormikCheckbox'
import { FormikTextarea } from '../../commonComponents/CustomFormikFields/FormikTextarea'

import { NatinfSelector } from './NatinfSelector'

import { PrimaryButton } from '../../commonStyles/Buttons.style'
import { COLORS } from '../../../constants/constants'


export const InfractionForm = ({ infractionPath, setCurrentInfractionIndex }) =>  {
  console.log(infractionPath)

  const handleValidate = () => {
    setCurrentInfractionIndex()
  }

  return (<FormWrapper>

      <Form.Group>
        <FormColumn>
          <Form.ControlLabel htmlFor={`${infractionPath}.registrationNumber`}>Immatriculation : </Form.ControlLabel>
          <Field name={`${infractionPath}.registrationNumber`} />
        </FormColumn>
     
        <FormColumn>
          <Form.ControlLabel htmlFor={`${infractionPath}.vehicle`}>Type de navire : </Form.ControlLabel>
          <Field name={`${infractionPath}.vehicle`} />
        </FormColumn>
     
        <FormColumn>
          <Form.ControlLabel htmlFor={`${infractionPath}.size`}>Taille : </Form.ControlLabel>
          <Field name={`${infractionPath}.size`} />
        </FormColumn>
      </Form.Group>

      <Form.Group>
        <Form.ControlLabel htmlFor={`${infractionPath}.owner`}>Propriétaire : </Form.ControlLabel>
        <Field name={`${infractionPath}.owner`} />
      </Form.Group>

      <Form.Group>
        <FormColumn>
          <NatinfSelector infractionPath={infractionPath} />
        </FormColumn>

        <FormColumn>
          <Form.Group>
            <Form.ControlLabel htmlFor={`${infractionPath}.infractionType`}>Type d&apos;infraction : </Form.ControlLabel>
            <FormikRadioGroup name={`${infractionPath}.infractionType`} radioValues={infractionTypeEnum} />
          </Form.Group>

          <Form.Group>
            <Form.ControlLabel htmlFor={`${infractionPath}.formalNotice`}>Mise en demeure : </Form.ControlLabel>
            <FormikRadioGroup name={`${infractionPath}.formalNotice`} radioValues={formalNoticeEnum} />
          </Form.Group>
        </FormColumn>
      </Form.Group>


      <Form.Group>
        <FormColumn>
          <Form.ControlLabel htmlFor={`${infractionPath}.relevantCourt`}>Tribunal compétent : </Form.ControlLabel>
          <Field name={`${infractionPath}.relevantCourt`} />
        </FormColumn>

        <FormColumn>
            <Form.ControlLabel htmlFor={`${infractionPath}.toProcess`}>A traiter : </Form.ControlLabel>
            <FormikCheckbox name={`${infractionPath}.toProcess`} />
        </FormColumn>
      </Form.Group>

      <Form.Group>
        <Form.ControlLabel htmlFor="observations">Note libre : </Form.ControlLabel>
        <FormikTextarea name={`${infractionPath}.observations`} />
      </Form.Group>
      <PrimaryButton type="button" onClick={handleValidate}>Valider l&apos;infraction</PrimaryButton>
  </FormWrapper>

  )
  }
    
const FormWrapper = styled.div`
  background: ${COLORS.white};
`

const FormColumn = styled.div`
  display: inline-block;
`