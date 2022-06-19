import React from 'react'
import { Form } from 'rsuite'
import { Field, FieldArray, useField } from 'formik'
import styled from 'styled-components'
import TrashIcon from '@rsuite/icons/Trash';

import { InfractionsForm } from './InfractionsForm'
import { FormikDatePicker, placeholderDateTimePicker } from '../../commonComponents/CustomFormikFields/FormikDatePicker';
import { COLORS } from '../../../constants/constants'
import { ControlTopicsCascader } from './ControlTopicsCascader'
import { ActionTypeEnum } from '../../../domain/entities/missions';


export const ControlForm = ({ remove, currentActionIndex, setCurrentActionIndex }) => {
  const [ actionTypeField ] = useField(`actions.${currentActionIndex}.actionType`)

  const handleRemoveAction = () => {
    setCurrentActionIndex(null)
    remove(currentActionIndex)
  }
  
  return (<>
    <Header>
      <Title>{ActionTypeEnum[actionTypeField.value]?.libelle}</Title>
      <Delete type="button" onClick={handleRemoveAction}><TrashIcon />Supprimer</Delete>
    </Header>

    <Form.Group>
      <Form.ControlLabel htmlFor={`actions.${currentActionIndex}.actionTheme`}>Thématique du contrôle</Form.ControlLabel>
      <ControlTopicsCascader name={`actions.${currentActionIndex}.actionTheme`} />
    </Form.Group>
    
    <Form.Group>
      <Form.ControlLabel htmlFor={`actions[${currentActionIndex}].actionStartDatetimeUtc`} >Date et heure du début du contrôle </Form.ControlLabel>
      <FormikDatePicker name={`actions[${currentActionIndex}].actionStartDatetimeUtc`} placeholder={placeholderDateTimePicker} format="dd MMM yyyy, HH:mm" oneTap/>
      <Form.ControlLabel htmlFor={`actions[${currentActionIndex}].actionEndDatetimeUtc`} >Date et heure de fin du contrôle </Form.ControlLabel>
      <FormikDatePicker name={`actions[${currentActionIndex}].actionEndDatetimeUtc`} placeholder={placeholderDateTimePicker} format="dd MMM yyyy, HH:mm" oneTap/>
    </Form.Group>

    <Form.Group>
      <ActionSummary>
        <ActionFieldWrapper>
          <Form.ControlLabel htmlFor={`actions.${currentActionIndex}.actionNumberOfControls`}>Nombre total de contrôles</Form.ControlLabel>
          <Field name={`actions.${currentActionIndex}.actionNumberOfControls`} />
        </ActionFieldWrapper>
        <ActionFieldWrapper>
          <Form.ControlLabel htmlFor={`actions.${currentActionIndex}.actionTargetType`}>Type de cible</Form.ControlLabel>
          <Field name={`actions.${currentActionIndex}.actionTargetType`} />
        </ActionFieldWrapper>
        <ActionFieldWrapper>
          <Form.ControlLabel htmlFor={`actions.${currentActionIndex}.actionControlType`}>Contrôle en</Form.ControlLabel>
          <Field name={`actions.${currentActionIndex}.actionControlType`} />
        </ActionFieldWrapper>
      </ActionSummary>
    </Form.Group>

    <FieldArray name={`actions[${currentActionIndex}].infractions`} render={(props)=>(<InfractionsForm {...props} currentActionIndex={currentActionIndex} />)} />
      
  </>)
}


const Header = styled.div``

const Title = styled.h2`
  font-size: 16px;
  line-height: 22px;
  display: inline-block;
  color: ${COLORS.charcoal}
`

const Delete = styled.button`
  color: red;
  float: right;
`
const ActionSummary = styled.div`
  display: flex;
`

const ActionFieldWrapper = styled.div``
