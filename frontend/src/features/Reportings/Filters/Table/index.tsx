import { CustomPeriodContainer, CustomPeriodLabel } from '@components/style'
import { useAppSelector } from '@hooks/useAppSelector.ts'
import {
  CheckPicker,
  CheckTreePicker,
  CustomSearch,
  type DateAsStringRange,
  DateRangePicker,
  type Option,
  type OptionValueType,
  useNewWindow
} from '@mtes-mct/monitor-ui'
import { DateRangeEnum } from 'domain/entities/dateRange'
import { forwardRef, memo, useMemo } from 'react'
import styled from 'styled-components'

import { ResetButton } from '../../../commonComponents/ResetButton'
import { ReportingSearch } from '../ReportingSearch'
import { ReportingsFiltersEnum, type SourceFilterProps } from '../slice'
import { OptionValue, StyledSelect, StyledTagsContainer } from '../style'
import { FilterTags } from './FilterTags'

import type { ReportingsOptionsListType } from '..'

type TableReportingsFiltersProps = {
  optionsList: ReportingsOptionsListType
  resetFilters: () => void
  updateDateRangeFilter: (value: DateAsStringRange | undefined) => void
  updatePeriodFilter: (value: OptionValueType | undefined) => void
  updateSimpleFilter: (value: any, filter: ReportingsFiltersEnum) => void
  updateSourceTypeFilter: (value: string[] | undefined) => void
}

export function TableReportingsFiltersWithRef(
  {
    optionsList,
    resetFilters,
    updateDateRangeFilter,
    updatePeriodFilter,
    updateSimpleFilter,
    updateSourceTypeFilter
  }: TableReportingsFiltersProps,
  ref
) {
  const { newWindowContainerRef } = useNewWindow()
  const {
    isAttachedToMissionFilter = undefined,
    nbOfFiltersSetted,
    periodFilter,
    seaFrontFilter = [],
    sourceFilter = [],
    sourceTypeFilter = [],
    startedAfter,
    startedBefore,
    statusFilter = undefined,
    tagFilter = [],
    targetTypeFilter = [],
    themeFilter = [],
    typeFilter = undefined
  } = useAppSelector(state => state.reportingFilters)
  const {
    attachMissionOptions,
    dateRangeOptions,
    seaFrontsOptions,
    sourceOptions,
    sourceTypeOptions,
    statusOptions,
    tagsOptions,
    targetTypeOptions,
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
        <ReportingSearch />
        <Filters>
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
            key={`reportings-sources-${sourceOptions.length}`}
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
            label="Filtre type de cible"
            menuStyle={{ maxWidth: '200%' }}
            name="targetType"
            onChange={value => updateSimpleFilter(value, ReportingsFiltersEnum.TARGET_TYPE_FILTER)}
            options={targetTypeOptions}
            placeholder="Type de cible"
            renderValue={() =>
              targetTypeFilter && <OptionValue>{`Type de cible (${targetTypeFilter.length})`}</OptionValue>
            }
            style={tagPickerStyle}
            value={targetTypeFilter}
          />
          <CheckTreePicker
            key={`reportings-themes-${themesOptions.length}`}
            childrenKey="subThemes"
            data-cy="reporting-theme-filter"
            isLabelHidden
            isTransparent
            label="Filtre thématiques et sous-thématiques"
            labelKey="name"
            name="themes"
            onChange={value => updateSimpleFilter(value, ReportingsFiltersEnum.THEME_FILTER)}
            options={themesOptions}
            placeholder="Thématiques et sous-thématiques"
            shouldShowLabels={false}
            style={{ width: 310 }}
            value={themeFilter}
            valueKey="id"
            withAllChildrenInResults
          />
          <CheckTreePicker
            key={`reportings-tags-${tagsOptions.length}`}
            childrenKey="subTags"
            data-cy="reporting-tag-filter"
            isLabelHidden
            isTransparent
            label="Filtre tags et sous-tags"
            labelKey="name"
            name="regulatoryTags"
            onChange={value => updateSimpleFilter(value, ReportingsFiltersEnum.TAG_FILTER)}
            options={tagsOptions}
            placeholder="Tags et sous-tags"
            renderedChildrenValue="Sous-tags."
            renderedValue="Tags"
            shouldShowLabels={false}
            style={{ width: 310 }}
            value={tagFilter}
            valueKey="id"
            withAllChildrenInResults
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
          <StyledSelect
            data-cy="select-status-filter"
            isLabelHidden
            isTransparent
            label="Statut"
            name="status"
            onChange={value => updateSimpleFilter(value, ReportingsFiltersEnum.STATUS_FILTER)}
            options={statusOptions}
            placeholder="Statut"
            style={tagPickerStyle}
            value={statusFilter}
          />
          <StyledSelect
            data-cy="select-attach-mission-filter"
            isLabelHidden
            isTransparent
            label="Lien mission"
            name="mission-link"
            onChange={value => updateSimpleFilter(value, ReportingsFiltersEnum.IS_ATTACHED_TO_MISSION_FILTER)}
            options={attachMissionOptions}
            placeholder="Lien mission"
            style={tagPickerStyle}
            value={isAttachedToMissionFilter}
          />
        </Filters>
      </FilterWrapper>
      <StyledTagsContainer>
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
        {nbOfFiltersSetted > 0 && <ResetButton onClick={resetFilters} />}
      </StyledTagsContainer>
    </>
  )
}

export const TableReportingsFiltersNotMemoized = forwardRef<HTMLDivElement, TableReportingsFiltersProps>(
  TableReportingsFiltersWithRef
)

export const TableReportingsFilters = memo(TableReportingsFiltersNotMemoized)

const FilterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-right: 2%;
`

const Filters = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`
const tagPickerStyle = { width: 180 }
