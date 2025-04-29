import { actionFactory } from '@features/Mission/Missions.helpers'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import {
  Accent,
  Button,
  DatePicker,
  FieldError,
  FormikNumberInput,
  FormikTextInput,
  FormikTextarea,
  Icon,
  MultiRadio,
  Size,
  THEME,
  Toggle,
  getOptionsFromLabelledEnum,
  pluralize,
  useNewWindow,
  type OptionValueType
} from '@mtes-mct/monitor-ui'
import { displayThemes } from '@utils/getThemesAsOptions'
import { FieldArray, useFormikContext, type FormikErrors } from 'formik'
import { omit } from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { InfractionsForm } from './InfractionsForm'
import { MultiPointPicker } from './MultiPointPicker'
import { OtherControlTypesForm } from './OtherControlTypesForm'
import {
  ActionTypeEnum,
  CompletionStatus,
  type EnvActionControl,
  type Mission
} from '../../../../../../domain/entities/missions'
import { ReportingTargetTypeEnum, TargetTypeEnum, TargetTypeLabels } from '../../../../../../domain/entities/targetType'
import { VehicleTypeEnum } from '../../../../../../domain/entities/vehicleType'
import { TargetSelector } from '../../../../../commonComponents/TargetSelector'
import { VehicleTypeSelector } from '../../../../../commonComponents/VehicleTypeSelector'
import { getFormattedReportingId } from '../../../../../Reportings/utils'
import { HIDDEN_ERROR } from '../../constants'
import { useMissionAndActionsCompletion } from '../../hooks/useMissionAndActionsCompletion'
import { getNumberOfInfractionTarget, missionFormsActions } from '../../slice'
import { Separator } from '../../style'
import { MissingFieldsText } from '../MissingFieldsText'
import {
  ActionFormBody,
  ActionThemes as StyledActionThemes,
  ActionTitle,
  Header,
  HeaderButtons,
  StyledAuthorContainer,
  StyledDeleteIconButton,
  TitleWithIcon
} from '../style'
import { ActionTags } from '../Tags/ActionTags'
import { ActionThemes } from '../Themes/ActionThemes'

import type { Reporting } from 'domain/entities/reporting'

export function ControlForm({
  currentActionId,
  removeControlAction
}: {
  currentActionId: string
  removeControlAction: () => void
}) {
  const { newWindowContainerRef } = useNewWindow()
  const dispatch = useAppDispatch()
  const {
    errors,
    setFieldValue,
    values: {
      attachedReportings,
      endDateTimeUtc,
      envActions = []
      // startDateTimeUtc
    }
  } = useFormikContext<Mission<EnvActionControl>>()

  const { actionsMissingFields } = useMissionAndActionsCompletion()

  const envActionIndex = envActions.findIndex(envAction => envAction.id === currentActionId)
  const currentAction = envActions?.[envActionIndex]
  // const actionDate =
  //   envActions[envActionIndex]?.actionStartDateTimeUtc ?? (startDateTimeUtc || new Date().toISOString())
  // const actualYearForThemes = customDayjs(actionDate).year()
  // const themeIds = useMemo(() => currentAction?.controlPlans?.map(controlPlan => controlPlan.themeId), [currentAction])
  // const { themes } = useGetControlPlans()
  // const themesAsText = useMemo(() => themeIds?.map(themeId => themeId && themes[themeId]?.theme), [themes, themeIds])

  const targetTypeOptions = getOptionsFromLabelledEnum(TargetTypeLabels)

  const { actionNumberOfControls, actionTargetType, reportingIds, vehicleType } = currentAction ?? {}
  const [isReportingListVisible, setIsReportingListVisible] = useState<boolean>(reportingIds?.length === 1)

  const currentActionErrors = (errors.envActions?.[envActionIndex] ?? undefined) as
    | FormikErrors<EnvActionControl>
    | undefined

  const numberOfInfractionTarget = useAppSelector(state => getNumberOfInfractionTarget(state.missionForms))

  const canAddInfraction =
    (actionNumberOfControls ?? 0) > numberOfInfractionTarget &&
    ((actionTargetType === TargetTypeEnum.VEHICLE && vehicleType !== undefined) ||
      (actionTargetType !== undefined && actionTargetType !== TargetTypeEnum.VEHICLE))

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
    () => attachedReportings?.every(reporting => reporting.isControlRequired && reporting.attachedEnvActionId),
    [attachedReportings]
  )

  const isGeomSameAsAttachedReportingGeom = useMemo(() => {
    const attachedReporting = attachedReportings?.find(reporting => reporting.id === currentAction?.reportingIds[0])

    if (
      attachedReporting?.geom?.type &&
      currentAction?.geom?.type &&
      attachedReporting?.geom?.type !== currentAction?.geom?.type
    ) {
      return false
    }

    return !!(
      attachedReporting?.geom &&
      currentAction?.geom &&
      JSON.stringify(attachedReporting?.geom) === JSON.stringify(currentAction?.geom)
    )
  }, [attachedReportings, currentAction?.geom, currentAction?.reportingIds])

  const onVehicleTypeChange = selectedVehicleType => {
    if (
      envActions[envActionIndex]?.vehicleType === selectedVehicleType ||
      (envActions[envActionIndex]?.vehicleType === null && selectedVehicleType === undefined)
    ) {
      return
    }
    setFieldValue(`envActions[${envActionIndex}].vehicleType`, selectedVehicleType)
    if (
      selectedVehicleType !== VehicleTypeEnum.VESSEL &&
      currentAction?.infractions &&
      currentAction?.infractions?.length > 0
    ) {
      setFieldValue(
        `envActions[${envActionIndex}].infractions`,
        currentAction.infractions?.map(infraction => omit(infraction, ['vesselSize', 'vesselType']))
      )
    }
  }

  const onTargetTypeChange = selectedTargetType => {
    if (
      envActions[envActionIndex]?.actionTargetType === selectedTargetType ||
      (envActions[envActionIndex]?.actionTargetType === null && selectedTargetType === undefined)
    ) {
      return
    }

    setFieldValue(`envActions[${envActionIndex}].actionTargetType`, selectedTargetType)
    setFieldValue(`envActions[${envActionIndex}].vehicleType`, undefined)
    if (
      selectedTargetType !== TargetTypeEnum.VEHICLE &&
      currentAction?.infractions &&
      currentAction?.infractions?.length > 0
    ) {
      setFieldValue(
        `envActions[${envActionIndex}].infractions`,
        currentAction.infractions?.map(infraction => omit(infraction, ['vesselSize', 'vesselType']))
      )
    }
  }

  const updateControlDate = (date: string | undefined) => {
    // const newControlDateYear = date ? customDayjs(date).year() : undefined
    // if (newControlDateYear && actualYearForThemes !== newControlDateYear) {
    //   setFieldValue(`envActions[${envActionIndex}].controlPlans[${UNIQ_CONTROL_PLAN_INDEX}]`, CONTROL_PLAN_INIT)
    // }

    setFieldValue(`envActions[${envActionIndex}].actionStartDateTimeUtc`, date)
  }

  const handleRemoveAction = () => {
    removeControlAction()
  }

  const duplicateControl = useCallback(() => {
    if (!currentAction) {
      return
    }

    const newControl = { ...currentAction, reportingIds: [] }
    const duplicatedAction = actionFactory(newControl)

    setFieldValue('envActions', [duplicatedAction, ...(envActions || [])])
    dispatch(missionFormsActions.setActiveActionId(duplicatedAction.id))
  }, [currentAction, setFieldValue, envActions, dispatch])

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

  const detachReportingFromOtherActions = (reportingId: OptionValueType) => {
    const reportingToDetachIndex = attachedReportings?.findIndex(
      reporting => reporting.attachedEnvActionId === currentAction?.id && reporting.id !== reportingId
    )
    if (reportingToDetachIndex !== -1) {
      setFieldValue(`attachedReportings[${reportingToDetachIndex}].attachedEnvActionId`, undefined)
    }
  }

  const updateInfractions = (reporting: Reporting) => {
    const newInfraction = {
      companyName: undefined,
      controlledPersonIdentity: undefined,
      imo: undefined,
      mmsi: undefined,
      registrationNumber: undefined,
      vesselName: undefined,
      vesselSize: undefined,
      vesselType: undefined
    }
    const updatedInfractions = reporting.targetDetails.map(target => {
      switch (reporting.targetType) {
        case ReportingTargetTypeEnum.VEHICLE:
          return {
            controlledPersonIdentity: target?.operatorName,
            registrationNumber: target?.externalReferenceNumber,
            ...(reporting.vehicleType === VehicleTypeEnum.VESSEL && {
              imo: target?.imo,
              mmsi: target?.mmsi,
              vesselName: target?.vesselName,
              vesselSize: target?.size,
              vesselType: target?.vesselType
            })
          }

        case ReportingTargetTypeEnum.COMPANY:
          return {
            ...newInfraction,
            companyName: target?.operatorName,
            controlledPersonIdentity: target?.vesselName
          }

        case ReportingTargetTypeEnum.INDIVIDUAL:
          return {
            ...newInfraction,
            controlledPersonIdentity: target?.vesselName
          }

        case ReportingTargetTypeEnum.OTHER:
        default:
          return newInfraction
      }
    })

    // if one infraction is already present, we only update vessel informations
    if (currentAction?.infractions?.length === 1) {
      setFieldValue(`envActions[${envActionIndex}].infractions[0]`, {
        ...currentAction.infractions[0],
        ...updatedInfractions[0]
      })
    }

    // if multiple infractions are present, we delete all of them and create new one
    if (currentAction?.infractions?.length && currentAction?.infractions?.length > 1) {
      setFieldValue(`envActions[${envActionIndex}].infractions`, updatedInfractions)
    }
  }

  const attachReportingToAction = (reportingToAttachIndex: number) => {
    setFieldValue(`attachedReportings[${reportingToAttachIndex}].attachedEnvActionId`, currentAction?.id)

    const reporting = attachedReportings[reportingToAttachIndex]
    if (!reporting) {
      return
    }

    // prefill infractions with the reporting details
    updateInfractions(reporting)

    setFieldValue(`envActions[${envActionIndex}].controlPlans`, [
      { subThemeIds: reporting?.subThemeIds, tagIds: [], themeId: reporting?.themeId }
    ])

    const updatedVehicleType =
      reporting.targetType === ReportingTargetTypeEnum.VEHICLE ? reporting.vehicleType : undefined
    setFieldValue(`envActions[${envActionIndex}].vehicleType`, updatedVehicleType)

    const updatedTargetType = reporting.targetType === ReportingTargetTypeEnum.OTHER ? undefined : reporting.targetType
    setFieldValue(`envActions[${envActionIndex}].actionTargetType`, updatedTargetType)
  }

  const selectReporting = (reportingId: OptionValueType | undefined) => {
    if (!reportingId) {
      return
    }
    setFieldValue(`envActions[${envActionIndex}].reportingIds`, [reportingId])

    detachReportingFromOtherActions(reportingId)

    const reportingToAttachIndex = attachedReportings?.findIndex(reporting => reporting.id === reportingId)
    if (reportingToAttachIndex !== -1) {
      attachReportingToAction(reportingToAttachIndex)
    }
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
          <Icon.ControlUnit color={THEME.color.gunMetal} />
          <ActionTitle>{pluralize('Contrôle', actionNumberOfControls ?? 0)}</ActionTitle>
          <StyledActionThemes>{displayThemes(currentAction?.themes)}</StyledActionThemes>
        </TitleWithIcon>
        <HeaderButtons>
          <Button
            accent={Accent.SECONDARY}
            Icon={Icon.Duplicate}
            onClick={duplicateControl}
            size={Size.SMALL}
            title="Dupliquer le contrôle"
          >
            Dupliquer
          </Button>

          <StyledDeleteIconButton
            accent={Accent.SECONDARY}
            Icon={Icon.Delete}
            onClick={handleRemoveAction}
            size={Size.SMALL}
            title="Supprimer le contrôle"
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

        <ActionThemes actionIndex={envActionIndex} actionType={ActionTypeEnum.CONTROL} />
        <ActionTags actionIndex={envActionIndex} />

        <div>
          <DatePicker
            baseContainer={newWindowContainerRef.current}
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
        <div>
          <MultiPointPicker
            actionIndex={envActionIndex}
            isGeomSameAsAttachedReportingGeom={isGeomSameAsAttachedReportingGeom}
          />
        </div>
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
              maxLength={3}
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
