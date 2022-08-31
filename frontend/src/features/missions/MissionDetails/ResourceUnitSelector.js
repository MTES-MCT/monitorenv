import React, { useRef } from 'react'
import _ from 'lodash'
import styled from 'styled-components'
import { Form, SelectPicker, TagPicker, IconButton } from 'rsuite'
import {  useField } from 'formik'

import { useGetControlResourcesQuery } from '../../../api/controlResourcesAPI'

import { ReactComponent as DeleteSVG } from '../../../uiMonitor/icons/Suppression_clair.svg'
import { COLORS } from '../../../constants/constants'

const DEFAULT_SELECT_PICKER_STYLE = {
  width: 200,
  margin: '0',
  borderColor: COLORS.lightGray,
  boxSizing: 'border-box',
  textOverflow: 'ellipsis'
}

const DEFAULT_SELECT_PICKER_MENU_STYLE = { 
  width: 200,
  overflowY: 'hidden',
  textOverflow: 'ellipsis'
}


export const ResourceUnitSelector = ({ resourceUnitPath, removeResourceUnit, resourceUnitIndex, ...props }) => {
  const [administrationField, , administrationHelpers] = useField(`resourceUnits.${resourceUnitIndex}.administration`);
  const [unitField, , unitHelpers] = useField(`resourceUnits.${resourceUnitIndex}.unit`);
  const [resourcesField, , resourcesHelpers] = useField(`resourceUnits.${resourceUnitIndex}.resources`);

  const administrationSelectorRef = useRef()
  const unitSelectorRef = useRef()
  const resourcesRef = useRef()
  const { data, isError, isLoading } = useGetControlResourcesQuery()

  const administrationList = _.uniqBy(data, 'administration')
  const unitList = _.uniqBy(_.filter(data, r => r.administration === administrationField.value), 'unit')
  const resourcesList = _.filter(data, r => r.administration === administrationField.value && r.unit === unitField.value && r.resource_name)
  
  // Add any resource from Mission not present in resourceList from API
  // See: https://github.com/MTES-MCT/monitorenv/issues/103 
  const existingResourcesOptions = resourcesField?.value?.map(r => ({
    resource_name: r
  }))
  const combinedResourceList = _.uniqBy([...resourcesList, ...existingResourcesOptions], (r)=>r.resource_name)

  const handleAdministrationChange = (value) => {
    if (value !== administrationField.value) {
      administrationHelpers.setValue(value)
      unitHelpers.setValue('')
      resourcesHelpers.setValue([])
    }
  }
  const handleUnitChange = (value) => {
    if (value !== unitField.value) {
      unitHelpers.setValue(value)
      resourcesHelpers.setValue([])
    }
  }

  if (isError) {
    return ('Erreur')
  }
  if (isLoading) {
    return ('Chargement')
  }
  const resourceUnitIndexDisplayed = resourceUnitIndex + 1

  return (
    <RessourceUnitWrapper>
      <SelectorWrapper >
        <FormGroupFixed>
          <FormColumn ref={administrationSelectorRef}>
            <Form.ControlLabel htmlFor="administration">Administration {resourceUnitIndexDisplayed}</Form.ControlLabel>
            <SelectPicker 
              size='sm'
              style={DEFAULT_SELECT_PICKER_STYLE}
              menuStyle={DEFAULT_SELECT_PICKER_MENU_STYLE}
              searchable={false}
              container={()=>administrationSelectorRef.current}
              value={administrationField.value}
              onChange={handleAdministrationChange}
              data={administrationList}
              labelKey={'administration'}
              valueKey={'administration'}
              {...props} />
          </FormColumn>
          <FormColumn ref={unitSelectorRef}>
            <Form.ControlLabel htmlFor="unit">Unité {resourceUnitIndexDisplayed}</Form.ControlLabel>
            <SelectPicker 
              size='sm'
              style={DEFAULT_SELECT_PICKER_STYLE}
              menuStyle={DEFAULT_SELECT_PICKER_MENU_STYLE}
              searchable={false}
              container={()=>unitSelectorRef.current} 
              value={unitField.value} 
              onChange={handleUnitChange} 
              data={unitList} 
              labelKey={'unit'}
              valueKey={'unit'}
              disabled={_.isEmpty(administrationField.value)}
              {...props} />
          </FormColumn>
        </FormGroupFixed>
        <FormGroupFixed>
          <RefWrapper ref={resourcesRef} data-cy={'unit-tag-picker'}>
            <Form.ControlLabel htmlFor="resources">Moyen(s) {resourceUnitIndexDisplayed}</Form.ControlLabel>
            <TagPicker
              block
              size='sm'
              creatable
              cleanable={false}
              container={()=>resourcesRef.current}
              value={resourcesField.value}
              onChange={resourcesHelpers.setValue}
              data={combinedResourceList}
              labelKey={'resource_name'}
              valueKey={'resource_name'}
              disabled={_.isEmpty(unitField.value)}
              {...props} />
          </RefWrapper>
        </FormGroupFixed>
      </SelectorWrapper>
      
        {resourceUnitIndex > 0 && <div><DeleteButton appearance="ghost" icon={<DeleteSVG className={"rs-icon"} />} onClick={removeResourceUnit}></DeleteButton></div>}
      
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