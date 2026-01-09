/* eslint-disable react/destructuring-assignment */

import { Bold } from '@components/style'
import { Tooltip } from '@components/Tooltip'
import { Rectangle } from '@features/layersSelector/utils/LayerLegend.style'
import {
  computeOccurenceWithinCurrentYear,
  type DateRange
} from '@features/VigilanceArea/components/VigilanceAreaForm/Planning/utils'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { computeVigilanceAreaPeriod, endingOccurenceText, frequencyText } from '@features/VigilanceArea/utils'
import { Icon, Size, THEME } from '@mtes-mct/monitor-ui'
import { useMemo, useState } from 'react'
import styled from 'styled-components'

import { Planning } from '.'

type PlanningBodyProps = {
  vigilanceArea: VigilanceArea.VigilanceArea
}

export function PlanningBody({ vigilanceArea }: PlanningBodyProps) {
  const [isSummaryOpen, setIsSummaryOpen] = useState(false)
  const [isCriticalSummaryOpen, setIsCriticalSummaryOpen] = useState(false)
  const occurences = useMemo(
    () =>
      (vigilanceArea.periods ?? [])
        .reduce((acc: DateRange[][], period) => {
          acc.push(computeOccurenceWithinCurrentYear(period))

          return acc
        }, [])
        .flat(),
    [vigilanceArea]
  )
  const hasSimplePeriods = useMemo(() => occurences.some(occ => !occ.isCritical), [occurences])
  const hasCriticalPeriods = useMemo(() => occurences.some(occ => occ.isCritical), [occurences])

  return (
    <>
      <Planning occurences={occurences} />
      <Periods>
        {vigilanceArea.periods && vigilanceArea.periods.length === 0 ? (
          <PeriodDescription>Aucune période de vigilance définie</PeriodDescription>
        ) : (
          <DetailsWrapper>
            {hasSimplePeriods && (
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
                  {vigilanceArea.periods
                    ?.filter(period => !period.isCritical)
                    .map(period => (
                      // eslint-disable-next-line react/no-array-index-key
                      <PeriodItem key={period.id}>
                        <span>{computeVigilanceAreaPeriod(period, false)}</span>
                        {period?.frequency && period.frequency !== VigilanceArea.Frequency.NONE && (
                          <Tooltip Icon={Icon.Reset}>
                            {[
                              frequencyText(period.frequency, false),
                              endingOccurenceText(period?.endingCondition, period?.computedEndDate, false)
                            ]
                              .filter(value => !!value)
                              .join(', ')}
                          </Tooltip>
                        )}
                      </PeriodItem>
                    ))}
                </PeriodList>
              </Details>
            )}
            {hasCriticalPeriods && (
              <Details
                onToggle={event => {
                  if (event.target) {
                    const elt = event.target as HTMLDetailsElement
                    setIsCriticalSummaryOpen(elt.open)
                  }
                }}
                open={isCriticalSummaryOpen}
              >
                <Summary>
                  <Rectangle $border="2px solid #E1000F" $size={Size.NORMAL} $vectorLayerColor="#C25141BF" />
                  Vigilance critique
                  <Chevron $isOpen={isCriticalSummaryOpen} color={THEME.color.slateGray} size={16} />
                </Summary>
                <PeriodList>
                  {vigilanceArea.periods
                    ?.filter(occ => occ.isCritical)
                    .map(period => (
                      // eslint-disable-next-line react/no-array-index-key
                      <PeriodItem key={period.id}>
                        <span>{computeVigilanceAreaPeriod(period, false)}</span>
                        {period?.frequency && period.frequency !== VigilanceArea.Frequency.NONE && (
                          <Tooltip Icon={Icon.Reset}>
                            {[
                              frequencyText(period?.frequency, false),
                              endingOccurenceText(period?.endingCondition, period?.computedEndDate, false)
                            ]
                              .filter(value => !!value)
                              .join(', ')}
                          </Tooltip>
                        )}
                      </PeriodItem>
                    ))}
                </PeriodList>
              </Details>
            )}
          </DetailsWrapper>
        )}
        <PeriodDescription>
          La zone sera visible sur la cartographie et la liste <Bold>uniquement</Bold> lors ses périodes de vigilance
          (simple et critique).
        </PeriodDescription>
      </Periods>
    </>
  )
}

const DetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 0;
`
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
  margin-top: 8px;
`

const PeriodList = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
  margin-left: 24px;
  flex-wrap: wrap;
`

const PeriodItem = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;
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
