import { format, isValid } from 'date-fns'
import { fr } from 'date-fns/locale'
import styled from 'styled-components'

import { COLORS } from '../../../../constants/constants'
import { InteractionListener } from '../../../../domain/entities/map/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'

export function SurveillanceCard({ feature }) {
  const listener = useAppSelector(state => state.draw.listener)

  const { actionStartDateTimeUtc, actionTheme } = feature.getProperties()
  const parsedActionStartDateTimeUtc = new Date(actionStartDateTimeUtc)

  if (listener === InteractionListener.SURVEILLANCE_ZONE) {
    return null
  }

  return (
    <SurveillanceCardHeader>
      <Col1>
        <SurveillanceDate>
          {isValid(parsedActionStartDateTimeUtc) &&
            format(parsedActionStartDateTimeUtc, 'dd MMM à HH:mm', { locale: fr })}
        </SurveillanceDate>
      </Col1>
      <Col2>
        <Theme>{actionTheme}</Theme>
      </Col2>
    </SurveillanceCardHeader>
  )
}

const SurveillanceCardHeader = styled.div`
  background: ${COLORS.white};
  padding: 4px 5px 5px 5px;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  display: flex;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.3);
  padding: 18px;
`

const SurveillanceDate = styled.div``

const Theme = styled.div``

const Col1 = styled.div`
  width: 120px;
`
const Col2 = styled.div`
  width: 330px;
`
