import { actionFactory } from '@features/missions/Missions.helpers'
import { useGetControlPlans } from '@hooks/useGetControlPlans'
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
  Toggle,
  Button,
  FormikTextInput,
  useNewWindow
} from '@mtes-mct/monitor-ui'
import { useField, useFormikContext, type FormikErrors } from 'formik'
import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { SurveillanceZonePicker } from './SurveillanceZonePicker'
import { CONTROL_PLAN_INIT } from '../../../../../domain/entities/controlPlan'
import {
  ActionTypeEnum,
  CompletionStatus,
  type EnvAction,
  type EnvActionSurveillance,
  type Mission
} from '../../../../../domain/entities/missions'
import { dateDifferenceInHours } from '../../../../../utils/dateDifferenceInHours'
import { getFormattedReportingId } from '../../../../Reportings/utils'
import { HIDDEN_ERROR } from '../../constants'
import { useMissionAndActionsCompletion } from '../../hooks/useMissionAndActionsCompletion'
import { Separator } from '../../style'
import { MissingFieldsText } from '../MissingFieldsText'
import {
  ActionThemes,
  ActionTitle,
  ActionFormBody,
  Header,
  HeaderButtons,
  StyledDeleteIconButton,
  TitleWithIcon,
  StyledAuthorContainer
} from '../style'
import { SurveillanceThemes } from '../Themes/SurveillanceThemes'

export function SurveillanceForm({ currentActionId, remove, setCurrentActionId }) {
  const { newWindowContainerRef } = useNewWindow()

  const {
    errors,
    setFieldValue,
    values: { attachedReportings, endDateTimeUtc, envActions, startDateTimeUtc }
  } = useFormikContext<Mission<EnvActionSurveillance>>()

  const { actionsMissingFields } = useMissionAndActionsCompletion()

  const [actionsFields] = useField<EnvAction[]>('envActions')
  const envActionIndex = actionsFields.value.findIndex(envAction => envAction.id === currentActionId)
  const currentAction = envActions[envActionIndex]

  const actionDate = envActions[envActionIndex]?.actionStartDateTimeUtc ?? startDateTimeUtc ?? new Date().toISOString()
  const actualYearForThemes = customDayjs(actionDate).year()

  const themeIds = useMemo(() => currentAction?.controlPlans.map(controlPlan => controlPlan.themeId), [currentAction])
  const { themes } = useGetControlPlans()
  const themesAsText = useMemo(() => themeIds?.map(themeId => themeId && themes[themeId]?.theme), [themes, themeIds])

  const { reportingIds = [] } = currentAction ?? {}
  const actionErrors = useMemo(
    () => (errors?.envActions ? errors?.envActions[envActionIndex] : undefined),
    [envActionIndex, errors?.envActions]
  ) as FormikErrors<EnvActionSurveillance>

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
    setCurrentActionId(undefined)
    remove(envActionIndex)
  }

  const duplicateSurveillance = useCallback(() => {
    if (!currentAction) {
      return
    }
    const duplicatedAction = actionFactory(currentAction)
    setFieldValue('envActions', [duplicatedAction, ...(envActions || [])])
  }, [currentAction, setFieldValue, envActions])

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

  useEffect(() => {
    if (actionsMissingFields[currentActionId] === 0 && currentAction?.completion === CompletionStatus.TO_COMPLETE) {
      setFieldValue(`envActions[${envActionIndex}].completion`, CompletionStatus.COMPLETED)

      return
    }

    if (actionsMissingFields[currentActionId] > 0 && currentAction?.completion === CompletionStatus.COMPLETED) {
      setFieldValue(`envActions[${envActionIndex}].completion`, CompletionStatus.TO_COMPLETE)
    }
  }, [actionsMissingFields, setFieldValue, currentActionId, currentAction?.completion, envActionIndex])

  return (
    <>
      <Header>
        <TitleWithIcon>
          <Icon.Observation color={THEME.color.gunMetal} />

          <ActionTitle>Surveillance</ActionTitle>
          <ActionThemes>{themeIds && themeIds?.length > 1 ? themesAsText?.join(', ') : themesAsText}</ActionThemes>
        </TitleWithIcon>
        <HeaderButtons>
          <Button accent={Accent.SECONDARY} Icon={Icon.Duplicate} onClick={duplicateSurveillance} size={Size.SMALL}>
            Dupliquer
          </Button>

          <StyledDeleteIconButton
            accent={Accent.SECONDARY}
            Icon={Icon.Delete}
            onClick={handleRemoveAction}
            size={Size.SMALL}
            title="supprimer"
          />
        </HeaderButtons>
      </Header>
      <Separator />
      <ActionFormBody>
        <MissingFieldsText missionEndDate={endDateTimeUtc} totalMissingFields={actionsMissingFields[currentActionId]} />
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
              baseContainer={newWindowContainerRef.current}
              data-cy="surveillance-start-date-time"
              defaultValue={currentAction?.actionStartDateTimeUtc ?? undefined}
              disabled={!!durationMatchMissionField.value}
              error={actionErrors?.actionStartDateTimeUtc}
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
              baseContainer={newWindowContainerRef.current}
              data-cy="surveillance-end-date-time"
              defaultValue={currentAction?.actionEndDateTimeUtc ?? undefined}
              disabled={!!durationMatchMissionField.value}
              error={actionErrors?.actionEndDateTimeUtc}
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
          {actionErrors?.actionStartDateTimeUtc && actionErrors?.actionStartDateTimeUtc !== HIDDEN_ERROR && (
            <FieldError>{actionErrors?.actionStartDateTimeUtc}</FieldError>
          )}
          {actionErrors?.actionEndDateTimeUtc && actionErrors?.actionEndDateTimeUtc !== HIDDEN_ERROR && (
            <FieldError>{actionErrors?.actionEndDateTimeUtc}</FieldError>
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
          <SurveillanceZonePicker actionIndex={envActionIndex} />
        </FlexSelectorWrapper>

        <FormikTextarea isLight label="Observations" name={`envActions[${envActionIndex}].observations`} />
        <div>
          <StyledAuthorContainer>
            <FormikTextInput
              data-cy="surveillance-open-by"
              isErrorMessageHidden
              isLight
              isRequired
              label="Ouvert par"
              name={`envActions[${envActionIndex}].openBy`}
            />
            <FormikTextInput
              data-cy="surveillance-completed-by"
              isErrorMessageHidden
              isLight
              label="Complété par"
              name={`envActions[${envActionIndex}].completedBy`}
            />
          </StyledAuthorContainer>
          {/* We simply want to display an error if the fields are not consistent, not if it's just a "field required" error. */}
          {actionErrors?.openBy && actionErrors?.openBy !== HIDDEN_ERROR && (
            <FieldError>{actionErrors.openBy}</FieldError>
          )}
          {actionErrors?.completedBy && actionErrors?.completedBy !== HIDDEN_ERROR && (
            <FieldError>{actionErrors.completedBy}</FieldError>
          )}
        </div>
      </ActionFormBody>
    </>
  )
}

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
