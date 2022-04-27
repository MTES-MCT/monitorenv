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
  console.log("singleform", actionIndex)
  if (actionIndex === null) {
    return (<NoSelectedAction>Ajouter ou sélectionner une action</NoSelectedAction>)
  }

  const handleRemoveAction = () => {
    remove(actionIndex)
    setCurrentActionIndex(null)
  }

  return (
      <div>
        <SecondaryButton type="button" onClick={handleRemoveAction}>
          <TrashIcon /> Supprimer
        </SecondaryButton>

        <Form.Group>
          <Form.ControlLabel>Thématique du contrôle</Form.ControlLabel>
          <Field name={`actions.${actionIndex}.actionTheme`} />
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel htmlFor={`actions[${actionIndex}].actionStartDatetimeUtc`} >Date et heure du début du contrôle </Form.ControlLabel>
          <FormikDatePicker name={`actions[${actionIndex}].actionStartDatetimeUtc`} placeholder={'Date et heure du début du contrôle'} oneTap/>
          <Field name={`actions.${actionIndex}.actionEndDatetimeUtc`} />
          
          <Form.ControlLabel>Nombre total de contrôles réalisés</Form.ControlLabel>
          <Field name={`actions.${actionIndex}.actionNumberOfControls`} />
          
          <Form.ControlLabel>Type d&apos;activité (type de cibles)</Form.ControlLabel>
          <Field name={`actions.${actionIndex}.actionActivityType`} />

          <FieldArray name={`actions[${actionIndex}].infractions`} render={(props)=>(<InfractionsForm {...props} actionIndex={actionIndex} />)} />
        </Form.Group>

        
      </div>
)}

const NoSelectedAction = styled.div`
  text-align: center;
`

const TrashIcon = styled(TrashSVG)`
  width: 40px;
  color: ${COLORS.red}
  transition: all 0.2s;
`
