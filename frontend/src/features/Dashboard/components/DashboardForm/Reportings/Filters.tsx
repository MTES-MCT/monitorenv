import { dashboardActions, getFilteredReportings, getReportingFilters } from '@features/Dashboard/slice'
import { StyledCustomPeriodContainer, StyledSelect } from '@features/Reportings/Filters/style'
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
import { ReportingDateRangeEnum, ReportingDateRangeLabels } from 'domain/entities/dateRange'
import { StatusFilterEnum, StatusFilterLabels } from 'domain/entities/reporting'
import { forwardRef, type ComponentProps } from 'react'
import styled from 'styled-components'

export const Filters = forwardRef<HTMLDivElement, ComponentProps<'div'>>(({ ...props }, ref) => {
  const dispatch = useAppDispatch()
  const reportingFilters = useAppSelector(state => getReportingFilters(state.dashboard))
  const filteredReportings = useAppSelector(state => getFilteredReportings(state.dashboard)) ?? []

  const { newWindowContainerRef } = useNewWindow()

  const dateRangeOptions = getOptionsFromLabelledEnum(ReportingDateRangeLabels)
  const statusOptions = getOptionsFromLabelledEnum(StatusFilterLabels)

  if (!reportingFilters) {
    return null
  }

  const setCustomPeriodFilter = (date: DateAsStringRange | undefined) => {
    dispatch(
      dashboardActions.setReportingFilters({
        period: date
      })
    )
  }

  const setPeriodFilter = (dateRange: OptionValueType | undefined) => {
    if (dateRange) {
      dispatch(
        dashboardActions.setReportingFilters({
          dateRange: dateRange as ReportingDateRangeEnum
        })
      )
    }
  }

  const setStatusFilter = (statusOption: Option<string>, isChecked: boolean | undefined) => {
    if (isChecked) {
      dispatch(
        dashboardActions.setReportingFilters({
          status: [...reportingFilters.status, statusOption.value as StatusFilterEnum]
        })
      )
    } else {
      dispatch(
        dashboardActions.setReportingFilters({
          status: reportingFilters.status.filter(status => status !== statusOption.value)
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
      $hasPeriodFilter={reportingFilters.dateRange === ReportingDateRangeEnum.CUSTOM}
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
        {reportingFilters.dateRange === ReportingDateRangeEnum.CUSTOM && (
          <StyledCustomPeriodContainer>
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
          </StyledCustomPeriodContainer>
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
})

const Wrapper = styled.div<{ $hasChildren: boolean; $hasPeriodFilter: boolean }>`
  padding: 16px 24px;
  ${({ $hasChildren, $hasPeriodFilter }) => $hasPeriodFilter && !$hasChildren && 'padding-bottom: 58px;'}
  ${({ $hasChildren }) => $hasChildren && 'display: flex; justify-content: space-between;'}
`
const StatusWrapper = styled.fieldset`
  border: none;
  display: flex;
  gap: 16px;
  float: right;
`

const StyledDatesWrapper = styled.div<{ $hasChildren: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 16px;
  ${({ $hasChildren }) => !$hasChildren && 'position: absolute;'}
  z-index: 1;
`

const DateRangeSelect = styled(StyledSelect)`
  width: 200px;
`
