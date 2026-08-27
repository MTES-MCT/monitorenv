import {
  PeriodText,
  RefRegContainer,
  RefRegText,
  RefRegTextContainer
} from '@features/RegulatoryArea/components/RegulatoryAreaGroupForm/RefRegForm'
import { getPeriodText } from '@features/RegulatoryArea/utils'

import type { ReactNode } from 'react'

export function ReadOnlyOtherRefRegText({
  children,
  endDate,
  refReg,
  startDate
}: {
  children?: ReactNode
  endDate: string | undefined
  refReg: string | undefined
  startDate: string | undefined
}) {
  return (
    <RefRegContainer>
      <RefRegTextContainer>
        <RefRegText title={refReg}>{refReg} </RefRegText>
        <PeriodText>{getPeriodText(startDate, endDate)}</PeriodText>
      </RefRegTextContainer>
      {children}
    </RefRegContainer>
  )
}
