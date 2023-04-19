import { FormikDatePicker } from '@mtes-mct/monitor-ui'
import { Form, IconButton } from 'rsuite'
import styled from 'styled-components'

import { COLORS } from '../../../../constants/constants'
import { InteractionListener } from '../../../../domain/entities/map/constants'
import { useNewWindow } from '../../../../ui/NewWindow'
import { FormikCheckbox } from '../../../../uiMonitor/CustomFormikFields/FormikCheckbox'
import { FormikInputNumberGhost } from '../../../../uiMonitor/CustomFormikFields/FormikInputNumber'
import { FormikTextarea } from '../../../../uiMonitor/CustomFormikFields/FormikTextarea'
import { ReactComponent as DeleteSVG } from '../../../../uiMonitor/icons/Delete.svg'
import { ReactComponent as SurveillanceIconSVG } from '../../../../uiMonitor/icons/Observation.svg'
import { MultiZonePicker } from '../../MultiZonePicker'
import { SurveillanceThemes } from './Themes/SurveillanceThemes'

export function SurveillanceForm({ currentActionIndex, remove, setCurrentActionIndex }) {
  const { newWindowContainerRef } = useNewWindow()

  const handleRemoveAction = () => {
    setCurrentActionIndex(null)
    remove(currentActionIndex)
  }
  console.log('test', test)

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
      <SurveillanceThemes currentActionIndex={currentActionIndex} />
      <FlexSelectorWrapper>
        <Column>
          <FormikDatePicker
            baseContainer={newWindowContainerRef.current}
            isCompact
            isLight
            isStringDate
            label="Date et heure du début de la surveillance (UTC)"
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

      <MultiZonePicker
        addButtonLabel="Ajouter une zone de surveillance"
        interactionListener={InteractionListener.SURVEILLANCE_ZONE}
        isLight
        label="Zone de surveillance"
        name={`envActions[${currentActionIndex}].geom`}
      />
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
