import { Option, Select, customDayjs, DateRangePicker, DateAsStringRange, useNewWindow } from '@mtes-mct/monitor-ui'
import _ from 'lodash'
import { MutableRefObject, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { CheckPicker } from 'rsuite'
import styled from 'styled-components'

import { FilterTags } from './FilterTags'
import { useGetControlThemesQuery } from '../../../../api/controlThemesAPI'
import { COLORS } from '../../../../constants/constants'
import { DateRangeEnum, ReportingDateRangeEnum, reportingDateRangeLabels } from '../../../../domain/entities/dateRange'
import {
  provenFiltersLabels,
  reportingSourceLabels,
  reportingTypeLabels,
  statusFilterLabels
} from '../../../../domain/entities/reporting'
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
    provenFilter,
    seaFrontFilter,
    sourceTypeFilter,
    startedAfter,
    startedBefore,
    statusFilter,
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

  const dateRangeOptions = Object.values(reportingDateRangeLabels)
  const typeOptions = Object.values(reportingTypeLabels)
  const sourceTypeOptions = Object.values(reportingSourceLabels)
  const seaFrontsOptions = Object.values(seaFrontLabels)
  const statusOptions = Object.values(statusFilterLabels)
  const isProvenOptions = Object.values(provenFiltersLabels)

  const updatePeriodFilter = period => {
    dispatch(reportingsFiltersActions.updateFilters({ key: ReportingsFiltersEnum.PERIOD_FILTER, value: period }))
    setIsCustomPeriodVisible(false)
    switch (period) {
      case ReportingDateRangeEnum.DAY:
        dispatch(
          reportingsFiltersActions.updateFilters({
            key: ReportingsFiltersEnum.STARTED_AFTER_FILTER,
            value: customDayjs.utc().subtract(24, 'hour').toISOString()
          })
        )
        dispatch(
          reportingsFiltersActions.updateFilters({ key: ReportingsFiltersEnum.STARTED_BEFORE_FILTER, value: undefined })
        )
        break

      case ReportingDateRangeEnum.WEEK:
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

      case ReportingDateRangeEnum.MONTH:
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
      case ReportingDateRangeEnum.YEAR:
        dispatch(
          reportingsFiltersActions.updateFilters({
            key: ReportingsFiltersEnum.STARTED_AFTER_FILTER,
            value: customDayjs.utc().startOf('year').toISOString()
          })
        )
        dispatch(
          reportingsFiltersActions.updateFilters({ key: ReportingsFiltersEnum.STARTED_BEFORE_FILTER, value: undefined })
        )
        break

      case ReportingDateRangeEnum.CUSTOM:
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

  const updateDateRangeFilter = (date: DateAsStringRange | undefined) => {
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

  const updateSimpleFilter = (value, filter) => {
    dispatch(reportingsFiltersActions.updateFilters({ key: filter, value }))
  }

  const updateCheckboxFilter = (isChecked, value, key, filter) => {
    const updatedFilter = [...filter] || []

    if (!isChecked && updatedFilter.includes(String(value))) {
      const newFilter = updatedFilter.filter(status => status !== String(value))
      dispatch(reportingsFiltersActions.updateFilters({ key, value: newFilter }))
    }
    if (isChecked && !updatedFilter.includes(value)) {
      const newFilter = [...updatedFilter, value]
      dispatch(reportingsFiltersActions.updateFilters({ key, value: newFilter }))
    }
  }

  const resetFilters = () => {
    setIsCustomPeriodVisible(false)
    dispatch(reportingsFiltersActions.resetReportingsFilters())
  }

  return (
    <>
      <FilterWrapper ref={unitPickerRef}>
        <StyledFiltersFirstLine>
          <StyledStatusFilter>
            {statusOptions.map(status => (
              <Checkbox
                key={status.label}
                checked={statusFilter?.includes(String(status.value))}
                label={status.label}
                name={status.label}
                onChange={isChecked =>
                  updateCheckboxFilter(isChecked, status.value, ReportingsFiltersEnum.STATUS_FILTER, statusFilter)
                }
              />
            ))}
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

          <StyledCheckPicker
            container={newWindowContainerRef.current}
            data={sourceTypeOptions}
            labelKey="label"
            onChange={value => updateSimpleFilter(value, ReportingsFiltersEnum.SOURCE_TYPE_FILTER)}
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

const FilterWrapper = styled.div`
  display: flex;
  gap: 16px;
  flex-direction: column;
`
const StyledFiltersFirstLine = styled.div`
  display: flex;
  justify-content: end;
`
const StyledStatusFilter = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  gap: 16px;
`
const StyledVerticalSeparator = styled.div`
  height: 21px;
  border: 1px solid ${p => p.theme.color.slateGray};
  margin-right: 16px;
  margin-left: 16px;
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
  padding-top: 10px;
  svg {
    margin-right: 5px;
  }
`

const tagPickerStyle = { width: 200 }

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
