import React from 'react'
import { Form } from 'rsuite'
import {  FieldArray, useField } from 'formik'
import styled from 'styled-components'
import { format, isValid } from 'date-fns'
import { fr } from 'date-fns/locale'
import TrashIcon from '@rsuite/icons/Trash';

import { InfractionsForm } from './InfractionsForm'
import { FormikDatePicker, placeholderDateTimePicker } from '../../commonComponents/CustomFormikFields/FormikDatePicker';
import { ControlTopicsCascader } from './ControlTopicsCascader'
import { actionTypeEnum, THEME_REQUIRE_PROTECTED_SPECIES } from '../../../domain/entities/missions';
import { ProtectedSpeciesSelector } from './ProtectedSpeciesSelector';
import { ActionTargetSelector } from './ActionTargetSelector';
import { VehicleTypeSelector } from './VehicleTypeSelector';
import { ControlPositions } from './ControlPositions';
import { FormikInput } from '../../commonComponents/CustomFormikFields/FormikInput'

import { ReactComponent as ControlIconSVG } from '../../icons/controles.svg'
import { COLORS } from '../../../constants/constants'

export const ControlForm = ({ remove, currentActionIndex, setCurrentActionIndex }) => {
  const [ actionTypeField ] = useField(`envActions.${currentActionIndex}.actionType`)
  const [ actionThemeField ] = useField(`envActions.${currentActionIndex}.actionTheme`)
  const [ actionStartDatetimeUtcField ] = useField(`envActions.${currentActionIndex}.actionStartDatetimeUtc`)
  const parsedActionStartDatetimeUtc = new Date(actionStartDatetimeUtcField.value)

  const handleRemoveAction = () => {
    setCurrentActionIndex(null)
    remove(currentActionIndex)
  }
  
  return (<>
    <Header>
      <ControlIcon/>
      <Title>{actionTypeEnum[actionTypeField.value]?.libelle}</Title>
      <SubTitle>&nbsp;({isValid(parsedActionStartDatetimeUtc) && format(parsedActionStartDatetimeUtc, "dd MMM à HH:mm", {locale: fr})})</SubTitle>
      <Delete type="button" onClick={handleRemoveAction}><TrashIcon />Supprimer</Delete>
    </Header>
    <Form.Group>
      <Form.ControlLabel htmlFor={`envActions.${currentActionIndex}.actionTheme`}>Thématique de contrôle</Form.ControlLabel>
      <ControlTopicsCascader name={`envActions.${currentActionIndex}.actionTheme`} />
    </Form.Group>

    {
      THEME_REQUIRE_PROTECTED_SPECIES.includes(actionThemeField?.value) &&
      <Form.Group>
        <Form.ControlLabel htmlFor={`envActions.${currentActionIndex}.protectedSpecies`}>Sous-thématique de contrôle</Form.ControlLabel>
        <ProtectedSpeciesSelector name={`envActions.${currentActionIndex}.protectedSpecies`} />
      </Form.Group>
    }
    
    <Form.Group>
      <Form.ControlLabel htmlFor={`envActions[${currentActionIndex}].actionStartDatetimeUtc`} >
        Date et heure du contrôle
      </Form.ControlLabel>
      <FormikDatePicker 
        ghost
        name={`envActions[${currentActionIndex}].actionStartDatetimeUtc`} 
        placeholder={placeholderDateTimePicker} 
        format="dd MMM yyyy, HH:mm" 
        oneTap/>
    </Form.Group>

    <ControlPositions name={`envActions[${currentActionIndex}].geom`}/>

    <Separator />

    <Form.Group>
      <ActionSummary>
        <ActionFieldWrapper>
          <Form.ControlLabel htmlFor={`envActions.${currentActionIndex}.actionNumberOfControls`}>
            Nombre total de contrôles
          </Form.ControlLabel>
          <FormikInput name={`envActions.${currentActionIndex}.actionNumberOfControls`} />
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

const Separator = styled.hr`
  border-color: ${COLORS.gunMetal};
`
const Delete = styled.button`
  color: red;
  float: right;
`
const ActionSummary = styled.div`
  display: flex;
`

const ActionFieldWrapper = styled.div`
  :not(:first-child){
    margin-left: 8px;
  }
`

const ControlIcon = styled(ControlIconSVG)`
  color: ${COLORS.gunMetal};
  margin-right: 8px;
  width: 18px;
`

const SubTitle = styled.div`
  font-size: 16px;
  display: inline-block;
`