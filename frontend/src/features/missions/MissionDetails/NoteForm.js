import React from 'react'
import { Form } from 'rsuite'
import { useField } from 'formik'
import styled from 'styled-components'
import TrashIcon from '@rsuite/icons/Trash';

import { FormikTextarea } from '../../commonComponents/CustomFormikFields/FormikTextarea'
import { COLORS } from '../../../constants/constants'
import { actionTypeEnum } from '../../../domain/entities/missions';


export const NoteForm = ({ remove, currentActionIndex, setCurrentActionIndex }) => {
  const [ actionTypeField ] = useField(`envActions.${currentActionIndex}.actionType`)

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
      <Form.ControlLabel htmlFor={`envActions.${currentActionIndex}.observations`}>Observations </Form.ControlLabel>
      <FormikTextarea classPrefix='input ghost' name={`envActions.${currentActionIndex}.observations`} />
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
