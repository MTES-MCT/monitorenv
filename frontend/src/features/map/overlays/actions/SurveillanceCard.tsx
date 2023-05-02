import { getLocalizedDayjs } from '@mtes-mct/monitor-ui'
import dayjs from 'dayjs'
import styled from 'styled-components'

import { COLORS } from '../../../../constants/constants'
import { InteractionListener } from '../../../../domain/entities/map/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { dateDifferenceInHours } from '../../../../utils/dateDifferenceInHours'
import { extractThemesAsText } from '../../../../utils/extractThemesAsText'

export function SurveillanceCard({ feature }) {
  const listener = useAppSelector(state => state.draw.listener)
  const { actionEndDateTimeUtc, actionStartDateTimeUtc, themes } = feature.getProperties()

  const duration = dateDifferenceInHours(actionStartDateTimeUtc, actionEndDateTimeUtc)

  const startDate = getLocalizedDayjs(actionStartDateTimeUtc)
  const endDate = actionEndDateTimeUtc ? getLocalizedDayjs(actionEndDateTimeUtc) : null
  const isSurveillanceOnOneDay = endDate && dayjs(startDate).isSame(dayjs(endDate), 'day')

  const simpleDate = startDate.isValid() && startDate.format('DD MMMM YYYY')

  if (listener === InteractionListener.SURVEILLANCE_ZONE) {
    return null
  }

  return (
    <StyledSurveillanceCard>
      <div>
        <StyledThemes>{extractThemesAsText(themes)}</StyledThemes>
        <StyledDuration>{duration > 0 ? `1 surveillance (${duration}h)` : '1 surveillance'}</StyledDuration>
      </div>

      <StyledDate>
        {!actionEndDateTimeUtc && simpleDate}
        {endDate && isSurveillanceOnOneDay && simpleDate}
        {endDate &&
          !isSurveillanceOnOneDay &&
          `du ${startDate.format('DD MMMM YYYY')} au ${endDate.format('DD MMMM YYYY')}`}
      </StyledDate>
    </StyledSurveillanceCard>
  )
}

const StyledSurveillanceCard = styled.div`
  background: ${COLORS.white};
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
  color: ${COLORS.slateGray};
`
