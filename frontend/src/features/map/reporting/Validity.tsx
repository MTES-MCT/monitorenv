import { FormikNumberInput } from '@mtes-mct/monitor-ui'
import dayjs from 'dayjs'
import { useFormikContext } from 'formik'
import styled from 'styled-components'

import type { Reporting } from '../../../domain/entities/reporting'

export function Validity() {
  const { values } = useFormikContext<Reporting>()
  const archiveDate = dayjs(values?.createdAt).add(values?.validityTime || 0, 'hour')

  const formattedArchivedDate = archiveDate.format('DD MMMM à HH:mm')

  return (
    <StyledValidityContainer>
      <FormikNumberInput label="Validité" max={24} name="validityTime" />
      {values?.validityTime && values?.validityTime > 0 ? (
        <span>{`Le signalement sera archivé le ${formattedArchivedDate}`}</span>
      ) : (
        ''
      )}
    </StyledValidityContainer>
  )
}

const StyledValidityContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: end;
  gap: 8px;
  > span {
    max-width: 38%;
    font-size: 12px;
    font-style: italic;
    color: ${p => p.theme.color.slateGray};
  }
`
