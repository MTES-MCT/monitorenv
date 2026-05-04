import { RTK_DEFAULT_QUERY_OPTIONS } from '@api/constants'
import { useGetControlUnitsQuery } from '@api/controlUnitsAPI'
import { useGetThemesQuery } from '@api/themesAPI'
import { CustomPeriodContainer } from '@components/style'
import { MissionDateRangeLabel } from '@features/Mission/components/MissionsList/type'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { FrontendError } from '@libs/FrontendError'
import { customDayjs, type DateAsStringRange, DateRangePicker, SingleTag, useNewWindow } from '@mtes-mct/monitor-ui'
import { deleteTagTag } from '@utils/deleteTagTag'
import { DateRangeEnum } from 'domain/entities/dateRange'
import { FrontCompletionStatusLabel, missionStatusLabels, missionTypeEnum } from 'domain/entities/missions'
import {
  INITIAL_STATE,
  MissionFiltersEnum,
  type MissionFiltersState,
  updateFilters
} from 'domain/shared_slices/MissionFilters'
import styled from 'styled-components'

import type { TagOption } from 'domain/entities/tags'
import type { ThemeFromAPI } from 'domain/entities/themes'

export function FilterTags({
  onUpdateDateRangeFilter
}: {
  onUpdateDateRangeFilter: (value: DateAsStringRange | undefined) => void
}) {
  const dispatch = useAppDispatch()
  const { newWindowContainerRef } = useNewWindow()

  const {
    selectedAdministrationNames,
    selectedCompletionStatus,
    selectedControlUnitIds,
    selectedMissionTypes,
    selectedPeriod,
    selectedSeaFronts,
    selectedStatuses,
    selectedTags,
    selectedThemes,
    selectedWithEnvActions,
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
    valueToDelete: number | string | boolean | TagOption,
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

  const onDeleteSimpleTag = (filterKey: keyof Omit<MissionFiltersState, 'nbOfFiltersSetted'>) => {
    dispatch(
      updateFilters({
        key: filterKey,
        value: INITIAL_STATE[filterKey]
      })
    )
  }

  return (
    <>
      {selectedPeriod === DateRangeEnum.CUSTOM && (
        <StyledCustomPeriodContainer>
          <DateRangePicker
            key="dateRange"
            baseContainer={newWindowContainerRef.current}
            data-cy="datepicker-missionStartedAfter"
            defaultValue={startedAfter && startedBefore ? [new Date(startedAfter), new Date(startedBefore)] : undefined}
            isStringDate
            label="Période spécifique"
            name="missionDateRange"
            onChange={onUpdateDateRangeFilter}
          />
        </StyledCustomPeriodContainer>
      )}
      <StyledContainer data-cy="missions-filter-tags">
        {selectedPeriod !== DateRangeEnum.CUSTOM && selectedPeriod !== INITIAL_STATE.selectedPeriod && (
          <SingleTag onDelete={() => onDeleteSimpleTag(MissionFiltersEnum.PERIOD_FILTER)}>
            {MissionDateRangeLabel[selectedPeriod]}
          </SingleTag>
        )}
        {selectedSeaFronts?.map(seaFront => (
          <SingleTag
            key={seaFront}
            onDelete={() => onDeleteTag(seaFront, MissionFiltersEnum.SEA_FRONT_FILTER, selectedSeaFronts)}
          >
            {String(`Façade ${seaFront}`)}
          </SingleTag>
        ))}
        {selectedAdministrationNames?.map(admin => (
          <SingleTag
            key={admin}
            onDelete={() => onDeleteTag(admin, MissionFiltersEnum.ADMINISTRATION_FILTER, selectedAdministrationNames)}
          >
            {String(`Admin. ${admin}`)}
          </SingleTag>
        ))}
        {selectedControlUnitIds?.map(unit => (
          <SingleTag
            key={unit}
            onDelete={() => onDeleteTag(unit, MissionFiltersEnum.UNIT_FILTER, selectedControlUnitIds)}
          >
            {String(`Unité ${controlUnits.currentData?.find(controlUnit => controlUnit.id === unit)?.name ?? unit}`)}
          </SingleTag>
        ))}
        {selectedMissionTypes?.map(type => (
          <SingleTag
            key={type}
            onDelete={() => onDeleteTag(type, MissionFiltersEnum.TYPE_FILTER, selectedMissionTypes)}
          >
            {String(`Type ${missionTypeEnum[type].libelle}`)}
          </SingleTag>
        ))}
        {selectedThemes?.map(theme => (
          <SingleTag key={theme} onDelete={() => onDeleteTag(theme, MissionFiltersEnum.THEME_FILTER, selectedThemes)}>
            {String(`Thème ${themesAPI.find(themeAPI => themeAPI.id === theme)?.name ?? theme}`)}
          </SingleTag>
        ))}
        {selectedTags?.map(tag => (
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
        {selectedStatuses?.map(status => (
          <SingleTag
            key={status}
            onDelete={() => onDeleteTag(status, MissionFiltersEnum.STATUS_FILTER, selectedStatuses)}
          >
            {String(`Mission ${missionStatusLabels[status].libelle.toLowerCase()}`)}
          </SingleTag>
        ))}
        {selectedCompletionStatus?.map(completionStatus => (
          <SingleTag
            key={completionStatus}
            onDelete={() =>
              onDeleteTag(completionStatus, MissionFiltersEnum.COMPLETION_STATUS_FILTER, selectedCompletionStatus)
            }
          >
            {String(`Données ${FrontCompletionStatusLabel[completionStatus].toLowerCase()}`)}
          </SingleTag>
        ))}
        {selectedWithEnvActions && (
          <SingleTag
            onDelete={() =>
              onDeleteTag(selectedWithEnvActions, MissionFiltersEnum.WITH_ENV_ACTIONS_FILTER, selectedWithEnvActions)
            }
          >
            Mission avec actions env.
          </SingleTag>
        )}
      </StyledContainer>
    </>
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

const StyledCustomPeriodContainer = styled(CustomPeriodContainer)`
  margin-top: 5px;
`
