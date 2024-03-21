import { CheckPicker, DateRangePicker, Checkbox, Icon, CustomSearch, type Option } from '@mtes-mct/monitor-ui'
import { forwardRef, useMemo } from 'react'
import styled from 'styled-components'

import { FilterTags } from './FilterTags'
import { AttachToMissionFilterEnum, AttachToMissionFilterLabels } from '../../../../domain/entities/reporting'
import { ReportingsFiltersEnum } from '../../../../domain/shared_slices/ReportingsFilters'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { ReportingSearch } from '../ReportingSearch'
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
  const {
    hasFilters,
    isAttachedToMissionFilter,
    isUnattachedToMissionFilter,
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
    typeFilter = undefined
  } = useAppSelector(state => state.reportingFilters)
  const {
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
          <ReportingSearch />

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
            <>
              <Checkbox
                key={AttachToMissionFilterLabels.ATTACHED}
                checked={!!isAttachedToMissionFilter}
                data-cy={`attach-to-mission-filter-${AttachToMissionFilterEnum.ATTACHED}`}
                label={AttachToMissionFilterLabels.ATTACHED}
                name={AttachToMissionFilterLabels.ATTACHED}
                onChange={isChecked =>
                  updateSimpleFilter(isChecked, ReportingsFiltersEnum.IS_ATTACHED_TO_MISSION_FILTER)
                }
              />
              <Checkbox
                key={AttachToMissionFilterLabels.UNATTACHED}
                checked={!!isUnattachedToMissionFilter}
                data-cy={`attach-to-mission-filter-${AttachToMissionFilterEnum.UNATTACHED}`}
                label={AttachToMissionFilterLabels.UNATTACHED}
                name={AttachToMissionFilterLabels.UNATTACHED}
                onChange={isChecked =>
                  updateSimpleFilter(isChecked, ReportingsFiltersEnum.IS_UNATTACHED_TO_MISSION_FILTER)
                }
              />
            </>
          </StyledStatusFilter>
        </StyledFiltersFirstLine>
        <StyledFiltersSecondLine>
          <StyledSelect
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
            popupWidth={300}
            renderValue={() => sourceFilter && <OptionValue>{`Source (${sourceFilter.length})`}</OptionValue>}
            style={tagPickerStyle}
            value={sourceFilter as any}
          />

          <StyledSelect
            data-cy="select-type-filter"
            isLabelHidden
            label="Type de signalement"
            name="Type"
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
            data-cy="reporting-theme-filter"
            isLabelHidden
            label="Thématiques"
            menuStyle={{ maxWidth: '200%' }}
            name="themes"
            onChange={value => updateThemeFilter(value)}
            options={themesOptions}
            placeholder="Thématiques"
            popupWidth={286}
            renderValue={() => themeFilter && <OptionValue>{`Thème (${themeFilter.length})`}</OptionValue>}
            style={{ width: 310 }}
            value={themeFilter}
          />
          <CheckPicker
            key={subThemesOptions.length}
            customSearch={subThemeCustomSearch}
            data-cy="reporting-sub-theme-filter"
            isLabelHidden
            label="Sous-thématiques"
            menuStyle={{ maxWidth: '200%' }}
            name="subThemes"
            onChange={value => updateSimpleFilter(value, ReportingsFiltersEnum.SUB_THEMES_FILTER)}
            options={subThemesOptions}
            placeholder="Sous-thématiques"
            popupWidth={286}
            renderValue={() => subThemesFilter && <OptionValue>{`Sous-thème (${subThemesFilter.length})`}</OptionValue>}
            searchable
            style={{ width: 310 }}
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
      <StyledTagsContainer $withTopMargin={isCustomPeriodVisible || hasFilters}>
        {isCustomPeriodVisible && (
          <StyledCustomPeriodContainer>
            <StyledCutomPeriodLabel>Période spécifique</StyledCutomPeriodLabel>
            <DateRangePicker
              key="dateRange"
              data-cy="datepicker-missionStartedAfter"
              defaultValue={
                startedAfter && startedBefore ? [new Date(startedAfter), new Date(startedBefore)] : undefined
              }
              isLabelHidden
              isStringDate
              label="Période spécifique"
              name="dateRange"
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
  flex-direction: column;
  gap: 16px;
`
const StyledFiltersFirstLine = styled.div`
  display: flex;
  justify-content: space-between;
`

const StyledFiltersSecondLine = styled.div`
  display: flex;
  gap: 10px;
`
const ResetFiltersButton = styled.div`
  align-items: end;
  cursor: pointer;
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
  text-decoration: underline;
  > span {
    font-size: 13px;
  }
`

const tagPickerStyle = { width: 200 }
