import { RTK_DEFAULT_QUERY_OPTIONS } from '@api/constants'
import { useGetControlUnitsQuery } from '@api/controlUnitsAPI'
import { useGetThemesQuery } from '@api/themesAPI'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { FrontendError } from '@libs/FrontendError'
import { customDayjs, SingleTag } from '@mtes-mct/monitor-ui'
import { deleteTagTag } from '@utils/deleteTagTag'
import { FrontCompletionStatusLabel, missionStatusLabels, missionTypeEnum } from 'domain/entities/missions'
import { MissionFiltersEnum, type MissionFiltersState, updateFilters } from 'domain/shared_slices/MissionFilters'
import { useMemo } from 'react'
import styled from 'styled-components'

import type { TagOption } from 'domain/entities/tags'
import type { ThemeFromAPI } from 'domain/entities/themes'

export function FilterTags() {
  const dispatch = useAppDispatch()
  const {
    nbOfFiltersSetted,
    selectedAdministrationNames,
    selectedCompletionStatus,
    selectedControlUnitIds,
    selectedMissionTypes,
    selectedSeaFronts,
    selectedStatuses,
    selectedTags,
    selectedThemes,
    startedAfter,
    startedBefore
  } = useAppSelector(state => state.missionFilters)

  const controlUnits = useGetControlUnitsQuery(undefined, RTK_DEFAULT_QUERY_OPTIONS)

  const dateRange: [string, string] = [
    startedAfter ?? `${customDayjs().format('YYYY-MM-DD')}T00:00:00.00000Z`,
    startedBefore ?? `${customDayjs().format('YYYY-MM-DD')}T00:00:00.00000Z`
  ]
  const { data } = useGetThemesQuery(dateRange)
  const themesAPI: ThemeFromAPI[] = Object.values(data ?? [])

  const onDeleteTag = <K extends MissionFiltersEnum>(
    valueToDelete: number | string | TagOption,
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

  const onDeleteTagTag = (valueToDelete: TagOption, tagFilter: TagOption[]) => {
    const updatedFilter = deleteTagTag(tagFilter, valueToDelete)
    dispatch(
      updateFilters({
        key: MissionFiltersEnum.TAGS_FILTER,
        value: updatedFilter.length === 0 ? undefined : updatedFilter
      })
    )
  }

  const hasTagFilters = useMemo(
    () =>
      nbOfFiltersSetted > 0 &&
      ((selectedAdministrationNames && selectedAdministrationNames?.length > 0) ||
        (selectedCompletionStatus && selectedCompletionStatus?.length > 0) ||
        (selectedControlUnitIds && selectedControlUnitIds?.length > 0) ||
        (selectedMissionTypes && selectedMissionTypes?.length > 0) ||
        (selectedSeaFronts && selectedSeaFronts?.length > 0) ||
        (selectedStatuses && selectedStatuses?.length > 0) ||
        (selectedTags && selectedTags?.length > 0) ||
        (selectedThemes && selectedThemes?.length > 0)),
    [
      nbOfFiltersSetted,
      selectedAdministrationNames,
      selectedCompletionStatus,
      selectedControlUnitIds,
      selectedMissionTypes,
      selectedSeaFronts,
      selectedStatuses,
      selectedThemes,
      selectedTags
    ]
  )

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
            {String(`Thème ${themesAPI.find(themeAPI => themeAPI.id === theme)?.name ?? theme}`)}
          </SingleTag>
        ))}
      {selectedTags &&
        selectedTags?.length > 0 &&
        selectedTags.map(tag => (
          <>
            <SingleTag key={tag.id} onDelete={() => onDeleteTagTag(tag, selectedTags)}>
              {`Tag ${tag.name}`}
            </SingleTag>
            {tag.subTags?.map(subTag => (
              <SingleTag key={subTag.id} onDelete={() => onDeleteTagTag(subTag, selectedTags)} title={subTag.name}>
                {`Sous-tag ${subTag.name}`}
              </SingleTag>
            ))}
          </>
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
