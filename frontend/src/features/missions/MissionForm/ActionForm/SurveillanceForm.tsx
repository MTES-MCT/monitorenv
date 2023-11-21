import {
  FieldError,
  FormikCheckbox,
  FormikDatePicker,
  FormikTextarea,
  pluralize,
  useNewWindow
} from '@mtes-mct/monitor-ui'
import { useField } from 'formik'
import { useMemo } from 'react'
import { Form, IconButton } from 'rsuite'
import styled from 'styled-components'

import { SurveillanceThemes } from './Themes/SurveillanceThemes'
import { InteractionListener } from '../../../../domain/entities/map/constants'
import { ActionTypeEnum, type EnvAction } from '../../../../domain/entities/missions'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { ReactComponent as DeleteSVG } from '../../../../uiMonitor/icons/Delete.svg'
import { ReactComponent as SurveillanceIconSVG } from '../../../../uiMonitor/icons/Observation.svg'
import { dateDifferenceInHours } from '../../../../utils/dateDifferenceInHours'
import { MultiZonePicker } from '../../MultiZonePicker'

export function SurveillanceForm({ currentActionIndex, remove, setCurrentActionIndex }) {
  const { newWindowContainerRef } = useNewWindow()

  const [actionsFields] = useField<EnvAction[]>('envActions')
  const envActionIndex = actionsFields.value.findIndex(envAction => envAction.id === String(currentActionIndex))

  const [, actionStartDateMeta] = useField(`envActions[${envActionIndex}].actionStartDateTimeUtc`)
  const [, actionEndDateMeta] = useField(`envActions[${envActionIndex}].actionEndDateTimeUtc`)

  const [geomField, ,] = useField(`envActions[${envActionIndex}].geom`)

  const [durationMatchMissionField] = useField(`envActions[${envActionIndex}].durationMatchesMission`)
  const [envActionField] = useField(`envActions[${envActionIndex}]`)

  const hasCustomZone = geomField.value && geomField.value.coordinates.length > 0
  const surveillances = actionsFields.value.filter(action => action.actionType === ActionTypeEnum.SURVEILLANCE)

  const { listener } = useAppSelector(state => state.draw)
  const isEditingZone = useMemo(() => listener === InteractionListener.SURVEILLANCE_ZONE, [listener])

  const duration = dateDifferenceInHours(
    envActionField.value.actionStartDateTimeUtc,
    envActionField.value.actionEndDateTimeUtc
  )

  const handleRemoveAction = () => {
    setCurrentActionIndex(undefined)
    remove(envActionIndex)
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
      <SurveillanceThemes envActionIndex={envActionIndex} />
      <FlexSelectorWrapper>
        <Form.Group>
          <Form.ControlLabel>Début et fin de surveillance (UTC)</Form.ControlLabel>
          <StyledDatePickerContainer>
            <StyledFormikDatePicker
              key={`start-date-${durationMatchMissionField.value}`}
              baseContainer={newWindowContainerRef.current}
              data-cy="surveillance-start-date-time"
              disabled={!!durationMatchMissionField.value}
              isCompact
              isErrorMessageHidden
              isLabelHidden
              isLight
              isStringDate
              isUndefinedWhenDisabled={false}
              label="Date et heure de début de surveillance (UTC)"
              name={`envActions[${envActionIndex}].actionStartDateTimeUtc`}
              withTime
            />
            <StyledFormikDatePicker
              key={`end-date-${durationMatchMissionField.value}`}
              baseContainer={newWindowContainerRef.current}
              data-cy="surveillance-end-date-time"
              disabled={!!durationMatchMissionField.value}
              isCompact
              isErrorMessageHidden
              isLabelHidden
              isLight
              isStringDate
              isUndefinedWhenDisabled={false}
              label="Date et heure de fin de surveillance (UTC)"
              name={`envActions[${envActionIndex}].actionEndDateTimeUtc`}
              withTime
            />
            {envActionField.value.actionStartDateTimeUtc && envActionField.value.actionEndDateTimeUtc && (
              <StyledDuration>
                {duration === 0 ? "(Moins d'1 heure)" : `(${duration} ${pluralize('heure', duration)})`}
              </StyledDuration>
            )}
          </StyledDatePickerContainer>
          {actionStartDateMeta.error && <FieldError>{actionStartDateMeta.error}</FieldError>}
          {actionEndDateMeta.error && <FieldError>{actionEndDateMeta.error}</FieldError>}
          <StyledFormikCheckbox
            data-cy="surveillance-duration-matches-mission"
            disabled={surveillances.length > 1}
            inline
            label="Dates et heures de surveillance équivalentes à celles de la mission"
            name={`envActions[${envActionIndex}].durationMatchesMission`}
          />
        </Form.Group>
      </FlexSelectorWrapper>
      <FlexSelectorWrapper>
        <MultiZonePicker
          addButtonLabel="Ajouter une zone de surveillance"
          envActionIndex={envActionIndex}
          interactionListener={InteractionListener.SURVEILLANCE_ZONE}
          isLight
          label="Zone de surveillance"
          name={`envActions[${envActionIndex}].geom`}
        />
        <StyledFormikCheckbox
          data-cy="surveillance-zone-matches-mission"
          disabled={hasCustomZone || isEditingZone}
          inline
          label="Zone de surveillance équivalente à la zone de mission"
          name={`envActions[${envActionIndex}].coverMissionZone`}
        />
      </FlexSelectorWrapper>
      <Form.Group>
        <Form.ControlLabel htmlFor={`envActions.${envActionIndex}.observations`}> </Form.ControlLabel>
        <FormikTextarea isLight label="Observations" name={`envActions.${envActionIndex}.observations`} />
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
  color: ${p => p.theme.color.charcoal};
`

const FlexSelectorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 24px;
`
const StyledDatePickerContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: baseline;
  margin-bottom: 8px;
`
const StyledFormikDatePicker = styled(FormikDatePicker)`
  p {
    max-width: 200px;
  }
`
const StyledDuration = styled.div`
  font-size: 13px;
  color: ${p => p.theme.color.slateGray};
  margin-left: 8px;
`

const SurveillanceIcon = styled(SurveillanceIconSVG)`
  margin-right: 8px;
  height: 24px;
  color: ${p => p.theme.color.gunMetal};
`
const DeleteIcon = styled(DeleteSVG)`
  color: ${p => p.theme.color.maximumRed};
`

const IconButtonRight = styled(IconButton)`
  margin-left: auto;
`

const StyledFormikCheckbox = styled(FormikCheckbox)`
  margin-left: 0px;
  margin-top: 8px;
`
