import { getTimeLeft } from '@features/Reportings/utils'
import { TextInput, customDayjs, getLocalizedDayjs } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { ReportingStatusEnum, getReportingStatus, type Reporting } from '../../../../../../domain/entities/reporting'

export function Validity({ reporting }: { reporting: Reporting }) {
  const reportingStatus = getReportingStatus(reporting)

  const localizedCreatedAt = getLocalizedDayjs(reporting.createdAt ?? customDayjs().toISOString())
  const formattedCreatedAt = localizedCreatedAt.format('DD/MM/YYYY à HH:mm')

  const endOfValidity = localizedCreatedAt.add(reporting.validityTime ?? 0, 'hour')
  const formattedEndOfValidity = endOfValidity.format('DD/MM/YYYY à HH:mm')

  const timeLeft = getTimeLeft(endOfValidity)

  let remainingMinutes = 0
  if (timeLeft < 1 && timeLeft > 0) {
    remainingMinutes = endOfValidity.diff(getLocalizedDayjs(customDayjs().toISOString()), 'minute')
  }

  return (
    <StyledValidityContainer>
      <div>
        <TextInput label="Date et heure" name="createdAt" plaintext value={formattedCreatedAt} />
        <TextInput
          label="Validité&nbsp;(h)"
          name="validityTime"
          plaintext
          value={reporting.validityTime ? `${reporting.validityTime} h` : '--'}
        />{' '}
      </div>

      {reportingStatus === ReportingStatusEnum.ARCHIVED && <GrayText>Le signalement a été archivé.</GrayText>}

      {((reportingStatus !== ReportingStatusEnum.ARCHIVED && timeLeft > 0 && timeLeft < 1) ||
        (timeLeft > 0 && timeLeft < 1)) && (
        <GrayText>{`Le signalement sera archivé le ${formattedEndOfValidity} (dans ${remainingMinutes}min)`}</GrayText>
      )}

      {((reportingStatus !== ReportingStatusEnum.ARCHIVED && timeLeft >= 1) || timeLeft >= 1) && (
        <GrayText>{`Le signalement sera archivé le ${formattedEndOfValidity}(dans ${Math.round(timeLeft)}h)`}</GrayText>
      )}
    </StyledValidityContainer>
  )
}

const StyledValidityContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  > div {
    display: flex;
    gap: 40px;
  }
`

const GrayText = styled.span`
  font-size: 12px;
  font-style: italic;
  color: ${p => p.theme.color.slateGray};
`
