import { TextInput, customDayjs, getLocalizedDayjs } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { ReportingStatusEnum, getReportingStatus } from '../../../../../domain/entities/reporting'

export function Validity({ reporting }) {
  const reportingStatus = getReportingStatus(reporting)

  const formattedCreatedAt = getLocalizedDayjs(reporting?.createdAt).format('DD/MM/YYYY à HH:mm')

  const endOfValidity = getLocalizedDayjs(reporting?.createdAt).add(reporting?.validityTime || 0, 'hour')
  const formattedEndOfValidity = endOfValidity.format('DD/MM/YYYY à HH:mm')

  const timeLeft = endOfValidity.diff(getLocalizedDayjs(customDayjs().toISOString()), 'hour', true)

  let remainingMinutes = 0
  if (timeLeft < 1 && timeLeft > 0) {
    remainingMinutes = endOfValidity.diff(getLocalizedDayjs(customDayjs().toISOString()), 'minute')
  }

  return (
    <StyledValidityContainer>
      <TextInput
        label="Validité (h)"
        name="validityTime"
        plaintext
        value={reporting.validityTime ? `${reporting.validityTime} h` : '--'}
      />
      {reportingStatus === ReportingStatusEnum.ARCHIVED && (
        <GrayText>{`Le signalement ouvert le ${formattedCreatedAt} (UTC) a été archivé.`}</GrayText>
      )}

      {((reportingStatus !== ReportingStatusEnum.ARCHIVED && timeLeft > 0 && timeLeft < 1) ||
        (timeLeft > 0 && timeLeft < 1)) && (
        <GrayText>{`Le signalement ouvert le ${formattedCreatedAt} (UTC) sera archivé le ${formattedEndOfValidity} (UTC) (dans ${remainingMinutes}min)`}</GrayText>
      )}

      {((reportingStatus !== ReportingStatusEnum.ARCHIVED && timeLeft >= 1) || timeLeft >= 1) && (
        <GrayText>{`Le signalement ouvert le ${formattedCreatedAt} (UTC) sera archivé le ${formattedEndOfValidity} (UTC) (dans ${Math.round(
          timeLeft
        )}h)`}</GrayText>
      )}
    </StyledValidityContainer>
  )
}

const StyledValidityContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: end;
  gap: 8px;
`

const GrayText = styled.span`
  font-size: 12px;
  font-style: italic;
  color: ${p => p.theme.color.slateGray};
`
