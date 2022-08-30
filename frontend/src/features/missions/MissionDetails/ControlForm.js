import React, { useEffect, useMemo } from 'react'
import { Form, IconButton } from 'rsuite'
import {  FieldArray, useField, useFormikContext } from 'formik'
import styled from 'styled-components'
import { format, isValid } from 'date-fns'
import { fr } from 'date-fns/locale'
import _ from 'lodash'

import { useGetControlThemesQuery } from '../../../api/controlThemesAPI'

import { usePrevious } from '../../../hooks/usePrevious'
import { FormikDatePicker, placeholderDateTimePicker } from '../../../uiMonitor/CustomFormikFields/FormikDatePicker';
import { FormikInputGhost } from '../../../uiMonitor/CustomFormikFields/FormikInput'

import { InfractionsForm } from './InfractionsForm'
import { ControlThemeSelector } from './ControlThemeSelector'
import { ProtectedSpeciesSelector } from './ProtectedSpeciesSelector';
import { ActionTargetSelector } from './ActionTargetSelector';
import { VehicleTypeSelector } from './VehicleTypeSelector';
import { ControlPositions } from './ControlPositions';

import { THEME_REQUIRE_PROTECTED_SPECIES } from '../../../domain/entities/missions';

import { ReactComponent as DeleteSVG } from '../../../uiMonitor/icons/Suppression_clair.svg'
import { ReactComponent as ControlIconSVG } from '../../../uiMonitor/icons/controles.svg'
import { COLORS } from '../../../constants/constants'

export const ControlForm = ({ remove, currentActionIndex, setCurrentActionIndex }) => {
  const { values: { envActions }, setFieldValue } = useFormikContext();
  const [ actionStartDatetimeUtcField ] = useField(`envActions.${currentActionIndex}.actionStartDatetimeUtc`)
  const parsedActionStartDatetimeUtc = new Date(actionStartDatetimeUtcField.value)
  const actionTheme = envActions[currentActionIndex]?.actionTheme
  const protectedSpecies = envActions[currentActionIndex]?.protectedSpecies

  const { data, isError, isLoading } = useGetControlThemesQuery()
  const themes = useMemo(()=> _.uniqBy(data, 'theme_level_1'), [data])
  const subThemes = useMemo(()=>_.filter(data, (t)=> {return t.theme_level_1 === actionTheme}), [data, actionTheme])
  
  const previousActionTheme = usePrevious(actionTheme)
  
  useEffect(()=> {
    if (previousActionTheme && previousActionTheme !== actionTheme) {
      setFieldValue(`envActions.${currentActionIndex}.actionSubTheme`, '')
    }
    if ((protectedSpecies?.length > 0) && !THEME_REQUIRE_PROTECTED_SPECIES.includes(actionTheme)) {
      setFieldValue(`envActions.${currentActionIndex}.protectedSpecies`, [])
    }
  }, [previousActionTheme, actionTheme, protectedSpecies, currentActionIndex, setFieldValue])
  
  const handleRemoveAction = () => {
    setCurrentActionIndex(null)
    remove(currentActionIndex)
  }

  return (<>
    <Header>
      <ControlIcon/>
      <Title>Contrôle</Title>
      <SubTitle>&nbsp;({isValid(parsedActionStartDatetimeUtc) && format(parsedActionStartDatetimeUtc, "dd MMM à HH:mm", {locale: fr})})</SubTitle>
      <IconButtonRight appearance='ghost' icon={<DeleteIcon className={"rs-icon"}/>} size="sm" title={"supprimer"} onClick={handleRemoveAction} >Supprimer</IconButtonRight>
    </Header>
    {isError && <Msg>Erreur au chargement des thèmes</Msg>}
    {isLoading && <Msg>Chargement des thèmes</Msg>}
    {!isError && !isLoading && <>
      <SelectorWrapper>
        <Form.ControlLabel htmlFor={`envActions.${currentActionIndex}.actionTheme`}>Thématique de contrôle</Form.ControlLabel>
        <ControlThemeSelector themes={themes} valueKey={"theme_level_1"} name={`envActions.${currentActionIndex}.actionTheme`} />
      </SelectorWrapper>
      <SelectorWrapper>
        <Form.ControlLabel htmlFor={`envActions.${currentActionIndex}.actionSubTheme`}>Sous-thématique de contrôle</Form.ControlLabel>
        <ControlThemeSelector themes={subThemes} valueKey={"theme_level_2"} name={`envActions.${currentActionIndex}.actionSubTheme`} />
      </SelectorWrapper>

      {
        THEME_REQUIRE_PROTECTED_SPECIES.includes(actionTheme) &&
        <SelectorWrapper>
          <ProtectedSpeciesSelector name={`envActions.${currentActionIndex}.protectedSpecies`} />
        </SelectorWrapper>
      }
    </>}
    
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

    <ActionSummary>
      <ActionFieldWrapper>
        <Form.ControlLabel htmlFor={`envActions.${currentActionIndex}.actionNumberOfControls`}>
          Nombre total de contrôles
        </Form.ControlLabel>
        <FormikInputGhost size="sm" name={`envActions.${currentActionIndex}.actionNumberOfControls`} />
      </ActionFieldWrapper>
      <ActionFieldWrapper>
        <ActionTargetSelector currentActionIndex={currentActionIndex} />
      </ActionFieldWrapper>
      <ActionFieldWrapper>
        <VehicleTypeSelector currentActionIndex={currentActionIndex} />
      </ActionFieldWrapper>
    </ActionSummary>

    <FieldArray 
      name={`envActions[${currentActionIndex}].infractions`} 
      render={(props)=>(<InfractionsForm 
        currentActionIndex={currentActionIndex} 
        {...props} 
         />
      )} />
      
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

const Msg = styled.div`
`

const SelectorWrapper = styled(Form.Group)`
  height: 58px;
`

const Separator = styled.hr`
  border-color: ${COLORS.gunMetal};
`
  
const ActionSummary = styled(Form.Group)`
  height: 58px;
  flex-shrink: 0;
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
const DeleteIcon = styled(DeleteSVG)`
  color: ${COLORS.maximumRed};
`

const IconButtonRight = styled(IconButton)`
  margin-left: auto;
`