import { dashboardActions, getFilteredReportings, getReportingFilters } from '@features/Dashboard/slice'
import { StyledCustomPeriodContainer, StyledSelect } from '@features/Reportings/Filters/style'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import {
  Checkbox,
  DateRangePicker,
  getOptionsFromLabelledEnum,
  useNewWindow,
  type DateAsStringRange
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
  const [startAfter, startBefore] = reportingFilters?.period ?? []

  if (!reportingFilters) {
    return null
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
          data-cy="select-period-filter"
          isLabelHidden
          isTransparent
          label="Période"
          name="Période"
          onChange={dateRange => {
            if (dateRange) {
              const matchingEnum = Object.values(ReportingDateRangeEnum).find(
                dateRangeEnum => dateRangeEnum === dateRange
              )
              if (matchingEnum) {
                dispatch(
                  dashboardActions.setReportingFilters({
                    dateRange: matchingEnum
                  })
                )
              }
            }
          }}
          options={dateRangeOptions}
          placeholder="Date de signalement depuis"
          value={reportingFilters.dateRange}
        />
        {reportingFilters.dateRange === ReportingDateRangeEnum.CUSTOM && (
          <StyledCustomPeriodContainer>
            <DateRangePicker
              key="dateRange"
              baseContainer={newWindowContainerRef.current}
              data-cy="datepicker-missionStartedAfter"
              defaultValue={startAfter && startBefore ? [new Date(startAfter), new Date(startBefore)] : undefined}
              isLabelHidden
              isStringDate
              label="Période spécifique"
              name="dateRange"
              onChange={(date: DateAsStringRange | undefined) => {
                dispatch(
                  dashboardActions.setReportingFilters({
                    period: date
                  })
                )
              }}
            />
          </StyledCustomPeriodContainer>
        )}
      </StyledDatesWrapper>

      <StatusWrapper>
        {statusOptions.map(statusOption => (
          <Checkbox
            key={statusOption.label}
            checked={statusOption.value === reportingFilters.status}
            data-cy={`status-filter-${statusOption.label}`}
            label={statusOption.label}
            name={statusOption.label}
            onChange={isChecked => {
              const matchingEnum = Object.values(StatusFilterEnum).find(status => status === statusOption.value)
              if (matchingEnum) {
                if (isChecked) {
                  dispatch(
                    dashboardActions.setReportingFilters({
                      status: matchingEnum
                    })
                  )
                } else {
                  dispatch(
                    dashboardActions.setReportingFilters({
                      status: undefined
                    })
                  )
                }
              }
            }}
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
