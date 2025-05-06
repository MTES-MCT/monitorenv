import { getTimeLeft } from '@features/Reportings/utils'
import { customDayjs, DatePicker, FormikNumberInput, getLocalizedDayjs, useNewWindow } from '@mtes-mct/monitor-ui'
import { getReportingStatus, type Reporting, ReportingStatusEnum } from 'domain/entities/reporting'
import { ReportingContext } from 'domain/shared_slices/Global'
import { useFormikContext } from 'formik'
import { useMemo } from 'react'
import styled from 'styled-components'

type ValidityProps = {
  mustIncreaseValidity: boolean
  reportingContext: ReportingContext
}

export function Validity({ mustIncreaseValidity, reportingContext }: ValidityProps) {
  const { newWindowContainerRef } = useNewWindow()

  const { setFieldValue, values } = useFormikContext<Reporting>()

  const reportingStatus = getReportingStatus(values)
  const createdAt = values.createdAt ?? customDayjs().toISOString()

  const endOfValidity = getLocalizedDayjs(createdAt).add(values?.validityTime ?? 0, 'hour')
  const formattedEndOfValidity = endOfValidity.format('DD/MM/YYYY à HH:mm')

  const timeLeft = getTimeLeft(endOfValidity)

  let remainingMinutes = 0
  if (timeLeft < 1 && timeLeft > 0) {
    remainingMinutes = endOfValidity.diff(getLocalizedDayjs(customDayjs().toISOString()), 'minute')
  }

  const canReopenReporting = useMemo(
    () => reportingStatus === ReportingStatusEnum.ARCHIVED && mustIncreaseValidity && timeLeft > 0,
    [reportingStatus, mustIncreaseValidity, timeLeft]
  )

  const actualYearForThemes = useMemo(() => customDayjs(values.createdAt).year(), [values.createdAt])

  const handleCreatedAtChange = (nextValue: string | undefined) => {
    setFieldValue('createdAt', nextValue)
    if (actualYearForThemes && actualYearForThemes !== customDayjs(nextValue).year()) {
      setFieldValue('theme', undefined)
    }
  }

  return (
    <StyledValidityContainer>
      <div>
        <DatePicker
          baseContainer={reportingContext === ReportingContext.SIDE_WINDOW ? newWindowContainerRef.current : undefined}
          defaultValue={createdAt}
          isCompact
          isErrorMessageHidden
          isHistorical
          isRequired
          isStringDate
          label="Date et heure (UTC)"
          name="createdAt"
          onChange={handleCreatedAtChange}
          withTime
        />
        <StyledFormikNumberInput isErrorMessageHidden isRequired label="Validité (h)" min={1} name="validityTime" />
      </div>

      {reportingStatus === ReportingStatusEnum.ARCHIVED && !mustIncreaseValidity && (
        <GrayText>Le signalement a été archivé.</GrayText>
      )}
      {reportingStatus === ReportingStatusEnum.ARCHIVED && mustIncreaseValidity && !canReopenReporting && (
        <RedText>
          La date de validité du signalement est dépassée. Pour le rouvrir, veuillez augmenter sa durée de validité.
        </RedText>
      )}

      {((reportingStatus !== ReportingStatusEnum.ARCHIVED && timeLeft > 0 && timeLeft < 1) ||
        (canReopenReporting && timeLeft > 0 && timeLeft < 1)) && (
        <GrayText>{`Le signalement sera archivé le ${formattedEndOfValidity} (UTC) (dans ${remainingMinutes}min)`}</GrayText>
      )}

      {((reportingStatus !== ReportingStatusEnum.ARCHIVED && timeLeft >= 1) ||
        (canReopenReporting && timeLeft >= 1)) && (
        <GrayText>{`Le signalement sera archivé le ${formattedEndOfValidity} (UTC) (dans ${Math.round(
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
const RedText = styled(GrayText)`
  color: ${p => p.theme.color.maximumRed};
`
