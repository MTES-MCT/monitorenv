import {
  customDayjs,
  FieldError,
  FormikCheckbox,
  FormikTextarea,
  MultiCheckbox,
  pluralize,
  type OptionValueType,
  DatePicker,
  Accent,
  Icon,
  Size,
  THEME,
  Label,
  Toggle
} from '@mtes-mct/monitor-ui'
import { useField, useFormikContext } from 'formik'
import { useMemo, useState } from 'react'
import styled from 'styled-components'

import { Header, StyledDeleteButton, Title, TitleWithIcon } from './style'
import { SurveillanceThemes } from './Themes/SurveillanceThemes'
import { CONTROL_PLAN_INIT } from '../../../../domain/entities/controlPlan'
import { InteractionListener } from '../../../../domain/entities/map/constants'
import {
  ActionTypeEnum,
  type EnvAction,
  type EnvActionSurveillance,
  type Mission
} from '../../../../domain/entities/missions'
import { dateDifferenceInHours } from '../../../../utils/dateDifferenceInHours'
import { getFormattedReportingId } from '../../../Reportings/utils'
import { MultiZonePicker } from '../../MultiZonePicker'

export function SurveillanceForm({ currentActionIndex, remove, setCurrentActionIndex }) {
  const {
    setFieldValue,
    values: { attachedReportings, envActions, startDateTimeUtc }
  } = useFormikContext<Mission<EnvActionSurveillance>>()

  const [actionsFields] = useField<EnvAction[]>('envActions')
  const envActionIndex = actionsFields.value.findIndex(envAction => envAction.id === String(currentActionIndex))
  const currentAction = envActions[envActionIndex]

  const actionDate = envActions[envActionIndex]?.actionStartDateTimeUtc ?? startDateTimeUtc ?? new Date().toISOString()
  const actualYearForThemes = customDayjs(actionDate).year()

  const { reportingIds = [] } = currentAction ?? {}
  const [, actionStartDateMeta] = useField(`envActions[${envActionIndex}].actionStartDateTimeUtc`)
  const [, actionEndDateMeta] = useField(`envActions[${envActionIndex}].actionEndDateTimeUtc`)

  const [durationMatchMissionField] = useField(`envActions[${envActionIndex}].durationMatchesMission`)

  const [envActionField] = useField(`envActions[${envActionIndex}]`)

  const surveillances = actionsFields.value.filter(action => action.actionType === ActionTypeEnum.SURVEILLANCE)

  const [isReportingListVisible, setIsReportingListVisible] = useState<boolean>(reportingIds?.length >= 1)

  const reportingAsOptions = useMemo(
    () =>
      attachedReportings?.map(reporting => ({
        isDisabled:
          reporting.isControlRequired &&
          currentAction?.id !== reporting.attachedEnvActionId &&
          !!reporting.attachedEnvActionId,
        label: `Signalement ${getFormattedReportingId(reporting.reportingId)}`,
        value: reporting.id
      })) || [],
    [attachedReportings, currentAction]
  )

  const areAllReportingsAttachedToAnAction = useMemo(
    () =>
      attachedReportings &&
      attachedReportings.every(reporting => reporting.isControlRequired && reporting.attachedEnvActionId),
    [attachedReportings]
  )

  const updateIsSurveillanceAttachedToReporting = (checked: boolean | undefined) => {
    setIsReportingListVisible(checked ?? false)
    if (!checked) {
      attachedReportings.map((reporting, index) => {
        if (reporting.attachedEnvActionId === currentAction?.id) {
          return setFieldValue(`attachedReportings[${index}].attachedEnvActionId`, undefined)
        }

        return reporting
      })
      setFieldValue(`envActions[${envActionIndex}].reportingIds`, [])
    }
  }

  const selectReportings = (nextReportingIds: OptionValueType[] | undefined) => {
    setFieldValue(`envActions[${envActionIndex}].reportingIds`, nextReportingIds ?? [])

    attachedReportings.map((reporting, index) => {
      if (nextReportingIds && nextReportingIds.includes(reporting.id)) {
        return setFieldValue(`attachedReportings[${index}].attachedEnvActionId`, currentAction?.id)
      }

      if (
        !nextReportingIds?.includes(reporting.id) &&
        attachedReportings &&
        attachedReportings[index]?.attachedEnvActionId === currentAction?.id
      ) {
        return setFieldValue(`attachedReportings[${index}].attachedEnvActionId`, undefined)
      }

      return reporting
    })
  }

  const duration = dateDifferenceInHours(
    envActionField.value.actionStartDateTimeUtc,
    envActionField.value.actionEndDateTimeUtc
  )

  const handleRemoveAction = () => {
    setCurrentActionIndex(undefined)
    remove(envActionIndex)
  }

  const updateStartDateTime = (date: string | undefined) => {
    const newSurveillanceDateYear = date ? customDayjs(date).year() : undefined
    if (newSurveillanceDateYear && actualYearForThemes !== newSurveillanceDateYear) {
      currentAction?.controlPlans?.forEach((_, index) => {
        setFieldValue(`envActions[${envActionIndex}].controlPlans[${index}]`, CONTROL_PLAN_INIT)
      })
    }

    setFieldValue(`envActions[${envActionIndex}].actionStartDateTimeUtc`, date)
  }
  const updateEndDateTime = (date: string | undefined) => {
    setFieldValue(`envActions[${envActionIndex}].actionEndDateTimeUtc`, date)
  }

  return (
    <>
      <Header>
        <TitleWithIcon>
          <Icon.Observation color={THEME.color.gunMetal} />
          <Title>Surveillance</Title>
        </TitleWithIcon>
        <StyledDeleteButton
          accent={Accent.SECONDARY}
          Icon={Icon.Delete}
          onClick={handleRemoveAction}
          size={Size.SMALL}
          title="supprimer"
        >
          Supprimer
        </StyledDeleteButton>
      </Header>
      <FormBody>
        <div>
          <StyledToggle>
            <Toggle
              checked={isReportingListVisible}
              dataCy="surveillance-form-toggle-reporting"
              isLabelHidden
              label="La surveillance est rattachée à un signalement"
              name="isSurveillanceAttachedToReporting"
              onChange={updateIsSurveillanceAttachedToReporting}
              readOnly={areAllReportingsAttachedToAnAction && currentAction?.reportingIds?.length === 0}
            />
            <span>La surveillance est rattachée à un signalement</span>
          </StyledToggle>
          {isReportingListVisible && (
            <StyledMultiCheckbox
              isLabelHidden
              label="Signalements"
              name={`envActions[${envActionIndex}].reportingIds`}
              onChange={selectReportings}
              options={reportingAsOptions}
              value={currentAction?.reportingIds}
            />
          )}
        </div>
        <SurveillanceThemes envActionIndex={envActionIndex} themesYear={actualYearForThemes} />
        <FlexSelectorWrapper>
          <Label $isRequired>Début et fin de surveillance (UTC)</Label>
          <StyledDatePickerContainer>
            <StyledDatePicker
              key={`start-date-${durationMatchMissionField.value}`}
              data-cy="surveillance-start-date-time"
              defaultValue={currentAction?.actionStartDateTimeUtc ?? undefined}
              disabled={!!durationMatchMissionField.value}
              error={actionStartDateMeta.error}
              isCompact
              isErrorMessageHidden
              isLabelHidden
              isLight
              isStringDate
              isUndefinedWhenDisabled={false}
              label="Date et heure de début de surveillance"
              name="startDateTimeUtc"
              onChange={updateStartDateTime}
              withTime
            />
            <StyledDatePicker
              key={`end-date-${durationMatchMissionField.value}`}
              data-cy="surveillance-end-date-time"
              defaultValue={currentAction?.actionEndDateTimeUtc ?? undefined}
              disabled={!!durationMatchMissionField.value}
              error={actionEndDateMeta.error}
              isCompact
              isErrorMessageHidden
              isLabelHidden
              isLight
              isStringDate
              isUndefinedWhenDisabled={false}
              label="Date et heure de fin de surveillance"
              name="endDateTimeUtc"
              onChange={updateEndDateTime}
              withTime
            />
            {envActionField.value.actionStartDateTimeUtc && envActionField.value.actionEndDateTimeUtc && (
              <StyledDuration>
                {duration === 0 ? "(Moins d'1 heure)" : `(${duration} ${pluralize('heure', duration)})`}
              </StyledDuration>
            )}
          </StyledDatePickerContainer>
          {/* We simply want to display an error if the dates are not consistent, not if it's just a "field required" error. */}
          {actionStartDateMeta.error && actionStartDateMeta.error.length > 1 && (
            <FieldError>{actionStartDateMeta.error}</FieldError>
          )}
          {actionEndDateMeta.error && actionEndDateMeta.error.length > 1 && (
            <FieldError>{actionEndDateMeta.error}</FieldError>
          )}
          <StyledFormikCheckbox
            data-cy="surveillance-duration-matches-mission"
            disabled={surveillances.length > 1}
            inline
            label="Dates et heures de surveillance équivalentes à celles de la mission"
            name={`envActions[${envActionIndex}].durationMatchesMission`}
          />
        </FlexSelectorWrapper>
        <FlexSelectorWrapper>
          <MultiZonePicker
            addButtonLabel="Ajouter une zone de surveillance"
            interactionListener={InteractionListener.SURVEILLANCE_ZONE}
            isLight
            label="Zone de surveillance"
            name={`envActions[${envActionIndex}].geom`}
          />
        </FlexSelectorWrapper>

        <FormikTextarea isLight label="Observations" name={`envActions[${envActionIndex}].observations`} />
      </FormBody>
    </>
  )
}

const FormBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-bottom: 48px;
`
const StyledToggle = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: 8px;
  > span {
    color: ${p => p.theme.color.gunMetal};
    font-weight: bold;
  }
`
const StyledMultiCheckbox = styled(MultiCheckbox)`
  margin-top: 16px;
  margin-left: 48px;
`

const FlexSelectorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: baseline;
`
const StyledDatePickerContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  align-items: baseline;
`
const StyledDatePicker = styled(DatePicker)`
  p {
    max-width: 200px;
  }
`
const StyledDuration = styled.div`
  font-size: 13px;
  color: ${p => p.theme.color.slateGray};
  margin-left: 8px;
`

const StyledFormikCheckbox = styled(FormikCheckbox)`
  margin-left: 0px;
  margin-top: 8px;
`
