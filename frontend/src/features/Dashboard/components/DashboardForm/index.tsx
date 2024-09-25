import { Dashboard } from '@features/Dashboard/types'
import { SideWindowContent } from '@features/SideWindow/style'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import { useRef, useState } from 'react'
import styled from 'styled-components'

import { Accordion } from './Accordion'
import { RegulatoryAreas } from './RegulatoryAreas'
import { dashboardActions } from '../../slice'

export function DashboardForm() {
  const extractedArea = useAppSelector(state => state.dashboard.extractedArea)

  const firstColumnRef = useRef<HTMLDivElement>(null)
  const firstColumnWidth = firstColumnRef.current?.clientWidth

  const dispatch = useAppDispatch()
  const dashboardId = 1 // TODO replace with real value
  const [expandedAccordionFirstColumn, setExpandedAccordionFirstColumn] = useState<Dashboard.Block | undefined>(
    undefined
  )
  const [expandedAccordionSecondColumn, setExpandedAccordionSecondColumn] = useState<Dashboard.Block | undefined>(
    undefined
  )
  const [expandedAccordionThirdColumn, setExpandedAccordionThirdColumn] = useState<Dashboard.Block | undefined>(
    undefined
  )

  const handleAccordionClick = (type: Dashboard.Block) => {
    switch (type) {
      case Dashboard.Block.REGULATORY_AREAS:
      case Dashboard.Block.AMP:
      case Dashboard.Block.VIGILANCE_AREAS:
        setExpandedAccordionFirstColumn(expandedAccordionFirstColumn === type ? undefined : type)
        dispatch(dashboardActions.setDashboardPanel())
        break
      case Dashboard.Block.TERRITORIAL_PRESSURE:
      case Dashboard.Block.REPORTINGS:
        setExpandedAccordionSecondColumn(expandedAccordionSecondColumn === type ? undefined : type)
        break
      case Dashboard.Block.CONTROL_UNITS:
      case Dashboard.Block.COMMENTS:
        setExpandedAccordionThirdColumn(expandedAccordionThirdColumn === type ? undefined : type)
        break
      default:
        break
    }
  }

  const clickOnEye = () => {}
  // TODO 20/09: use constant instead of number to define the accordion index

  return (
    <Container>
      <Column ref={firstColumnRef}>
        <RegulatoryAreas
          columnWidth={firstColumnWidth ?? 0}
          dashboardId={dashboardId}
          isExpanded={expandedAccordionFirstColumn === Dashboard.Block.REGULATORY_AREAS}
          regulatoryAreas={extractedArea?.regulatoryAreas}
          setExpandedAccordion={() => handleAccordionClick(Dashboard.Block.REGULATORY_AREAS)}
        />

        <Accordion
          isExpanded={expandedAccordionFirstColumn === Dashboard.Block.AMP}
          setExpandedAccordion={() => handleAccordionClick(Dashboard.Block.AMP)}
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
          isExpanded={expandedAccordionFirstColumn === Dashboard.Block.VIGILANCE_AREAS}
          setExpandedAccordion={() => handleAccordionClick(Dashboard.Block.VIGILANCE_AREAS)}
          title="Zones de vigilance"
        >
          <div>TEST</div>
          <div>TEST</div>
          <div>TEST</div>
          <div>TEST</div>
        </Accordion>
      </Column>
      <Column>
        <Accordion
          isExpanded={expandedAccordionSecondColumn === Dashboard.Block.TERRITORIAL_PRESSURE}
          setExpandedAccordion={() => handleAccordionClick(Dashboard.Block.TERRITORIAL_PRESSURE)}
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
          isExpanded={expandedAccordionSecondColumn === Dashboard.Block.REPORTINGS}
          setExpandedAccordion={() => handleAccordionClick(Dashboard.Block.REPORTINGS)}
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
          isExpanded={expandedAccordionThirdColumn === Dashboard.Block.CONTROL_UNITS}
          setExpandedAccordion={() => handleAccordionClick(Dashboard.Block.CONTROL_UNITS)}
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
          isExpanded={expandedAccordionThirdColumn === Dashboard.Block.COMMENTS}
          setExpandedAccordion={() => handleAccordionClick(Dashboard.Block.COMMENTS)}
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
  flex-direction: row;
`

const Column = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 16px;
  height: calc(100vh- 48px - 40px); // 48px = navbar height, 40px = padding
  overflow-y: auto;
  overflow-x: visible;
  padding: 12px;
`
