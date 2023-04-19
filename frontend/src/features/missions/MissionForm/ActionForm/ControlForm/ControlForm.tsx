/* eslint-disable react/jsx-props-no-spreading */
import { FormikDatePicker, FormikNumberInput, FormikTextarea } from '@mtes-mct/monitor-ui'
import { FieldArray, useFormikContext, getIn } from 'formik'
import _ from 'lodash'
import { useMemo } from 'react'
import { Form, IconButton } from 'rsuite'
import styled from 'styled-components'

import { COLORS } from '../../../../../constants/constants'
import {
  Mission,
  EnvActionControl,
  ActionTargetTypeEnum,
  VehicleTypeEnum
} from '../../../../../domain/entities/missions'
import { useNewWindow } from '../../../../../ui/NewWindow'
import { ReactComponent as ControlIconSVG } from '../../../../../uiMonitor/icons/Control.svg'
import { ReactComponent as DeleteSVG } from '../../../../../uiMonitor/icons/Delete.svg'
import { getDateAsLocalizedStringCompact } from '../../../../../utils/getDateAsLocalizedString'
import { MultiPointPicker } from '../../../MultiPointPicker'
import { ActionTheme } from '../Themes/ActionTheme'
import { ActionTargetSelector } from './ActionTargetSelector'
import { InfractionsForm } from './InfractionsForm'
import { VehicleTypeSelector } from './VehicleTypeSelector'

export function ControlForm({
  currentActionIndex,
  readOnly,
  removeControlAction,
  setCurrentActionIndex
}: {
  currentActionIndex: number
  readOnly: boolean
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
    ((actionTargetType === ActionTargetTypeEnum.VEHICLE && vehicleType !== undefined) ||
      (actionTargetType !== undefined && actionTargetType !== ActionTargetTypeEnum.VEHICLE)) &&
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

      if (selectedTargetType !== ActionTargetTypeEnum.VEHICLE) {
        _.set(w, `envActions[${currentActionIndex}].vehicleType`, null)
        _.update(w, `envActions[${currentActionIndex}].infractions`, inf =>
          inf?.map(i => ({ ...i, vesselSize: null, vesselType: null }))
        )
      }

      return w
    })
  }

  const handleRemoveAction = () => {
    setCurrentActionIndex(null)
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
        {!readOnly && (
          <IconButtonRight
            appearance="ghost"
            icon={<DeleteIcon className="rs-icon" />}
            onClick={handleRemoveAction}
            size="sm"
            title="supprimer"
          >
            Supprimer
          </IconButtonRight>
        )}
      </Header>
      <FormBody>
        <ActionTheme
          labelSubTheme="Sous-thématiques de contrôle"
          labelTheme="Thématique de contrôle"
          themePath={`envActions[${currentActionIndex}].themes[0]`}
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
          containerName="geom"
          label="Lieu du contrôle"
          name={`envActions[${currentActionIndex}].geom`}
          readOnly={readOnly}
        />

        <Separator />

        <ActionSummary>
          <ActionFieldWrapper>
            <Form.ControlLabel htmlFor={`envActions.${currentActionIndex}.actionNumberOfControls`} />
            <NumberOfControls
              data-cy="control-form-number-controls"
              isLight
              label="Nombre total de contrôles"
              min={0}
              name={`envActions.${currentActionIndex}.actionNumberOfControls`}
            />
          </ActionFieldWrapper>
          <ActionFieldWrapper>
            <ActionTargetSelector
              currentActionIndex={currentActionIndex}
              error={actionTargetTypeErrorMessage}
              onChange={onTargetTypeChange}
              value={actionTargetType}
            />
          </ActionFieldWrapper>
          <ActionFieldWrapper>
            <VehicleTypeSelector
              currentActionIndex={currentActionIndex}
              disabled={actionTargetType !== ActionTargetTypeEnum.VEHICLE}
              error={actionVehicleTypeErrorMessage}
              onChange={onVehicleTypeChange}
              value={vehicleType}
            />
          </ActionFieldWrapper>
        </ActionSummary>

        <FieldArray
          name={`envActions[${currentActionIndex}].infractions`}
          // eslint-disable-next-line react/jsx-props-no-spreading
          render={({ form, push, remove }) => (
            <InfractionsForm
              canAddInfraction={canAddInfraction}
              currentActionIndex={currentActionIndex}
              form={form}
              push={push}
              remove={remove}
            />
          )}
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
const NumberOfControls = styled(FormikNumberInput)`
  width: 150px !important;
`
