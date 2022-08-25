import React from 'react'
import { Form, IconButton } from 'rsuite'
import { useField } from 'formik'
import styled from 'styled-components'

import { FormikTextarea } from '../../../uiMonitor/CustomFormikFields/FormikTextarea'

import { actionTypeEnum } from '../../../domain/entities/missions';

import { ReactComponent as NoteSVG } from '../../../uiMonitor/icons/note_libre.svg'
import { ReactComponent as DeleteSVG } from '../../../uiMonitor/icons/Suppression_clair.svg'
import { COLORS } from '../../../constants/constants'


export const NoteForm = ({ remove, currentActionIndex, setCurrentActionIndex }) => {
  const [ actionTypeField ] = useField(`envActions.${currentActionIndex}.actionType`)

  const handleRemoveAction = () => {
    setCurrentActionIndex(null)
    remove(currentActionIndex)
  }
  
  return (<>
    <Header>
      <NoteIcon/>
      <Title>{actionTypeEnum[actionTypeField.value]?.libelle}</Title>
      <IconButtonRight appearance='ghost' icon={<DeleteIcon className={"rs-icon"}/>} size="sm" title={"supprimer"} onClick={handleRemoveAction} >Supprimer</IconButtonRight>
    </Header>
    
    <Form.Group>
      <Form.ControlLabel htmlFor={`envActions.${currentActionIndex}.observations`}>Observations </Form.ControlLabel>
      <FormikTextarea classPrefix='input ghost' name={`envActions.${currentActionIndex}.observations`} />
    </Form.Group>
 
      
  </>)
}


const Header = styled.div`
  margin-bottom: 32px;
  display: flex;
`

const Title = styled.h2`
  font-size: 16px;
  line-height: 22px;
  display: inline-block;
  color: ${COLORS.charcoal}
`

const NoteIcon = styled(NoteSVG)`
  color: ${COLORS.gunMetal};
  margin-right: 8px;
  width: 18px;
`

const DeleteIcon = styled(DeleteSVG)`
  color: ${COLORS.maximumRed};
`

const IconButtonRight = styled(IconButton)`
  margin-left: auto;
`
