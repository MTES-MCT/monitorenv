import { Dashboard } from '@features/Dashboard/types'
import { SideWindowContent } from '@features/SideWindow/style'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, IconButton, Textarea } from '@mtes-mct/monitor-ui'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { Accordion } from './Accordion'
import { Amps } from './Amps'
import { RegulatoryAreas } from './RegulatoryAreas'
import { TerritorialPressure } from './TerritorialPressure'
import { VigilanceAreas } from './VigilanceAreas'
import { dashboardActions } from '../../slice'

export function DashboardForm() {
  const extractedArea = useAppSelector(state => state.dashboard.extractedArea)

  const firstColumnRef = useRef<HTMLDivElement>(null)
  const firstColumnWidth = firstColumnRef.current?.clientWidth

  const secondColumnRef = useRef<HTMLDivElement>(null)
  const secondColumnWidth = secondColumnRef.current?.clientWidth

  const dispatch = useAppDispatch()
  const dashboardId = 1 // TODO replace with real value
  const comments = useAppSelector(state => state.dashboard.dashboards?.[dashboardId]?.comments ?? undefined)

  const [expandedAccordionFirstColumn, setExpandedAccordionFirstColumn] = useState<Dashboard.Block | undefined>(
    undefined
  )
  const [expandedAccordionSecondColumn, setExpandedAccordionSecondColumn] = useState<Dashboard.Block | undefined>(
    undefined
  )
  const [expandedAccordionThirdColumn, setExpandedAccordionThirdColumn] = useState<Dashboard.Block | undefined>(
    undefined
  )

  const updateComments = (value: string | undefined) => {
    dispatch(dashboardActions.setComments(value))
  }

  const handleAccordionClick = (type: Dashboard.Block) => {
    switch (type) {
      case Dashboard.Block.REGULATORY_AREAS:
      case Dashboard.Block.AMP:
      case Dashboard.Block.VIGILANCE_AREAS:
        setExpandedAccordionFirstColumn(expandedAccordionFirstColumn === type ? undefined : type)
        dispatch(dashboardActions.setDashboardPanel())
        dispatch(dashboardActions.removeAllRegulatoryIdToDisplay())
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

  useEffect(() => {
    // remove openedPanel on mount
    dispatch(dashboardActions.setDashboardPanel())

    // cleanup preview on unmount
    return () => {
      dispatch(dashboardActions.removeAllPreviewedItems())
    }
  }, [dispatch])

  const clickOnEye = () => {}

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

        <Amps
          amps={extractedArea?.amps}
          dashboardId={dashboardId}
          isExpanded={expandedAccordionFirstColumn === Dashboard.Block.AMP}
          setExpandedAccordion={() => handleAccordionClick(Dashboard.Block.AMP)}
        />
        <VigilanceAreas
          columnWidth={firstColumnWidth ?? 0}
          dashboardId={dashboardId}
          isExpanded={expandedAccordionFirstColumn === Dashboard.Block.VIGILANCE_AREAS}
          setExpandedAccordion={() => handleAccordionClick(Dashboard.Block.VIGILANCE_AREAS)}
          vigilanceAreas={extractedArea?.vigilanceAreas}
        />
      </Column>
      <Column ref={secondColumnRef}>
        <TerritorialPressure
          columnWidth={(firstColumnWidth ?? 0) + (secondColumnWidth ?? 0)}
          isExpanded={expandedAccordionSecondColumn === Dashboard.Block.TERRITORIAL_PRESSURE}
          setExpandedAccordion={() => handleAccordionClick(Dashboard.Block.TERRITORIAL_PRESSURE)}
        />

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
          <StyledTextarea
            isLabelHidden
            label="Commentaires"
            name="comments"
            onChange={updateComments}
            value={comments}
          />
        </Accordion>
      </Column>
    </Container>
  )
}

const Container = styled(SideWindowContent)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  // gap and padding are 3px less than the mockup because of box-shadow is hidden because of overflow @see AccordionWrapper
  column-gap: 45px;
  padding: 21px 21px 0 21px;
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: calc(100vh - 48px - 24px); // 48px = navbar height, 24px = padding
  scrollbar-gutter: stable;
  overflow-y: auto;

  padding: 3px;
`
const StyledTextarea = styled(Textarea)`
  padding: 16px 24px;
`
