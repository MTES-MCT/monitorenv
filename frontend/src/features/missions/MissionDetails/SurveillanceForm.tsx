import { useFormikContext } from 'formik'
import _ from 'lodash'
import { useMemo, useEffect } from 'react'
import { Form, IconButton } from 'rsuite'
import styled from 'styled-components'

import { useGetControlThemesQuery } from '../../../api/controlThemesAPI'
import { COLORS } from '../../../constants/constants'
import { usePrevious } from '../../../hooks/usePrevious'
import { FormikCheckbox } from '../../../uiMonitor/CustomFormikFields/FormikCheckbox'
import { FormikDatePicker } from '../../../uiMonitor/CustomFormikFields/FormikDatePicker'
import { FormikInputNumberGhost } from '../../../uiMonitor/CustomFormikFields/FormikInputNumber'
import { FormikTextarea } from '../../../uiMonitor/CustomFormikFields/FormikTextarea'
import { ReactComponent as DeleteSVG } from '../../../uiMonitor/icons/Delete.svg'
import { ReactComponent as SurveillanceIconSVG } from '../../../uiMonitor/icons/Observation.svg'
import { ControlThemeSelector } from './ControlThemeSelector'
import { SurveillanceZones } from './SurveillanceZones'

import type { MissionType, EnvActionControlType } from '../../../domain/entities/missions'

export function SurveillanceForm({ currentActionIndex, remove, setCurrentActionIndex }) {
  const {
    setFieldValue,
    values: { envActions }
  } = useFormikContext<MissionType<EnvActionControlType>>()

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
      <FlexSelectorWrapper>
        <Column>
          <FormikDatePicker
            ghost
            label="Date et heure du début de la surveillance"
            name={`envActions[${currentActionIndex}].actionStartDateTimeUtc`}
            withTime
          />
        </Column>
        <Column>
          <Form.ControlLabel htmlFor={`envActions.${currentActionIndex}.duration`}>Durée</Form.ControlLabel>
          <InputDivWithUnits>
            <SizedFormikInputNumberGhost name={`envActions.${currentActionIndex}.duration`} size="sm" />
            &nbsp;heures
          </InputDivWithUnits>
        </Column>
      </FlexSelectorWrapper>

      <SurveillanceZones name={`envActions[${currentActionIndex}].geom`} />
      <WhiteCheckbox
        inline
        label="Zone de surveillance équivalente à la zone de mission"
        name={`envActions[${currentActionIndex}].coverMissionZone`}
      />

      <Form.Group>
        <Form.ControlLabel htmlFor={`envActions.${currentActionIndex}.observations`}>Observations </Form.ControlLabel>
        <FormikTextarea classPrefix="input ghost" name={`envActions.${currentActionIndex}.observations`} />
      </Form.Group>
    </>
  )
}

const Header = styled.div`
  margin-bottom: 24px;
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
const FlexSelectorWrapper = styled(Form.Group)`
  height: 58px;
  display: flex;
`
const Column = styled.div`
  &:not(:last-child) {
    margin-right: 24px;
  }
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
const SizedFormikInputNumberGhost = styled(FormikInputNumberGhost)`
  width: 70px !important;
`
const InputDivWithUnits = styled.div`
  display: flex;
  align-items: baseline;
`

const WhiteCheckbox = styled(FormikCheckbox)`
  margin-left: -10px;
  margin-bottom: 32px;
  .rs-checkbox-wrapper .rs-checkbox-inner::before {
    background-color: ${COLORS.white};
  }

  .rs-checkbox-wrapper .rs-checkbox-inner::after {
    border-color: ${COLORS.charcoal};
  }
  &:hover .rs-checkbox-wrapper .rs-checkbox-inner::after {
    border-color: ${COLORS.white};
  }
`
