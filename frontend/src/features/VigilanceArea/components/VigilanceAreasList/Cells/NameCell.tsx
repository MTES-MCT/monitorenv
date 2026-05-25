import { isMatchForRecurringOccurrence } from '@features/layersSelector/utils/getFilteredVigilanceAreasPerPeriod'
import { Accent, customDayjs, Icon, Tag } from '@mtes-mct/monitor-ui'
import { useMemo } from 'react'
import styled from 'styled-components'

import { HighlightCell } from './HighlightCell'
import { BasePeriodCircle } from '../../VigilanceAreaForm/Periods/Periods'

import type { VigilanceArea } from '@features/VigilanceArea/types'

const ALL_TIMES_AND_CRITICAL = 'CRITICAL_AT_ALL_TIMES'
const ALL_TIMES_AND_SIMPLE = 'SIMPLE_AT_ALL_TIMES'

export function NameCell({ vigilanceArea }: { vigilanceArea: VigilanceArea.VigilanceArea }) {
  const statusAndCriticity = useMemo(() => {
    const hasAllTimePeriods = vigilanceArea.periods?.some(period => period.isAtAllTimes)
    const hasCriticalPeriod = vigilanceArea.periods?.some(period => period.isCritical)

    if (hasAllTimePeriods) {
      return hasCriticalPeriod ? ALL_TIMES_AND_CRITICAL : ALL_TIMES_AND_SIMPLE
    }

    const activePeriods = vigilanceArea.periods?.filter(period => {
      if (!period.frequency) {
        return false
      }
      const startDate = customDayjs(period.startDatePeriod).utc()
      const endDate = customDayjs(period.endDatePeriod).utc()
      const endDateFilter = customDayjs().utc().endOf('day')
      const startDateFilter = customDayjs().utc().startOf('day')
      const loopStopDate = period.computedEndDate
        ? customDayjs(period.computedEndDate)
        : customDayjs(endDate).add(5, 'year')

      return isMatchForRecurringOccurrence(
        startDate,
        endDate,
        startDateFilter,
        endDateFilter,
        period.frequency,
        loopStopDate
      )
    })

    if (!activePeriods?.length) {
      return undefined
    }

    return activePeriods.some(period => period.isCritical) ? ALL_TIMES_AND_CRITICAL : ALL_TIMES_AND_SIMPLE
  }, [vigilanceArea.periods])

  return (
    <Wrapper>
      <NameAndStatus>
        {statusAndCriticity && <StyledPeriodCircle $isCritical={statusAndCriticity === ALL_TIMES_AND_CRITICAL} />}
        <HighlightCell text={vigilanceArea.name ?? ''} />
      </NameAndStatus>
      {vigilanceArea.isDraft && (
        <StyledTag accent={Accent.PRIMARY} Icon={Icon.EditUnbordered}>
          Brouillon
        </StyledTag>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  max-width: 450px;
`
const NameAndStatus = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
const StyledTag = styled(Tag)`
  font-style: normal;
  margin-left: 8px;
`

export const StyledPeriodCircle = styled(BasePeriodCircle)`
  margin-right: 8px;
`
