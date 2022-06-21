import React from 'react'
import styled from 'styled-components'
import { Form } from 'rsuite'
import { Field, useField } from 'formik'

import { infractionTypeEnum, formalNoticeEnum, vehicleTypeEnum } from '../../../domain/entities/missions'

import { FormikRadioGroup } from '../../commonComponents/CustomFormikFields/FormikRadioGroup'
import { FormikCheckbox } from '../../commonComponents/CustomFormikFields/FormikCheckbox'
import { FormikTextarea } from '../../commonComponents/CustomFormikFields/FormikTextarea'

import { NatinfSelector } from './NatinfSelector'

import { PrimaryButton } from '../../commonStyles/Buttons.style'
import { COLORS } from '../../../constants/constants'
import { VesselSizeSelector } from './VesselSizeSelector'
import { VehicleTypeSelector } from './VehicleTypeSelector'


export const InfractionForm = ({ infractionPath, setCurrentInfractionIndex }) =>  {
  const [vehicleField] = useField(`${infractionPath}.vehicle`)
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
          <VehicleTypeSelector name={`${infractionPath}.vehicle`} />
        </FormColumn>
     
        <FormColumn>
          { vehicleField.value === vehicleTypeEnum.VESSEL.code &&
            <VesselSizeSelector name={`${infractionPath}.size`} />
          }
        </FormColumn>
      </Form.Group>

      <Form.Group>
        <Form.ControlLabel htmlFor={`${infractionPath}.owner`}>Propriétaire : </Form.ControlLabel>
        <Field name={`${infractionPath}.owner`} />
      </Form.Group>

      <Form.Group style={{display: 'flex'}}>
        <FormColumn flex={1}>
          <NatinfSelector infractionPath={infractionPath} />
        </FormColumn>

        <FormColumn flex={1}>
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

        <FormColumnWithCheckbox>
            <FormikCheckbox name={`${infractionPath}.toProcess`} label={'A traiter'} inline/>
        </FormColumnWithCheckbox>
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
  ${props => `flex: ${props.flex};`}
  `
const FormColumnWithCheckbox = styled.div`
  display: inline-block;
  vertical-align: top;
  padding-top: 16px;
`
