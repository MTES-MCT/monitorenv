import { FormikCheckbox, FormikDateRangePicker, FormikTextarea } from '@mtes-mct/monitor-ui'
import { useField } from 'formik'
import { Form, IconButton } from 'rsuite'
import styled from 'styled-components'

import { COLORS } from '../../../../constants/constants'
import { InteractionListener } from '../../../../domain/entities/map/constants'
import { ActionTypeEnum, type EnvAction } from '../../../../domain/entities/missions'
import { useNewWindow } from '../../../../ui/NewWindow'
import { ReactComponent as DeleteSVG } from '../../../../uiMonitor/icons/Delete.svg'
import { ReactComponent as SurveillanceIconSVG } from '../../../../uiMonitor/icons/Observation.svg'
import { MultiZonePicker } from '../../MultiZonePicker'
import { SurveillanceThemes } from './Themes/SurveillanceThemes'

export function SurveillanceForm({ currentActionIndex, readOnly, remove, setCurrentActionIndex }) {
  const { newWindowContainerRef } = useNewWindow()
  const [actionsFields] = useField<EnvAction[]>('envActions')
  const [field, ,] = useField(`envActions[${currentActionIndex}].geom`)
  const [durationMatchMissionField] = useField(`envActions[${currentActionIndex}].durationMatchesMission`)
  const [durationField] = useField(`envActions[${currentActionIndex}].duration`)

  const hasCustomZone = field.value && field.value.coordinates.length > 0

  const totalSurveillances = actionsFields.value.filter(
    action => action.actionType === ActionTypeEnum.SURVEILLANCE
  ).length

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
        <FormikDateRangePicker
          baseContainer={newWindowContainerRef.current}
          disabled={!!durationMatchMissionField.value}
          isCompact
          isLight
          isStringDate
          label="Date et fin de surveillance (UTC)"
          name={`envActions[${currentActionIndex}].dateRange`}
          withTime
        />

        <FormikCheckbox
          disabled={totalSurveillances > 1}
          inline
          label="Dates et heures de surveillance équivalentes à celles de la mission"
          name={`envActions[${currentActionIndex}].durationMatchesMission`}
        />
        <div>{`Durée : ${durationField?.value || 0} H`}</div>
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
