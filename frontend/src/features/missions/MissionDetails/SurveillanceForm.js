import { useFormikContext } from 'formik'
import _ from 'lodash'
import React, { useMemo, useEffect } from 'react'
import { Form, IconButton } from 'rsuite'
import styled from 'styled-components'

import { useGetControlThemesQuery } from '../../../api/controlThemesAPI'
import { COLORS } from '../../../constants/constants'
import { usePrevious } from '../../../hooks/usePrevious'
import { FormikDatePicker, placeholderDateTimePicker } from '../../../uiMonitor/CustomFormikFields/FormikDatePicker'
import { FormikInputGhost } from '../../../uiMonitor/CustomFormikFields/FormikInput'
import { FormikTextarea } from '../../../uiMonitor/CustomFormikFields/FormikTextarea'
import { ReactComponent as DeleteSVG } from '../../../uiMonitor/icons/Suppression_clair.svg'
import { ReactComponent as SurveillanceIconSVG } from '../../../uiMonitor/icons/surveillance_18px.svg'
import { ControlThemeSelector } from './ControlThemeSelector'

export function SurveillanceForm({ currentActionIndex, remove, setCurrentActionIndex }) {
  const {
    setFieldValue,
    values: { envActions }
  } = useFormikContext()

  const actionTheme = envActions[currentActionIndex]?.actionTheme

  const { data, isError, isLoading } = useGetControlThemesQuery()
  const themes = useMemo(() => _.uniqBy(data, 'themeLevel1'), [data])
  const subThemes = useMemo(() => _.filter(data, t => t.themeLevel1 === actionTheme), [data, actionTheme])

  const previousActionTheme = usePrevious(actionTheme)

  useEffect(() => {
    if (previousActionTheme && previousActionTheme !== actionTheme) {
      setFieldValue(`envActions.${currentActionIndex}.actionSubTheme`, '')
    }
  }, [previousActionTheme, actionTheme, currentActionIndex, setFieldValue])

  const handleRemoveAction = () => {
    setCurrentActionIndex(null)
    remove(currentActionIndex)
  }

  return (
    <>
      <Header>
        <SurveillanceIcon />
        <Title>Surveillance</Title>
        <IconButtonRight
          appearance="ghost"
          icon={<DeleteIcon className="rs-icon" />}
          onClick={handleRemoveAction}
          size="sm"
          title="supprimer"
        >
          Supprimer
        </IconButtonRight>
      </Header>
      {!isError && !isLoading && (
        <>
          <SelectorWrapper>
            <Form.ControlLabel htmlFor={`envActions.${currentActionIndex}.actionTheme`}>Thématique</Form.ControlLabel>
            <ControlThemeSelector
              name={`envActions.${currentActionIndex}.actionTheme`}
              themes={themes}
              valueKey="themeLevel1"
            />
          </SelectorWrapper>
          <SelectorWrapper>
            <Form.ControlLabel htmlFor={`envActions.${currentActionIndex}.actionSubTheme`}>
              Sous-thématique
            </Form.ControlLabel>
            <ControlThemeSelector
              name={`envActions.${currentActionIndex}.actionSubTheme`}
              themes={subThemes}
              valueKey="themeLevel2"
            />
          </SelectorWrapper>
        </>
      )}

      <SelectorWrapper>
        <Form.ControlLabel htmlFor={`envActions[${currentActionIndex}].actionStartDatetimeUtc`}>
          Date et heure de début{' '}
        </Form.ControlLabel>
        <FormikDatePicker
          format="dd MMM yyyy, HH:mm"
          ghost
          name={`envActions[${currentActionIndex}].actionStartDatetimeUtc`}
          oneTap
          placeholder={placeholderDateTimePicker}
        />
      </SelectorWrapper>

      <Form.Group>
        <Form.ControlLabel htmlFor={`envActions.${currentActionIndex}.duration`}>Durée</Form.ControlLabel>
        <FormikInputGhost name={`envActions.${currentActionIndex}.duration`} size="sm" />
      </Form.Group>

      <Form.Group>
        <Form.ControlLabel htmlFor={`envActions.${currentActionIndex}.observations`}>Observations </Form.ControlLabel>
        <FormikTextarea classPrefix="input ghost" name={`envActions.${currentActionIndex}.observations`} />
      </Form.Group>
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
