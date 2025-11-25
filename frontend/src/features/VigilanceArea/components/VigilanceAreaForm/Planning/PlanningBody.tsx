/* eslint-disable react/destructuring-assignment */

import { Bold } from '@components/style'
import { Rectangle } from '@features/layersSelector/utils/LayerLegend.style'
import { computeOccurenceWithinCurrentYear } from '@features/VigilanceArea/components/VigilanceAreaForm/Planning/utils'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { Icon, Size, THEME } from '@mtes-mct/monitor-ui'
import { getDateAsLocalizedStringVeryCompact } from '@utils/getDateAsLocalizedString'
import { useMemo, useState } from 'react'
import styled from 'styled-components'

import { Planning } from '.'

type PlanningBodyProps = {
  vigilanceArea: VigilanceArea.VigilanceArea
}

export function PlanningBody({ vigilanceArea }: PlanningBodyProps) {
  const [isSummaryOpen, setIsSummaryOpen] = useState(false)
  const occurences = useMemo(
    () => (vigilanceArea ? computeOccurenceWithinCurrentYear(vigilanceArea) : []),
    [vigilanceArea]
  )

  return (
    <>
      <Planning occurences={occurences} />
      <Periods>
        {!vigilanceArea.isAtAllTimes && !vigilanceArea.startDatePeriod ? (
          <PeriodDescription>Aucune période de vigilance définie</PeriodDescription>
        ) : (
          <Details
            onToggle={event => {
              if (event.target) {
                const elt = event.target as HTMLDetailsElement
                setIsSummaryOpen(elt.open)
              }
            }}
            open={isSummaryOpen}
          >
            <Summary>
              <Rectangle $size={Size.NORMAL} $vectorLayerColor="#C2514180" />
              Vigilance simple
              <Chevron $isOpen={isSummaryOpen} color={THEME.color.slateGray} size={16} />
            </Summary>
            <PeriodList>
              {occurences.map(({ end, start }) => (
                <li>
                  Du {getDateAsLocalizedStringVeryCompact(start.toISOString(), true)} au{' '}
                  {getDateAsLocalizedStringVeryCompact(end.toISOString(), true)}
                </li>
              ))}
            </PeriodList>
          </Details>
        )}
        <PeriodDescription>
          La zone sera visible sur la cartographie et la liste <Bold>uniquement</Bold> lors ses périodes de vigilance
          (simple et critique).
        </PeriodDescription>
      </Periods>
    </>
  )
}

const Details = styled.details`
  cursor: pointer;
`
const Summary = styled.summary`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 8px;
  margin-bottom: 4px;
`

const Periods = styled.section`
  margin-top: 16px;
`

const PeriodList = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
  margin-left: 24px;
  flex-wrap: wrap;
`

const PeriodDescription = styled.p`
  font-style: italic;
  font-weight: 400;
  color: ${p => p.theme.color.slateGray};
`

const Chevron = styled(Icon.Chevron)<{ $isOpen: boolean }>`
  ${p => p.$isOpen && `transform: rotate(-180deg);`}
  transition: all 0.2s;
`
