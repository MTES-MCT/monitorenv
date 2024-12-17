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
  type OptionValueType
} from '@mtes-mct/monitor-ui'
import { DateRangeEnum, ReportingDateRangeLabels } from 'domain/entities/dateRange'
import { StatusFilterEnum, StatusFilterLabels } from 'domain/entities/reporting'
import { forwardRef, type ComponentProps } from 'react'
import styled from 'styled-components'

import { dashboardFiltersActions, getReportingFilters } from '../slice'

export const Filters = forwardRef<HTMLDivElement, { isExpanded: boolean } & ComponentProps<'div'>>(
  ({ isExpanded }, ref) => {
    const dispatch = useAppDispatch()
    const dashboardId = useAppSelector(state => state.dashboard.activeDashboardId)

    const reportingFilters = useAppSelector(state => getReportingFilters(state.dashboardFilters, dashboardId))
    const filteredReportings = useAppSelector(state => getFilteredReportings(state.dashboard, reportingFilters)) ?? []

    const { newWindowContainerRef } = useNewWindow()

    const dateRangeOptions = getOptionsFromLabelledEnum(ReportingDateRangeLabels)
    const statusOptions = getOptionsFromLabelledEnum(StatusFilterLabels)

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
          filters: { dateRange: dateRange as DateRangeEnum },
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

  return (
    <Wrapper
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      ref={ref}
      $hasChildren={filteredReportings.length > 1}
      $hasPeriodFilter={reportingFilters.dateRange === DateRangeEnum.CUSTOM}
    >
      <StyledDatesWrapper $hasChildren={filteredReportings.length > 1}>
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
      </StyledDatesWrapper>

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
      </Wrapper>
    )
  }
)

const Wrapper = styled.div<{ $hasChildren: boolean; $hasPeriodFilter: boolean }>`
  padding: 16px 24px;
  ${({ $hasChildren, $hasPeriodFilter }) => $hasPeriodFilter && !$hasChildren && 'padding-bottom: 58px;'}
  ${({ $hasChildren }) => ($hasChildren ? 'display: flex; justify-content: space-between;' : 'display: flow-root;')}
`
const StatusWrapper = styled.fieldset`
  border: none;
  display: flex;
  gap: 16px;
  float: right;
  padding-bottom: 16px;
`

const StyledDatesWrapper = styled.div<{ $hasChildren: boolean; $isExpanded: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 16px;
  ${p => !p.$hasChildren && p.$isExpanded && 'position: absolute; z-index: 1;'}
`

const DateRangeSelect = styled(StyledSelect)`
  width: 200px;
`
