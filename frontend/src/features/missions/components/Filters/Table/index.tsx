import { ReinitializeFiltersButton } from '@features/commonComponents/ReinitializeFiltersButton'
import { MissionSearch } from '@features/missions/MissionsSearch'
import { useAppSelector } from '@hooks/useAppSelector'
import {
  Checkbox,
  CheckPicker,
  CustomSearch,
  DateRangePicker,
  Select,
  useNewWindow,
  type DateAsStringRange,
  type Option
} from '@mtes-mct/monitor-ui'
import { DateRangeEnum } from 'domain/entities/dateRange'
import { MissionFiltersEnum } from 'domain/shared_slices/MissionFilters'
import { forwardRef, useMemo } from 'react'
import styled from 'styled-components'

import { FilterTags } from './FilterTags'

type TableMissionFiltersProps = {
  onResetFilters: () => void
  onUpdateAdministrationFilter: (value: any) => void
  onUpdateDateRangeFilter: (value: DateAsStringRange | undefined) => void
  onUpdatePeriodFilter: (value: DateRangeEnum) => void
  onUpdateSimpleFilter: (value: any, filter: MissionFiltersEnum) => void
  optionsList: { [key: string]: Option<string | number>[] }
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
      selectedThemes,
      selectedWithEnvActions,
      startedAfter,
      startedBefore
    } = useAppSelector(state => state.missionFilters)

    const { administrations, completion, controlUnits, dates, seaFonts, status, themes, types } = optionsList

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
              options={seaFonts ?? []}
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
              onChange={onUpdateAdministrationFilter as any}
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
              onChange={onUpdatePeriodFilter as any}
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
              renderValue={() => selectedThemes && <OptionValue>{`Theme (${selectedThemes.length})`}</OptionValue>}
              style={tagPickerStyle}
              value={selectedThemes}
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
              label="Etat des données"
              name="completion"
              onChange={(value: any) => onUpdateSimpleFilter(value, MissionFiltersEnum.COMPLETION_STATUS_FILTER)}
              options={completion ?? []}
              placeholder="Etat des données"
              renderValue={() =>
                selectedCompletionStatus && (
                  <OptionValue>{`Etat des données (${selectedCompletionStatus.length})`}</OptionValue>
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
        <StyledTagsContainer $withTopMargin={selectedPeriod === DateRangeEnum.CUSTOM || hasFilters}>
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
        </StyledTagsContainer>
      </>
    )
  }
)

const FilterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 10px;
`
const FilterWrapperLine = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
`

const tagPickerStyle = { width: 200 }

const StyledSelect = styled(Select)`
  .rs-picker-toggle-caret,
  .rs-picker-toggle-clean {
    top: 5px !important;
  }
`

export const StyledTagsContainer = styled.div<{ $withTopMargin: boolean }>`
  margin-top: ${p => (p.$withTopMargin ? '16px' : '0px')};
  display: flex;
  flex-direction: row;
  max-width: 100%;
  flex-wrap: wrap;
  gap: 16px;
  align-items: end;
`

const StyledCustomPeriodContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 5px;
`

const OptionValue = styled.span`
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
