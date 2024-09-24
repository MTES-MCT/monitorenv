import { Dashboard } from '@features/Dashboard/types'
import { SideWindowContent } from '@features/SideWindow/style'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { Accordion } from './Accordion'
import { RegulatoryAreas } from './RegulatoryAreas'
import { dashboardActions } from '../../slice'

export function DashboardForm() {
  const extractedArea = useAppSelector(state => state.dashboard.extractedArea)

  const dispatch = useAppDispatch()
  const dashboardId = 1 // TODO replace with real value
  const expandedAccordion = useAppSelector(state =>
    dashboardId ? state.dashboard.dashboards?.[dashboardId]?.openAccordion : undefined
  )

  const handleAccordionClick = (type: Dashboard.Block) => {
    if (expandedAccordion === type) {
      dispatch(dashboardActions.setDashboardAccordion())

      return
    }
    dispatch(dashboardActions.setDashboardAccordion(type))
    dispatch(dashboardActions.setDashboardPanel())
  }

  const clickOnEye = () => {}
  // TODO 20/09: use constant instead of number to define the accordion index

  return (
    <Container>
      <Column>
        <RegulatoryAreas
          dashboardId={dashboardId}
          isExpanded={expandedAccordion === Dashboard.Block.REGULATORY_AREAS}
          setExpandedAccordion={() => handleAccordionClick(Dashboard.Block.REGULATORY_AREAS)}
        />

        <Accordion
          isExpanded={expandedAccordion === Dashboard.Block.AMP}
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
          isExpanded={expandedAccordion === Dashboard.Block.VIGILANCE_AREAS}
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
          isExpanded={expandedAccordion === Dashboard.Block.TERRITORIAL_PRESSURE}
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
          isExpanded={expandedAccordion === Dashboard.Block.REPORTINGS}
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
          isExpanded={expandedAccordion === Dashboard.Block.CONTROL_UNITS}
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
          isExpanded={expandedAccordion === Dashboard.Block.COMMENTS}
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
  overflow-y: hidden;
  flex-direction: row;
`

const Column = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
  padding: 12px;
  padding-bottom: 100px;
`
