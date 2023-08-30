/* eslint-disable react/jsx-props-no-spreading */
import {
  FormikDatePicker,
  FormikNumberInput,
  FormikTextarea,
  getOptionsFromLabelledEnum,
  useNewWindow
} from '@mtes-mct/monitor-ui'
import { FieldArray, useFormikContext, getIn } from 'formik'
import _ from 'lodash'
import { useMemo } from 'react'
import { Form, IconButton } from 'rsuite'
import styled from 'styled-components'

import { InfractionsForm } from './InfractionsForm'
import { COLORS } from '../../../../../constants/constants'
import { TargetTypeEnum, TargetTypeLabels } from '../../../../../domain/entities/targetType'
import { VehicleTypeEnum } from '../../../../../domain/entities/vehicleType'
import { ReactComponent as ControlIconSVG } from '../../../../../uiMonitor/icons/Control.svg'
import { ReactComponent as DeleteSVG } from '../../../../../uiMonitor/icons/Delete.svg'
import { getDateAsLocalizedStringCompact } from '../../../../../utils/getDateAsLocalizedString'
import { TargetSelector } from '../../../../commonComponents/TargetSelector'
import { VehicleTypeSelector } from '../../../../commonComponents/VehicleTypeSelector'
import { MultiPointPicker } from '../../../MultiPointPicker'
import { ActionTheme } from '../Themes/ActionTheme'

import type { Mission, EnvActionControl } from '../../../../../domain/entities/missions'

export function ControlForm({
  currentActionIndex,
  removeControlAction,
  setCurrentActionIndex
}: {
  currentActionIndex: number
  removeControlAction: Function
  setCurrentActionIndex: Function
}) {
  const { newWindowContainerRef } = useNewWindow()

  const {
    errors,
    setValues,
    values: { envActions }
  } = useFormikContext<Mission<EnvActionControl>>()
  const currentAction = envActions[currentActionIndex]

  const targetTypeOptions = getOptionsFromLabelledEnum(TargetTypeLabels)

  const { actionNumberOfControls, actionTargetType, vehicleType } = currentAction || {}

  const actionTargetTypeErrorMessage = useMemo(
    () => getIn(errors, `envActions[${currentActionIndex}].actionTargetType`) || '',
    [errors, currentActionIndex]
  )
  const actionVehicleTypeErrorMessage = useMemo(
    () => getIn(errors, `envActions[${currentActionIndex}].vehicleType`) || '',
    [errors, currentActionIndex]
  )
  const canAddInfraction =
    actionNumberOfControls &&
    actionNumberOfControls > 0 &&
    ((actionTargetType === TargetTypeEnum.VEHICLE && vehicleType !== undefined) ||
      (actionTargetType !== undefined && actionTargetType !== TargetTypeEnum.VEHICLE)) &&
    actionNumberOfControls > (envActions[currentActionIndex]?.infractions?.length || 0)

  const onVehicleTypeChange = selectedVehicleType => {
    if (
      envActions[currentActionIndex]?.vehicleType === selectedVehicleType ||
      (envActions[currentActionIndex]?.vehicleType === null && selectedVehicleType === undefined)
    ) {
      return
    }
    setValues(v => {
      const w = _.cloneDeep(v)
      _.set(w, `envActions[${currentActionIndex}].vehicleType`, selectedVehicleType)
      if (selectedVehicleType !== VehicleTypeEnum.VESSEL) {
        _.update(w, `envActions[${currentActionIndex}].infractions`, inf =>
          inf?.map(i => ({ ...i, vesselSize: null, vesselType: null }))
        )
      }

      return w
    })
  }
  const onTargetTypeChange = selectedTargetType => {
    if (
      envActions[currentActionIndex]?.actionTargetType === selectedTargetType ||
      (envActions[currentActionIndex]?.actionTargetType === null && selectedTargetType === undefined)
    ) {
      return
    }
    setValues(v => {
      const w = _.cloneDeep(v)
      _.set(w, `envActions[${currentActionIndex}].actionTargetType`, selectedTargetType)

      if (selectedTargetType !== TargetTypeEnum.VEHICLE) {
        _.set(w, `envActions[${currentActionIndex}].vehicleType`, null)
        _.update(w, `envActions[${currentActionIndex}].infractions`, inf =>
          inf?.map(i => ({ ...i, vesselSize: null, vesselType: null }))
        )
      }

      return w
    })
  }

  const handleRemoveAction = () => {
    setCurrentActionIndex(undefined)
    removeControlAction(currentActionIndex)
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
        <ActionTheme
          actionIndex={currentActionIndex}
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
            name={`envActions[${currentActionIndex}].actionStartDateTimeUtc`}
            withTime
          />
        </Form.Group>

        <MultiPointPicker
          addButtonLabel="Ajouter un point de contrôle"
          label="Lieu du contrôle"
          name={`envActions[${currentActionIndex}].geom`}
        />

        <Separator />

        <ActionSummary>
          <ActionFieldWrapper>
            <Form.ControlLabel htmlFor={`envActions.${currentActionIndex}.actionNumberOfControls`} />
            <FormikNumberInput
              data-cy="control-form-number-controls"
              isErrorMessageHidden
              isLight
              label="Nombre total de contrôles"
              min={1}
              name={`envActions.${currentActionIndex}.actionNumberOfControls`}
            />
          </ActionFieldWrapper>
          <ActionFieldWrapper>
            <TargetSelector
              error={actionTargetTypeErrorMessage}
              name={`envActions.${currentActionIndex}.actionTargetType`}
              onChange={onTargetTypeChange}
              options={targetTypeOptions}
              value={actionTargetType}
            />
          </ActionFieldWrapper>
          <ActionFieldWrapper>
            <VehicleTypeSelector
              disabled={actionTargetType !== TargetTypeEnum.VEHICLE}
              error={actionVehicleTypeErrorMessage}
              name={`envActions.${currentActionIndex}.vehicleType`}
              onChange={onVehicleTypeChange}
              value={vehicleType}
            />
          </ActionFieldWrapper>
        </ActionSummary>

        <FieldArray
          name={`envActions[${currentActionIndex}].infractions`}
          render={({ form, push, remove }) => (
            <InfractionsForm
              canAddInfraction={canAddInfraction}
              currentActionIndex={currentActionIndex}
              form={form}
              push={push}
              remove={remove}
            />
          )}
          validateOnChange={false}
        />
        <FormikTextarea isLight label="Observations" name={`envActions[${currentActionIndex}].observations`} />
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
`
const Title = styled.h2`
  font-size: 16px;
  line-height: 22px;
  display: inline-block;
  color: ${COLORS.charcoal};
`

const Separator = styled.hr`
  border-color: ${COLORS.slateGray};
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
  color: ${COLORS.gunMetal};
  margin-right: 8px;
  margin-top: 2px;
  width: 24px;
`

const SubTitle = styled.div`
  font-size: 16px;
  display: inline-block;
`
const DeleteIcon = styled(DeleteSVG)`
  color: ${COLORS.maximumRed};
`

const IconButtonRight = styled(IconButton)`
  margin-left: auto;
`
