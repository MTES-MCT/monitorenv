import { CustomPeriodContainer, TagsContainer } from '@components/style'
import { ReinitializeFiltersButton } from '@features/commonComponents/ReinitializeFiltersButton'
import { MissionSearch } from '@features/Mission/MissionsSearch'
import { useAppSelector } from '@hooks/useAppSelector'
import {
  Checkbox,
  CheckPicker,
  CheckTreePicker,
  CustomSearch,
  type DateAsStringRange,
  DateRangePicker,
  Select,
  useNewWindow
} from '@mtes-mct/monitor-ui'
import { getTagsAsOptions, parseOptionsToTags } from '@utils/getTagsAsOptions'
import { DateRangeEnum } from 'domain/entities/dateRange'
import { MissionFiltersEnum } from 'domain/shared_slices/MissionFilters'
import { forwardRef, useMemo } from 'react'
import styled from 'styled-components'

import { FilterTags } from './FilterTags'

import type { MissionOptionsListType } from '..'

type TableMissionFiltersProps = {
  onResetFilters: () => void
  onUpdateAdministrationFilter: (value: any) => void
  onUpdateDateRangeFilter: (value: DateAsStringRange | undefined) => void
  onUpdatePeriodFilter: (value: DateRangeEnum | undefined) => void
  onUpdateSimpleFilter: (value: any, filter: MissionFiltersEnum) => void
  optionsList: MissionOptionsListType
}

export const TableMissionFilters = forwardRef<HTMLDivElement, TableMissionFiltersProps>(
  (
    {
      onResetFilters,
      onUpdateAdministrationFilter,
      onUpdateDateRangeFilter,
      onUpdatePeriodFilter,
      onUpdateSimpleFilter,
      optionsList
    },
    ref
  ) => {
    const { newWindowContainerRef } = useNewWindow()
    const {
      hasFilters,
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

    const { administrations, completion, controlUnits, dates, seaFronts, status, tags, themes, types } = optionsList

    const controlUnitCustomSearch = useMemo(
      () => new CustomSearch(controlUnits ?? [], ['label'], { isStrict: true, threshold: 0.2 }),
      [controlUnits]
    )

    const themeCustomSearch = useMemo(() => new CustomSearch(themes ?? [], ['label']), [themes])

    return (
      <>
        <FilterWrapper ref={ref}>
          <MissionSearch />
          <FilterWrapperLine>
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
          </FilterWrapperLine>
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
            <CheckPicker
              key={`theme${themes?.length}${JSON.stringify(selectedThemes)}`}
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
              renderValue={() => selectedStatuses && <OptionValue>{`Statut (${selectedStatuses.length})`}</OptionValue>}
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
              label="Missions avec actions CACEM"
              name="missionsWithEnvActions"
              onChange={value => onUpdateSimpleFilter(value ?? false, MissionFiltersEnum.WITH_ENV_ACTIONS_FILTER)}
            />
          </FilterWrapperLine>
        </FilterWrapper>
        <TagsContainer $withTopMargin={selectedPeriod === DateRangeEnum.CUSTOM || hasFilters}>
          {selectedPeriod === DateRangeEnum.CUSTOM && (
            <StyledCustomPeriodContainer>
              <DateRangePicker
                key="dateRange"
                baseContainer={newWindowContainerRef.current}
                data-cy="datepicker-missionStartedAfter"
                defaultValue={
                  startedAfter && startedBefore ? [new Date(startedAfter), new Date(startedBefore)] : undefined
                }
                isStringDate
                label="Période spécifique"
                name="missionDateRange"
                onChange={onUpdateDateRangeFilter}
              />
            </StyledCustomPeriodContainer>
          )}
          <FilterTags />

          {hasFilters && <ReinitializeFiltersButton onClick={onResetFilters} />}
        </TagsContainer>
      </>
    )
  }
)

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

const StyledCustomPeriodContainer = styled(CustomPeriodContainer)`
  margin-top: 5px;
`

const OptionValue = styled.span`
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
