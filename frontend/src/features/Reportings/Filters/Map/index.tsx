import { CheckPicker, DateRangePicker, Checkbox, SingleTag, Accent } from '@mtes-mct/monitor-ui'
import { forwardRef, useRef } from 'react'
import styled from 'styled-components'

import { ReportingSourceLabels } from '../../../../domain/entities/reporting'
import { ReportingTargetTypeLabels } from '../../../../domain/entities/targetType'
import { ReportingsFiltersEnum, reportingsFiltersActions } from '../../../../domain/shared_slices/ReportingsFilters'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { useGetControlPlans } from '../../../../hooks/useGetControlPlans'
import { OptionValue, StyledSelect, StyledStatusFilter } from '../style'

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
    attachToMissionFilter,
    periodFilter,
    sourceTypeFilter,
    startedAfter,
    startedBefore,
    statusFilter,
    subThemesFilter,
    targetTypeFilter,
    themeFilter,
    typeFilter
  } = useAppSelector(state => state.reportingFilters)
  const { subThemes, themes } = useGetControlPlans()
  const {
    attachToMissionOptions,
    dateRangeOptions,
    sourceTypeOptions,
    statusOptions,
    subThemesOptions,
    targetTypeOtions,
    themesOptions,
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
        <StyledStatusFilter>
          {attachToMissionOptions.map(attachToMission => (
            <Checkbox
              key={attachToMission.label}
              checked={attachToMissionFilter?.includes(String(attachToMission.value))}
              data-cy={`attach-to-mission-filter-${attachToMission.value}`}
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
        <CheckPicker
          data-cy="select-source-type-filter"
          isLabelHidden
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
        <CheckPicker
          isLabelHidden
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
                accent={Accent.SECONDARY}
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
        <CheckPicker
          isLabelHidden
          label="Thématiques"
          name="themes"
          onChange={value => updateSimpleFilter(value, ReportingsFiltersEnum.THEME_FILTER)}
          options={themesOptions}
          placeholder="Thématiques"
          renderValue={() => themeFilter && <OptionValue>{`Thème (${themeFilter.length})`}</OptionValue>}
          searchable
          value={themeFilter}
        />

        {themeFilter && themeFilter.length > 0 && (
          <StyledTagsContainer>
            {themeFilter.map(themeId => (
              <SingleTag
                key={themeId}
                accent={Accent.SECONDARY}
                onDelete={() => onDeleteTag(themeId, ReportingsFiltersEnum.THEME_FILTER, themeFilter)}
                title={themes[themeId]?.theme}
              >
                {String(themes[themeId]?.theme)}
              </SingleTag>
            ))}
          </StyledTagsContainer>
        )}

        <CheckPicker
          isLabelHidden
          label="Sous-thématiques"
          name="subThemes"
          onChange={value => updateSimpleFilter(value, ReportingsFiltersEnum.SUB_THEMES_FILTER)}
          options={subThemesOptions}
          placeholder="Sous-thématiques"
          renderValue={() => subThemesFilter && <OptionValue>{`Sous-thème (${subThemesFilter.length})`}</OptionValue>}
          searchable
          value={subThemesFilter}
        />

        {subThemesFilter && subThemesFilter.length > 0 && (
          <StyledTagsContainer>
            {subThemesFilter.map(subThemeId => (
              <SingleTag
                key={subThemeId}
                accent={Accent.SECONDARY}
                onDelete={() => onDeleteTag(subThemeId, ReportingsFiltersEnum.SUB_THEMES_FILTER, subThemesFilter)}
                title={subThemes[subThemeId]?.subTheme}
              >
                {String(subThemes[subThemeId]?.subTheme)}
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
