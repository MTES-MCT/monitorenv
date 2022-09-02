import React from 'react'
import styled from 'styled-components'
import { Form, Button, ButtonToolbar} from 'rsuite'
import { useField } from 'formik'

import { infractionTypeEnum, formalNoticeEnum, actionTargetTypeEnum } from '../../../domain/entities/missions'

import { FormikRadioGroup } from '../../../uiMonitor/CustomFormikFields/FormikRadioGroup'
import { FormikCheckbox } from '../../../uiMonitor/CustomFormikFields/FormikCheckbox'
import { FormikTextarea } from '../../../uiMonitor/CustomFormikFields/FormikTextarea'

import { NatinfSelector } from './NatinfSelector'

import { COLORS } from '../../../constants/constants'
import { InfractionFormHeaderVehicle } from './InfractionFormHeaderVehicle'
import { InfractionFormHeaderCompany } from './InfractionFormHeaderCompany'
import { RelevantCourtSelector } from './RelevantCourtSelector'
import { FormikInput } from '../../../uiMonitor/CustomFormikFields/FormikInput'


export const InfractionForm = ({ currentActionIndex, infractionPath, validateInfraction, removeInfraction }) =>  {

  const [actionTargetField] = useField(`envActions.${currentActionIndex}.actionTargetType`)

  return (<FormWrapper>
      {actionTargetField.value === actionTargetTypeEnum.VEHICLE.code 
        && <InfractionFormHeaderVehicle currentActionIndex={currentActionIndex} infractionPath={infractionPath} />}

      {actionTargetField.value === actionTargetTypeEnum.COMPANY.code 
        && <InfractionFormHeaderCompany infractionPath={infractionPath} />}

      <Form.Group>
        <Form.ControlLabel htmlFor={`${infractionPath}.controlledPersonIdentity`}>Identité de la personne controlée</Form.ControlLabel>
        <FormikInput size='sm' name={`${infractionPath}.controlledPersonIdentity`} />
      </Form.Group>

      <SubGroup>
        <Form.ControlLabel htmlFor={`${infractionPath}.infractionType`}>Type d&apos;infraction</Form.ControlLabel>
        <FormikRadioGroup name={`${infractionPath}.infractionType`} radioValues={infractionTypeEnum} />
      </SubGroup>

      <SubGroup>
        <Form.ControlLabel htmlFor={`${infractionPath}.formalNotice`}>Mise en demeure</Form.ControlLabel>
        <FormikRadioGroup name={`${infractionPath}.formalNotice`} radioValues={formalNoticeEnum} />
      </SubGroup>

      <FormGroupFixedHeight>
        <NatinfSelector infractionPath={infractionPath} />
      </FormGroupFixedHeight>

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
      <ButtonToolbarRight>
        <Button onClick={removeInfraction}>Supprimer l&apos;infraction</Button>
        <Button appearance="primary" onClick={validateInfraction}>Valider l&apos;infraction</Button>
      </ButtonToolbarRight>
  </FormWrapper>

  )
  }
    
const FormWrapper = styled.div`
  background: ${COLORS.white};
  padding: 32px;
`
const FormGroupFixedHeight = styled(Form.Group)`
  haight: 58px;
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
const ButtonToolbarRight = styled(ButtonToolbar)`
  display: flex;
  justify-content: flex-end;
`
const SubGroup = styled.div`
  margin-bottom: 16px;
`