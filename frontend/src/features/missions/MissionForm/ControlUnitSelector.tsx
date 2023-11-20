/* eslint-disable react/jsx-props-no-spreading */
import {
  Accent,
  CustomSearch,
  FormikTextInput,
  getOptionsFromIdAndName,
  Icon,
  IconButton,
  Level,
  Message,
  MultiSelect,
  Select,
  useNewWindow
} from '@mtes-mct/monitor-ui'
import { useField } from 'formik'
import { uniq, uniqBy } from 'lodash'
import { useMemo } from 'react'
import styled from 'styled-components'

import { RTK_DEFAULT_QUERY_OPTIONS } from '../../../api/constants'
import { useGetLegacyControlUnitsQuery } from '../../../api/legacyControlUnitsAPI'
import { useGetEngagedControlUnitsQuery } from '../../../api/missionsAPI'
import { missionSourceEnum } from '../../../domain/entities/missions'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { isNewMission } from '../../../utils/isNewMission'
import { isNotArchived } from '../../../utils/isNotArchived'
import { getMissionPageRoute } from '../../../utils/routes'

import type { ControlUnit } from '../../../domain/entities/controlUnit'

export function ControlUnitSelector({ controlUnitIndex, removeControlUnit }) {
  const { newWindowContainerRef } = useNewWindow()
  const [administrationField, administrationMeta, administrationHelpers] = useField<string>(
    `controlUnits.${controlUnitIndex}.administration`
  )
  const [unitField, , unitHelpers] = useField<number | undefined>(`controlUnits.${controlUnitIndex}.id`)
  const [, unitNameMeta, unitNameHelpers] = useField<string | undefined>(`controlUnits.${controlUnitIndex}.name`)
  const [resourcesField, , resourcesHelpers] = useField<ControlUnit.ControlUnitResource[]>(
    `controlUnits.${controlUnitIndex}.resources`
  )

  const currentPath = useAppSelector(state => state.sideWindow.currentPath)
  const routeParams = getMissionPageRoute(currentPath)
  const missionIsNewMission = isNewMission(routeParams?.params?.id)

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

  const administrationsAsOption = useMemo(() => {
    const formattedAdministrations = uniq(filteredControlUnits.map(({ administration }) => administration)).sort()

    return formattedAdministrations.map(administration => ({
      label: administration,
      value: administration
    }))
  }, [filteredControlUnits])

  const unitList = filteredControlUnits
    .filter(unit => (administrationField.value ? administrationField.value === unit.administration : true))
    .sort()

  const unitListAsOption = useMemo(() => getOptionsFromIdAndName(unitList), [unitList])
  const controlUnitCustomSearch = useMemo(
    () =>
      new CustomSearch(unitListAsOption || [], ['label'], {
        isStrict: true,
        threshold: 0.2
      }),
    [unitListAsOption]
  )

  const resourcesList =
    filteredControlUnits?.find(unit => unit.administration === administrationField.value && unit.id === unitField.value)
      ?.resources || [].filter(isNotArchived)

  // Add any resource from Mission not present in list from API (as the resource might be historized)
  // See: https://github.com/MTES-MCT/monitorenv/issues/103
  // eslint-disable-next-line no-unsafe-optional-chaining
  const combinedResourceList = useMemo(() => {
    const resources = [...resourcesList, ...resourcesField.value]

    return uniqBy(resources, 'id').sort()
  }, [resourcesList, resourcesField.value])
  const resourcesAsOption = useMemo(() => getOptionsFromIdAndName(combinedResourceList), [combinedResourceList])

  const handleAdministrationChange = value => {
    if (value !== administrationField.value) {
      administrationHelpers.setValue(value)
      const newUnitList = uniqBy(
        filteredControlUnits.filter(controlUnit => controlUnit.administration === value),
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
    if (!values) {
      resourcesHelpers.setValue([])

      return
    }
    const resourceObjects = values.map(id => resourcesList.find(resource => resource.id === id))
    resourcesHelpers.setValue(resourceObjects)
  }

  const engagedControlUnit = engagedControlUnits.find(engaged => engaged.controlUnit.id === unitField.value)
  const resourceUnitIndexDisplayed = controlUnitIndex + 1

  const controlUnitWarningMessage = useMemo(() => {
    if (!engagedControlUnit) {
      return ''
    }

    if (engagedControlUnit.missionSources.length === 1) {
      const source = engagedControlUnit.missionSources[0]
      if (!source) {
        return ''
      }

      return `Cette unité est actuellement sélectionnée dans une autre mission en cours ouverte par le ${missionSourceEnum[source].label}.`
    }

    if (engagedControlUnit.missionSources.length > 1) {
      return `Cette unité est actuellement sélectionnée dans plusieurs autres missions en cours, ouvertes par le ${engagedControlUnit.missionSources
        .map(source => missionSourceEnum[source].label)
        .join(' et le ')}.`
    }

    return ''
  }, [engagedControlUnit])

  if (isError) {
    return <div>Erreur</div>
  }

  if (isLoading) {
    return <div>Chargement</div>
  }

  return (
    <RessourceUnitWrapper>
      <AdministrationContainer>
        <Select
          baseContainer={newWindowContainerRef.current}
          data-cy="add-control-administration"
          error={administrationMeta.error}
          label={`Administration ${resourceUnitIndexDisplayed}`}
          name={administrationField.name}
          onChange={handleAdministrationChange}
          options={administrationsAsOption}
          searchable={administrationsAsOption.length > 10}
          value={administrationField.value}
        />
        {controlUnitIndex > 0 && (
          <DeleteButton accent={Accent.SECONDARY} Icon={Icon.Delete} onClick={removeControlUnit} />
        )}
      </AdministrationContainer>

      <div>
        <Select
          key={unitList.length}
          baseContainer={newWindowContainerRef.current}
          customSearch={unitList.length > 10 ? controlUnitCustomSearch : undefined}
          data-cy="add-control-unit"
          error={unitNameMeta.error}
          label={`Unité ${resourceUnitIndexDisplayed}`}
          name={unitField.name}
          onChange={handleUnitChange}
          options={unitListAsOption || []}
          searchable={unitList.length > 10}
          value={unitField.value}
        />
        {missionIsNewMission && !!engagedControlUnit && (
          <StyledMessage level={Level.WARNING}>{controlUnitWarningMessage}</StyledMessage>
        )}
      </div>

      <MultiSelect
        baseContainer={newWindowContainerRef.current}
        cleanable={false}
        disabled={!unitField.value}
        label={`Moyen(s) ${resourceUnitIndexDisplayed}`}
        name={resourcesField.name}
        onChange={handleResourceChange}
        options={resourcesAsOption || []}
        value={resourcesField.value.map(resource => resource.id)}
      />

      <FormikTextInput
        data-cy="control-unit-contact"
        isErrorMessageHidden
        label={`Contact de l'unité ${resourceUnitIndexDisplayed}`}
        name={`controlUnits.${controlUnitIndex}.contact`}
      />
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
  gap: 4px;
`

const AdministrationContainer = styled.div`
  position: relative;
`

const DeleteButton = styled(IconButton)`
  position: absolute;
  top: 21px;
  left: calc(100% + 4px);
`
