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
  Toggle
} from '@mtes-mct/monitor-ui'
import { FieldArray, useFormikContext, getIn } from 'formik'
import _ from 'lodash'
import { useMemo, useState } from 'react'
import styled from 'styled-components'

import { InfractionsForm } from './InfractionsForm'
import { MultiPointPicker } from './MultiPointPicker'
import { OtherControlTypesForm } from './OtherControlTypesForm'
import { CONTROL_PLAN_INIT, UNIQ_CONTROL_PLAN_INDEX } from '../../../../../domain/entities/controlPlan'
import { type Mission, type EnvActionControl, ActionTypeEnum } from '../../../../../domain/entities/missions'
import { TargetTypeEnum, TargetTypeLabels } from '../../../../../domain/entities/targetType'
import { VehicleTypeEnum } from '../../../../../domain/entities/vehicleType'
import { getDateAsLocalizedStringCompact } from '../../../../../utils/getDateAsLocalizedString'
import { TargetSelector } from '../../../../commonComponents/TargetSelector'
import { VehicleTypeSelector } from '../../../../commonComponents/VehicleTypeSelector'
import { getFormattedReportingId } from '../../../../Reportings/utils'
import { FormTitle, Separator } from '../../style'
import { FormBody, Header, StyledDeleteButton, TitleWithIcon } from '../style'
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
    values: { attachedReportings, envActions, startDateTimeUtc }
  } = useFormikContext<Mission<EnvActionControl>>()

  const envActionIndex = envActions.findIndex(envAction => envAction.id === String(currentActionIndex))
  const currentAction = envActions[envActionIndex]
  const actionDate =
    envActions[envActionIndex]?.actionStartDateTimeUtc ?? (startDateTimeUtc || new Date().toISOString())
  const actualYearForThemes = customDayjs(actionDate).year()

  const targetTypeOptions = getOptionsFromLabelledEnum(TargetTypeLabels)

  const { actionNumberOfControls, actionTargetType, reportingIds, vehicleType } = currentAction ?? {}
  const [isReportingListVisible, setIsReportingListVisible] = useState<boolean>(reportingIds?.length === 1)

  const actionTargetTypeErrorMessage = useMemo(
    () => getIn(errors, `envActions[${envActionIndex}].actionTargetType`) ?? '',
    [errors, envActionIndex]
  )
  const actionVehicleTypeErrorMessage = useMemo(
    () => getIn(errors, `envActions[${envActionIndex}].vehicleType`) ?? '',
    [errors, envActionIndex]
  )
  const actionStartDateTimeUtcErrorMessage = useMemo(
    () => getIn(errors, `envActions[${envActionIndex}].actionStartDateTimeUtc`) ?? '',
    [errors, envActionIndex]
  )
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

  return (
    <>
      <Header>
        <TitleWithIcon>
          <Icon.ControlUnit color={THEME.color.gunMetal} />

          <FormTitle>Contrôle{actionNumberOfControls && actionNumberOfControls > 1 ? 's' : ''}</FormTitle>
          <SubTitle>
            &nbsp;(
            {getDateAsLocalizedStringCompact(currentAction?.actionStartDateTimeUtc, false)})
          </SubTitle>
        </TitleWithIcon>
        <Separator />

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
            error={actionStartDateTimeUtcErrorMessage}
            isErrorMessageHidden
            isLight
            isRequired
            isStringDate
            label="Date et heure du contrôle (UTC)"
            name="actionStartDateTimeUtc"
            onChange={updateControlDate}
            withTime
          />
          {actionStartDateTimeUtcErrorMessage && actionStartDateTimeUtcErrorMessage.length > 1 && (
            <FieldError>{actionStartDateTimeUtcErrorMessage}</FieldError>
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
            label="Nombre total de contrôles"
            min={1}
            name={`envActions.${envActionIndex}.actionNumberOfControls`}
          />

          <TargetSelector
            error={actionTargetTypeErrorMessage}
            isRequired
            name={`envActions.${envActionIndex}.actionTargetType`}
            onChange={onTargetTypeChange}
            options={targetTypeOptions}
            value={actionTargetType}
          />

          <VehicleTypeSelector
            disabled={actionTargetType !== TargetTypeEnum.VEHICLE}
            error={actionVehicleTypeErrorMessage}
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
      </FormBody>
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

const SubTitle = styled.div`
  font-size: 16px;
  display: inline-block;
`
