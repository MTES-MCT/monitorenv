import React from 'react'
import { Form } from 'rsuite'
import { Field, useField } from 'formik'
import styled from 'styled-components'
import TrashIcon from '@rsuite/icons/Trash';

import { FormikDatePicker, placeholderDateTimePicker } from '../../commonComponents/CustomFormikFields/FormikDatePicker';
import { FormikTextarea } from '../../commonComponents/CustomFormikFields/FormikTextarea'
import { ControlTopicsCascader } from './ControlTopicsCascader'

import { actionTypeEnum } from '../../../domain/entities/missions';

import { ReactComponent as SurveillanceIconSVG } from '../../icons/surveillance_18px.svg'
import { COLORS } from '../../../constants/constants'


export const SurveillanceForm = ({ remove, currentActionIndex, setCurrentActionIndex }) => {
  const [ actionTypeField ] = useField(`envActions.${currentActionIndex}.actionType`)

  const handleRemoveAction = () => {
    setCurrentActionIndex(null)
    remove(currentActionIndex)
  }
  
  return (<>
    <Header>
      <SurveillanceIcon/>
      <Title>{actionTypeEnum[actionTypeField.value]?.libelle}</Title>
      <Delete type="button" onClick={handleRemoveAction}><TrashIcon />Supprimer</Delete>
    </Header>

    <Form.Group>
      <Form.ControlLabel htmlFor={`envActions.${currentActionIndex}.actionTheme`}>Thématique du contrôle</Form.ControlLabel>
      <ControlTopicsCascader name={`envActions.${currentActionIndex}.actionTheme`} />
    </Form.Group>
    
    <Form.Group>
      <Form.ControlLabel htmlFor={`envActions[${currentActionIndex}].actionStartDatetimeUtc`} >Date et heure du début du contrôle </Form.ControlLabel>
      <FormikDatePicker name={`envActions[${currentActionIndex}].actionStartDatetimeUtc`} placeholder={placeholderDateTimePicker} format="dd MMM yyyy, HH:mm" oneTap/>
    </Form.Group>
   
    <Form.Group>
      <Form.ControlLabel htmlFor={`envActions.${currentActionIndex}.duration`}>Durée</Form.ControlLabel>
      <Field name={`envActions.${currentActionIndex}.duration`} />
    </Form.Group>
    
    <Form.Group>
      <Form.ControlLabel htmlFor={`envActions.${currentActionIndex}.observations`}>Observations </Form.ControlLabel>
      <FormikTextarea name={`envActions.${currentActionIndex}.observations`} />
    </Form.Group>
 
      
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
const SurveillanceIcon = styled(SurveillanceIconSVG)`
  margin-right: 8px;
  color: ${COLORS.gunMetal};
`