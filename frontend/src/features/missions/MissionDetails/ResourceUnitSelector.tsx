/* eslint-disable react/jsx-props-no-spreading */
import { useField } from 'formik'
import _ from 'lodash'
import { MutableRefObject, useRef } from 'react'
import { Form, TagPicker, IconButton } from 'rsuite'
import styled from 'styled-components'

import { useGetControlResourcesQuery } from '../../../api/controlResourcesAPI'
import { FormikInput } from '../../../uiMonitor/CustomFormikFields/FormikInput'
import { SelectPicker } from '../../../uiMonitor/CustomRsuite/SelectPicker'
import { ReactComponent as DeleteSVG } from '../../../uiMonitor/icons/Delete.svg'

export function ResourceUnitSelector({ removeResourceUnit, resourceUnitIndex, resourceUnitPath, ...props }) {
  const [administrationField, , administrationHelpers] = useField(`resourceUnits.${resourceUnitIndex}.administration`)
  const [unitField, , unitHelpers] = useField(`resourceUnits.${resourceUnitIndex}.unit`)
  const [resourcesField, , resourcesHelpers] = useField(`resourceUnits.${resourceUnitIndex}.resources`)
  const [, , contactHelpers] = useField(`resourceUnits.${resourceUnitIndex}.contact`)

  const resourcesRef = useRef() as MutableRefObject<HTMLDivElement>
  const { data, isError, isLoading } = useGetControlResourcesQuery()

  const administrationList = _.chain(data)
    .uniqBy('administration')
    .sort((a, b) => a?.administration?.localeCompare(b?.administration))
    .value()
  const unitList = _.chain(data)
    .filter(r => !!(r.administration === administrationField.value))
    .uniqBy('unit')
    .sort((a, b) => a?.unit?.localeCompare(b?.unit))
    .value()
  const resourcesList = _.chain(data)
    .filter(r => !!(r.administration === administrationField.value && r.unit === unitField.value && r.resourceName))
    .value()

  // Add any resource from Mission not present in resourceList from API
  // See: https://github.com/MTES-MCT/monitorenv/issues/103
  const existingResourcesOptions = resourcesField?.value?.map(r => ({
    resourceName: r
  }))
  const combinedResourceList = _.chain([...resourcesList, ...existingResourcesOptions])
    .uniqBy('resourceName')
    .sort((a, b) => a?.resourceName?.localeCompare(b?.resourceName))
    .value()

  const handleAdministrationChange = value => {
    if (value !== administrationField.value) {
      administrationHelpers.setValue(value)
      const newUnitList = _.uniqBy(
        _.filter(data, r => r.administration === value),
        'unit'
      )
      if (newUnitList.length === 1) {
        unitHelpers.setValue(newUnitList[0]?.unit)
      } else {
        unitHelpers.setValue('')
      }
      resourcesHelpers.setValue([])
    }
  }
  const handleUnitChange = value => {
    if (value !== unitField.value) {
      unitHelpers.setValue(value)
      resourcesHelpers.setValue([])
    }
  }
  const handleResourceChange = value => {
    resourcesHelpers.setValue(value)
  }
  const handleContactChange = value => {
    contactHelpers.setValue(value)
  }
  if (isError) {
    return <div>Erreur</div>
  }
  if (isLoading) {
    return <div>Chargement</div>
  }
  const resourceUnitIndexDisplayed = resourceUnitIndex + 1

  return (
    <RessourceUnitWrapper>
      <SelectorWrapper>
        <FormGroupFixed>
          <Form.ControlLabel htmlFor="administration">Administration {resourceUnitIndexDisplayed}</Form.ControlLabel>
          <SelectPicker
            block
            data={administrationList}
            labelKey="administration"
            onChange={handleAdministrationChange}
            searchable={administrationList.length > 10}
            size="sm"
            value={administrationField.value}
            valueKey="administration"
          />
        </FormGroupFixed>
        <FormGroupFixed>
          <Form.ControlLabel htmlFor="unit">Unité {resourceUnitIndexDisplayed}</Form.ControlLabel>
          <SelectPicker
            block
            data={unitList}
            disabled={_.isEmpty(administrationField.value)}
            labelKey="unit"
            onChange={handleUnitChange}
            searchable={unitList.length > 10}
            size="sm"
            value={unitField.value}
            valueKey="unit"
            {...props}
          />
        </FormGroupFixed>
        <FormGroupFixed>
          <RefWrapper ref={resourcesRef} data-cy="unit-tag-picker">
            <Form.ControlLabel htmlFor="resources">Moyen(s) {resourceUnitIndexDisplayed}</Form.ControlLabel>
            <TagPicker
              block
              cleanable={false}
              container={() => resourcesRef.current}
              creatable
              data={combinedResourceList}
              disabled={_.isEmpty(unitField.value)}
              labelKey="resourceName"
              onChange={handleResourceChange}
              size="sm"
              value={resourcesField.value}
              valueKey="resourceName"
              {...props}
            />
          </RefWrapper>
        </FormGroupFixed>
        <FormGroupFixed>
          <Form.ControlLabel htmlFor={`resourceUnits.${resourceUnitIndex}.contact`}>
            Contact de l&apos;unité {resourceUnitIndexDisplayed}
          </Form.ControlLabel>
          <FormikInput name={`resourceUnits.${resourceUnitIndex}.contact`} onChange={handleContactChange} size="sm" />
        </FormGroupFixed>
      </SelectorWrapper>

      {resourceUnitIndex > 0 && (
        <div>
          <DeleteButton appearance="ghost" icon={<DeleteSVG className="rs-icon" />} onClick={removeResourceUnit} />
        </div>
      )}
    </RessourceUnitWrapper>
  )
}

const RessourceUnitWrapper = styled.div`
  display: flex;
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
