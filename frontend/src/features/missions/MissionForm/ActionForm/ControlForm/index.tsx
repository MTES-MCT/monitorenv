import { actionFactory } from '@features/missions/Missions.helpers'
import { useGetControlPlans } from '@hooks/useGetControlPlans'
import {
  customDayjs,
  FormikNumberInput,
  FormikTextarea,
  MultiRadio,
  getOptionsFromLabelledEnum,
  type OptionValueType,
  DatePicker,
  FieldError,
  Accent,
  Icon,
  Size,
  THEME,
  Toggle,
  pluralize,
  Button,
  FormikTextInput
} from '@mtes-mct/monitor-ui'
import { FieldArray, useFormikContext, type FormikErrors } from 'formik'
import _ from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { InfractionsForm } from './InfractionsForm'
import { MultiPointPicker } from './MultiPointPicker'
import { OtherControlTypesForm } from './OtherControlTypesForm'
import { CONTROL_PLAN_INIT, UNIQ_CONTROL_PLAN_INDEX } from '../../../../../domain/entities/controlPlan'
import {
  type Mission,
  type EnvActionControl,
  ActionTypeEnum,
  CompletionStatus
} from '../../../../../domain/entities/missions'
import { TargetTypeEnum, TargetTypeLabels } from '../../../../../domain/entities/targetType'
import { VehicleTypeEnum } from '../../../../../domain/entities/vehicleType'
import { TargetSelector } from '../../../../commonComponents/TargetSelector'
import { VehicleTypeSelector } from '../../../../commonComponents/VehicleTypeSelector'
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
import { ActionTheme } from '../Themes/ActionTheme'

export function ControlForm({
  currentActionIndex,
  removeControlAction,
  setCurrentActionIndex
}: {
  currentActionIndex: string
  removeControlAction: () => void
  setCurrentActionIndex: (string) => void
}) {
  const {
    errors,
    setFieldValue,
    setValues,
    values: { attachedReportings, endDateTimeUtc, envActions, startDateTimeUtc }
  } = useFormikContext<Mission<EnvActionControl>>()

  const { actionsMissingFields } = useMissionAndActionsCompletion()

  const envActionIndex = envActions.findIndex(envAction => envAction.id === String(currentActionIndex))
  const currentAction = envActions[envActionIndex]
  const actionDate =
    envActions[envActionIndex]?.actionStartDateTimeUtc ?? (startDateTimeUtc || new Date().toISOString())
  const actualYearForThemes = customDayjs(actionDate).year()
  const themeIds = useMemo(() => currentAction?.controlPlans.map(controlPlan => controlPlan.themeId), [currentAction])
  const { themes } = useGetControlPlans()
  const themesAsText = useMemo(() => themeIds?.map(themeId => themeId && themes[themeId]?.theme), [themes, themeIds])

  const targetTypeOptions = getOptionsFromLabelledEnum(TargetTypeLabels)

  const { actionNumberOfControls, actionTargetType, reportingIds, vehicleType } = currentAction ?? {}
  const [isReportingListVisible, setIsReportingListVisible] = useState<boolean>(reportingIds?.length === 1)

  const currentActionErrors = (errors.envActions ? errors.envActions[envActionIndex] : undefined) as
    | FormikErrors<EnvActionControl>
    | undefined

  const canAddInfraction =
    actionNumberOfControls &&
    actionNumberOfControls > 0 &&
    ((actionTargetType === TargetTypeEnum.VEHICLE && vehicleType !== undefined) ||
      (actionTargetType !== undefined && actionTargetType !== TargetTypeEnum.VEHICLE)) &&
    actionNumberOfControls > (envActions[envActionIndex]?.infractions?.length ?? 0)

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

  const onVehicleTypeChange = selectedVehicleType => {
    if (
      envActions[envActionIndex]?.vehicleType === selectedVehicleType ||
      (envActions[envActionIndex]?.vehicleType === null && selectedVehicleType === undefined)
    ) {
      return
    }
    setValues(v => {
      const w = _.cloneDeep(v)
      _.set(w, `envActions[${envActionIndex}].vehicleType`, selectedVehicleType)
      if (selectedVehicleType !== VehicleTypeEnum.VESSEL) {
        _.update(w, `envActions[${envActionIndex}].infractions`, inf =>
          inf?.map(i => ({ ...i, vesselSize: null, vesselType: null }))
        )
      }

      return w
    })
  }
  const onTargetTypeChange = selectedTargetType => {
    if (
      envActions[envActionIndex]?.actionTargetType === selectedTargetType ||
      (envActions[envActionIndex]?.actionTargetType === null && selectedTargetType === undefined)
    ) {
      return
    }
    setValues(v => {
      const w = _.cloneDeep(v)
      _.set(w, `envActions[${envActionIndex}].actionTargetType`, selectedTargetType)

      if (selectedTargetType !== TargetTypeEnum.VEHICLE) {
        _.set(w, `envActions[${envActionIndex}].vehicleType`, null)
        _.update(w, `envActions[${envActionIndex}].infractions`, inf =>
          inf?.map(i => ({ ...i, vesselSize: null, vesselType: null }))
        )
      }

      return w
    })
  }

  const updateControlDate = (date: string | undefined) => {
    const newControlDateYear = date ? customDayjs(date).year() : undefined
    if (newControlDateYear && actualYearForThemes !== newControlDateYear) {
      setFieldValue(`envActions[${envActionIndex}].controlPlans[${UNIQ_CONTROL_PLAN_INDEX}]`, CONTROL_PLAN_INIT)
    }

    setFieldValue(`envActions[${envActionIndex}].actionStartDateTimeUtc`, date)
  }

  const handleRemoveAction = () => {
    setCurrentActionIndex(undefined)
    removeControlAction()
  }

  const duplicateControl = useCallback(() => {
    if (!currentAction) {
      return
    }
    const duplicatedAction = actionFactory(currentAction)
    setFieldValue('envActions', [duplicatedAction, ...(envActions || [])])
  }, [currentAction, setFieldValue, envActions])

  const updateIsControlAttachedToReporting = (checked: boolean | undefined) => {
    setIsReportingListVisible(checked ?? false)
    if (!checked) {
      const reportingToDetachIndex = attachedReportings?.findIndex(
        reporting => reporting.attachedEnvActionId === currentAction?.id
      )

      if (reportingToDetachIndex !== -1) {
        setFieldValue(`attachedReportings[${reportingToDetachIndex}].attachedEnvActionId`, undefined)
      }
      setFieldValue(`envActions[${envActionIndex}].reportingIds`, [])
    }
  }

  const selectReporting = (reportingId: OptionValueType | undefined) => {
    if (!reportingId) {
      return
    }
    setFieldValue(`envActions[${envActionIndex}].reportingIds`, [reportingId])
    const reportingToAttachIndex = attachedReportings?.findIndex(reporting => reporting.id === reportingId)

    if (reportingToAttachIndex !== -1) {
      setFieldValue(`attachedReportings[${reportingToAttachIndex}].attachedEnvActionId`, currentAction?.id)
    }

    const reportingToDetachIndex = attachedReportings?.findIndex(
      reporting => reporting.attachedEnvActionId === currentAction?.id && reporting.id !== reportingId
    )
    if (reportingToDetachIndex !== -1) {
      setFieldValue(`attachedReportings[${reportingToDetachIndex}].attachedEnvActionId`, undefined)
    }
  }

  useEffect(() => {
    if (actionsMissingFields[currentActionIndex] === 0 && currentAction?.completion === CompletionStatus.TO_COMPLETE) {
      setFieldValue(`envActions[${envActionIndex}].completion`, CompletionStatus.COMPLETED)

      return
    }

    if (actionsMissingFields[currentActionIndex] > 0 && currentAction?.completion === CompletionStatus.COMPLETED) {
      setFieldValue(`envActions[${envActionIndex}].completion`, CompletionStatus.TO_COMPLETE)
    }
  }, [actionsMissingFields, setFieldValue, currentActionIndex, currentAction?.completion, envActionIndex])

  return (
    <>
      <Header>
        <TitleWithIcon>
          <Icon.ControlUnit color={THEME.color.gunMetal} />

          <ActionTitle>{pluralize('Contrôle', actionNumberOfControls ?? 0)}</ActionTitle>
          <ActionThemes>{themesAsText}</ActionThemes>
        </TitleWithIcon>
        <HeaderButtons>
          <Button accent={Accent.SECONDARY} Icon={Icon.Duplicate} onClick={duplicateControl} size={Size.SMALL}>
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
        <MissingFieldsText
          missionEndDate={endDateTimeUtc}
          totalMissingFields={actionsMissingFields[currentActionIndex]}
        />
        <div>
          <StyledToggle>
            <Toggle
              checked={isReportingListVisible}
              dataCy="control-form-toggle-reporting"
              isLabelHidden
              label="Le contrôle est rattaché à un signalement"
              name="isControlAttachedToReporting"
              onChange={updateIsControlAttachedToReporting}
              readOnly={areAllReportingsAttachedToAnAction && currentAction?.reportingIds?.length === 0}
            />
            <span>Le contrôle est rattaché à un signalement</span>
          </StyledToggle>
          {isReportingListVisible && (
            <StyledMultiRadio
              isLabelHidden
              label="Signalements"
              name="reportingIds"
              onChange={selectReporting}
              options={reportingAsOptions}
              value={currentAction?.reportingIds[0]}
            />
          )}
        </div>

        <ActionTheme
          actionIndex={envActionIndex}
          actionType={ActionTypeEnum.CONTROL}
          labelSubTheme="Sous-thématiques de contrôle"
          labelTheme="Thématique de contrôle"
          themeIndex={0}
          themesYear={actualYearForThemes}
        />

        <div>
          <DatePicker
            defaultValue={currentAction?.actionStartDateTimeUtc ?? undefined}
            error={currentActionErrors?.actionStartDateTimeUtc ?? undefined}
            isErrorMessageHidden
            isLight
            isRequired
            isStringDate
            label="Date et heure du contrôle (UTC)"
            name="actionStartDateTimeUtc"
            onChange={updateControlDate}
            withTime
          />
          {currentActionErrors?.actionStartDateTimeUtc &&
            currentActionErrors?.actionStartDateTimeUtc !== HIDDEN_ERROR && (
              <FieldError>{currentActionErrors?.actionStartDateTimeUtc}</FieldError>
            )}
        </div>
        <MultiPointPicker actionIndex={envActionIndex} />

        <Separator />

        <ActionSummary>
          <FormikNumberInput
            data-cy="control-form-number-controls"
            isErrorMessageHidden
            isLight
            isRequired
            label="Nb total de contrôles"
            min={1}
            name={`envActions.${envActionIndex}.actionNumberOfControls`}
          />

          <TargetSelector
            error={currentActionErrors?.actionTargetType ?? ''}
            isRequired
            name={`envActions.${envActionIndex}.actionTargetType`}
            onChange={onTargetTypeChange}
            options={targetTypeOptions}
            value={actionTargetType}
          />

          <VehicleTypeSelector
            disabled={actionTargetType !== TargetTypeEnum.VEHICLE}
            error={currentActionErrors?.vehicleType ?? ''}
            isRequired
            name={`envActions.${envActionIndex}.vehicleType`}
            onChange={onVehicleTypeChange}
            value={vehicleType}
          />
        </ActionSummary>

        <FieldArray
          name={`envActions[${envActionIndex}].infractions`}
          render={({ form, push, remove }) => (
            <InfractionsForm
              canAddInfraction={canAddInfraction}
              envActionIndex={envActionIndex}
              form={form}
              push={push}
              remove={remove}
            />
          )}
          validateOnChange={false}
        />
        <FormikTextarea
          data-cy="control-form-observations"
          isLight
          label="Observations"
          name={`envActions[${envActionIndex}].observations`}
        />
        <OtherControlTypesForm currentActionIndex={envActionIndex} />
        <div>
          <StyledAuthorContainer>
            <FormikTextInput
              data-cy="control-open-by"
              isErrorMessageHidden
              isLight
              isRequired
              label="Ouvert par"
              name={`envActions[${envActionIndex}].openBy`}
            />
            <FormikTextInput
              data-cy="control-completed-by"
              isErrorMessageHidden
              isLight
              label="Complété par"
              name={`envActions[${envActionIndex}].completedBy`}
            />
          </StyledAuthorContainer>
          {/* We simply want to display an error if the fields are not consistent, not if it's just a "field required" error. */}
          {currentActionErrors?.openBy && currentActionErrors?.openBy !== HIDDEN_ERROR && (
            <FieldError>{currentActionErrors.openBy}</FieldError>
          )}
          {currentActionErrors?.completedBy && currentActionErrors?.completedBy !== HIDDEN_ERROR && (
            <FieldError>{currentActionErrors.completedBy}</FieldError>
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

const StyledMultiRadio = styled(MultiRadio)`
  margin-top: 16px;
  margin-left: 48px;
`

const ActionSummary = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
`
