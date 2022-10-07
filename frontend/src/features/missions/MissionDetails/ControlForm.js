import { format, isValid } from 'date-fns'
import { fr } from 'date-fns/locale'
import { FieldArray, useField, useFormikContext } from 'formik'
import _ from 'lodash'
import React, { useEffect, useMemo } from 'react'
import { Form, IconButton } from 'rsuite'
import styled from 'styled-components'

import { useGetControlThemesQuery } from '../../../api/controlThemesAPI'
import { COLORS } from '../../../constants/constants'
import { THEME_REQUIRE_PROTECTED_SPECIES } from '../../../domain/entities/missions'
import { usePrevious } from '../../../hooks/usePrevious'
import { FormikDatePicker, placeholderDateTimePicker } from '../../../uiMonitor/CustomFormikFields/FormikDatePicker'
import { FormikInputGhost } from '../../../uiMonitor/CustomFormikFields/FormikInput'
import { ReactComponent as ControlIconSVG } from '../../../uiMonitor/icons/Control.svg'
import { ReactComponent as DeleteSVG } from '../../../uiMonitor/icons/Delete.svg'
import { ActionTargetSelector } from './ActionTargetSelector'
import { ControlPositions } from './ControlPositions'
import { ControlThemeSelector } from './ControlThemeSelector'
import { InfractionsForm } from './InfractionsForm'
import { ProtectedSpeciesSelector } from './ProtectedSpeciesSelector'
import { VehicleTypeSelector } from './VehicleTypeSelector'

export function ControlForm({ currentActionIndex, remove, setCurrentActionIndex }) {
  const {
    setFieldValue,
    values: { envActions }
  } = useFormikContext()
  const [actionStartDatetimeUtcField] = useField(`envActions.${currentActionIndex}.actionStartDatetimeUtc`)
  const parsedActionStartDatetimeUtc = new Date(actionStartDatetimeUtcField.value)
  const actionTheme = envActions[currentActionIndex]?.actionTheme
  const protectedSpecies = envActions[currentActionIndex]?.protectedSpecies

  const { data, isError, isLoading } = useGetControlThemesQuery()
  const themes = useMemo(() => _.uniqBy(data, 'themeLevel1'), [data])
  const subThemes = useMemo(() => _.filter(data, t => t.themeLevel1 === actionTheme), [data, actionTheme])

  const previousActionTheme = usePrevious(actionTheme)

  useEffect(() => {
    if (previousActionTheme && previousActionTheme !== actionTheme) {
      setFieldValue(`envActions.${currentActionIndex}.actionSubTheme`, '')
    }
    if (protectedSpecies?.length > 0 && !THEME_REQUIRE_PROTECTED_SPECIES.includes(actionTheme)) {
      setFieldValue(`envActions.${currentActionIndex}.protectedSpecies`, [])
    }
  }, [previousActionTheme, actionTheme, protectedSpecies, currentActionIndex, setFieldValue])

  const handleRemoveAction = () => {
    setCurrentActionIndex(null)
    remove(currentActionIndex)
  }

  return (
    <>
      <Header>
        <ControlIcon />
        <Title>Contrôle</Title>
        <SubTitle>
          &nbsp;(
          {isValid(parsedActionStartDatetimeUtc) &&
            format(parsedActionStartDatetimeUtc, 'dd MMM à HH:mm', { locale: fr })}
          )
        </SubTitle>
        <IconButtonRight
          appearance="ghost"
          icon={<DeleteIcon className="rs-icon" />}
          onClick={handleRemoveAction}
          title="supprimer"
        >
          Supprimer
        </IconButtonRight>
      </Header>
      {isError && <Msg>Erreur au chargement des thèmes</Msg>}
      {isLoading && <Msg>Chargement des thèmes</Msg>}
      {!isError && !isLoading && (
        <>
          <SelectorWrapper>
            <Form.ControlLabel htmlFor={`envActions.${currentActionIndex}.actionTheme`}>
              Thématique de contrôle
            </Form.ControlLabel>
            <ControlThemeSelector
              name={`envActions.${currentActionIndex}.actionTheme`}
              themes={themes}
              valueKey="themeLevel1"
            />
          </SelectorWrapper>
          <SelectorWrapper>
            <Form.ControlLabel htmlFor={`envActions.${currentActionIndex}.actionSubTheme`}>
              Sous-thématique de contrôle
            </Form.ControlLabel>
            <ControlThemeSelector
              name={`envActions.${currentActionIndex}.actionSubTheme`}
              themes={subThemes}
              valueKey="themeLevel2"
            />
          </SelectorWrapper>

          {THEME_REQUIRE_PROTECTED_SPECIES.includes(actionTheme) && (
            <SelectorWrapper>
              <ProtectedSpeciesSelector name={`envActions.${currentActionIndex}.protectedSpecies`} />
            </SelectorWrapper>
          )}
        </>
      )}

      <Form.Group>
        <Form.ControlLabel htmlFor={`envActions[${currentActionIndex}].actionStartDatetimeUtc`}>
          Date et heure du contrôle
        </Form.ControlLabel>
        <FormikDatePicker
          format="dd MMM yyyy, HH:mm"
          ghost
          name={`envActions[${currentActionIndex}].actionStartDatetimeUtc`}
          oneTap
          placeholder={placeholderDateTimePicker}
        />
      </Form.Group>

      <ControlPositions name={`envActions[${currentActionIndex}].geom`} />

      <Separator />

      <ActionSummary>
        <ActionFieldWrapper>
          <Form.ControlLabel htmlFor={`envActions.${currentActionIndex}.actionNumberOfControls`}>
            Nombre total de contrôles
          </Form.ControlLabel>
          <FormikInputGhost name={`envActions.${currentActionIndex}.actionNumberOfControls`} size="sm" />
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
        render={props => <InfractionsForm currentActionIndex={currentActionIndex} {...props} />}
      />
    </>
  )
}

const Header = styled.div`
  margin-bottom: 32px;
  display: flex;
`

const Title = styled.h2`
  font-size: 16px;
  line-height: 22px;
  display: inline-block;
  color: ${COLORS.charcoal};
`

const Msg = styled.div``

const SelectorWrapper = styled.div`
  height: 58px;
  margin-bottom: 16px;
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
  :not(:first-child) {
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
