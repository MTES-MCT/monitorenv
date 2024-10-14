import { RTK_DEFAULT_QUERY_OPTIONS } from '@api/constants'
import { useGetControlUnitsQuery } from '@api/controlUnitsAPI'
import { Dashboard } from '@features/Dashboard/types'
import { SideWindowContent } from '@features/SideWindow/style'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Banner, Icon, Level, THEME } from '@mtes-mct/monitor-ui'
import { isNotArchived } from '@utils/isNotArchived'
import { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

import { Amps } from './Amps'
import { Comments } from './Comments'
import { ControlUnits } from './ControlUnits'
import { DashboardFilters } from './Filters'
import { Footer } from './Footer'
import { RegulatoryAreas } from './RegulatoryAreas'
import { Reportings } from './Reportings'
import { TerritorialPressure } from './TerritorialPressure'
import { VigilanceAreas } from './VigilanceAreas'
import { Weather } from './Weather'
import { dashboardActions, getFilteredReportings, type DashboardType } from '../../slice'

type DashboardProps = {
  dashboard: DashboardType
  isActive: boolean
}
export function DashboardForm({ dashboard, isActive }: DashboardProps) {
  const dispatch = useAppDispatch()
  const previewSelectionFilter = dashboard.filters.previewSelection ?? false

  const filteredReportings = useAppSelector(state => getFilteredReportings(state.dashboard))

  const { data: controlUnits } = useGetControlUnitsQuery(undefined, RTK_DEFAULT_QUERY_OPTIONS)
  const activeControlUnits = useMemo(() => controlUnits?.filter(isNotArchived), [controlUnits])

  const firstColumnRef = useRef<HTMLDivElement>(null)
  const firstColumnWidth = firstColumnRef.current?.clientWidth ?? 0

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

  return (
    <>
      {isActive && (
        <>
          {dashboard.isBannerDisplayed && (
            <Banner isClosable level={Level.SUCCESS} top="0" withAutomaticClosing>
              <Icon.Confirm color={THEME.color.mediumSeaGreen} />
              Le tableau de bord a bien été enregistré
            </Banner>
          )}

          <DashboardFilters />
          <Container>
            <Column ref={firstColumnRef}>
              <RegulatoryAreas
                columnWidth={firstColumnWidth}
                isExpanded={expandedAccordionFirstColumn === Dashboard.Block.REGULATORY_AREAS}
                isSelectedAccordionOpen={previewSelectionFilter}
                regulatoryAreas={dashboard.extractedArea?.regulatoryAreas}
                selectedRegulatoryAreaIds={dashboard.dashboard.regulatoryAreas}
                setExpandedAccordion={() => handleAccordionClick(Dashboard.Block.REGULATORY_AREAS)}
              />

              <Amps
                amps={dashboard.extractedArea?.amps}
                columnWidth={firstColumnWidth}
                isExpanded={expandedAccordionFirstColumn === Dashboard.Block.AMP}
                isSelectedAccordionOpen={previewSelectionFilter}
                selectedAmpIds={dashboard.dashboard.amps}
                setExpandedAccordion={() => handleAccordionClick(Dashboard.Block.AMP)}
              />
              <VigilanceAreas
                columnWidth={firstColumnWidth}
                isExpanded={expandedAccordionFirstColumn === Dashboard.Block.VIGILANCE_AREAS}
                isSelectedAccordionOpen={previewSelectionFilter}
                selectedVigilanceAreaIds={dashboard.dashboard.vigilanceAreas}
                setExpandedAccordion={() => handleAccordionClick(Dashboard.Block.VIGILANCE_AREAS)}
                vigilanceAreas={dashboard.extractedArea?.vigilanceAreas}
              />
            </Column>
            <Column>
              <TerritorialPressure
                isExpanded={expandedAccordionSecondColumn === Dashboard.Block.TERRITORIAL_PRESSURE}
                setExpandedAccordion={() => handleAccordionClick(Dashboard.Block.TERRITORIAL_PRESSURE)}
              />

              <Reportings
                isExpanded={expandedAccordionSecondColumn === Dashboard.Block.REPORTINGS}
                isSelectedAccordionOpen={previewSelectionFilter}
                reportings={filteredReportings ?? []}
                selectedReportings={dashboard.dashboard.reportings}
                setExpandedAccordion={() => handleAccordionClick(Dashboard.Block.REPORTINGS)}
              />
            </Column>
            <Column>
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
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: calc(100vh - 48px - 24px - 66px); // 48px = navbar height, 24px = padding, 66px = bottom bar height
  scrollbar-gutter: stable;
  overflow-y: auto;

  padding: 3px;
`
