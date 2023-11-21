/* eslint-disable react/jsx-props-no-spreading */
import {
  FormikDatePicker,
  FormikNumberInput,
  FormikTextarea,
  MultiRadio,
  getOptionsFromLabelledEnum,
  useNewWindow,
  type OptionValueType
} from '@mtes-mct/monitor-ui'
import { FieldArray, useFormikContext, getIn } from 'formik'
import _ from 'lodash'
import { useMemo, useState } from 'react'
import { Form, IconButton, Toggle } from 'rsuite'
import styled from 'styled-components'

import { InfractionsForm } from './InfractionsForm'
import { OtherControlTypesForm } from './OtherControlTypesForm'
import { TargetTypeEnum, TargetTypeLabels } from '../../../../../domain/entities/targetType'
import { VehicleTypeEnum } from '../../../../../domain/entities/vehicleType'
import { ReactComponent as ControlIconSVG } from '../../../../../uiMonitor/icons/Control.svg'
import { ReactComponent as DeleteSVG } from '../../../../../uiMonitor/icons/Delete.svg'
import { getDateAsLocalizedStringCompact } from '../../../../../utils/getDateAsLocalizedString'
import { TargetSelector } from '../../../../commonComponents/TargetSelector'
import { VehicleTypeSelector } from '../../../../commonComponents/VehicleTypeSelector'
import { getFormattedReportingId } from '../../../../Reportings/utils/getFormattedReportingId'
import { MultiPointPicker } from '../../../MultiPointPicker'
import { ActionTheme } from '../Themes/ActionTheme'

import type { Mission, EnvActionControl } from '../../../../../domain/entities/missions'

export function ControlForm({
  currentActionIndex,
  removeControlAction,
  setCurrentActionIndex
}: {
  currentActionIndex: string
  removeControlAction: () => void
  setCurrentActionIndex: (string) => void
}) {
  const { newWindowContainerRef } = useNewWindow()

  const {
    errors,
    setFieldValue,
    setValues,
    values: { attachedReportings, envActions }
  } = useFormikContext<Mission<EnvActionControl>>()

  const envActionIndex = envActions.findIndex(envAction => envAction.id === String(currentActionIndex))
  const currentAction = envActions[envActionIndex]

  const targetTypeOptions = getOptionsFromLabelledEnum(TargetTypeLabels)

  const { actionNumberOfControls, actionTargetType, reportingIds, vehicleType } = currentAction || {}
  const [isReportingListVisible, setIsReportingListVisible] = useState<boolean>(reportingIds?.length === 1)

  const actionTargetTypeErrorMessage = useMemo(
    () => getIn(errors, `envActions[${envActionIndex}].actionTargetType`) || '',
    [errors, envActionIndex]
  )
  const actionVehicleTypeErrorMessage = useMemo(
    () => getIn(errors, `envActions[${envActionIndex}].vehicleType`) || '',
    [errors, envActionIndex]
  )
  const canAddInfraction =
    actionNumberOfControls &&
    actionNumberOfControls > 0 &&
    ((actionTargetType === TargetTypeEnum.VEHICLE && vehicleType !== undefined) ||
      (actionTargetType !== undefined && actionTargetType !== TargetTypeEnum.VEHICLE)) &&
    actionNumberOfControls > (envActions[envActionIndex]?.infractions?.length || 0)

  const reportingAsOptions = useMemo(
    () =>
      attachedReportings?.map(reporting => ({
        isDisabled:
          reporting.isControlRequired &&
          !!reporting.attachedEnvActionId &&
          !!currentAction &&
          currentAction?.id !== reporting.attachedEnvActionId,
        label: `Signalement ${getFormattedReportingId(reporting.reportingId)}`,
        value: reporting.id
      })) || [],
    [attachedReportings, currentAction]
  )

  const areAllReportingsAttachedToAControl = useMemo(
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

  const handleRemoveAction = () => {
    setCurrentActionIndex(undefined)
    removeControlAction()
  }
  const updateIsContralAttachedToReporting = (checked: boolean) => {
    setIsReportingListVisible(checked)
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
  }

  return (
    <>
      <Header>
        <ControlIcon />
        <Title>Contrôle{actionNumberOfControls && actionNumberOfControls > 1 ? 's' : ''}</Title>
        <SubTitle>
          &nbsp;(
          {getDateAsLocalizedStringCompact(currentAction?.actionStartDateTimeUtc)})
        </SubTitle>

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
      <FormBody>
        <ReportingsContainer>
          <StyledToggle>
            <Toggle
              checked={isReportingListVisible}
              data-cy="control-form-toggle-reporting"
              onChange={updateIsContralAttachedToReporting}
              readOnly={areAllReportingsAttachedToAControl && currentAction?.reportingIds?.length === 0}
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
        </ReportingsContainer>
        <ActionTheme
          actionIndex={envActionIndex}
          labelSubTheme="Sous-thématiques de contrôle"
          labelTheme="Thématique de contrôle"
          themeIndex={0}
        />
        <Form.Group>
          <FormikDatePicker
            baseContainer={newWindowContainerRef.current}
            isLight
            isStringDate
            label="Date et heure du contrôle (UTC)"
            name={`envActions[${envActionIndex}].actionStartDateTimeUtc`}
            withTime
          />
        </Form.Group>

        <MultiPointPicker
          addButtonLabel="Ajouter un point de contrôle"
          label="Lieu du contrôle"
          name={`envActions[${envActionIndex}].geom`}
        />

        <Separator />

        <ActionSummary>
          <ActionFieldWrapper>
            <Form.ControlLabel htmlFor={`envActions.${envActionIndex}.actionNumberOfControls`} />
            <FormikNumberInput
              data-cy="control-form-number-controls"
              isErrorMessageHidden
              isLight
              label="Nombre total de contrôles"
              min={1}
              name={`envActions.${envActionIndex}.actionNumberOfControls`}
            />
          </ActionFieldWrapper>
          <ActionFieldWrapper>
            <TargetSelector
              error={actionTargetTypeErrorMessage}
              name={`envActions.${envActionIndex}.actionTargetType`}
              onChange={onTargetTypeChange}
              options={targetTypeOptions}
              value={actionTargetType}
            />
          </ActionFieldWrapper>
          <ActionFieldWrapper>
            <VehicleTypeSelector
              disabled={actionTargetType !== TargetTypeEnum.VEHICLE}
              error={actionVehicleTypeErrorMessage}
              name={`envActions.${envActionIndex}.vehicleType`}
              onChange={onVehicleTypeChange}
              value={vehicleType}
            />
          </ActionFieldWrapper>
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
        <StyledFormikTextareaWithMargin
          isLight
          label="Observations"
          name={`envActions[${envActionIndex}].observations`}
        />
        <OtherControlTypesForm currentActionIndex={envActionIndex} />
      </FormBody>
    </>
  )
}

const Header = styled.div`
  margin-bottom: 24px;
  display: flex;
`
const FormBody = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 48px;
`
const Title = styled.h2`
  font-size: 16px;
  line-height: 22px;
  display: inline-block;
  color: ${p => p.theme.color.charcoal};
`
const ReportingsContainer = styled.div`
  padding-bottom: 32px;
  gap: 16px;
`
const StyledToggle = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  gap: 8px;
  > .rs-toggle-checked .rs-toggle-presentation {
    background-color: ${p => p.theme.color.gunMetal};
  }
  > span {
    color: ${p => p.theme.color.gunMetal};
    font-weight: bold;
  }
`

const StyledMultiRadio = styled(MultiRadio)`
  margin-left: 48px;
`

const Separator = styled.hr`
  border-color: ${p => p.theme.color.slateGray};
`

const ActionSummary = styled(Form.Group)`
  height: 58px;
  flex-shrink: 0;
  display: flex;
`

const ActionFieldWrapper = styled.div`
  :not(:first-child) {
    margin-left: 8px;
  }
`

const ControlIcon = styled(ControlIconSVG)`
  color: ${p => p.theme.color.gunMetal};
  margin-right: 8px;
  margin-top: 2px;
  width: 24px;
`

const SubTitle = styled.div`
  font-size: 16px;
  display: inline-block;
`
const DeleteIcon = styled(DeleteSVG)`
  color: ${p => p.theme.color.maximumRed};
`

const IconButtonRight = styled(IconButton)`
  margin-left: auto;
`

const StyledFormikTextareaWithMargin = styled(FormikTextarea)`
  margin-top: 24px;
`
