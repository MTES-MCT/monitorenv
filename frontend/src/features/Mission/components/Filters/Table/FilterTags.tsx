import { RTK_DEFAULT_QUERY_OPTIONS } from '@api/constants'
import { useGetControlUnitsQuery } from '@api/controlUnitsAPI'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { useGetControlPlans } from '@hooks/useGetControlPlans'
import { FrontendError } from '@libs/FrontendError'
import { SingleTag } from '@mtes-mct/monitor-ui'
import { FrontCompletionStatusLabel, missionStatusLabels, missionTypeEnum } from 'domain/entities/missions'
import { MissionFiltersEnum, updateFilters, type MissionFiltersState } from 'domain/shared_slices/MissionFilters'
import { useMemo } from 'react'
import styled from 'styled-components'

export function FilterTags() {
  const dispatch = useAppDispatch()
  const {
    hasFilters,
    selectedAdministrationNames,
    selectedCompletionStatus,
    selectedControlUnitIds,
    selectedMissionTypes,
    selectedSeaFronts,
    selectedStatuses,
    selectedThemes
  } = useAppSelector(state => state.missionFilters)

  const controlUnits = useGetControlUnitsQuery(undefined, RTK_DEFAULT_QUERY_OPTIONS)
  const { themesAsOptions } = useGetControlPlans()

  const onDeleteTag = <K extends MissionFiltersEnum>(
    valueToDelete: number | string,
    filterKey: K,
    selectedValues: MissionFiltersState[K]
  ) => {
    if (!Array.isArray(selectedValues)) {
      throw new FrontendError('`selectedValues` should be an array.')
    }

    const nextSelectedValues = selectedValues.filter(selectedValue => selectedValue !== valueToDelete) as
      | string[]
      | number[]
    dispatch(updateFilters({ key: filterKey, value: nextSelectedValues.length === 0 ? undefined : nextSelectedValues }))
  }

  const hasTagFilters = useMemo(() => {
    if (
      hasFilters &&
      ((selectedAdministrationNames && selectedAdministrationNames?.length > 0) ??
        (selectedCompletionStatus && selectedCompletionStatus?.length > 0) ??
        (selectedControlUnitIds && selectedControlUnitIds?.length > 0) ??
        (selectedMissionTypes && selectedMissionTypes?.length > 0) ??
        (selectedSeaFronts && selectedSeaFronts?.length > 0) ??
        (selectedStatuses && selectedStatuses?.length > 0) ??
        (selectedThemes && selectedThemes?.length > 0))
    ) {
      return true
    }

    return false
  }, [
    hasFilters,
    selectedAdministrationNames,
    selectedCompletionStatus,
    selectedControlUnitIds,
    selectedMissionTypes,
    selectedSeaFronts,
    selectedStatuses,
    selectedThemes
  ])

  if (!hasTagFilters) {
    return null
  }

  return (
    <StyledContainer data-cy="missions-filter-tags">
      {selectedSeaFronts &&
        selectedSeaFronts?.length > 0 &&
        selectedSeaFronts.map(seaFront => (
          <SingleTag
            key={seaFront}
            onDelete={() => onDeleteTag(seaFront, MissionFiltersEnum.SEA_FRONT_FILTER, selectedSeaFronts)}
          >
            {String(`Façade ${seaFront}`)}
          </SingleTag>
        ))}
      {selectedAdministrationNames &&
        selectedAdministrationNames?.length > 0 &&
        selectedAdministrationNames.map(admin => (
          <SingleTag
            key={admin}
            onDelete={() => onDeleteTag(admin, MissionFiltersEnum.ADMINISTRATION_FILTER, selectedAdministrationNames)}
          >
            {String(`Admin. ${admin}`)}
          </SingleTag>
        ))}
      {selectedControlUnitIds &&
        selectedControlUnitIds?.length > 0 &&
        selectedControlUnitIds.map(unit => (
          <SingleTag
            key={unit}
            onDelete={() => onDeleteTag(unit, MissionFiltersEnum.UNIT_FILTER, selectedControlUnitIds)}
          >
            {String(`Unité ${controlUnits.currentData?.find(controlUnit => controlUnit.id === unit)?.name ?? unit}`)}
          </SingleTag>
        ))}
      {selectedMissionTypes &&
        selectedMissionTypes?.length > 0 &&
        selectedMissionTypes.map(type => (
          <SingleTag
            key={type}
            onDelete={() => onDeleteTag(type, MissionFiltersEnum.TYPE_FILTER, selectedMissionTypes)}
          >
            {String(`Type ${missionTypeEnum[type].libelle}`)}
          </SingleTag>
        ))}
      {selectedThemes &&
        selectedThemes?.length > 0 &&
        selectedThemes.map(theme => (
          <SingleTag key={theme} onDelete={() => onDeleteTag(theme, MissionFiltersEnum.THEME_FILTER, selectedThemes)}>
            {String(`Thème ${themesAsOptions.find(t => t.value === theme)?.label ?? theme}`)}
          </SingleTag>
        ))}
      {selectedStatuses &&
        selectedStatuses?.length > 0 &&
        selectedStatuses.map(status => (
          <SingleTag
            key={status}
            onDelete={() => onDeleteTag(status, MissionFiltersEnum.STATUS_FILTER, selectedStatuses)}
          >
            {String(`Mission ${missionStatusLabels[status].libelle.toLowerCase()}`)}
          </SingleTag>
        ))}
      {selectedCompletionStatus &&
        selectedCompletionStatus?.length > 0 &&
        selectedCompletionStatus.map(completionStatus => (
          <SingleTag
            key={completionStatus}
            onDelete={() =>
              onDeleteTag(completionStatus, MissionFiltersEnum.COMPLETION_STATUS_FILTER, selectedCompletionStatus)
            }
          >
            {String(`Données ${FrontCompletionStatusLabel[completionStatus].toLowerCase()}`)}
          </SingleTag>
        ))}
    </StyledContainer>
  )
}

const StyledContainer = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  gap: 8px 16px;
  max-width: 100%;
  flex-wrap: wrap;
`
