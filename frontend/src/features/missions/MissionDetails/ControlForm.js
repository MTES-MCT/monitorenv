import React from 'react'
import { Form } from 'rsuite'
import { Field, FieldArray, useField } from 'formik'
import styled from 'styled-components'
import TrashIcon from '@rsuite/icons/Trash';

import { InfractionsForm } from './InfractionsForm'
import { FormikDatePicker, placeholderDateTimePicker } from '../../commonComponents/CustomFormikFields/FormikDatePicker';
import { COLORS } from '../../../constants/constants'
import { ControlTopicsCascader } from './ControlTopicsCascader'
import { actionTypeEnum, THEME_REQUIRE_PROTECTED_SPECIES } from '../../../domain/entities/missions';
import { ProtectedSpeciesSelector } from './ProtectedSpeciesSelector';
import { ActionTargetSelector } from './ActionTargetSelector';
import { VehicleTypeSelector } from './VehicleTypeSelector';
import { ControlPositions } from './ControlPositions';


export const ControlForm = ({ remove, currentActionIndex, setCurrentActionIndex }) => {
  const [ actionTypeField ] = useField(`envActions.${currentActionIndex}.actionType`)
  const [ actionThemeField ] = useField(`envActions.${currentActionIndex}.actionTheme`)

  const handleRemoveAction = () => {
    setCurrentActionIndex(null)
    remove(currentActionIndex)
  }
  
  return (<>
    <Header>
      <Title>{actionTypeEnum[actionTypeField.value]?.libelle}</Title>
      <Delete type="button" onClick={handleRemoveAction}><TrashIcon />Supprimer</Delete>
    </Header>
    <Form.Group>
      <Form.ControlLabel htmlFor={`envActions.${currentActionIndex}.actionTheme`}>Thématique du contrôle</Form.ControlLabel>
      <ControlTopicsCascader name={`envActions.${currentActionIndex}.actionTheme`} />
    </Form.Group>

    {
      THEME_REQUIRE_PROTECTED_SPECIES.includes(actionThemeField?.value) &&
      <Form.Group>
        <ProtectedSpeciesSelector name={`envActions.${currentActionIndex}.protectedSpecies`} />
      </Form.Group>
    }
    
    <ControlPositions name={`envActions[${currentActionIndex}].geom`}/>
    <Form.Group>
      <Form.ControlLabel htmlFor={`envActions[${currentActionIndex}].actionStartDatetimeUtc`} >
        Date et heure du début du contrôle
      </Form.ControlLabel>
      <FormikDatePicker 
        name={`envActions[${currentActionIndex}].actionStartDatetimeUtc`} 
        placeholder={placeholderDateTimePicker} 
        format="dd MMM yyyy, HH:mm" 
        oneTap/>
    </Form.Group>

    <Form.Group>
      <ActionSummary>
        <ActionFieldWrapper>
          <Form.ControlLabel htmlFor={`envActions.${currentActionIndex}.actionNumberOfControls`}>
            Nombre total de contrôles
          </Form.ControlLabel>
          <Field name={`envActions.${currentActionIndex}.actionNumberOfControls`} />
        </ActionFieldWrapper>
        <ActionFieldWrapper>
          <ActionTargetSelector currentActionIndex={currentActionIndex} />
        </ActionFieldWrapper>
        <ActionFieldWrapper>
          <VehicleTypeSelector currentActionIndex={currentActionIndex} />
        </ActionFieldWrapper>
      </ActionSummary>
    </Form.Group>

    <FieldArray 
      name={`envActions[${currentActionIndex}].infractions`} 
      render={(props)=>(<InfractionsForm 
        currentActionIndex={currentActionIndex} 
        {...props} 
         />
      )} />
      
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
