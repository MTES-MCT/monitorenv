import React from 'react'
import styled from 'styled-components'
import { Form, Button} from 'rsuite'
import { Field, useField } from 'formik'

import { infractionTypeEnum, formalNoticeEnum, actionTargetTypeEnum } from '../../../domain/entities/missions'

import { FormikRadioGroup } from '../../commonComponents/CustomFormikFields/FormikRadioGroup'
import { FormikCheckbox } from '../../commonComponents/CustomFormikFields/FormikCheckbox'
import { FormikTextarea } from '../../commonComponents/CustomFormikFields/FormikTextarea'

import { NatinfSelector } from './NatinfSelector'

import { COLORS } from '../../../constants/constants'
import { InfractionFormHeaderVehicle } from './InfractionFormHeaderVehicle'
import { InfractionFormHeaderCompany } from './InfractionFormHeaderCompany'
import { RelevantCourtSelector } from './RelevantCourtSelector'


export const InfractionForm = ({ currentActionIndex, infractionPath, validateInfraction, removeInfraction }) =>  {

  const [actionTargetField] = useField(`envActions.${currentActionIndex}.actionTargetType`)

  return (<FormWrapper>
      {actionTargetField.value === actionTargetTypeEnum.VEHICLE.code 
        && <InfractionFormHeaderVehicle currentActionIndex={currentActionIndex} infractionPath={infractionPath} />}

      {actionTargetField.value === actionTargetTypeEnum.COMPANY.code 
        && <InfractionFormHeaderCompany infractionPath={infractionPath} />}

      <Form.Group>
        <Form.ControlLabel htmlFor={`${infractionPath}.controlledPersonIdentity`}>Identité de la personne controlée</Form.ControlLabel>
        <Field name={`${infractionPath}.controlledPersonIdentity`} />
      </Form.Group>

      <Form.Group>
        <Form.ControlLabel htmlFor={`${infractionPath}.infractionType`}>Type d&apos;infraction</Form.ControlLabel>
        <FormikRadioGroup name={`${infractionPath}.infractionType`} radioValues={infractionTypeEnum} />
      </Form.Group>

      <Form.Group>
        <Form.ControlLabel htmlFor={`${infractionPath}.formalNotice`}>Mise en demeure</Form.ControlLabel>
        <FormikRadioGroup name={`${infractionPath}.formalNotice`} radioValues={formalNoticeEnum} />
      </Form.Group>

      <Form.Group>
        <NatinfSelector infractionPath={infractionPath} />
      </Form.Group>

      <Form.Group>
        <FormColumn>
          <RelevantCourtSelector infractionPath={infractionPath}/>
        </FormColumn>

        <FormColumnWithCheckbox>
            <FormikCheckbox name={`${infractionPath}.toProcess`} label={'A traiter'} inline/>
        </FormColumnWithCheckbox>
      </Form.Group>

      <Form.Group>
        <Form.ControlLabel htmlFor="observations">Observations</Form.ControlLabel>
        <FormikTextarea name={`${infractionPath}.observations`} />
      </Form.Group>
      <Button appearance="ghost" onClick={removeInfraction}>Supprimer l&apos;infraction</Button>
      <Button onClick={validateInfraction}>Valider l&apos;infraction</Button>
  </FormWrapper>

  )
  }
    
const FormWrapper = styled.div`
  background: ${COLORS.white};
  padding: 32px;
`

const FormColumn = styled.div`
  display: inline-block;
  ${props => `flex: ${props.flex};`}
`
const FormColumnWithCheckbox = styled.div`
  display: inline-block;
  vertical-align: top;
  padding-top: 16px;
`
