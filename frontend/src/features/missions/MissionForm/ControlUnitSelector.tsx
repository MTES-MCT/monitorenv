/* eslint-disable react/jsx-props-no-spreading */
import { FieldError, FormikTextInput, Level, Message } from '@mtes-mct/monitor-ui'
import { useField } from 'formik'
import _ from 'lodash'
import { type MutableRefObject, useMemo, useRef } from 'react'
import { Form, IconButton, TagPicker } from 'rsuite'
import styled from 'styled-components'

import { RTK_DEFAULT_QUERY_OPTIONS } from '../../../api/constants'
import { useGetLegacyControlUnitsQuery } from '../../../api/legacyControlUnitsAPI'
import { useGetEngagedControlUnitsQuery } from '../../../api/missionsAPI'
import { FormikErrorWrapper } from '../../../uiMonitor/CustomFormikFields/FormikErrorWrapper'
import { SelectPicker } from '../../../uiMonitor/CustomRsuite/SelectPicker'
import { ReactComponent as DeleteSVG } from '../../../uiMonitor/icons/Delete.svg'
import { isNotArchived } from '../../../utils/isNotArchived'

import type { ControlUnit } from '../../../domain/entities/controlUnit'

export function ControlUnitSelector({ controlUnitIndex, controlUnitPath, removeControlUnit, ...props }) {
  const [administrationField, administrationMeta, administrationHelpers] = useField<string>(
    `controlUnits.${controlUnitIndex}.administration`
  )
  const [unitField, , unitHelpers] = useField<number | undefined>(`controlUnits.${controlUnitIndex}.id`)
  const [, unitNameMeta, unitNameHelpers] = useField<string | undefined>(`controlUnits.${controlUnitIndex}.name`)
  const [resourcesField, , resourcesHelpers] = useField<ControlUnit.ControlUnitResource[]>(
    `controlUnits.${controlUnitIndex}.resources`
  )

  const resourcesRef = useRef() as MutableRefObject<HTMLDivElement>
  const {
    data: controlUnitsData,
    isError,
    isLoading
  } = useGetLegacyControlUnitsQuery(undefined, RTK_DEFAULT_QUERY_OPTIONS)

  const filteredControlUnits = useMemo(() => controlUnitsData?.filter(isNotArchived) || [], [controlUnitsData])

  const { data: engagedControlUnitsData } = useGetEngagedControlUnitsQuery(undefined, RTK_DEFAULT_QUERY_OPTIONS)

  const engagedControlUnits = useMemo(() => {
    if (!engagedControlUnitsData) {
      return []
    }

    return engagedControlUnitsData
  }, [engagedControlUnitsData])

  const administrationList = _.chain(filteredControlUnits)
    .map(unit => unit.administration)
    .uniq()
    .sort((a, b) => a?.localeCompare(b))
    .map(administration => ({ administration }))
    .value()

  const unitList = filteredControlUnits
    .filter(unit => (administrationField.value ? administrationField.value === unit.administration : true))
    .sort((a, b) => a?.name?.localeCompare(b?.name))

  const resourcesList = (
    filteredControlUnits?.find(unit => unit.administration === administrationField.value && unit.id === unitField.value)
      ?.resources || []
  ).filter(isNotArchived)

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

  const isEngaged = !!engagedControlUnits.find(engaged => engaged.id === unitField.value)
  const resourceUnitIndexDisplayed = controlUnitIndex + 1

  return (
    <RessourceUnitWrapper>
      <FormGroupFixed>
        <FormikErrorWrapper name={`controlUnits.${controlUnitIndex}.administration`} noMessage>
          <Form.ControlLabel htmlFor="administration">Administration {resourceUnitIndexDisplayed}</Form.ControlLabel>
          <StyledAdministartionContainer>
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
            {controlUnitIndex > 0 && (
              <DeleteButton appearance="ghost" icon={<DeleteSVG className="rs-icon" />} onClick={removeControlUnit} />
            )}
          </StyledAdministartionContainer>
        </FormikErrorWrapper>
        {administrationMeta.error && <FieldError>{administrationMeta.error}</FieldError>}
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
        {unitNameMeta.error && <FieldError>{unitNameMeta.error}</FieldError>}
        {isEngaged && (
          <StyledMessage level={Level.WARNING}>
            Cette unité est actuellement sélectionnée dans une autre mission en cours.
          </StyledMessage>
        )}
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
          isErrorMessageHidden
          label={`Contact de l'unité ${resourceUnitIndexDisplayed}`}
          name={`controlUnits.${controlUnitIndex}.contact`}
        />
      </FormGroupFixed>
    </RessourceUnitWrapper>
  )
}

const StyledMessage = styled(Message)`
  margin-top: 8px;
`

const RessourceUnitWrapper = styled.div`
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
  flex: 1;
`

const FormGroupFixed = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  :not(:last-child) {
    margin-bottom: 4px;
  }
  .Field-TextInput {
    flex: 1;
  }
`

const RefWrapper = styled.div`
  width: 100%;
  .rs-picker {
    margin-top: 4px;
  }
  .rs-picker-menu {
    position: relative;
    margin-top: -50px;
  }
`
const StyledAdministartionContainer = styled.div`
  position: relative;
`

const DeleteButton = styled(IconButton)`
  position: absolute;
  top: 0px;
  left: calc(100% + 4px);
`
