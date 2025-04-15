import { CustomPeriodContainer, CustomPeriodLabel } from '@components/style'
import { ReinitializeFiltersButton } from '@features/commonComponents/ReinitializeFiltersButton'
import { getThemesAsOptions, parseOptionsToThemes } from '@features/Themes/useCases/getThemesAsOptions'
import {
  Checkbox,
  CheckPicker,
  CustomSearch,
  DateRangePicker,
  useNewWindow,
  type DateAsStringRange,
  type Option,
  type OptionValueType
} from '@mtes-mct/monitor-ui'
import { CheckTreePicker } from '@mtes-mct/monitor-ui__root'
import { DateRangeEnum } from 'domain/entities/dateRange'
import { forwardRef, useMemo } from 'react'
import styled from 'styled-components'

import { AttachToMissionFilterEnum, AttachToMissionFilterLabels } from '../../../../domain/entities/reporting'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { ReportingSearch } from '../ReportingSearch'
import { ReportingsFiltersEnum, type SourceFilterProps } from '../slice'
import { OptionValue, Separator, StyledSelect, StyledStatusFilter, StyledTagsContainer } from '../style'
import { FilterTags } from './FilterTags'

import type { ReportingsOptionsListType } from '..'
import type { ThemeAPI } from 'domain/entities/themes'

type TableReportingsFiltersProps = {
  optionsList: ReportingsOptionsListType
  resetFilters: () => void
  updateCheckboxFilter: (
    isChecked: boolean | undefined,
    value: string,
    filter: ReportingsFiltersEnum,
    filterValues: string[]
  ) => void
  updateDateRangeFilter: (value: DateAsStringRange | undefined) => void
  updatePeriodFilter: (value: OptionValueType | undefined) => void
  updateSimpleFilter: (value: OptionValueType | undefined, filter: ReportingsFiltersEnum) => void
  updateSourceTypeFilter: (value: string[] | undefined) => void
  updateThemeFilter: (value: ThemeAPI[] | undefined) => void
}

export function TableReportingsFiltersWithRef(
  {
    optionsList,
    resetFilters,
    updateCheckboxFilter,
    updateDateRangeFilter,
    updatePeriodFilter,
    updateSimpleFilter,
    updateSourceTypeFilter,
    updateThemeFilter
  }: TableReportingsFiltersProps,
  ref
) {
  const { newWindowContainerRef } = useNewWindow()
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
    targetTypeOtions,
    themesOptions,
    typeOptions
  } = optionsList

  const sourceCustomSearch = useMemo(
    () =>
      new CustomSearch<Option<SourceFilterProps>>(sourceOptions, ['label'], {
        cacheKey: 'REPORTINGS_LIST',
        withCacheInvalidation: true
      }),
    [sourceOptions]
  )

  const isCustomPeriodVisible = periodFilter === DateRangeEnum.CUSTOM

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
            isTransparent
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
            isTransparent
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
            isTransparent
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
            value={sourceFilter}
          />

          <StyledSelect
            data-cy="select-type-filter"
            isLabelHidden
            isTransparent
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
            isTransparent
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
          <CheckTreePicker
            key={`theme${themesOptions.length}${JSON.stringify(themeFilter)}`}
            childrenKey="subThemes"
            data-cy="reporting-theme-filter"
            isLabelHidden
            isTransparent
            label="Thématiques"
            menuStyle={{ maxWidth: '200%' }}
            name="themes"
            onChange={value => updateThemeFilter(parseOptionsToThemes(value ?? []))}
            options={themesOptions}
            placeholder="Thématiques"
            style={{ width: 310 }}
            value={getThemesAsOptions(themeFilter)}
          />

          <CheckPicker
            isLabelHidden
            isTransparent
            label="Façade"
            name="seaFront"
            onChange={value => updateSimpleFilter(value, ReportingsFiltersEnum.SEA_FRONT_FILTER)}
            options={seaFrontsOptions}
            placeholder="Façade"
            renderValue={() => seaFrontFilter && <OptionValue>{`Façade (${seaFrontFilter.length})`}</OptionValue>}
            size="sm"
            style={tagPickerStyle}
            value={seaFrontFilter}
          />
        </StyledFiltersSecondLine>
      </FilterWrapper>
      <StyledTagsContainer $withTopMargin={isCustomPeriodVisible || hasFilters}>
        {isCustomPeriodVisible && (
          <CustomPeriodContainer>
            <CustomPeriodLabel>Période spécifique</CustomPeriodLabel>
            <DateRangePicker
              key="dateRange"
              baseContainer={newWindowContainerRef.current}
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
          </CustomPeriodContainer>
        )}

        <FilterTags />

        {hasFilters && <ReinitializeFiltersButton onClick={resetFilters} />}
      </StyledTagsContainer>
    </>
  )
}

export const TableReportingsFilters = forwardRef<HTMLDivElement, TableReportingsFiltersProps>(
  TableReportingsFiltersWithRef
)

const FilterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-right: 2%;
`
const StyledFiltersFirstLine = styled.div`
  display: flex;
  justify-content: space-between;
`

const StyledFiltersSecondLine = styled.div`
  display: flex;
  gap: 10px;
`
const tagPickerStyle = { width: 200 }
