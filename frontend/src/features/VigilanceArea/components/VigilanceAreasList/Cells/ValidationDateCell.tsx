import { getDateAsLocalizedStringVeryCompact } from '@utils/getDateAsLocalizedString'
import { getNbMonths } from '@utils/getNbMonths'
import { useMemo } from 'react'
import styled from 'styled-components'

export function ValidationDateCell({ date }: { date: string | undefined }) {
  const nbMonths = useMemo(() => getNbMonths(date), [date])

  if (!date) {
    return <span>-</span>
  }
  const formattedDate = getDateAsLocalizedStringVeryCompact(date, true)

  return <LastValidation $warning={nbMonths >= 6}>{formattedDate}</LastValidation>
}

const LastValidation = styled.span<{ $warning?: boolean }>`
  color: ${p => p.$warning && p.theme.color.maximumRed};
`
