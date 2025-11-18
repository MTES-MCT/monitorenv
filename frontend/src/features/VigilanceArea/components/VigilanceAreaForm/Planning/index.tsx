import { useGetVigilanceAreaQuery } from '@api/vigilanceAreasAPI'
import { Accent, Icon, IconButton, Size } from '@mtes-mct/monitor-ui'
import React from 'react'
import styled from 'styled-components'

import { Header, PanelBody, PanelContainer, Title, TitleContainer } from '../style'

type VigilanceAreaPlanningProps = {
  vigilanceAreaId: number
}

export function VigilanceAreaPlanning({ vigilanceAreaId }: VigilanceAreaPlanningProps) {
  const { data: vigilanceArea } = useGetVigilanceAreaQuery(vigilanceAreaId)
  const [isOpen, setIsOpen] = React.useState(true)

  // compute all occurence of the current year

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
            <li>
              <PlanningBox />
              Janvier
            </li>
            <li>
              <PlanningBox />
              Février
            </li>
            <li>
              <PlanningBox />
              Mars
            </li>
            <li>
              <PlanningBox />
              Avril
            </li>
            <li>
              <PlanningBox />
              Mai
            </li>
            <li>
              <PlanningBox />
              Juin
            </li>
            <li>
              <PlanningBox />
              Juillet
            </li>
            <li>
              <PlanningBox />
              Août
            </li>
            <li>
              <PlanningBox />
              Sept.
            </li>
            <li>
              <PlanningBox />
              Oct.
            </li>
            <li>
              <PlanningBox />
              Nov
            </li>
            <li>
              <PlanningBox />
              Déc.
            </li>
          </PlanningWrapper>
        </StyledPanelBody>
      </StyledPanelContainer>
    )
  )
}

const PlanningWrapper = styled.ol`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  gap: 10px 4px;

  font-size: 11px;
  color: ${p => p.theme.color.slateGray};

  padding-bottom: 10px;
  border-bottom: 1px solid ${p => p.theme.color.lightGray};
`

const StyledPanelBody = styled(PanelBody)`
  padding: 16px;
`

const PlanningBox = styled.div`
  border: 1px solid ${p => p.theme.color.gainsboro};
  width: 52px;
  height: 26px;
`

const StyledTitleContainer = styled(TitleContainer)`
  justify-content: space-between;
  width: 100%;
`
const StyledPanelContainer = styled(PanelContainer)`
  height: 100%;
  max-height: none;
`
