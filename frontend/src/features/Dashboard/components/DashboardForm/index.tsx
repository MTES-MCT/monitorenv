import { SideWindowContent } from '@features/SideWindow/style'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import { useState } from 'react'
import styled from 'styled-components'

import { Accordion } from './Accordion'
import { RegulatoryAreas } from './RegulatoryAreas'

export function DashboardForm() {
  const extractedArea = useAppSelector(state => state.dashboard.extractedArea)

  const [expandedAccordion, setExpandedAccordion] = useState<number>(0)

  const handleAccordionClick = (index: number) => {
    if (expandedAccordion === index) {
      setExpandedAccordion(0)

      return
    }
    setExpandedAccordion(index)
  }

  const clickOnEye = () => {}
  // TODO 20/09: use constant instead of number to define the accordion index

  return (
    <Container>
      <FirstColumn>
        <RegulatoryAreas isExpanded={expandedAccordion === 1} setExpandedAccordion={() => handleAccordionClick(1)} />

        <Accordion
          isExpanded={expandedAccordion === 2}
          setExpandedAccordion={() => handleAccordionClick(2)}
          title="Zones AMP"
        >
          <div>TEST</div>
          <div>TEST</div>
          <div>TEST</div>
          <div>TEST</div>
          <div>TEST</div>
          <div>TEST</div>
          <div>TEST</div>
          <div>TEST</div>
          <div>TEST</div>
          <div>TEST</div>
          <div>TEST</div>
          <div>TEST</div>
        </Accordion>
        <Accordion
          isExpanded={expandedAccordion === 3}
          setExpandedAccordion={() => handleAccordionClick(3)}
          title="Zones de vigilance"
        >
          <div>TEST</div>
          <div>TEST</div>
          <div>TEST</div>
          <div>TEST</div>
        </Accordion>
      </FirstColumn>
      <Column>
        <Accordion
          isExpanded={expandedAccordion === 4}
          setExpandedAccordion={() => handleAccordionClick(4)}
          title="Pression territoriale des contrôles et surveillances"
        >
          <div>TEST</div>
          <div>TEST</div>
          <div>TEST</div>
          <div>TEST</div>
          <div>TEST</div>
          <div>TEST</div>
          <div>TEST</div>
          <div>TEST</div>
          <div>TEST</div>
          <div>TEST</div>
          <div>TEST</div>
          <div>TEST</div>
        </Accordion>
        <Accordion
          headerButton={<IconButton accent={Accent.TERTIARY} Icon={Icon.Hide} onClick={clickOnEye} />}
          isExpanded={expandedAccordion === 5}
          setExpandedAccordion={() => handleAccordionClick(5)}
          title="Signalements"
        >
          <div>TEST</div>
          <div>TEST</div>
          <div>TEST</div>
          <div>TEST</div>
        </Accordion>
      </Column>
      <Column>
        <Accordion
          isExpanded={expandedAccordion === 6}
          setExpandedAccordion={() => handleAccordionClick(6)}
          title="Unités"
        >
          <div>TEST</div>
          <div>TEST</div>
          <div>TEST</div>
          <div>TEST</div>
          <div>TEST</div>
          <div>TEST</div>
          <div>TEST</div>
          <div>TEST</div>
          <div>TEST</div>
          <div>TEST</div>
          <div>TEST</div>
          <div>TEST</div>
        </Accordion>
        <Accordion
          isExpanded={expandedAccordion === 7}
          setExpandedAccordion={() => handleAccordionClick(7)}
          title="Commentaires"
        >
          <div>TEST</div>
          <div>TEST</div>
          <div>TEST</div>
          <div>TEST</div>
        </Accordion>
      </Column>
    </Container>
  )
}

const Container = styled(SideWindowContent)`
  display: flex;
  overflow-y: hidden;
  flex-direction: row;
`

const FirstColumn = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
  padding: 12px;
  padding-bottom: 100px;
`
const Column = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
  padding: 12px;
  padding-bottom: 100px;
  z-index: -1;
`
