import { FormikCheckbox, FormikDatePicker, FormikNumberInput, FormikTextarea } from '@mtes-mct/monitor-ui'
import { Form, IconButton } from 'rsuite'
import styled from 'styled-components'

import { COLORS } from '../../../../constants/constants'
import { InteractionListener } from '../../../../domain/entities/map/constants'
import { useNewWindow } from '../../../../ui/NewWindow'
import { ReactComponent as DeleteSVG } from '../../../../uiMonitor/icons/Delete.svg'
import { ReactComponent as SurveillanceIconSVG } from '../../../../uiMonitor/icons/Observation.svg'
import { MultiZonePicker } from '../../MultiZonePicker'
import { SurveillanceThemes } from './Themes/SurveillanceThemes'

export function SurveillanceForm({ currentActionIndex, readOnly, remove, setCurrentActionIndex }) {
  const { newWindowContainerRef } = useNewWindow()

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
          <SizedFormikInputNumberGhost isLight label="Durée" name={`envActions.${currentActionIndex}.duration`} />
          <InputDivWithUnits>&nbsp;heures</InputDivWithUnits>
        </Column>
      </FlexSelectorWrapper>
      <FormikCheckbox
        inline
        label="Dates et heures de surveillance équivalentes à celles de la mission"
        name={`envActions[${currentActionIndex}].durationMatchesMission`}
      />

      <MultiZonePicker
        addButtonLabel="Ajouter une zone de surveillance"
        interactionListener={InteractionListener.SURVEILLANCE_ZONE}
        isLight
        label="Zone de surveillance"
        name={`envActions[${currentActionIndex}].geom`}
        readOnly={readOnly}
      />
      <FormikCheckbox
        inline
        label="Zone de surveillance équivalente à la zone de mission"
        name={`envActions[${currentActionIndex}].coverMissionZone`}
      />

      <Form.Group>
        <Form.ControlLabel htmlFor={`envActions.${currentActionIndex}.observations`}> </Form.ControlLabel>
        <FormikTextarea isLight label="Observations" name={`envActions.${currentActionIndex}.observations`} />
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
  display: flex;
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
const SizedFormikInputNumberGhost = styled(FormikNumberInput)`
  width: 70px !important;
`
const InputDivWithUnits = styled.div`
  display: flex;
  align-items: baseline;
`
