import { FormikCheckbox, FormikDatePicker, FormikTextarea } from '@mtes-mct/monitor-ui'
import { useField } from 'formik'
import { Form, IconButton } from 'rsuite'
import styled from 'styled-components'

import { COLORS } from '../../../../constants/constants'
import { InteractionListener } from '../../../../domain/entities/map/constants'
import { ActionTypeEnum, type EnvAction } from '../../../../domain/entities/missions'
import { useNewWindow } from '../../../../ui/NewWindow'
import { ReactComponent as DeleteSVG } from '../../../../uiMonitor/icons/Delete.svg'
import { ReactComponent as SurveillanceIconSVG } from '../../../../uiMonitor/icons/Observation.svg'
import { dateDifferenceInHours } from '../../../../utils/dateDifferenceInHours'
import { MultiZonePicker } from '../../MultiZonePicker'
import { SurveillanceThemes } from './Themes/SurveillanceThemes'

export function SurveillanceForm({ currentActionIndex, readOnly, remove, setCurrentActionIndex }) {
  const { newWindowContainerRef } = useNewWindow()

  const [actionsFields] = useField<EnvAction[]>('envActions')
  const [geomField, ,] = useField(`envActions[${currentActionIndex}].geom`)

  // const [durationMatchMissionField] = useField(`envActions[${currentActionIndex}].durationMatchesMission`)
  const [envActionField] = useField(`envActions[${currentActionIndex}]`)

  const hasCustomZone = geomField.value && geomField.value.coordinates.length > 0
  const surveillances = actionsFields.value.filter(action => action.actionType === ActionTypeEnum.SURVEILLANCE)

  const handleRemoveAction = () => {
    setCurrentActionIndex(undefined)
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
        <Form.Group>
          <Form.ControlLabel>Début et fin de surveillance (UTC)</Form.ControlLabel>
          <StyledDatePickerContainer>
            <FormikDatePicker
              baseContainer={newWindowContainerRef.current}
              // disabled={!!durationMatchMissionField.value}
              isCompact
              isLabelHidden
              isLight
              isStringDate
              label="Date et heure de début de surveillance (UTC)"
              name={`envActions[${currentActionIndex}].actionStartDateTimeUtc`}
              withTime
            />
            <FormikDatePicker
              baseContainer={newWindowContainerRef.current}
              // disabled={!!durationMatchMissionField.value}
              isCompact
              isLabelHidden
              isLight
              isStringDate
              label="Date et heure de fin de surveillance (UTC)"
              name={`envActions[${currentActionIndex}].actionEndDateTimeUtc`}
              withTime
            />
            {envActionField.value.actionStartDateTimeUtc && envActionField.value.actionEndDateTimeUtc && (
              <StyledDuration>{`(${dateDifferenceInHours(
                envActionField.value.actionStartDateTimeUtc,
                envActionField.value.actionEndDateTimeUtc
              )} heures)`}</StyledDuration>
            )}
          </StyledDatePickerContainer>
          <FormikCheckbox
            disabled={surveillances.length > 1}
            inline
            label="Dates et heures de surveillance équivalentes à celles de la mission"
            name={`envActions[${currentActionIndex}].durationMatchesMission`}
          />
        </Form.Group>
      </FlexSelectorWrapper>

      <MultiZonePicker
        addButtonLabel="Ajouter une zone de surveillance"
        currentActionIndex={currentActionIndex}
        interactionListener={InteractionListener.SURVEILLANCE_ZONE}
        isLight
        label="Zone de surveillance"
        name={`envActions[${currentActionIndex}].geom`}
        readOnly={readOnly}
      />
      <FormikCheckbox
        disabled={hasCustomZone}
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

const FlexSelectorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
`
const StyledDatePickerContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
`
const StyledDuration = styled.div`
  font-size: 13px;
  color: ${COLORS.slateGray};
  margin-left: 8px;
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
