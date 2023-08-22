import { DateRangePicker, useNewWindow, Checkbox } from '@mtes-mct/monitor-ui'
import { forwardRef } from 'react'
import styled from 'styled-components'

import { FilterTags } from './FilterTags'
import { ReportingsFiltersEnum } from '../../../../domain/shared_slices/ReportingsFilters'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { ReactComponent as ReloadSVG } from '../../../../uiMonitor/icons/Reload.svg'
import {
  OptionValue,
  StyledCheckPicker,
  StyledCustomPeriodContainer,
  StyledCutomPeriodLabel,
  StyledSelect,
  StyledStatusFilter,
  StyledTagsContainer
} from '../style'

export function TableReportingsFiltersWithRef(
  {
    isCustomPeriodVisible,
    optionsList,
    resetFilters,
    updateCheckboxFilter,
    updateDateRangeFilter,
    updatePeriodFilter,
    updateSimpleFilter,
    updateSourceTypeFilter
  },
  ref
) {
  const { newWindowContainerRef } = useNewWindow()

  const {
    hasFilters,
    periodFilter,
    // provenFilter,
    seaFrontFilter,
    sourceFilter,
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
    seaFrontsOptions,
    sourceOptions,
    sourceTypeOptions,
    statusOptions,
    subThemesListAsOptions,
    themesListAsOptions,
    typeOptions
  } = optionsList

  return (
    <>
      <FilterWrapper ref={ref}>
        <StyledFiltersFirstLine>
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
            {/* TODO  awaiting validation Ariane and Adeline              
            <StyledVerticalSeparator />
            {isProvenOptions.map(provenStatus => (
              <Checkbox
                key={provenStatus.label}
                checked={provenFilter?.includes(String(provenStatus.value))}
                label={provenStatus.label}
                name={provenStatus.label}
                onChange={isChecked =>
                  updateCheckboxFilter(isChecked, provenStatus.value, ReportingsFiltersEnum.PROVEN_FILTER, provenFilter)
                }
              />
            ))} */}
          </StyledStatusFilter>
        </StyledFiltersFirstLine>
        <StyledFiltersSecondLine>
          <StyledSelect
            baseContainer={newWindowContainerRef.current}
            cleanable={false}
            data-cy="select-period-filter"
            isLabelHidden
            label="Période"
            name="Période"
            onChange={updatePeriodFilter}
            options={dateRangeOptions}
            placeholder="Date de signalement depuis"
            style={tagPickerStyle}
            value={periodFilter}
          />

          <StyledCheckPicker
            container={newWindowContainerRef.current}
            data={sourceTypeOptions}
            data-cy="select-source-type-filter"
            labelKey="label"
            onChange={value => updateSourceTypeFilter(value)}
            placeholder="Type de source"
            renderValue={() => sourceTypeFilter && <OptionValue>{`Type (${sourceTypeFilter.length})`}</OptionValue>}
            size="sm"
            style={tagPickerStyle}
            value={sourceTypeFilter}
            valueKey="value"
          />

          <StyledCheckPicker
            container={newWindowContainerRef.current}
            data={sourceOptions}
            data-cy="select-source-filter"
            labelKey="label"
            onChange={value => updateSimpleFilter(value, ReportingsFiltersEnum.SOURCE_FILTER)}
            placeholder="Source"
            renderValue={() => sourceFilter && <OptionValue>{`Source (${sourceFilter.length})`}</OptionValue>}
            size="sm"
            style={tagPickerStyle}
            value={sourceFilter}
            valueKey="value"
          />

          <StyledSelect
            baseContainer={newWindowContainerRef.current}
            data-cy="select-type-filter"
            isLabelHidden
            label="Type de signalement"
            name="type"
            onChange={value => updateSimpleFilter(value, ReportingsFiltersEnum.TYPE_FILTER)}
            options={typeOptions}
            placeholder="Type de signalement"
            style={tagPickerStyle}
            value={typeFilter}
          />
          <StyledCheckPicker
            container={newWindowContainerRef.current}
            data={themesListAsOptions}
            labelKey="label"
            onChange={value => updateSimpleFilter(value, ReportingsFiltersEnum.THEME_FILTER)}
            placeholder="Thématiques"
            renderValue={() => themeFilter && <OptionValue>{`Thème (${themeFilter.length})`}</OptionValue>}
            size="sm"
            style={{ width: 311 }}
            value={themeFilter}
            valueKey="value"
          />
          <StyledCheckPicker
            container={newWindowContainerRef.current}
            data={subThemesListAsOptions}
            labelKey="label"
            onChange={value => updateSimpleFilter(value, ReportingsFiltersEnum.SUB_THEMES_FILTER)}
            placeholder="Sous-thématiques"
            renderValue={() => subThemesFilter && <OptionValue>{`Sous-thème (${subThemesFilter.length})`}</OptionValue>}
            size="sm"
            style={{ width: 311 }}
            value={subThemesFilter}
            valueKey="value"
          />
          <StyledCheckPicker
            container={newWindowContainerRef.current}
            data={seaFrontsOptions}
            labelKey="label"
            onChange={value => updateSimpleFilter(value, ReportingsFiltersEnum.SEA_FRONT_FILTER)}
            placeholder="Facade"
            renderValue={() => seaFrontFilter && <OptionValue>{`Facade (${seaFrontFilter.length})`}</OptionValue>}
            searchable={false}
            size="sm"
            style={tagPickerStyle}
            value={seaFrontFilter}
            valueKey="value"
          />
        </StyledFiltersSecondLine>
      </FilterWrapper>
      <StyledTagsContainer $withMargin={isCustomPeriodVisible || hasFilters}>
        {isCustomPeriodVisible && (
          <StyledCustomPeriodContainer>
            <StyledCutomPeriodLabel>Période spécifique</StyledCutomPeriodLabel>
            <DateRangePicker
              key="dateRange"
              baseContainer={newWindowContainerRef.current}
              data-cy="datepicker-missionStartedAfter"
              defaultValue={
                startedAfter && startedBefore ? [new Date(startedAfter), new Date(startedBefore)] : undefined
              }
              isLabelHidden
              isStringDate
              label="Date de début entre le et le"
              onChange={updateDateRangeFilter}
            />
          </StyledCustomPeriodContainer>
        )}

        <FilterTags />

        {hasFilters && (
          <ResetFiltersButton data-cy="reinitialize-filters" onClick={resetFilters}>
            <ReloadSVG />
            Réinitialiser les filtres
          </ResetFiltersButton>
        )}
      </StyledTagsContainer>
    </>
  )
}

export const TableReportingsFilters = forwardRef(TableReportingsFiltersWithRef)

const FilterWrapper = styled.div`
  display: flex;
  gap: 16px;
  flex-direction: column;
`
const StyledFiltersFirstLine = styled.div`
  display: flex;
`

const StyledFiltersSecondLine = styled.div`
  display: flex;
  gap: 10px;
`
const ResetFiltersButton = styled.div`
  text-decoration: underline;
  cursor: pointer;
  display: flex;
  align-items: center;
  svg {
    width: 20px;
    height: 20px;
    margin-right: 5px;
  }
`

const tagPickerStyle = { width: 200 }
