import { CustomPeriodContainer } from '@components/style'
import { getFilteredReportings } from '@features/Dashboard/slice'
import { StyledSelect } from '@features/Reportings/Filters/style'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import {
  Checkbox,
  DateRangePicker,
  getOptionsFromLabelledEnum,
  useNewWindow,
  type Option,
  type DateAsStringRange,
  type OptionValueType,
  Select
} from '@mtes-mct/monitor-ui'
import { DateRangeEnum, ReportingDateRangeLabels } from 'domain/entities/dateRange'
import { ReportingTypeLabels, StatusFilterEnum, StatusFilterLabels } from 'domain/entities/reporting'
import { forwardRef, type ComponentProps } from 'react'
import styled from 'styled-components'

import { dashboardFiltersActions, getReportingFilters } from '../slice'

export const Filters = forwardRef<HTMLDivElement, ComponentProps<'div'>>(({ ...props }, ref) => {
  const dispatch = useAppDispatch()
  const dashboardId = useAppSelector(state => state.dashboard.activeDashboardId)

  const reportingFilters = useAppSelector(state => getReportingFilters(state.dashboardFilters, dashboardId))
  const filteredReportings = useAppSelector(state => getFilteredReportings(state.dashboard, reportingFilters)) ?? []

  const { newWindowContainerRef } = useNewWindow()

  const dateRangeOptions = getOptionsFromLabelledEnum(ReportingDateRangeLabels)
  const statusOptions = getOptionsFromLabelledEnum(StatusFilterLabels)
  const typeOptions = getOptionsFromLabelledEnum(ReportingTypeLabels)

  if (!reportingFilters) {
    return null
  }

  const setCustomPeriodFilter = (date: DateAsStringRange | undefined) => {
    dispatch(
      dashboardFiltersActions.setReportingFilters({
        filters: { period: date },
        id: dashboardId
      })
    )
  }

  const setPeriodFilter = (dateRange: OptionValueType | undefined) => {
    if (dateRange) {
      dispatch(
        dashboardFiltersActions.setReportingFilters({
          filters: { dateRange: dateRange as DateRangeEnum, period: undefined },
          id: dashboardId
        })
      )
    }
  }

  const setStatusFilter = (statusOption: Option<string>, isChecked: boolean | undefined) => {
    if (isChecked) {
      dispatch(
        dashboardFiltersActions.setReportingFilters({
          filters: { status: [...reportingFilters.status, statusOption.value as StatusFilterEnum] },
          id: dashboardId
        })
      )
    } else {
      dispatch(
        dashboardFiltersActions.setReportingFilters({
          filters: { status: reportingFilters.status.filter(status => status !== statusOption.value) },
          id: dashboardId
        })
      )
    }
  }

  const setTypeFilter = (type: string | undefined) => {
    dispatch(
      dashboardFiltersActions.setReportingFilters({
        filters: { type },
        id: dashboardId
      })
    )
  }

  return (
    <Wrapper
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      ref={ref}
      $hasChildren={filteredReportings.length > 1}
      $hasPeriodFilter={reportingFilters.dateRange === DateRangeEnum.CUSTOM}
    >
      <DateAndTypeWrapper $hasChildren={filteredReportings.length > 1}>
        <DateRangeSelect
          cleanable={false}
          isLabelHidden
          isTransparent
          label="Période"
          name="Période"
          onChange={setPeriodFilter}
          options={dateRangeOptions}
          placeholder="Date de signalement depuis"
          value={reportingFilters.dateRange}
        />
        <Select
          isLabelHidden
          isTransparent
          label="Type de signalement"
          name="Type"
          onChange={setTypeFilter}
          options={typeOptions}
          placeholder="Type de signalement"
          value={reportingFilters.type}
        />
      </DateAndTypeWrapper>
      <SpecificDateAndStatusWrapper $hasChildren={filteredReportings.length > 0}>
        {reportingFilters.dateRange === DateRangeEnum.CUSTOM && (
          <CustomPeriodContainer>
            <DateRangePicker
              key="dateRange"
              baseContainer={newWindowContainerRef.current}
              defaultValue={reportingFilters.period}
              isLabelHidden
              isStringDate
              label="Période spécifique"
              name="dateRange"
              onChange={setCustomPeriodFilter}
            />
          </CustomPeriodContainer>
        )}

        <StatusWrapper>
          {statusOptions.map(statusOption => (
            <Checkbox
              key={statusOption.label}
              checked={reportingFilters.status.includes(statusOption.value as StatusFilterEnum)}
              label={statusOption.label}
              name={statusOption.label}
              onChange={isChecked => setStatusFilter(statusOption, isChecked)}
            />
          ))}
        </StatusWrapper>
      </SpecificDateAndStatusWrapper>
    </Wrapper>
  )
})

const Wrapper = styled.div<{ $hasChildren: boolean; $hasPeriodFilter: boolean }>`
  padding: 16px 24px;
  ${({ $hasChildren, $hasPeriodFilter }) => $hasPeriodFilter && !$hasChildren && 'padding-bottom: 58px;'}
  ${({ $hasChildren }) =>
    $hasChildren
      ? 'display: flex; flex-direction: column; gap: 16px; justify-content: space-between;'
      : 'display: flow-root;'}
`
const StatusWrapper = styled.fieldset`
  border: none;
  display: flex;
  gap: 16px;
  float: right;
  padding-bottom: 16px;
`
const DateAndTypeWrapper = styled.div<{ $hasChildren: boolean }>`
  display: flex;
  gap: 16px;
  ${p => !p.$hasChildren && 'position: absolute;'}
  z-index: 2;
`

const SpecificDateAndStatusWrapper = styled.div<{ $hasChildren: boolean }>`
  display: flex;
  gap: 16px;
  ${p => !p.$hasChildren && 'position: relative; top: 40px;'}

  > fieldset {
    padding-bottom: 0px;
    padding-left: 0px;
  }
`

const DateRangeSelect = styled(StyledSelect)`
  width: 200px;
`
