import { useField } from 'formik'
import _ from 'lodash'
import React, { useRef } from 'react'
import { Form, SelectPicker, TagPicker, IconButton } from 'rsuite'
import styled from 'styled-components'

import { useGetControlResourcesQuery } from '../../../api/controlResourcesAPI'
import { COLORS } from '../../../constants/constants'
import { ReactComponent as DeleteSVG } from '../../../uiMonitor/icons/Delete.svg'

const DEFAULT_SELECT_PICKER_STYLE = {
  borderColor: COLORS.lightGray,
  boxSizing: 'border-box',
  margin: '0',
  textOverflow: 'ellipsis',
  width: 200
}

const DEFAULT_SELECT_PICKER_MENU_STYLE = {
  overflowY: 'hidden',
  textOverflow: 'ellipsis',
  width: 200
}

export function ResourceUnitSelector({ removeResourceUnit, resourceUnitIndex, resourceUnitPath, ...props }) {
  const [administrationField, , administrationHelpers] = useField(`resourceUnits.${resourceUnitIndex}.administration`)
  const [unitField, , unitHelpers] = useField(`resourceUnits.${resourceUnitIndex}.unit`)
  const [resourcesField, , resourcesHelpers] = useField(`resourceUnits.${resourceUnitIndex}.resources`)

  const administrationSelectorRef = useRef()
  const unitSelectorRef = useRef()
  const resourcesRef = useRef()
  const { data, isError, isLoading } = useGetControlResourcesQuery()

  const administrationList = _.uniqBy(data, 'administration')
  const unitList = _.uniqBy(
    _.filter(data, r => r.administration === administrationField.value),
    'unit'
  )
  const resourcesList = _.filter(
    data,
    r => r.administration === administrationField.value && r.unit === unitField.value && r.resourceName
  )

  // Add any resource from Mission not present in resourceList from API
  // See: https://github.com/MTES-MCT/monitorenv/issues/103
  const existingResourcesOptions = resourcesField?.value?.map(r => ({
    resourceName: r
  }))
  const combinedResourceList = _.uniqBy([...resourcesList, ...existingResourcesOptions], r => r.resourceName)

  const handleAdministrationChange = value => {
    if (value !== administrationField.value) {
      administrationHelpers.setValue(value)
      unitHelpers.setValue('')
      resourcesHelpers.setValue([])
    }
  }
  const handleUnitChange = value => {
    if (value !== unitField.value) {
      unitHelpers.setValue(value)
      resourcesHelpers.setValue([])
    }
  }

  if (isError) {
    return 'Erreur'
  }
  if (isLoading) {
    return 'Chargement'
  }
  const resourceUnitIndexDisplayed = resourceUnitIndex + 1

  return (
    <RessourceUnitWrapper>
      <SelectorWrapper>
        <FormGroupFixed>
          <FormColumn ref={administrationSelectorRef}>
            <Form.ControlLabel htmlFor="administration">Administration {resourceUnitIndexDisplayed}</Form.ControlLabel>
            <SelectPicker
              container={() => administrationSelectorRef.current}
              data={administrationList}
              labelKey="administration"
              menuStyle={DEFAULT_SELECT_PICKER_MENU_STYLE}
              onChange={handleAdministrationChange}
              searchable={false}
              size="sm"
              style={DEFAULT_SELECT_PICKER_STYLE}
              value={administrationField.value}
              valueKey="administration"
              {...props}
            />
          </FormColumn>
          <FormColumn ref={unitSelectorRef}>
            <Form.ControlLabel htmlFor="unit">Unité {resourceUnitIndexDisplayed}</Form.ControlLabel>
            <SelectPicker
              container={() => unitSelectorRef.current}
              data={unitList}
              disabled={_.isEmpty(administrationField.value)}
              labelKey="unit"
              menuStyle={DEFAULT_SELECT_PICKER_MENU_STYLE}
              onChange={handleUnitChange}
              searchable={false}
              size="sm"
              style={DEFAULT_SELECT_PICKER_STYLE}
              value={unitField.value}
              valueKey="unit"
              {...props}
            />
          </FormColumn>
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
              onChange={resourcesHelpers.setValue}
              size="sm"
              value={resourcesField.value}
              valueKey="resourceName"
              {...props}
            />
          </RefWrapper>
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
  margin-bottom: 16px;
  .rs-picker-select-menu {
    position: relative;
    margin-top: -50px;
  }
`

const FormColumn = styled.div`
  display: inline-block;
  vertical-align: top;
  :not(:last-child) {
    margin-right: 16px;
  }
`

const FormGroupFixed = styled.div`
  height: 58px;
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
