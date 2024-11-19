import type { Dashboard } from '@features/Dashboard/types'
import type { RefObject } from 'react'

export const scrollToSection = (sectionRef: RefObject<HTMLDivElement>) => {
  sectionRef.current?.scrollIntoView({ behavior: 'smooth' })
}

export type ColumnProps = {
  className: string
  expandedAccordion: Dashboard.Block | undefined
  isSelectedAccordionOpen: boolean
  onExpandedAccordionClick: (type: Dashboard.Block) => void
}
