import { Option, Select, customDayjs, DateRangePicker, DateAsStringRange, useNewWindow } from '@mtes-mct/monitor-ui'
import _ from 'lodash'
import { MutableRefObject, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { CheckPicker } from 'rsuite'
import styled from 'styled-components'

import { FilterTags } from './FilterTags'
import { useGetControlThemesQuery } from '../../../../api/controlThemesAPI'
import { COLORS } from '../../../../constants/constants'
import { DateRangeEnum, dateRangeLabels } from '../../../../domain/entities/dateRange'
import { reportingSourceLabels, reportingTypeLabels } from '../../../../domain/entities/reporting'
import { seaFrontLabels } from '../../../../domain/entities/seaFrontType'
import { ReportingsFiltersEnum, reportingsFiltersActions } from '../../../../domain/shared_slices/ReportingsFilters'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { ReactComponent as ReloadSVG } from '../../../../uiMonitor/icons/Reload.svg'

export function ReportingsTableFilters() {
  const dispatch = useDispatch()
  const { newWindowContainerRef } = useNewWindow()
  const {
    hasFilters,
    periodFilter,
    seaFrontFilter,
    sourceTypeFilter,
    startedAfter,
    startedBefore,
    themeFilter,
    typeFilter
  } = useAppSelector(state => state.reportingFilters)
  const [isCustomPeriodVisible, setIsCustomPeriodVisible] = useState(periodFilter === DateRangeEnum.CUSTOM)

  const unitPickerRef = useRef() as MutableRefObject<HTMLDivElement>

  const { data: controlThemes } = useGetControlThemesQuery()

  const themesListAsOptions: Option[] = _.chain(controlThemes)
    .map(theme => theme.themeLevel1)
    .uniq()
    .sort((a, b) => a?.localeCompare(b))
    .map(t => ({ label: t, value: t }))
    .value()

  const dateRangeOptions = Object.values(dateRangeLabels)
  const typeOptions = Object.values(reportingTypeLabels)
  const sourceTypeOptions = Object.values(reportingSourceLabels)
  const seaFrontsOptions = Object.values(seaFrontLabels)

  const onUpdatePeriodFilter = period => {
    dispatch(reportingsFiltersActions.updateFilters({ key: ReportingsFiltersEnum.PERIOD_FILTER, value: period }))
    setIsCustomPeriodVisible(false)
    switch (period) {
      case DateRangeEnum.DAY:
        dispatch(
          reportingsFiltersActions.updateFilters({
            key: ReportingsFiltersEnum.STARTED_AFTER_FILTER,
            value: customDayjs().utc().startOf('day').toISOString()
          })
        )
        dispatch(
          reportingsFiltersActions.updateFilters({ key: ReportingsFiltersEnum.STARTED_BEFORE_FILTER, value: undefined })
        )
        break

      case DateRangeEnum.WEEK:
        dispatch(
          reportingsFiltersActions.updateFilters({
            key: ReportingsFiltersEnum.STARTED_AFTER_FILTER,
            value: customDayjs.utc().startOf('day').utc().subtract(7, 'day').toISOString()
          })
        )
        dispatch(
          reportingsFiltersActions.updateFilters({ key: ReportingsFiltersEnum.STARTED_BEFORE_FILTER, value: undefined })
        )
        break

      case DateRangeEnum.MONTH:
        dispatch(
          reportingsFiltersActions.updateFilters({
            key: ReportingsFiltersEnum.STARTED_AFTER_FILTER,
            value: customDayjs.utc().startOf('day').utc().subtract(30, 'day').toISOString()
          })
        )
        dispatch(
          reportingsFiltersActions.updateFilters({ key: ReportingsFiltersEnum.STARTED_BEFORE_FILTER, value: undefined })
        )
        break

      case DateRangeEnum.CUSTOM:
        setIsCustomPeriodVisible(true)
        break

      default:
        dispatch(
          reportingsFiltersActions.updateFilters({
            key: ReportingsFiltersEnum.STARTED_AFTER_FILTER,
            value: customDayjs.utc().startOf('day').utc().subtract(7, 'day').toISOString()
          })
        )
        dispatch(
          reportingsFiltersActions.updateFilters({ key: ReportingsFiltersEnum.STARTED_BEFORE_FILTER, value: undefined })
        )
        break
    }
  }

  const onUpdateDateRangeFilter = (date: DateAsStringRange | undefined) => {
    dispatch(
      reportingsFiltersActions.updateFilters({
        key: ReportingsFiltersEnum.STARTED_AFTER_FILTER,
        value: date && date[0] ? date[0] : undefined
      })
    )
    dispatch(
      reportingsFiltersActions.updateFilters({
        key: ReportingsFiltersEnum.STARTED_BEFORE_FILTER,
        value: date && date[1] ? date[1] : undefined
      })
    )
  }

  const onUpdateSimpleFilter = (value, filter) => {
    dispatch(reportingsFiltersActions.updateFilters({ key: filter, value }))
  }

  const onResetFilters = () => {
    setIsCustomPeriodVisible(false)
    dispatch(reportingsFiltersActions.resetReportingsFilters())
  }

  return (
    <>
      <FilterWrapper ref={unitPickerRef}>
        <StyledSelect
          baseContainer={newWindowContainerRef.current}
          cleanable={false}
          data-cy="select-period-filter"
          isLabelHidden
          label="Période"
          name="Période"
          onChange={onUpdatePeriodFilter}
          options={dateRangeOptions}
          placeholder="Date de signalement depuis"
          style={tagPickerStyle}
          value={periodFilter}
        />

        <StyledCheckPicker
          container={newWindowContainerRef.current}
          data={sourceTypeOptions}
          labelKey="label"
          onChange={value => onUpdateSimpleFilter(value, ReportingsFiltersEnum.SOURCE_TYPE_FILTER)}
          placeholder="Type de source"
          renderValue={() => sourceTypeFilter && <OptionValue>{`Type (${sourceTypeFilter.length})`}</OptionValue>}
          size="sm"
          style={tagPickerStyle}
          value={sourceTypeFilter}
          valueKey="value"
        />

        <StyledSelect
          baseContainer={newWindowContainerRef.current}
          data-cy="select-type-filter"
          isLabelHidden
          label="Type de signalement"
          name="type"
          onChange={value => onUpdateSimpleFilter(value, ReportingsFiltersEnum.TYPE_FILTER)}
          options={typeOptions}
          placeholder="Type de signalement"
          style={tagPickerStyle}
          value={typeFilter}
        />
        <StyledCheckPicker
          container={newWindowContainerRef.current}
          data={themesListAsOptions}
          labelKey="label"
          onChange={value => onUpdateSimpleFilter(value, ReportingsFiltersEnum.THEME_FILTER)}
          placeholder="Thématiques"
          renderValue={() => themeFilter && <OptionValue>{`Theme (${themeFilter.length})`}</OptionValue>}
          size="sm"
          style={tagPickerStyle}
          value={themeFilter}
          valueKey="value"
        />
        <StyledCheckPicker
          container={newWindowContainerRef.current}
          data={seaFrontsOptions}
          labelKey="label"
          onChange={value => onUpdateSimpleFilter(value, ReportingsFiltersEnum.SEA_FRONT_FILTER)}
          placeholder="Facade"
          renderValue={() => seaFrontFilter && <OptionValue>{`Facade (${seaFrontFilter.length})`}</OptionValue>}
          searchable={false}
          size="sm"
          style={tagPickerStyle}
          value={seaFrontFilter}
          valueKey="value"
        />
      </FilterWrapper>
      {isCustomPeriodVisible && <StyledCutomPeriodLabel>Période spécifique</StyledCutomPeriodLabel>}
      <StyledTagsContainer>
        {isCustomPeriodVisible && (
          <StyledCustomPeriodContainer>
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
              onChange={onUpdateDateRangeFilter}
            />
          </StyledCustomPeriodContainer>
        )}
        <FilterTags />

        {hasFilters && (
          <ResetFiltersButton data-cy="reinitialize-filters" onClick={onResetFilters}>
            <ReloadSVG />
            Réinitialiser les filtres
          </ResetFiltersButton>
        )}
      </StyledTagsContainer>
    </>
  )
}

const FilterWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  gap: 10px;
`

const ResetFiltersButton = styled.div`
  text-decoration: underline;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding-top: 10px;
  svg {
    margin-right: 5px;
  }
`

const tagPickerStyle = { width: 160 }

const StyledSelect = styled(Select)`
  .rs-picker-toggle-caret,
  .rs-picker-toggle-clean {
    top: 5px !important;
  }
`
const StyledCheckPicker = styled(CheckPicker)`
  .rs-picker-toggle-placeholder {
    font-size: 13px !important;
  }
`
const StyledTagsContainer = styled.div`
  display: flex;
  flex-direction row;
  gap: 16px;
  align-items: baseline;
`
const StyledCustomPeriodContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 5px;
`
const StyledCutomPeriodLabel = styled.span`
  font-size: 13px;
  color: ${COLORS.slateGray};
  margin-top: 16px;
`

const OptionValue = styled.span`
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
