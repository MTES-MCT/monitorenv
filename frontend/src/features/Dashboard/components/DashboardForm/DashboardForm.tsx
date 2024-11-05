import { RTK_DEFAULT_QUERY_OPTIONS } from '@api/constants'
import { useGetControlUnitsQuery } from '@api/controlUnitsAPI'
import { Dashboard } from '@features/Dashboard/types'
import { SideWindowContent } from '@features/SideWindow/style'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { isNotArchived } from '@utils/isNotArchived'
import { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

import { Amps } from './Amps'
import { Comments } from './Comments'
import { ControlUnits } from './ControlUnits'
import { Footer } from './Footer'
import { RegulatoryAreas } from './RegulatoryAreas'
import { Reportings } from './Reportings'
import { dashboardFiltersActions, getReportingFilters } from './slice'
import { TerritorialPressure } from './TerritorialPressure'
import { Toolbar } from './Toolbar'
import { VigilanceAreas } from './VigilanceAreas'
import { Weather } from './Weather'
import {
  dashboardActions,
  getFilteredAmps,
  getFilteredRegulatoryAreas,
  getFilteredReportings,
  getFilteredVigilanceAreas,
  type DashboardType
} from '../../slice'

type DashboardProps = {
  dashboardForm: [string, DashboardType]
  isActive: boolean
}
export function DashboardForm({ dashboardForm: [key, dashboard], isActive }: DashboardProps) {
  const dispatch = useAppDispatch()

  const filters = useAppSelector(state => state.dashboardFilters?.dashboards[key]?.filters)
  const previewSelectionFilter = filters?.previewSelection ?? false

  const filteredAmps = useAppSelector(state => getFilteredAmps(state.dashboard, filters?.amps))
  const filteredRegulatoryAreas = useAppSelector(state =>
    getFilteredRegulatoryAreas(state.dashboard, filters?.regulatoryThemes)
  )
  const filteredVigilanceAreas = useAppSelector(state => getFilteredVigilanceAreas(state.dashboard, filters))

  const reportingFilters = useAppSelector(state => getReportingFilters(state.dashboardFilters, key))
  const filteredReportings = useAppSelector(state => getFilteredReportings(state.dashboard, reportingFilters))

  const { data: controlUnits } = useGetControlUnitsQuery(undefined, RTK_DEFAULT_QUERY_OPTIONS)
  const activeControlUnits = useMemo(() => controlUnits?.filter(isNotArchived), [controlUnits])
  const [firstColumnWidth, setFirstColumnWidth] = useState<number | undefined>(undefined)

  const firstColumnRef = useRef<HTMLDivElement>(null)

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
    if (isActive) {
      setFirstColumnWidth(firstColumnRef.current?.clientWidth)
    }
  }, [isActive])

  useEffect(() => {
    // remove openedPanel on mount
    dispatch(dashboardActions.setDashboardPanel())

    // cleanup preview on unmount
    return () => {
      dispatch(dashboardActions.removeAllPreviewedItems())
      dispatch(dashboardActions.setActiveDashboardId(undefined))
    }
  }, [dispatch])

  useEffect(() => {
    if (previewSelectionFilter) {
      setExpandedAccordionFirstColumn(undefined)
      setExpandedAccordionSecondColumn(undefined)
      setExpandedAccordionThirdColumn(undefined)
      dispatch(dashboardFiltersActions.setFilters({ filters: { previewSelection: false }, id: key }))
    }
  }, [previewSelectionFilter, dispatch, key])

  return (
    <>
      {isActive && (
        <>
          <Toolbar ref={toolbarRef} dashboardForm={[key, dashboard]} geometry={dashboard.dashboard.geom} />

          <Container>
            <Column ref={firstColumnRef} $filterHeight={toolbarHeight}>
              <RegulatoryAreas
                columnWidth={firstColumnWidth ?? 0}
                isExpanded={expandedAccordionFirstColumn === Dashboard.Block.REGULATORY_AREAS}
                isSelectedAccordionOpen={previewSelectionFilter}
                regulatoryAreas={filteredRegulatoryAreas ?? []}
                selectedRegulatoryAreaIds={dashboard.dashboard.regulatoryAreaIds}
                setExpandedAccordion={() => handleAccordionClick(Dashboard.Block.REGULATORY_AREAS)}
              />

              <Amps
                amps={filteredAmps ?? []}
                columnWidth={firstColumnWidth ?? 0}
                isExpanded={expandedAccordionFirstColumn === Dashboard.Block.AMP}
                isSelectedAccordionOpen={previewSelectionFilter}
                selectedAmpIds={dashboard.dashboard.ampIds}
                setExpandedAccordion={() => handleAccordionClick(Dashboard.Block.AMP)}
              />
              <VigilanceAreas
                columnWidth={firstColumnWidth ?? 0}
                isExpanded={expandedAccordionFirstColumn === Dashboard.Block.VIGILANCE_AREAS}
                isSelectedAccordionOpen={previewSelectionFilter}
                selectedVigilanceAreaIds={dashboard.dashboard.vigilanceAreaIds}
                setExpandedAccordion={() => handleAccordionClick(Dashboard.Block.VIGILANCE_AREAS)}
                vigilanceAreas={filteredVigilanceAreas ?? []}
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
                selectedReportingIds={dashboard.dashboard.reportingIds}
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
  scrollbar-gutter: stable;
  overflow-y: auto;

  padding: 3px;
`
