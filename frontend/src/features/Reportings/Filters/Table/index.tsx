import {
  CheckPicker,
  DateRangePicker,
  useNewWindow,
  Checkbox,
  Icon,
  CustomSearch,
  type Option
} from '@mtes-mct/monitor-ui'
import { forwardRef, useMemo } from 'react'
import styled from 'styled-components'

import { FilterTags } from './FilterTags'
import { ReportingsFiltersEnum } from '../../../../domain/shared_slices/ReportingsFilters'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import {
  OptionValue,
  Separator,
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
    updateSourceTypeFilter,
    updateThemeFilter
  },
  ref
) {
  const { newWindowContainerRef } = useNewWindow()

  const {
    attachToMissionFilter = [],
    hasFilters,
    periodFilter,
    seaFrontFilter = [],
    sourceFilter = [],
    sourceTypeFilter = [],
    startedAfter,
    startedBefore,
    statusFilter = [],
    subThemesFilter = [],
    targetTypeFilter = [],
    themeFilter = [],
    typeFilter = []
  } = useAppSelector(state => state.reportingFilters)
  const {
    attachToMissionOptions,
    dateRangeOptions,
    seaFrontsOptions,
    sourceOptions,
    sourceTypeOptions,
    statusOptions,
    subThemesOptions,
    targetTypeOtions,
    themesOptions,
    typeOptions
  } = optionsList

  const sourceCustomSearch = useMemo(
    () =>
      new CustomSearch(sourceOptions as Array<Option>, ['label'], {
        cacheKey: 'REPORTINGS_LIST',
        withCacheInvalidation: true
      }),
    [sourceOptions]
  )
  const themeCustomSearch = useMemo(
    () =>
      new CustomSearch(themesOptions as Array<Option<number>>, ['label'], {
        cacheKey: 'REPORTINGS_LIST',
        withCacheInvalidation: true
      }),
    [themesOptions]
  )

  const subThemeCustomSearch = useMemo(
    () =>
      new CustomSearch(subThemesOptions as Array<Option<number>>, ['label'], {
        cacheKey: 'REPORTINGS_LIST',
        withCacheInvalidation: true
      }),
    [subThemesOptions]
  )

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
            <Separator />
            {attachToMissionOptions.map(attachToMission => (
              <Checkbox
                key={attachToMission.label}
                checked={attachToMissionFilter?.includes(String(attachToMission.value))}
                data-cy={`attach-to-mission-filter-${attachToMission.label}`}
                label={attachToMission.label}
                name={attachToMission.label}
                onChange={isChecked =>
                  updateCheckboxFilter(
                    isChecked,
                    attachToMission.value,
                    ReportingsFiltersEnum.ATTACH_TO_MISSION_FILTER,
                    attachToMissionFilter
                  )
                }
              />
            ))}
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

          <CheckPicker
            data-cy="select-source-type-filter"
            isLabelHidden
            label="Type de source"
            name="sourceType"
            onChange={value => updateSourceTypeFilter(value)}
            options={sourceTypeOptions}
            placeholder="Type de source"
            renderValue={() => sourceTypeFilter && <OptionValue>{`Type (${sourceTypeFilter.length})`}</OptionValue>}
            style={tagPickerStyle}
            value={sourceTypeFilter}
          />

          <CheckPicker
            key={sourceOptions.length}
            customSearch={sourceCustomSearch}
            data-cy="select-source-filter"
            isLabelHidden
            label="Source"
            menuStyle={{ maxWidth: '200%' }}
            name="source"
            onChange={value => updateSimpleFilter(value, ReportingsFiltersEnum.SOURCE_FILTER)}
            options={sourceOptions}
            optionValueKey={'label' as any}
            placeholder="Source"
            renderValue={() => sourceFilter && <OptionValue>{`Source (${sourceFilter.length})`}</OptionValue>}
            style={tagPickerStyle}
            value={sourceFilter as any}
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
          <CheckPicker
            isLabelHidden
            label="Type de cible"
            menuStyle={{ maxWidth: '200%' }}
            name="targetType"
            onChange={value => updateSimpleFilter(value, ReportingsFiltersEnum.TARGET_TYPE_FILTER)}
            options={targetTypeOtions}
            placeholder="Type de cible"
            renderValue={() =>
              targetTypeFilter && <OptionValue>{`Type de cible (${targetTypeFilter.length})`}</OptionValue>
            }
            style={tagPickerStyle}
            value={targetTypeFilter}
          />
          <CheckPicker
            key={themesOptions.length}
            customSearch={themeCustomSearch}
            isLabelHidden
            label="Thématiques"
            menuStyle={{ maxWidth: '200%' }}
            name="themes"
            onChange={value => updateThemeFilter(value)}
            options={themesOptions}
            placeholder="Thématiques"
            renderValue={() => themeFilter && <OptionValue>{`Thème (${themeFilter.length})`}</OptionValue>}
            style={{ width: 311 }}
            value={themeFilter}
          />
          <CheckPicker
            key={subThemesOptions.length}
            customSearch={subThemeCustomSearch}
            isLabelHidden
            label="Sous-thématiques"
            menuStyle={{ maxWidth: '200%' }}
            name="subThemes"
            onChange={value => updateSimpleFilter(value, ReportingsFiltersEnum.SUB_THEMES_FILTER)}
            options={subThemesOptions}
            placeholder="Sous-thématiques"
            renderValue={() => subThemesFilter && <OptionValue>{`Sous-thème (${subThemesFilter.length})`}</OptionValue>}
            searchable
            style={{ width: 311 }}
            value={subThemesFilter}
          />
          <CheckPicker
            isLabelHidden
            label="Facade"
            name="seaFront"
            onChange={value => updateSimpleFilter(value, ReportingsFiltersEnum.SEA_FRONT_FILTER)}
            options={seaFrontsOptions}
            placeholder="Facade"
            renderValue={() => seaFrontFilter && <OptionValue>{`Facade (${seaFrontFilter.length})`}</OptionValue>}
            size="sm"
            style={tagPickerStyle}
            value={seaFrontFilter}
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
            <Icon.Reset size={14} />
            <span>Réinitialiser les filtres</span>
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
  align-items: end;
  gap: 4px;
  margin-bottom: 8px;
  > span {
    font-size: 13px;
  }
`

const tagPickerStyle = { width: 200 }
