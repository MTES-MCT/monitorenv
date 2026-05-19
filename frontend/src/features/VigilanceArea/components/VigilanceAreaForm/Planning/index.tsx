import { type DateRange } from '@features/VigilanceArea/components/VigilanceAreaForm/Planning/utils'
import styled from 'styled-components'

import { MonthBox } from './MonthBox'

type PlanningProps = {
  isInline?: boolean
  occurences: DateRange[]
}

export const MonthPlanner = [
  { index: 0, label: 'Janvier' },
  { index: 1, label: 'Février' },
  { index: 2, label: 'Mars' },
  { index: 3, label: 'Avril' },
  { index: 4, label: 'Mai' },
  { index: 5, label: 'Juin' },
  { index: 6, label: 'Juillet' },
  { index: 7, label: 'Août' },
  { index: 8, label: 'Sept.' },
  { index: 9, label: 'Oct.' },
  { index: 10, label: 'Nov.' },
  { index: 11, label: 'Déc.' }
]

export function Planning({ isInline = false, occurences }: PlanningProps) {
  return (
    <PlanningWrapper $isInline={isInline}>
      {MonthPlanner.map(({ index, label }) => (
        <li key={index}>
          <MonthBox dateRanges={occurences} isInline={isInline} label={label} monthIndex={index} />
        </li>
      ))}
    </PlanningWrapper>
  )
}

const PlanningWrapper = styled.ol<{ $isInline: boolean }>`
  border-bottom: ${p => (p.$isInline ? '0px' : `1px solid ${p.theme.color.lightGray}`)};
  color: ${p => p.theme.color.slateGray};
  column-gap: 10px;
  display: grid;
  font-size: 11px;
  grid-template-columns: ${({ $isInline }) => ($isInline ? 'repeat(12, 1fr)' : 'repeat(6, 1fr)')};
  padding-bottom: ${({ $isInline }) => ($isInline ? '0px' : '16px')};

  > li {
    width: fit-content;
  }
`
