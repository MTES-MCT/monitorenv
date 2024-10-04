import { useAppDispatch } from '@hooks/useAppDispatch'
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
import { MissionFiltersEnum, updateFilters } from 'domain/shared_slices/MissionFilters'
import { forwardRef, useMemo } from 'react'
import styled from 'styled-components'

type MapMissionFiltersProps = {
  onUpdateAdministrationFilter: (value: any) => void
  onUpdateDateRangeFilter: (value: DateAsStringRange | undefined) => void
  onUpdatePeriodFilter: (value: DateRangeEnum) => void
  onUpdateSimpleFilter: (value: any, filter: MissionFiltersEnum) => void
  optionsList: { [key: string]: Option<string | number>[] }
}
export const MapMissionFilters = forwardRef<HTMLDivElement, MapMissionFiltersProps>(
  (
    { onUpdateAdministrationFilter, onUpdateDateRangeFilter, onUpdatePeriodFilter, onUpdateSimpleFilter, optionsList },
    ref
  ) => {
    const dispatch = useAppDispatch()
    const { newWindowContainerRef } = useNewWindow()
    const {
      selectedAdministrationNames,
      selectedCompletionStatus,
      selectedControlUnitIds,
      selectedMissionTypes,
      selectedPeriod,
      selectedStatuses,
      selectedThemes,
      startedAfter,
      startedBefore
    } = useAppSelector(state => state.missionFilters)

    const { administrations, completion, controlUnits, dates, status, themes, types } = optionsList

    const controlUnitCustomSearch = useMemo(
      () => new CustomSearch(controlUnits ?? [], ['label'], { isStrict: true, threshold: 0.2 }),
      [controlUnits]
    )

    const themeCustomSearch = useMemo(() => new CustomSearch(themes ?? [], ['label']), [themes])

    const udpateStatusFilter = (isChecked, value) => {
      const updatedFilter = [...(selectedStatuses ?? [])]

      if (!isChecked && updatedFilter.includes(String(value))) {
        const newFilter = updatedFilter.filter(statusFilter => statusFilter !== String(value))
        dispatch(updateFilters({ key: MissionFiltersEnum.STATUS_FILTER, value: newFilter }))
      }
      if (isChecked && !updatedFilter.includes(value)) {
        const newFilter = [...updatedFilter, value]
        dispatch(updateFilters({ key: MissionFiltersEnum.STATUS_FILTER, value: newFilter }))
      }
    }

    return (
      <FilterWrapper ref={ref}>
        <StyledBloc>
          <StyledStatusFilter>
            {status?.map(missionStatus => (
              <Checkbox
                key={missionStatus.label}
                checked={selectedStatuses?.includes(String(missionStatus.value))}
                data-cy={`status-filter-${missionStatus.label}`}
                label={missionStatus.label}
                name={missionStatus.label}
                onChange={isChecked => udpateStatusFilter(isChecked, missionStatus.value)}
              />
            ))}
          </StyledStatusFilter>
          <StyledSelect
            cleanable={false}
            data-cy="select-period-filter"
            isLabelHidden
            label="Période"
            name="Période"
            onChange={onUpdatePeriodFilter as any}
            options={dates ?? []}
            placeholder="Date de mission depuis"
            value={selectedPeriod}
          />
          {selectedPeriod === DateRangeEnum.CUSTOM && (
            <StyledCustomPeriodContainer>
              <DateRangePicker
                key="dateRange"
                baseContainer={newWindowContainerRef.current}
                data-cy="datepicker-missionStartedAfter"
                defaultValue={
                  startedAfter && startedBefore ? [new Date(startedAfter), new Date(startedBefore)] : undefined
                }
                hasSingleCalendar
                isStringDate
                label="Période spécifique"
                name="missionDateRange"
                onChange={onUpdateDateRangeFilter}
              />
            </StyledCustomPeriodContainer>
          )}
        </StyledBloc>
        <StyledBloc>
          <CheckPicker
            data-cy="select-administration-filter"
            isLabelHidden
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
            value={selectedAdministrationNames}
          />
          <CheckPicker
            key={controlUnits?.length}
            customSearch={controlUnitCustomSearch}
            data-cy="select-units-filter"
            isLabelHidden
            label="Unité"
            name="controlUnit"
            onChange={(value: any) => onUpdateSimpleFilter(value, MissionFiltersEnum.UNIT_FILTER)}
            options={controlUnits ?? []}
            placeholder="Unité"
            popupWidth={300}
            renderValue={() =>
              selectedControlUnitIds && <OptionValue>{`Unité (${selectedControlUnitIds.length})`}</OptionValue>
            }
            value={selectedControlUnitIds}
          />
          <CheckPicker
            data-cy="select-types-filter"
            isLabelHidden
            label="Type de mission"
            name="missionType"
            onChange={(value: any) => onUpdateSimpleFilter(value, MissionFiltersEnum.TYPE_FILTER)}
            options={types ?? []}
            placeholder="Type de mission"
            renderValue={() =>
              selectedMissionTypes && <OptionValue>{`Type (${selectedMissionTypes.length})`}</OptionValue>
            }
            value={selectedMissionTypes}
          />
          <CheckPicker
            data-cy="select-completion-statuses-filter"
            isLabelHidden
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
            value={selectedCompletionStatus}
          />
        </StyledBloc>
        <StyledBloc>
          <CheckPicker
            key={`theme${themes?.length}${JSON.stringify(selectedThemes)}`}
            customSearch={themeCustomSearch}
            data-cy="mission-theme-filter"
            isLabelHidden
            label="Thématique"
            name="theme"
            onChange={(value: any) => onUpdateSimpleFilter(value, MissionFiltersEnum.THEME_FILTER)}
            options={themes ?? []}
            placeholder="Thématique"
            popupWidth={300}
            renderValue={() => selectedThemes && <OptionValue>{`Theme (${selectedThemes.length})`}</OptionValue>}
            value={selectedThemes}
          />
        </StyledBloc>
      </FilterWrapper>
    )
  }
)

const FilterWrapper = styled.div`
  display: flex;
  gap: 32px;
  flex-direction: column;
  padding: 12px 4px;
`
const StyledBloc = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

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
export const StyledStatusFilter = styled.div`
  align-items: end;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 8px;
`
