import { isMissionNew } from '@features/missions/utils'
import {
  Accent,
  type ControlUnit,
  CustomSearch,
  FormikTextInput,
  getOptionsFromIdAndName,
  Icon,
  IconButton,
  MultiSelect,
  Select
} from '@mtes-mct/monitor-ui'
import { useField } from 'formik'
import { uniq, uniqBy } from 'lodash'
import { useMemo } from 'react'
import styled from 'styled-components'

import { ControlUnitWarningMessage } from './ControlUnitWarningMessage'
import { RTK_DEFAULT_QUERY_OPTIONS } from '../../../../api/constants'
import { useGetLegacyControlUnitsQuery } from '../../../../api/legacyControlUnitsAPI'
import { useGetEngagedControlUnitsQuery } from '../../../../api/missionsAPI'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { isNotArchived } from '../../../../utils/isNotArchived'
import { getMissionPageRoute } from '../../../../utils/routes'
import { missionFormsActions } from '../slice'

type ControlUnitSelectorProps = {
  controlUnitIndex: number
  removeControlUnit: () => void
}

export function ControlUnitSelector({ controlUnitIndex, removeControlUnit }: ControlUnitSelectorProps) {
  const dispatch = useAppDispatch()

  const [administrationField, administrationMeta, administrationHelpers] = useField<string>(
    `controlUnits.${controlUnitIndex}.administration`
  )
  const [unitField, , unitHelpers] = useField<number | undefined>(`controlUnits.${controlUnitIndex}.id`)
  const [unitNameField, unitNameMeta, unitNameHelpers] = useField<string | undefined>(
    `controlUnits.${controlUnitIndex}.name`
  )
  const [resourcesField, , resourcesHelpers] = useField<ControlUnit.ControlUnitResource[]>(
    `controlUnits.${controlUnitIndex}.resources`
  )

  const currentPath = useAppSelector(state => state.sideWindow.currentPath)
  const routeParams = getMissionPageRoute(currentPath)
  const missionIsNewMission = isMissionNew(routeParams?.params?.id)

  const {
    data: controlUnitsData,
    isError,
    isLoading
  } = useGetLegacyControlUnitsQuery(undefined, RTK_DEFAULT_QUERY_OPTIONS)

  // Include archived control units (and administrations) if they're already selected
  const activeWithSelectedControlUnits = useMemo(
    () =>
      controlUnitsData?.filter(controlUnit => isNotArchived(controlUnit) || unitNameField.value === controlUnit.name) ??
      [],
    [controlUnitsData, unitNameField.value]
  )

  const administrationsAsOption = useMemo(() => {
    const formattedAdministrations = uniq(
      activeWithSelectedControlUnits.map(({ administration }) => administration)
    ).sort()

    return formattedAdministrations.map(administration => ({
      label: administration,
      value: administration
    }))
  }, [activeWithSelectedControlUnits])

  const unitList = activeWithSelectedControlUnits
    .filter(unit => (administrationField.value ? administrationField.value === unit.administration : true))
    .sort()

  const unitListAsOption = useMemo(() => getOptionsFromIdAndName(unitList), [unitList])
  const controlUnitCustomSearch = useMemo(
    () =>
      new CustomSearch(unitListAsOption ?? [], ['label'], {
        isStrict: true,
        threshold: 0.2
      }),
    [unitListAsOption]
  )

  // Include archived resources if they're already selected
  const activeWithSelectedControlUnitResources = useMemo(() => {
    const activeControlUnitResources = (
      activeWithSelectedControlUnits?.find(
        unit => unit.administration === administrationField.value && unit.id === unitField.value
      )?.resources ?? []
    ).filter(isNotArchived)

    const resources = [...activeControlUnitResources, ...resourcesField.value]

    return uniqBy(resources, 'id')
  }, [activeWithSelectedControlUnits, administrationField.value, resourcesField.value, unitField.value])

  const resourcesAsOption = useMemo(
    () => getOptionsFromIdAndName(activeWithSelectedControlUnitResources),
    [activeWithSelectedControlUnitResources]
  )

  const handleAdministrationChange = value => {
    if (value !== administrationField.value) {
      administrationHelpers.setValue(value)
      const newUnitList = uniqBy(
        activeWithSelectedControlUnits.filter(controlUnit => controlUnit.administration === value),
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

  const { data: engagedControlUnits = [] } = useGetEngagedControlUnitsQuery(undefined, {
    skip: !missionIsNewMission
  })

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

      if (foundUnit.resources.length === 1 && foundUnit.resources[0]) {
        resourcesHelpers.setValue([foundUnit.resources[0]])
      }

      if (missionIsNewMission) {
        const controlUnitAlreadyEngaged = engagedControlUnits.find(engaged => engaged.controlUnit.id === value)
        if (controlUnitAlreadyEngaged) {
          dispatch(missionFormsActions.setEngagedControlUnit(controlUnitAlreadyEngaged))

          return
        }
        dispatch(missionFormsActions.setEngagedControlUnit(undefined))
      }
    }
  }
  const handleResourceChange = (nextControlUnitResourceIds: number[] | undefined) => {
    if (!nextControlUnitResourceIds) {
      resourcesHelpers.setValue([])

      return
    }

    const nextControlUnitResources = activeWithSelectedControlUnitResources.filter(controlUnitResource =>
      nextControlUnitResourceIds.includes(controlUnitResource.id)
    )

    resourcesHelpers.setValue(nextControlUnitResources)
  }

  const resourceUnitIndexDisplayed = controlUnitIndex + 1

  if (isError) {
    return <div>Erreur</div>
  }

  if (isLoading) {
    return <div>Chargement</div>
  }

  return (
    <ControlUnitWrapper>
      <RessourceUnitWrapper>
        <Select
          data-cy="add-control-administration"
          error={administrationMeta.error}
          isErrorMessageHidden
          isRequired
          label={`Administration ${resourceUnitIndexDisplayed}`}
          name={administrationField.name}
          onChange={handleAdministrationChange}
          options={administrationsAsOption}
          searchable={administrationsAsOption.length > 10}
          style={{ flex: 1 }}
          value={administrationField.value}
        />

        <div>
          <Select
            key={unitList.length}
            customSearch={unitList.length > 10 ? controlUnitCustomSearch : undefined}
            data-cy="add-control-unit"
            error={unitNameMeta.error}
            isErrorMessageHidden
            isRequired
            label={`Unité ${resourceUnitIndexDisplayed}`}
            name={unitField.name}
            onChange={handleUnitChange}
            options={unitListAsOption ?? []}
            searchable={unitList.length > 10}
            style={{ flex: 1 }}
            value={unitField.value}
          />
          {missionIsNewMission && <ControlUnitWarningMessage controlUnitIndex={controlUnitIndex} />}
        </div>

        <MultiSelect
          cleanable={false}
          data-cy="add-control-unit-resource"
          disabled={!unitField.value}
          label={`Moyen(s) ${resourceUnitIndexDisplayed}`}
          name={resourcesField.name}
          onChange={handleResourceChange}
          options={resourcesAsOption ?? []}
          style={{ flex: 1 }}
          value={resourcesField.value.map(resource => resource.id)}
        />

        <FormikTextInput
          data-cy="control-unit-contact"
          isErrorMessageHidden
          label={`Contact de l'unité ${resourceUnitIndexDisplayed}`}
          name={`controlUnits.${controlUnitIndex}.contact`}
        />
      </RessourceUnitWrapper>
      {controlUnitIndex > 0 && (
        <DeleteButton accent={Accent.SECONDARY} Icon={Icon.Delete} onClick={removeControlUnit} />
      )}
    </ControlUnitWrapper>
  )
}

const RessourceUnitWrapper = styled.div`
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 4px;
`

const ControlUnitWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  gap: 8px;
`

const DeleteButton = styled(IconButton)`
  align-self: start;
  margin-top: 20px;
`
