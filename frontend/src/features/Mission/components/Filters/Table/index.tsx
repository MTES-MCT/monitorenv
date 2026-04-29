import { TagsContainer } from '@components/style'
import { ShowFilters } from '@components/Table/style'
import { ReinitializeFiltersButton } from '@features/commonComponents/ReinitializeFiltersButton'
import { MissionSearch } from '@features/Mission/MissionsSearch'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import {
  Checkbox,
  CheckPicker,
  CheckTreePicker,
  CustomSearch,
  type DateAsStringRange,
  Icon,
  Select
} from '@mtes-mct/monitor-ui'
import { DateRangeEnum } from 'domain/entities/dateRange'
import { MissionFiltersEnum, setFiltersVisibility } from 'domain/shared_slices/MissionFilters'
import { forwardRef, memo, useMemo } from 'react'
import styled from 'styled-components'

import { FilterTags } from './FilterTags'

import type { MissionOptionsListType } from '..'

type TableMissionsFiltersProps = {
  onResetFilters: () => void
  onUpdateAdministrationFilter: (value: any) => void
  onUpdateDateRangeFilter: (value: DateAsStringRange | undefined) => void
  onUpdatePeriodFilter: (value: DateRangeEnum | undefined) => void
  onUpdateSimpleFilter: (value: any, filter: MissionFiltersEnum) => void
  optionsList: MissionOptionsListType
}

export function TableMissionsFiltersWithRef(
  {
    onResetFilters,
    onUpdateAdministrationFilter,
    onUpdateDateRangeFilter,
    onUpdatePeriodFilter,
    onUpdateSimpleFilter,
    optionsList
  },
  ref
) {
  const dispatch = useAppDispatch()
  const {
    areFiltersVisible,
    nbOfFiltersSetted,
    selectedAdministrationNames,
    selectedCompletionStatus,
    selectedControlUnitIds,
    selectedMissionTypes,
    selectedPeriod,
    selectedSeaFronts,
    selectedStatuses,
    selectedTags,
    selectedThemes,
    selectedWithEnvActions
  } = useAppSelector(state => state.missionFilters)

  const setAreFiltersVisibility = () => {
    dispatch(setFiltersVisibility(!areFiltersVisible))
  }

  const { administrations, completion, controlUnits, dates, seaFronts, status, tags, themes, types } = optionsList

  const controlUnitCustomSearch = useMemo(
    () => new CustomSearch(controlUnits ?? [], ['label'], { isStrict: true, threshold: 0.2 }),
    [controlUnits]
  )

  const themeCustomSearch = useMemo(() => new CustomSearch(themes ?? [], ['label']), [themes])

  return (
    <>
      <FilterWrapper ref={ref}>
        <FirstLine>
          <MissionSearch />
          <ShowFilters Icon={Icon.FilterBis} onClick={setAreFiltersVisibility}>
            {areFiltersVisible ? 'Masquer les filtres' : 'Afficher les filtres'}
          </ShowFilters>
        </FirstLine>
        {areFiltersVisible && (
          <>
            <FilterWrapperLine>
              <StyledSelect
                cleanable={false}
                data-cy="select-period-filter"
                isLabelHidden
                isTransparent
                label="Période"
                name="Période"
                onChange={onUpdatePeriodFilter}
                options={dates ?? []}
                placeholder="Date de mission depuis"
                style={tagPickerStyle}
                value={selectedPeriod}
              />
              <CheckPicker
                data-cy="select-seaFronts-filter"
                isLabelHidden
                isTransparent
                label="Façade"
                name="seaFront"
                onChange={(value: any) => onUpdateSimpleFilter(value, MissionFiltersEnum.SEA_FRONT_FILTER)}
                options={seaFronts ?? []}
                placeholder="Façade"
                renderValue={() =>
                  selectedSeaFronts && <OptionValue>{`Façade (${selectedSeaFronts.length})`}</OptionValue>
                }
                style={tagPickerStyle}
                value={selectedSeaFronts}
              />
              <CheckPicker
                data-cy="select-administration-filter"
                isLabelHidden
                isTransparent
                label="Administration"
                name="administration"
                onChange={onUpdateAdministrationFilter}
                options={administrations ?? []}
                placeholder="Administration"
                popupWidth={300}
                renderValue={() =>
                  selectedAdministrationNames && (
                    <OptionValue>{`Administration (${selectedAdministrationNames.length})`}</OptionValue>
                  )
                }
                searchable
                style={tagPickerStyle}
                value={selectedAdministrationNames}
              />
              <CheckPicker
                key={controlUnits?.length}
                customSearch={controlUnitCustomSearch}
                data-cy="select-units-filter"
                isLabelHidden
                isTransparent
                label="Unité"
                name="controlUnit"
                onChange={(value: any) => onUpdateSimpleFilter(value, MissionFiltersEnum.UNIT_FILTER)}
                options={controlUnits ?? []}
                placeholder="Unité"
                popupWidth={300}
                renderValue={() =>
                  selectedControlUnitIds && <OptionValue>{`Unité (${selectedControlUnitIds.length})`}</OptionValue>
                }
                style={tagPickerStyle}
                value={selectedControlUnitIds}
              />

              <CheckPicker
                data-cy="select-types-filter"
                isLabelHidden
                isTransparent
                label="Type de mission"
                name="missionType"
                onChange={(value: any) => onUpdateSimpleFilter(value, MissionFiltersEnum.TYPE_FILTER)}
                options={types ?? []}
                placeholder="Type de mission"
                renderValue={() =>
                  selectedMissionTypes && <OptionValue>{`Type (${selectedMissionTypes.length})`}</OptionValue>
                }
                style={tagPickerStyle}
                value={selectedMissionTypes}
              />
            </FilterWrapperLine>
            <FilterWrapperLine>
              <CheckPicker
                key={`theme${themes?.length}`}
                customSearch={themeCustomSearch}
                data-cy="mission-theme-filter"
                isLabelHidden
                isTransparent
                label="Thématique"
                name="theme"
                onChange={(value: any) => onUpdateSimpleFilter(value, MissionFiltersEnum.THEME_FILTER)}
                options={themes ?? []}
                placeholder="Thématique"
                popupWidth={300}
                renderValue={() => selectedThemes && <OptionValue>{`Thème (${selectedThemes.length})`}</OptionValue>}
                style={tagPickerStyle}
                value={selectedThemes}
              />
              <CheckTreePicker
                childrenKey="subTags"
                isLabelHidden
                isTransparent
                label="Tags et sous-tags"
                labelKey="name"
                name="regulatoryTags"
                onChange={value => onUpdateSimpleFilter(value, MissionFiltersEnum.TAGS_FILTER)}
                options={tags}
                placeholder="Tags et sous-tags"
                renderedChildrenValue="Sous-tags."
                renderedValue="Tags"
                shouldShowLabels={false}
                style={tagPickerStyle}
                value={selectedTags}
                valueKey="id"
              />
              <CheckPicker
                data-cy="select-statuses-filter"
                isLabelHidden
                isTransparent
                label="Statut de mission"
                name="status"
                onChange={(value: any) => onUpdateSimpleFilter(value, MissionFiltersEnum.STATUS_FILTER)}
                options={status ?? []}
                placeholder="Statut de mission"
                renderValue={() =>
                  selectedStatuses && <OptionValue>{`Statut (${selectedStatuses.length})`}</OptionValue>
                }
                style={tagPickerStyle}
                value={selectedStatuses}
              />
              <CheckPicker
                data-cy="select-completion-statuses-filter"
                isLabelHidden
                isTransparent
                label="État des données"
                name="completion"
                onChange={(value: any) => onUpdateSimpleFilter(value, MissionFiltersEnum.COMPLETION_STATUS_FILTER)}
                options={completion ?? []}
                placeholder="État des données"
                renderValue={() =>
                  selectedCompletionStatus && (
                    <OptionValue>{`État des données (${selectedCompletionStatus.length})`}</OptionValue>
                  )
                }
                style={tagPickerStyle}
                value={selectedCompletionStatus}
              />
              <Checkbox
                checked={selectedWithEnvActions}
                label="Missions avec actions env."
                name="missionsWithEnvActions"
                onChange={value => onUpdateSimpleFilter(value ?? false, MissionFiltersEnum.WITH_ENV_ACTIONS_FILTER)}
              />
            </FilterWrapperLine>
          </>
        )}
      </FilterWrapper>
      {nbOfFiltersSetted > 0 && (
        <TagsContainer $withTopMargin={selectedPeriod === DateRangeEnum.CUSTOM}>
          <FilterTags onUpdateDateRangeFilter={onUpdateDateRangeFilter} />
          <ReinitializeFiltersButton onClick={onResetFilters} />
        </TagsContainer>
      )}
    </>
  )
}

export const TableMissionsFiltersNotMemoized = forwardRef<HTMLDivElement, TableMissionsFiltersProps>(
  TableMissionsFiltersWithRef
)

export const TableMissionsFilters = memo(TableMissionsFiltersNotMemoized)

const FilterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 8px;
`
const FilterWrapperLine = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
`

export const tagPickerStyle = { width: 200 }

const StyledSelect = styled(Select<DateRangeEnum>)`
  .rs-picker-toggle-caret,
  .rs-picker-toggle-clean {
    top: 5px !important;
  }
`

const OptionValue = styled.span`
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const FirstLine = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: 16px;
  margin-bottom: 8px;
`
