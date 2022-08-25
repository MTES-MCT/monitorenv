import React, { useMemo, useEffect } from 'react'
import { Form, IconButton } from 'rsuite'
import { useFormikContext } from 'formik'
import styled from 'styled-components'
import _ from 'lodash'

import { useGetControlThemesQuery } from '../../../api/controlThemesAPI'

import { usePrevious } from '../../../hooks/usePrevious'
import { FormikDatePicker, placeholderDateTimePicker } from '../../../uiMonitor/CustomFormikFields/FormikDatePicker';
import { FormikTextarea } from '../../../uiMonitor/CustomFormikFields/FormikTextarea'
import { FormikInputGhost } from '../../../uiMonitor/CustomFormikFields/FormikInput'

import { ControlThemeSelector } from './ControlThemeSelector'

import { ReactComponent as SurveillanceIconSVG } from '../../../uiMonitor/icons/surveillance_18px.svg'
import { ReactComponent as DeleteSVG } from '../../../uiMonitor/icons/Suppression_clair.svg'
import { COLORS } from '../../../constants/constants'


export const SurveillanceForm = ({ remove, currentActionIndex, setCurrentActionIndex }) => {
  const { values: { envActions }, setFieldValue } = useFormikContext();
  
  const actionTheme = envActions[currentActionIndex]?.actionTheme
  
  const { data, isError, isLoading } = useGetControlThemesQuery()
  const themes = useMemo(()=> _.uniqBy(data, 'theme_level_1'), [data])
  const subThemes = useMemo(()=>_.filter(data, (t)=> {return t.theme_level_1 === actionTheme}), [data, actionTheme])

  const previousActionTheme = usePrevious(actionTheme)
  
  useEffect(()=> {
    if (previousActionTheme && previousActionTheme !== actionTheme) {
      setFieldValue(`envActions.${currentActionIndex}.actionSubTheme`, '')
    }
  }, [previousActionTheme, actionTheme, currentActionIndex, setFieldValue])
  
  const handleRemoveAction = () => {
    setCurrentActionIndex(null)
    remove(currentActionIndex)
  }
  
  return (<>
    <Header>
      <SurveillanceIcon/>
      <Title>Surveillance</Title>
      <IconButtonRight appearance='ghost' icon={<DeleteIcon className={"rs-icon"}/>} size="sm" title={"supprimer"} onClick={handleRemoveAction} >Supprimer</IconButtonRight>
    </Header>
    {
      !isError && !isLoading && <>
        <SelectorWrapper>
          <Form.ControlLabel htmlFor={`envActions.${currentActionIndex}.actionTheme`}>Thématique</Form.ControlLabel>
          <ControlThemeSelector themes={themes} valueKey={"theme_level_1"} name={`envActions.${currentActionIndex}.actionTheme`} />
        </SelectorWrapper>
        <SelectorWrapper>
          <Form.ControlLabel htmlFor={`envActions.${currentActionIndex}.actionSubTheme`}>Sous-thématique</Form.ControlLabel>
          <ControlThemeSelector themes={subThemes} valueKey={"theme_level_2"} name={`envActions.${currentActionIndex}.actionSubTheme`} />
        </SelectorWrapper>
        </>
    }
    
    <SelectorWrapper>
      <Form.ControlLabel htmlFor={`envActions[${currentActionIndex}].actionStartDatetimeUtc`} >Date et heure de début </Form.ControlLabel>
      <FormikDatePicker 
        ghost
        name={`envActions[${currentActionIndex}].actionStartDatetimeUtc`} 
        placeholder={placeholderDateTimePicker} 
        format="dd MMM yyyy, HH:mm" 
        oneTap/>
    </SelectorWrapper>
   
    <Form.Group>
      <Form.ControlLabel htmlFor={`envActions.${currentActionIndex}.duration`}>Durée</Form.ControlLabel>
      <FormikInputGhost size="sm" name={`envActions.${currentActionIndex}.duration`} />
    </Form.Group>
    
    <Form.Group>
      <Form.ControlLabel htmlFor={`envActions.${currentActionIndex}.observations`}>Observations </Form.ControlLabel>
      <FormikTextarea
        classPrefix='input ghost'
       name={`envActions.${currentActionIndex}.observations`} />
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

const SelectorWrapper = styled(Form.Group)`
  height: 58px;
`

const SurveillanceIcon = styled(SurveillanceIconSVG)`
  margin-right: 8px;
  height: 24px;
  color: ${COLORS.gunMetal};
`
const DeleteIcon = styled(DeleteSVG)`
  color: ${COLORS.maximumRed};
`

const IconButtonRight = styled(IconButton)`
  margin-left: auto;
`
