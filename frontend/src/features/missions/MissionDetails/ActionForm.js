import React from 'react'
import { Form } from 'rsuite'
import { Field, FieldArray } from 'formik'
import styled from 'styled-components'

import { InfractionsForm } from './InfractionsForm'
import { FormikDatePicker } from '../../commonComponents/FormikDatePicker';

import { SecondaryButton } from '../../commonStyles/Buttons.style'
import { ReactComponent as TrashSVG } from '../../icons/Suppression_clair.svg'
import { COLORS } from '../../../constants/constants'

export const ActionForm = ({ remove, actionIndex, setCurrentActionIndex }) =>  {
  if (actionIndex === null) {
    return (<NoSelectedAction>Ajouter ou sélectionner une action</NoSelectedAction>)
  }

  const handleRemoveAction = () => {
    remove(actionIndex)
    setCurrentActionIndex(null)
  }

  return (
      <ActionFormWrapper>
        <Title>Contrôle/Surveillance</Title>
        <SecondaryButton type="button" onClick={handleRemoveAction}>
          <TrashIcon /> Supprimer
        </SecondaryButton>

        <Form.Group>
          <Form.ControlLabel htmlFor={`actions.${actionIndex}.actionTheme`}>Thématique du contrôle</Form.ControlLabel>
          <Field name={`actions.${actionIndex}.actionTheme`} />
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel htmlFor={`actions[${actionIndex}].actionStartDatetimeUtc`} >Date et heure du début du contrôle </Form.ControlLabel>
          <FormikDatePicker name={`actions[${actionIndex}].actionStartDatetimeUtc`} placeholder={'Date et heure du début du contrôle'} oneTap/>
          <Form.ControlLabel htmlFor={`actions[${actionIndex}].actionEndDatetimeUtc`} >Date et heure de fin du contrôle </Form.ControlLabel>
          <FormikDatePicker name={`actions[${actionIndex}].actionEndDatetimeUtc`} placeholder={'Date et heure de fin du contrôle'} oneTap/>
          
          <Form.ControlLabel htmlFor={`actions.${actionIndex}.actionNumberOfControls`}>Nombre total de contrôles réalisés</Form.ControlLabel>
          <Field name={`actions.${actionIndex}.actionNumberOfControls`} />
          
          <Form.ControlLabel htmlFor={`actions.${actionIndex}.actionTargetType`}>Type de cible</Form.ControlLabel>
          <Field name={`actions.${actionIndex}.actionTargetType`} />
          
          <Form.ControlLabel htmlFor={`actions.${actionIndex}.actionControlType`}>Contrôle en</Form.ControlLabel>
          <Field name={`actions.${actionIndex}.actionControlType`} />

          <FieldArray name={`actions[${actionIndex}].infractions`} render={(props)=>(<InfractionsForm {...props} actionIndex={actionIndex} />)} />
        </Form.Group>
      </ActionFormWrapper>
)}

const ActionFormWrapper = styled.div`
`
const Title = styled.h3``

const NoSelectedAction = styled.div`
  text-align: center;
`

const TrashIcon = styled(TrashSVG)`
  width: 40px;
  color: ${COLORS.red}
  transition: all 0.2s;
`
