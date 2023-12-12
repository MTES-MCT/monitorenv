import { getLocalizedDayjs, customDayjs as dayjs } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { useAppSelector } from '../../../../hooks/useAppSelector'
import { useGetControlPlansByYear } from '../../../../hooks/useGetControlPlansByYear'
import { dateDifferenceInHours } from '../../../../utils/dateDifferenceInHours'
import { extractThemesAsText } from '../../../../utils/extractThemesAsText'

export function SurveillanceCard({ feature }) {
  const listener = useAppSelector(state => state.draw.listener)
  const { actionEndDateTimeUtc, actionStartDateTimeUtc, controlPlans } = feature.getProperties()

  const duration = dateDifferenceInHours(actionStartDateTimeUtc, actionEndDateTimeUtc)

  const startDate = actionStartDateTimeUtc ? getLocalizedDayjs(actionStartDateTimeUtc) : undefined
  const endDate = actionEndDateTimeUtc ? getLocalizedDayjs(actionEndDateTimeUtc) : null
  const isSurveillanceOnOneDay = endDate && dayjs(startDate).isSame(dayjs(endDate), 'day')

  const simpleDate = startDate?.isValid() && startDate?.format('DD MMMM YYYY')

  const year = dayjs(feature.actionStartDateTimeUtc || feature.startDateTimeUtc || new Date().toISOString()).year()
  const { themesAsOptions } = useGetControlPlansByYear({
    year
  })

  if (listener) {
    return null
  }

  return (
    <StyledSurveillanceCard>
      <div>
        <StyledThemes>{extractThemesAsText(controlPlans, themesAsOptions)}</StyledThemes>
        <StyledDuration>{duration > 0 ? `1 surveillance (${duration}h)` : '1 surveillance'}</StyledDuration>
      </div>

      <StyledDate>
        {!actionEndDateTimeUtc && simpleDate}
        {endDate && isSurveillanceOnOneDay && simpleDate}
        {endDate &&
          !isSurveillanceOnOneDay &&
          `du ${startDate?.format('DD MMMM YYYY')} au ${endDate.format('DD MMMM YYYY')}`}
      </StyledDate>
    </StyledSurveillanceCard>
  )
}

const StyledSurveillanceCard = styled.div`
  background: ${p => p.theme.color.white};
  display: flex;
  flex-direction: column;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.3);
  padding: 12px;
  gap: 8px;
  flex: 0 0 200px;
`
const StyledThemes = styled.div`
  white-space: nowrap;
  font-weight: 700;
`
const StyledDuration = styled.div`
  font-weight: 500;
`

const StyledDate = styled.div`
  color: ${p => p.theme.color.slateGray};
`
