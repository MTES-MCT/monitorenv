import { DateRangePicker, Checkbox, SingleTag, Accent } from '@mtes-mct/monitor-ui'
import { forwardRef, useRef } from 'react'
import styled from 'styled-components'

import { ReportingSourceLabels } from '../../../../domain/entities/reporting'
import { ReportingsFiltersEnum, reportingsFiltersActions } from '../../../../domain/shared_slices/ReportingsFilters'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { OptionValue, StyledCheckPicker, StyledSelect, StyledStatusFilter } from '../style'

export function MapReportingsFiltersWithRef(
  {
    isCustomPeriodVisible,
    optionsList,
    updateCheckboxFilter,
    updateDateRangeFilter,
    updatePeriodFilter,
    updateSimpleFilter,
    updateSourceTypeFilter
  },
  ref
) {
  const dispatch = useAppDispatch()
  const {
    periodFilter,
    sourceTypeFilter,
    startedAfter,
    startedBefore,
    statusFilter,
    subThemesFilter,
    themeFilter,
    typeFilter
  } = useAppSelector(state => state.reportingFilters)

  const {
    dateRangeOptions,
    sourceTypeOptions,
    statusOptions,
    subThemesListAsOptions,
    themesListAsOptions,
    typeOptions
  } = optionsList

  const onDeleteTag = (valueToDelete: string | any, filterKey: ReportingsFiltersEnum, reportingFilter) => {
    const updatedFilter = reportingFilter.filter(unit => unit !== valueToDelete)
    dispatch(reportingsFiltersActions.updateFilters({ key: filterKey, value: updatedFilter }))
  }

  const filtersRef = useRef()

  return (
    <FilterWrapper ref={ref}>
      <StyledBloc>
        <StyledStatusFilter>
          {statusOptions.map(status => (
            <Checkbox
              key={status.label}
              checked={statusFilter?.includes(String(status.value))}
              data-cy={`status-filter-${status.label}`}
              label={status.label}
              name={status.label}
              onChange={isChecked =>
                updateCheckboxFilter(isChecked, status.value, ReportingsFiltersEnum.STATUS_FILTER, statusFilter)
              }
            />
          ))}
        </StyledStatusFilter>

        <StyledSelect
          cleanable={false}
          data-cy="select-period-filter"
          isLabelHidden
          label="Période"
          name="Période"
          onChange={updatePeriodFilter}
          options={dateRangeOptions}
          placeholder="Date de signalement depuis"
          value={periodFilter}
        />
        {isCustomPeriodVisible && (
          <StyledCustomPeriodContainer>
            <DateRangePicker
              key="dateRange"
              baseContainer={filtersRef.current}
              data-cy="datepicker-missionStartedAfter"
              defaultValue={
                startedAfter && startedBefore ? [new Date(startedAfter), new Date(startedBefore)] : undefined
              }
              hasSingleCalendar
              isCompact
              isLabelHidden
              isStringDate
              label="Date de début entre le et le"
              onChange={updateDateRangeFilter}
            />
          </StyledCustomPeriodContainer>
        )}
      </StyledBloc>

      <StyledBloc>
        <StyledCheckPicker
          data={sourceTypeOptions}
          data-cy="select-source-type-filter"
          labelKey="label"
          onChange={value => updateSourceTypeFilter(value)}
          placeholder="Type de source"
          renderValue={() => sourceTypeFilter && <OptionValue>{`Type (${sourceTypeFilter.length})`}</OptionValue>}
          searchable={false}
          size="sm"
          value={sourceTypeFilter}
          valueKey="value"
        />

        {sourceTypeFilter.length > 0 && (
          <StyledTagsContainer>
            {sourceTypeFilter.map(sourceType => (
              <SingleTag
                key={sourceType}
                accent={Accent.SECONDARY}
                onDelete={() => onDeleteTag(sourceType, ReportingsFiltersEnum.SOURCE_TYPE_FILTER, sourceTypeFilter)}
                title={String(`${ReportingSourceLabels[sourceType]}`)}
              >
                {String(`${ReportingSourceLabels[sourceType]}`)}
              </SingleTag>
            ))}
          </StyledTagsContainer>
        )}

        <StyledSelect
          data-cy="select-type-filter"
          isLabelHidden
          label="Type de signalement"
          name="type"
          onChange={value => updateSimpleFilter(value, ReportingsFiltersEnum.TYPE_FILTER)}
          options={typeOptions}
          placeholder="Type de signalement"
          value={typeFilter}
        />
      </StyledBloc>
      <StyledBloc>
        <StyledCheckPicker
          data={themesListAsOptions}
          labelKey="label"
          onChange={value => updateSimpleFilter(value, ReportingsFiltersEnum.THEME_FILTER)}
          placeholder="Thématiques"
          renderValue={() => themeFilter && <OptionValue>{`Thème (${themeFilter.length})`}</OptionValue>}
          size="sm"
          value={themeFilter}
          valueKey="value"
        />

        {themeFilter.length > 0 && (
          <StyledTagsContainer>
            {themeFilter.map(theme => (
              <SingleTag
                key={theme}
                accent={Accent.SECONDARY}
                onDelete={() => onDeleteTag(theme, ReportingsFiltersEnum.THEME_FILTER, themeFilter)}
                title={String(theme)}
              >
                {String(theme)}
              </SingleTag>
            ))}
          </StyledTagsContainer>
        )}

        <StyledCheckPicker
          data={subThemesListAsOptions}
          labelKey="label"
          onChange={value => updateSimpleFilter(value, ReportingsFiltersEnum.SUB_THEMES_FILTER)}
          placeholder="Sous-thématiques"
          renderValue={() => subThemesFilter && <OptionValue>{`Sous-thème (${subThemesFilter.length})`}</OptionValue>}
          size="sm"
          value={subThemesFilter}
          valueKey="value"
        />

        {subThemesFilter.length > 0 && (
          <StyledTagsContainer>
            {subThemesFilter.map(subTheme => (
              <SingleTag
                key={subTheme}
                accent={Accent.SECONDARY}
                onDelete={() => onDeleteTag(subTheme, ReportingsFiltersEnum.SUB_THEMES_FILTER, subThemesFilter)}
                title={String(subTheme)}
              >
                {String(subTheme)}
              </SingleTag>
            ))}
          </StyledTagsContainer>
        )}
      </StyledBloc>
    </FilterWrapper>
  )
}

export const MapReportingsFilters = forwardRef(MapReportingsFiltersWithRef)

const FilterWrapper = styled.div`
  display: flex;
  gap: 32px;
  flex-direction: column;
  padding: 12px 4px;
`
export const StyledCustomPeriodContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: start;
  text-align: left;
`
const StyledBloc = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`
const StyledTagsContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`
