import { type DateRange } from '@features/VigilanceArea/components/VigilanceAreaForm/Planning/utils'
import styled from 'styled-components'

import { MonthBox } from './MonthBox'

type PlanningProps = {
  occurences: DateRange[]
}

const MonthPlanner = [
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

export function Planning({ occurences }: PlanningProps) {
  return (
    <PlanningWrapper>
      {MonthPlanner.map(({ index, label }) => (
        <li key={index}>
          <MonthBox dateRanges={occurences} label={label} monthIndex={index} />
        </li>
      ))}
    </PlanningWrapper>
  )
}

const PlanningWrapper = styled.ol`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px 4px;

  font-size: 11px;
  color: ${p => p.theme.color.slateGray};

  padding-bottom: 16px;
  border-bottom: 1px solid ${p => p.theme.color.lightGray};

  > li {
    width: fit-content;
  }
`
