import { FormikNumberInput, customDayjs } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import { useMemo } from 'react'
import styled from 'styled-components'

import { ReportingStatusEnum, type Reporting } from '../../../domain/entities/reporting'
import { getReportingEndOfValidity, getReportingStatus, getReportingTimeLeft } from '../utils'

export function Validity({ mustIncreaseValidity }: { mustIncreaseValidity: boolean }) {
  const { values } = useFormikContext<Reporting>()

  const reportingStatus = getReportingStatus(values)

  const formattedCreatedAt = customDayjs(values?.createdAt).format('DD/MM/YYYY à HH:mm')

  const endOfValidity = getReportingEndOfValidity(values?.createdAt, values?.validityTime)
  const formattedEndOfValidity = endOfValidity.format('DD/MM/YYYY à HH:mm')

  const timeLeft = getReportingTimeLeft(values?.createdAt, values?.validityTime)

  let remainingMinutes = 0
  if (timeLeft < 1 && timeLeft > 0) {
    remainingMinutes = endOfValidity.diff(customDayjs().toISOString(), 'minute')
  }

  const canReopenReporting = useMemo(
    () => reportingStatus === ReportingStatusEnum.ARCHIVED && mustIncreaseValidity && timeLeft > 0,
    [reportingStatus, mustIncreaseValidity, timeLeft]
  )

  return (
    <StyledValidityContainer>
      <StyledFormikNumberInput label="Validité (h)" name="validityTime" />
      {reportingStatus === ReportingStatusEnum.ARCHIVED && !mustIncreaseValidity && (
        <GrayText>{`Le signalement ouvert le ${formattedCreatedAt} (UTC) a été archivé.`}</GrayText>
      )}
      {reportingStatus === ReportingStatusEnum.ARCHIVED && mustIncreaseValidity && !canReopenReporting && (
        <RedText>{`La date de validité du signalement, ouvert le ${formattedCreatedAt} (UTC), est dépassée. Pour le rouvrir, veuillez augmenter sa durée de validité.`}</RedText>
      )}

      {((reportingStatus !== ReportingStatusEnum.ARCHIVED && timeLeft > 0 && timeLeft < 1) ||
        (canReopenReporting && timeLeft > 0 && timeLeft < 1)) && (
        <GrayText>{`Le signalement ouvert le ${formattedCreatedAt} (UTC) sera archivé le ${formattedEndOfValidity} (UTC) (dans ${remainingMinutes}min)`}</GrayText>
      )}

      {((reportingStatus !== ReportingStatusEnum.ARCHIVED && timeLeft >= 1) ||
        (canReopenReporting && timeLeft >= 1)) && (
        <GrayText>{`Le signalement ouvert le ${formattedCreatedAt} (UTC) sera archivé le ${formattedEndOfValidity} (UTC) (dans ${Math.round(
          timeLeft
        )}h)`}</GrayText>
      )}
    </StyledValidityContainer>
  )
}

const StyledFormikNumberInput = styled(FormikNumberInput)`
  max-width: 80px;
  text-align: right;
`
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
const RedText = styled(GrayText)`
  color: ${p => p.theme.color.maximumRed};
`
