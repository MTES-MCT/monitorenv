import { CustomPeriodContainer } from '@components/style'
import { getThemesAsOptions, parseOptionsToThemes } from '@features/Themes/useCases/getThemesAsOptions'
import {
  Checkbox,
  CheckPicker,
  CheckTreePicker,
  DateRangePicker,
  SingleTag,
  type DateAsStringRange,
  type OptionValueType
} from '@mtes-mct/monitor-ui'
import { DateRangeEnum } from 'domain/entities/dateRange'
import { forwardRef } from 'react'
import styled from 'styled-components'

import {
  AttachToMissionFilterEnum,
  AttachToMissionFilterLabels,
  ReportingSourceLabels
} from '../../../../domain/entities/reporting'
import { ReportingTargetTypeLabels } from '../../../../domain/entities/targetType'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { reportingsFiltersActions, ReportingsFiltersEnum } from '../slice'
import { OptionValue, StyledSelect, StyledStatusFilter } from '../style'

import type { ReportingsOptionsListType } from '..'
import type { ThemeAPI } from 'domain/entities/themes'

type MapReportingsFiltersProps = {
  optionsList: ReportingsOptionsListType
  updateCheckboxFilter: (
    isChecked: boolean | undefined,
    value: string,
    filter: ReportingsFiltersEnum,
    filterValues: string[]
  ) => void
  updateDateRangeFilter: (value: DateAsStringRange | undefined) => void
  updatePeriodFilter: (value: OptionValueType | undefined) => void
  updateSimpleFilter: (value: OptionValueType | undefined, filter: ReportingsFiltersEnum) => void
  updateSourceTypeFilter: (value: string[]) => void
  updateThemeFilter: (value: ThemeAPI[]) => void
}

export function MapReportingsFiltersWithRef(
  {
    optionsList,
    updateCheckboxFilter,
    updateDateRangeFilter,
    updatePeriodFilter,
    updateSimpleFilter,
    updateSourceTypeFilter,
    updateThemeFilter
  }: MapReportingsFiltersProps,
  ref
) {
  const dispatch = useAppDispatch()
  const {
    isAttachedToMissionFilter,
    isUnattachedToMissionFilter,
    periodFilter,
    sourceTypeFilter,
    startedAfter,
    startedBefore,
    statusFilter,
    targetTypeFilter,
    themeFilter,
    typeFilter
  } = useAppSelector(state => state.reportingFilters)
  const { dateRangeOptions, sourceTypeOptions, statusOptions, targetTypeOtions, themesOptions, typeOptions } =
    optionsList

  const onDeleteTag = (valueToDelete: string | any, filterKey: ReportingsFiltersEnum, reportingFilter) => {
    const updatedFilter = reportingFilter.filter(unit => unit !== valueToDelete)
    dispatch(reportingsFiltersActions.updateFilters({ key: filterKey, value: updatedFilter }))
  }

  return (
    <FilterWrapper ref={ref}>
      <StyledBloc>
        <StyledStatusFilter $withBottomMargin>
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
        <StyledStatusFilter $withBottomMargin>
          <>
            <Checkbox
              checked={!!isAttachedToMissionFilter}
              data-cy={`attach-to-mission-filter-${AttachToMissionFilterEnum.ATTACHED}`}
              label={AttachToMissionFilterLabels.ATTACHED}
              name={AttachToMissionFilterLabels.ATTACHED}
              onChange={isChecked => updateSimpleFilter(isChecked, ReportingsFiltersEnum.IS_ATTACHED_TO_MISSION_FILTER)}
            />
            <Checkbox
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

        <StyledSelect
          cleanable={false}
          data-cy="select-period-filter"
          isLabelHidden
          isTransparent
          label="Période"
          name="Période"
          onChange={updatePeriodFilter}
          options={dateRangeOptions}
          placeholder="Date de signalement depuis"
          value={periodFilter}
        />
        {periodFilter === DateRangeEnum.CUSTOM && (
          <StyledCustomPeriodContainer>
            <DateRangePicker
              key="dateRange"
              data-cy="datepicker-missionStartedAfter"
              defaultValue={
                startedAfter && startedBefore ? [new Date(startedAfter), new Date(startedBefore)] : undefined
              }
              hasSingleCalendar
              isCompact
              isLabelHidden
              isStringDate
              label="Date de début entre le et le"
              name="reportingDateRange"
              onChange={updateDateRangeFilter}
            />
          </StyledCustomPeriodContainer>
        )}
      </StyledBloc>

      <StyledBloc>
        <CheckPicker
          data-cy="select-source-type-filter"
          isLabelHidden
          isTransparent
          label="Type de source"
          name="sourceType"
          onChange={value => updateSourceTypeFilter(value)}
          options={sourceTypeOptions}
          placeholder="Type de source"
          renderValue={() => sourceTypeFilter && <OptionValue>{`Type (${sourceTypeFilter.length})`}</OptionValue>}
          searchable={false}
          value={sourceTypeFilter}
        />

        {sourceTypeFilter && sourceTypeFilter.length > 0 && (
          <StyledTagsContainer>
            {sourceTypeFilter.map(sourceType => (
              <SingleTag
                key={sourceType}
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
          isTransparent
          label="Type de signalement"
          name="type"
          onChange={value => updateSimpleFilter(value, ReportingsFiltersEnum.TYPE_FILTER)}
          options={typeOptions}
          placeholder="Type de signalement"
          value={typeFilter}
        />
        <CheckPicker
          isLabelHidden
          isTransparent
          label="Type de cible"
          name="targetType"
          onChange={value => updateSimpleFilter(value, ReportingsFiltersEnum.TARGET_TYPE_FILTER)}
          options={targetTypeOtions}
          placeholder="Cible"
          renderValue={() => targetTypeFilter && <OptionValue>{`Cible (${targetTypeFilter.length})`}</OptionValue>}
          value={targetTypeFilter}
        />
        {targetTypeFilter && targetTypeFilter.length > 0 && (
          <StyledTagsContainer>
            {targetTypeFilter.map(targetType => (
              <SingleTag
                key={targetType}
                onDelete={() => onDeleteTag(targetType, ReportingsFiltersEnum.TARGET_TYPE_FILTER, targetTypeFilter)}
                title={String(ReportingTargetTypeLabels[targetType])}
              >
                {String(ReportingTargetTypeLabels[targetType])}
              </SingleTag>
            ))}
          </StyledTagsContainer>
        )}
      </StyledBloc>
      <StyledBloc>
        <CheckTreePicker
          key={`theme${themesOptions.length}${JSON.stringify(themeFilter)}`}
          // customSearch={themeCustomSearch}
          data-cy="reporting-theme-filter"
          isLabelHidden
          isTransparent
          label="Thématiques"
          menuStyle={{ maxWidth: '200%' }}
          name="themes"
          onChange={value => updateThemeFilter(parseOptionsToThemes(value ?? []))}
          options={themesOptions}
          placeholder="Thématiques"
          value={getThemesAsOptions(themeFilter ?? [])}
        />

        {themeFilter && themeFilter.length > 0 && (
          <StyledTagsContainer>
            {themeFilter.map(theme => (
              <SingleTag
                key={theme.id}
                onDelete={() => onDeleteTag(theme, ReportingsFiltersEnum.THEME_FILTER, themeFilter)}
                title={theme.name}
              >
                {theme.name}
              </SingleTag>
            ))}
          </StyledTagsContainer>
        )}
      </StyledBloc>
    </FilterWrapper>
  )
}

export const MapReportingsFilters = forwardRef<HTMLDivElement, MapReportingsFiltersProps>(MapReportingsFiltersWithRef)

const FilterWrapper = styled.div`
  display: flex;
  gap: 32px;
  flex-direction: column;
  padding: 12px 4px;
`
export const StyledCustomPeriodContainer = styled(CustomPeriodContainer)`
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
