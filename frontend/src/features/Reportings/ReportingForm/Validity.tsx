import { FormikNumberInput, customDayjs, getLocalizedDayjs } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import styled from 'styled-components'

import type { Reporting } from '../../../domain/entities/reporting'

export function Validity() {
  const { values } = useFormikContext<Reporting>()

  const formattedCreatedAt = getLocalizedDayjs(values?.createdAt).format('DD/MM/YYYY à HH:mm')

  const archiveDate = getLocalizedDayjs(values?.createdAt).add(values?.validityTime || 0, 'hour')
  const formattedArchivedDate = archiveDate.format('DD MMMM à HH:mm')

  const remainingTime = archiveDate.diff(getLocalizedDayjs(customDayjs().toISOString()), 'hour')

  return (
    <StyledValidityContainer>
      <StyledFormikNumberInput label="Validité (h)" max={24} name="validityTime" />
      {!values.isArchived && remainingTime > 0 && values?.validityTime && values?.validityTime > 0 ? (
        <GrayText>{`Le signalement ouvert le ${formattedCreatedAt} (UTC) sera archivé le ${formattedArchivedDate} (UTC) (dans ${remainingTime}h)`}</GrayText>
      ) : (
        <RedText>{`La date de validité du signalement, ouvert le ${formattedCreatedAt} (UTC) , est dépassée. Pour le rouvrir, veuillez augmenter sa durée de validité.`}</RedText>
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
