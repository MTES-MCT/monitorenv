import { useGetVigilanceAreaQuery } from '@api/vigilanceAreasAPI'
import { computeOccurenceWithinCurrentYear } from '@features/VigilanceArea/components/VigilanceAreaForm/Planning/utils'
import { Accent, Icon, IconButton, Size } from '@mtes-mct/monitor-ui'
import React, { useMemo } from 'react'
import styled from 'styled-components'

import { Header, PanelBody, PanelContainer, Title, TitleContainer } from '../style'
import { MonthBox } from './MonthBox'

type VigilanceAreaPlanningProps = {
  vigilanceAreaId: number
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

export function VigilanceAreaPlanning({ vigilanceAreaId }: VigilanceAreaPlanningProps) {
  const { data: vigilanceArea } = useGetVigilanceAreaQuery(vigilanceAreaId)
  const [isOpen, setIsOpen] = React.useState(true)

  const occurences = useMemo(
    () => (vigilanceArea ? computeOccurenceWithinCurrentYear(vigilanceArea) : []),
    [vigilanceArea]
  )

  if (!vigilanceArea) {
    return null
  }

  return (
    isOpen && (
      <StyledPanelContainer>
        <Header $isEditing>
          <StyledTitleContainer>
            <Title>Planning de vigilance</Title>
            <IconButton
              accent={Accent.TERTIARY}
              Icon={Icon.Close}
              onClick={() => setIsOpen(false)}
              size={Size.SMALL}
              title="Fermer la zone de vigilance"
            />
          </StyledTitleContainer>
        </Header>
        <StyledPanelBody>
          <PlanningWrapper>
            {MonthPlanner.map(({ index, label }) => {
              const occurencesOfTheMonth = occurences.filter(
                ({ end, start }) => start.month() === index || end.month() === index
              )

              return (
                <li key={index}>
                  <MonthBox dateRanges={occurencesOfTheMonth} monthIndex={index} />
                  {label}
                </li>
              )
            })}
          </PlanningWrapper>
        </StyledPanelBody>
      </StyledPanelContainer>
    )
  )
}

const PlanningWrapper = styled.ol`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px 4px;

  font-size: 11px;
  color: ${p => p.theme.color.slateGray};

  padding-bottom: 10px;
  border-bottom: 1px solid ${p => p.theme.color.lightGray};
`

const StyledPanelBody = styled(PanelBody)`
  padding: 16px;
`

const StyledTitleContainer = styled(TitleContainer)`
  justify-content: space-between;
  width: 100%;
`
const StyledPanelContainer = styled(PanelContainer)`
  height: 100%;
  max-height: none;
`
