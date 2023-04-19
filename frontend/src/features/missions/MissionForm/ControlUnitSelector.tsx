/* eslint-disable react/jsx-props-no-spreading */
import { FormikTextInput } from '@mtes-mct/monitor-ui'
import { useField } from 'formik'
import _ from 'lodash'
import { MutableRefObject, useMemo, useRef } from 'react'
import { Form, IconButton, TagPicker } from 'rsuite'
import styled from 'styled-components'

import { useGetControlUnitsQuery } from '../../../api/controlUnitsAPI'
import { FormikErrorWrapper } from '../../../uiMonitor/CustomFormikFields/FormikErrorWrapper'
import { SelectPicker } from '../../../uiMonitor/CustomRsuite/SelectPicker'
import { ReactComponent as DeleteSVG } from '../../../uiMonitor/icons/Delete.svg'

import type { ControlResource } from '../../../domain/entities/controlUnit'

export function ControlUnitSelector({ controlUnitIndex, controlUnitPath, removeControlUnit, ...props }) {
  const [administrationField, , administrationHelpers] = useField<string>(
    `controlUnits.${controlUnitIndex}.administration`
  )
  const [unitField, , unitHelpers] = useField<number | undefined>(`controlUnits.${controlUnitIndex}.id`)
  const [, , unitNameHelpers] = useField<string | undefined>(`controlUnits.${controlUnitIndex}.name`)
  const [resourcesField, , resourcesHelpers] = useField<ControlResource[]>(`controlUnits.${controlUnitIndex}.resources`)

  const resourcesRef = useRef() as MutableRefObject<HTMLDivElement>
  const { data, isError, isLoading } = useGetControlUnitsQuery()

  const filteredControlUnits = useMemo(() => data?.filter(unit => !unit.isArchived) || [], [data])

  const administrationList = _.chain(filteredControlUnits)
    .map(unit => unit.administration)
    .uniq()
    .sort((a, b) => a?.localeCompare(b))
    .map(administration => ({ administration }))
    .value()

  const unitList = filteredControlUnits
    .filter(unit => (administrationField.value ? administrationField.value === unit.administration : true))
    .sort((a, b) => a?.name?.localeCompare(b?.name))

  const resourcesList =
    filteredControlUnits?.find(unit => unit.administration === administrationField.value && unit.id === unitField.value)
      ?.resources || []

  // Add any resource from Mission not present in list from API (as the resource might be historized)
  // See: https://github.com/MTES-MCT/monitorenv/issues/103
  // eslint-disable-next-line no-unsafe-optional-chaining
  const combinedResourceList = _.chain([...resourcesList, ...resourcesField?.value])
    .uniqBy('id')
    .sort((a, b) => a?.name?.localeCompare(b?.name))
    .value()

  const handleAdministrationChange = value => {
    if (value !== administrationField.value) {
      administrationHelpers.setValue(value)
      const newUnitList = _.uniqBy(
        _.filter(filteredControlUnits, r => r.administration === value),
        'name'
      )
      if (newUnitList.length === 1 && newUnitList[0]?.id) {
        unitHelpers.setValue(newUnitList[0]?.id)
        unitNameHelpers.setValue(newUnitList[0]?.name)
      } else {
        unitHelpers.setValue(undefined)
        unitNameHelpers.setValue(undefined)
      }
      resourcesHelpers.setValue([])
    }
  }
  const handleUnitChange = value => {
    if (value !== unitField.value) {
      unitHelpers.setValue(value)
      resourcesHelpers.setValue([])

      const foundUnit = unitList.find(unit => unit.id === value)
      if (!foundUnit) {
        return
      }
      unitNameHelpers.setValue(foundUnit.name)
      administrationHelpers.setValue(foundUnit.administration)
    }
  }
  const handleResourceChange = values => {
    const resourceObjects = values
      .filter(value => typeof value === 'number')
      .map(id => resourcesList.find(resource => resource.id === id))
    resourcesHelpers.setValue(resourceObjects)
  }

  if (isError) {
    return <div>Erreur</div>
  }
  if (isLoading) {
    return <div>Chargement</div>
  }
  const resourceUnitIndexDisplayed = controlUnitIndex + 1

  return (
    <RessourceUnitWrapper>
      <SelectorWrapper>
        <FormGroupFixed>
          <FormikErrorWrapper name={`controlUnits.${controlUnitIndex}.administration`} noMessage>
            <Form.ControlLabel htmlFor="administration">Administration {resourceUnitIndexDisplayed}</Form.ControlLabel>
            <SelectPicker
              block
              data={administrationList}
              dataCy="add-control-administration"
              labelKey="administration"
              onChange={handleAdministrationChange}
              searchable={administrationList.length > 10}
              size="sm"
              value={administrationField.value}
              valueKey="administration"
            />
          </FormikErrorWrapper>
        </FormGroupFixed>
        <FormGroupFixed>
          <FormikErrorWrapper name={`controlUnits.${controlUnitIndex}.id`} noMessage>
            <Form.ControlLabel htmlFor="unit">Unité {resourceUnitIndexDisplayed}</Form.ControlLabel>
            <SelectPicker
              block
              data={unitList}
              dataCy="add-control-unit"
              labelKey="name"
              onChange={handleUnitChange}
              searchable={unitList.length > 10}
              size="sm"
              value={unitField.value}
              valueKey="id"
              {...props}
              key={unitField.value}
            />
          </FormikErrorWrapper>
        </FormGroupFixed>
        <FormGroupFixed>
          <RefWrapper ref={resourcesRef} data-cy="unit-tag-picker">
            <Form.ControlLabel htmlFor="resources">Moyen(s) {resourceUnitIndexDisplayed}</Form.ControlLabel>
            <TagPicker
              block
              cleanable={false}
              container={() => resourcesRef.current}
              data={combinedResourceList}
              disabled={!_.isNumber(unitField.value)}
              labelKey="name"
              onChange={handleResourceChange}
              size="sm"
              value={resourcesField.value.map(resource => resource.id)}
              valueKey="id"
              {...props}
            />
          </RefWrapper>
        </FormGroupFixed>
        <FormGroupFixed>
          <FormikTextInput
            data-cy="control-unit-contact"
            label={`Contact de l'unité ${resourceUnitIndexDisplayed}`}
            name={`controlUnits.${controlUnitIndex}.contact`}
          />
        </FormGroupFixed>
      </SelectorWrapper>

      {controlUnitIndex > 0 && (
        <div>
          <DeleteButton appearance="ghost" icon={<DeleteSVG className="rs-icon" />} onClick={removeControlUnit} />
        </div>
      )}
    </RessourceUnitWrapper>
  )
}

const RessourceUnitWrapper = styled.div`
  display: flex;
  max-width: 416px;
  margin-bottom: 14px;
`

const SelectorWrapper = styled.div`
  width: 100%;
  max-width: 416px;
  margin-bottom: 14px;
`

const FormGroupFixed = styled.div`
  height: 52px;
  :not(:last-child) {
    margin-bottom: 4px;
  }
`

const RefWrapper = styled.div`
  .rs-picker-menu {
    position: relative;
    margin-top: -50px;
  }
`

const DeleteButton = styled(IconButton)`
  margin-top: 22px;
  margin-left: 8px;
`
