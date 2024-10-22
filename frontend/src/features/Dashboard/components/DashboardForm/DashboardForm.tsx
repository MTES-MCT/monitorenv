import { RTK_DEFAULT_QUERY_OPTIONS } from '@api/constants'
import { useGetControlUnitsQuery } from '@api/controlUnitsAPI'
import { Dashboard } from '@features/Dashboard/types'
import { SideWindowContent } from '@features/SideWindow/style'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { isNotArchived } from '@utils/isNotArchived'
import { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

import { AccordionContent } from './Accordion'
import { Amps } from './Amps'
import { Comments } from './Comments'
import { ControlUnits } from './ControlUnits'
import { Footer } from './Footer'
import { RegulatoryAreas } from './RegulatoryAreas'
import { Reportings } from './Reportings'
import { AccordionContent as SelectedAccordionContent } from './SelectedAccordion'
import { TerritorialPressure } from './TerritorialPressure'
import { Toolbar } from './Toolbar'
import { VigilanceAreas } from './VigilanceAreas'
import { Weather } from './Weather'
import { dashboardActions, getFilteredReportings, type DashboardType } from '../../slice'

type DashboardProps = {
  dashboardForm: [string, DashboardType]
  isActive: boolean
}
export function DashboardForm({ dashboardForm: [key, dashboard], isActive }: DashboardProps) {
  const dispatch = useAppDispatch()
  const previewSelectionFilter = dashboard.filters.previewSelection ?? false

  const filteredReportings = useAppSelector(state => getFilteredReportings(state.dashboard))

  const { data: controlUnits } = useGetControlUnitsQuery(undefined, RTK_DEFAULT_QUERY_OPTIONS)
  const activeControlUnits = useMemo(() => controlUnits?.filter(isNotArchived), [controlUnits])
  const selectedReportings =
    dashboard.extractedArea?.reportings.filter(reporting => dashboard.dashboard.reportingIds.includes(+reporting.id)) ??
    []

  const firstColumnRef = useRef<HTMLDivElement>(null)
  const firstColumnWidth = firstColumnRef.current?.clientWidth ?? 0

  const containerRef = useRef<HTMLDivElement>(null)
  const regRef = useRef<HTMLDivElement>(null)
  const ampRef = useRef<HTMLDivElement>(null)
  const zdvRef = useRef<HTMLDivElement>(null)
  const [containerHeight, setContainerHeight] = useState<number | undefined>(undefined)
  const [regulatoryAreasHeight, setRegulatoryAreasHeight] = useState<number | undefined>(undefined)
  const [ampsHeight, setAmpsHeight] = useState<number | undefined>(undefined)
  const [vigilanceAreasHeight, setVigilanceAreasHeight] = useState<number | undefined>(undefined)

  const toolbarRef = useRef<HTMLDivElement>(null)
  const toolbarHeight = toolbarRef.current?.clientHeight ?? 0
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
        dispatch(dashboardActions.removeAllPreviewedItems())
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

  useEffect(() => {
    if (previewSelectionFilter) {
      setExpandedAccordionFirstColumn(undefined)
      setExpandedAccordionSecondColumn(undefined)
      setExpandedAccordionThirdColumn(undefined)
      dispatch(dashboardActions.setDashboardFilters({ previewSelection: false }))
    }
  }, [previewSelectionFilter, dispatch])

  useEffect(() => {
    if (isActive) {
      setContainerHeight(containerRef.current?.clientHeight)
    }
  }, [isActive])

  useEffect(() => {
    if (containerHeight && ampRef.current && zdvRef.current) {
      setRegulatoryAreasHeight(containerHeight - ampRef.current.clientHeight - zdvRef.current.clientHeight)
    }
    if (containerHeight && regRef.current && zdvRef.current) {
      setAmpsHeight(containerHeight - regRef.current.clientHeight - zdvRef.current.clientHeight)
    }
    if (containerHeight && regRef.current && ampRef.current) {
      setVigilanceAreasHeight(containerHeight - regRef.current.clientHeight - ampRef.current.clientHeight)
    }
  }, [containerHeight, setExpandedAccordionFirstColumn])

  return (
    <>
      {isActive && (
        <>
          <Toolbar ref={toolbarRef} dashboardForm={[key, dashboard]} geometry={dashboard.dashboard.geom} />

          <Container ref={containerRef}>
            <Column ref={firstColumnRef} $filterHeight={toolbarHeight}>
              <StyledRegulatoryAreas
                ref={regRef}
                $maxContentHeight={dashboard.extractedArea ? dashboard.extractedArea.regulatoryAreas.length * 10 : 0}
                $maxHeight={regulatoryAreasHeight}
                $maxSelectedHeight={dashboard.dashboard.regulatoryAreas.length * 10}
                columnWidth={firstColumnWidth}
                isExpanded={expandedAccordionFirstColumn === Dashboard.Block.REGULATORY_AREAS}
                isSelectedAccordionOpen={previewSelectionFilter}
                regulatoryAreas={dashboard.extractedArea?.regulatoryAreas}
                selectedRegulatoryAreaIds={dashboard.dashboard.regulatoryAreaIds}
                setExpandedAccordion={() => handleAccordionClick(Dashboard.Block.REGULATORY_AREAS)}
              />

              <StyledAmps
                ref={ampRef}
                $maxContentHeight={dashboard.extractedArea ? dashboard.extractedArea.amps.length * 10 : 0}
                $maxHeight={ampsHeight}
                $maxSelectedHeight={dashboard.dashboard.amps.length * 10}
                $top={regulatoryAreasHeight ?? 0}
                amps={dashboard.extractedArea?.amps}
                columnWidth={firstColumnWidth}
                isExpanded={expandedAccordionFirstColumn === Dashboard.Block.AMP}
                isSelectedAccordionOpen={previewSelectionFilter}
                selectedAmpIds={dashboard.dashboard.ampIds}
                setExpandedAccordion={() => handleAccordionClick(Dashboard.Block.AMP)}
              />
              <StyledVigilanceAreass
                ref={zdvRef}
                $maxContentHeight={dashboard.extractedArea ? dashboard.extractedArea.vigilanceAreas.length * 10 : 0}
                $maxHeight={vigilanceAreasHeight}
                $maxSelectedHeight={dashboard.dashboard.vigilanceAreas.length * 10}
                columnWidth={firstColumnWidth}
                isExpanded={expandedAccordionFirstColumn === Dashboard.Block.VIGILANCE_AREAS}
                isSelectedAccordionOpen={previewSelectionFilter}
                selectedVigilanceAreaIds={dashboard.dashboard.vigilanceAreaIds}
                setExpandedAccordion={() => handleAccordionClick(Dashboard.Block.VIGILANCE_AREAS)}
                vigilanceAreas={dashboard.extractedArea?.vigilanceAreas}
              />
            </Column>
            <Column $filterHeight={toolbarHeight}>
              <TerritorialPressure
                isExpanded={expandedAccordionSecondColumn === Dashboard.Block.TERRITORIAL_PRESSURE}
                setExpandedAccordion={() => handleAccordionClick(Dashboard.Block.TERRITORIAL_PRESSURE)}
              />

              <Reportings
                isExpanded={expandedAccordionSecondColumn === Dashboard.Block.REPORTINGS}
                isSelectedAccordionOpen={previewSelectionFilter}
                reportings={filteredReportings ?? []}
                selectedReportings={selectedReportings}
                setExpandedAccordion={() => handleAccordionClick(Dashboard.Block.REPORTINGS)}
              />
            </Column>
            <Column $filterHeight={toolbarHeight}>
              <ControlUnits
                controlUnits={activeControlUnits ?? []}
                isExpanded={expandedAccordionThirdColumn === Dashboard.Block.CONTROL_UNITS}
                isSelectedAccordionOpen={previewSelectionFilter}
                setExpandedAccordion={() => handleAccordionClick(Dashboard.Block.CONTROL_UNITS)}
              />
              <Comments
                comments={dashboard.dashboard.comments}
                isExpanded={expandedAccordionThirdColumn === Dashboard.Block.COMMENTS}
                setExpandedAccordion={() => handleAccordionClick(Dashboard.Block.COMMENTS)}
              />
              <Weather geom={dashboard.dashboard.geom} />
            </Column>
          </Container>
          <Footer />
        </>
      )}
    </>
  )
}

const Container = styled(SideWindowContent)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  // gap and padding are 3px less than the mockup because of box-shadow is hidden because of overflow @see AccordionWrapper
  column-gap: 45px;
  padding: 21px 21px 0 21px;
  position: relative;
  overflow: hidden;
`

const Column = styled.div<{ $filterHeight: number }>`
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: calc(
    100vh - 48px - 24px - 66px - ${p => p.$filterHeight}
  ); // 48px = navbar height, 24px = padding, 66px = bottom bar height, filterHeight is variable
  overflow-y: auto;

  scrollbar-gutter: stable;

  padding: 3px;
`

const StyledRegulatoryAreas = styled(RegulatoryAreas)<{
  $maxContentHeight: number | undefined
  $maxHeight: number | undefined
  $maxSelectedHeight: number | undefined
}>`
  // max-height: ${p => p.$maxHeight && p.$maxHeight}px;
  overflow-y: hidden;
  ${AccordionContent} {
    max-height: ${p => p.$maxContentHeight && p.$maxContentHeight}px;
    overflow-y: auto;
  }
  ${SelectedAccordionContent} {
    max-height: ${p => p.$maxSelectedHeight && p.$maxSelectedHeight}px;
  }
`

const StyledAmps = styled(Amps)<{
  $maxContentHeight: number | undefined
  $maxHeight: number | undefined
  $maxSelectedHeight: number | undefined
  $top: number
}>`
  // max-height: ${p => p.$maxHeight && p.$maxHeight}px;
  overflow-y: hidden;
  ${AccordionContent} {
    max-height: ${p => p.$maxContentHeight && p.$maxContentHeight}px;
    overflow-y: auto;
  }
  ${SelectedAccordionContent} {
    max-height: ${p => p.$maxSelectedHeight && p.$maxSelectedHeight}px;
  }
`

const StyledVigilanceAreass = styled(VigilanceAreas)<{
  $maxContentHeight: number | undefined
  $maxHeight: number | undefined
  $maxSelectedHeight: number | undefined
}>`
  // max-height: ${p => p.$maxHeight && p.$maxHeight}px;
  ${AccordionContent} {
    max-height: ${p => p.$maxContentHeight && p.$maxContentHeight}px;
    overflow-y: auto;
  }
  ${SelectedAccordionContent} {
    max-height: ${p => p.$maxSelectedHeight && p.$maxSelectedHeight}px;
  }
`
