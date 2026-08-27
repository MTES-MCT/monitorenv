import {
  PeriodText,
  RefRegContainer,
  RefRegText,
  RefRegTextContainer
} from '@features/RegulatoryArea/components/RegulatoryAreaGroupForm/RefRegForm'
import { getPeriodText } from '@features/RegulatoryArea/utils'
import { Link } from '@mtes-mct/monitor-ui'

import type { ReactNode } from 'react'

export function ReadOnlyRefRegText({
  children,
  date,
  dateFin,
  refReg,
  url
}: {
  children?: ReactNode
  date: string | undefined
  dateFin: string | undefined
  refReg: string | undefined
  url: string | undefined
}) {
  return (
    <RefRegContainer>
      <RefRegTextContainer>
        <RefRegText title={refReg}>{refReg} </RefRegText>
        <Link href={url} rel="external noreferrer" target="_blank">
          {url}
        </Link>
        <PeriodText>{getPeriodText(date, dateFin)}</PeriodText>
      </RefRegTextContainer>
      {children}
    </RefRegContainer>
  )
}
