import { RTK_DEFAULT_QUERY_OPTIONS } from '@api/constants'
import { useGetControlUnitsQuery } from '@api/controlUnitsAPI'
import { Dashboard } from '@features/Dashboard/types'
import { SideWindowContent } from '@features/SideWindow/style'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Button, Icon } from '@mtes-mct/monitor-ui'
import { isNotArchived } from '@utils/isNotArchived'
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
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
import { useObserver } from './useObserver'
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

export type BookmarkType = {
  orientation?: 'top' | 'bottom'
  ref: RefObject<HTMLDivElement>
  title: string
  visible: boolean
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
  const [secondColumnWidth, setSecondColumnWidth] = useState<number | undefined>(undefined)
  const [thirdColumnWidth, setThirdColumnWidth] = useState<number | undefined>(undefined)

  const firstColumnRef = useRef<HTMLDivElement>(null)
  const secondColumnRef = useRef<HTMLDivElement>(null)
  const thirdColumnRef = useRef<HTMLDivElement>(null)
  const regulatoryAreaRef = useRef<HTMLDivElement>(null)
  const ampRef = useRef<HTMLDivElement>(null)
  const vigilanceAreaRef = useRef<HTMLDivElement>(null)
  const territorialPressureRef = useRef<HTMLDivElement>(null)
  const reportingRef = useRef<HTMLDivElement>(null)
  const controlUnitRef = useRef<HTMLDivElement>(null)
  const commentsRef = useRef<HTMLDivElement>(null)
  const weatherRef = useRef<HTMLDivElement>(null)

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

  const [regBookmark, setRegBookmark] = useState<BookmarkType>({
    ref: regulatoryAreaRef,
    title: 'Zones REG',
    visible: false
  })

  const [ampBookMark, setAmpBookmark] = useState<BookmarkType>({ ref: ampRef, title: 'Zones AMP', visible: false })

  const [vigilanceBookMark, setVigilanceBookmark] = useState<BookmarkType>({
    ref: vigilanceAreaRef,
    title: 'Zones de vigilance',
    visible: false
  })

  const [territorialPressionBookmark, setTerritorialPressionBookmark] = useState<BookmarkType>({
    ref: territorialPressureRef,
    title: 'Pression territoriale',
    visible: false
  })

  const [reportingBookmark, setReportingBookmark] = useState<BookmarkType>({
    ref: reportingRef,
    title: 'Signalements',
    visible: false
  })

  const [controlUnitBookmark, setControlUnitBookmark] = useState<BookmarkType>({
    ref: controlUnitRef,
    title: 'Unités',
    visible: false
  })

  const [commentsBookmark, setCommentsBookmark] = useState<BookmarkType>({
    ref: commentsRef,
    title: 'Commentaires',
    visible: false
  })

  const [weatherBookmark, setWeatherBookmark] = useState<BookmarkType>({
    ref: weatherRef,
    title: 'Météo',
    visible: false
  })

  const firstColumnTopBookmarks = [regBookmark, ampBookMark, vigilanceBookMark].filter(
    bookmark => bookmark.visible && bookmark.orientation === 'top'
  )
  const firstColumnBottomBookmarks = [regBookmark, ampBookMark, vigilanceBookMark].filter(
    bookmark => bookmark.visible && bookmark.orientation === 'bottom'
  )

  const secondColumnTopBookmarks = [territorialPressionBookmark, reportingBookmark].filter(
    bookmark => bookmark.visible && bookmark.orientation === 'top'
  )
  const secondColumnBottomBookmarks = [territorialPressionBookmark].filter(
    bookmark => bookmark.visible && bookmark.orientation === 'bottom'
  )

  const thirdColumnTopBookmarks = [controlUnitBookmark, commentsBookmark, weatherBookmark].filter(
    bookmark => bookmark.visible && bookmark.orientation === 'top'
  )
  const thirdColumnBottomBookmarks = [commentsBookmark, weatherBookmark].filter(
    bookmark => bookmark.visible && bookmark.orientation === 'bottom'
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
      setSecondColumnWidth(secondColumnRef.current?.clientWidth)
      setThirdColumnWidth(thirdColumnRef.current?.clientWidth)
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

  const scrollToSection = (sectionRef: RefObject<HTMLDivElement>) => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  useObserver(firstColumnRef, [
    { ref: regulatoryAreaRef, setState: setRegBookmark, state: regBookmark },
    { ref: ampRef, setState: setAmpBookmark, state: ampBookMark },
    { ref: vigilanceAreaRef, setState: setVigilanceBookmark, state: vigilanceBookMark }
  ])

  useObserver(secondColumnRef, [
    { ref: territorialPressureRef, setState: setTerritorialPressionBookmark, state: territorialPressionBookmark },
    { ref: reportingRef, setState: setReportingBookmark, state: reportingBookmark }
  ])

  useObserver(thirdColumnRef, [
    { ref: controlUnitRef, setState: setControlUnitBookmark, state: controlUnitBookmark },
    { ref: commentsRef, setState: setCommentsBookmark, state: commentsBookmark },
    { ref: weatherRef, setState: setWeatherBookmark, state: weatherBookmark }
  ])

  return (
    <>
      {isActive && (
        <>
          <Toolbar ref={toolbarRef} dashboardForm={[key, dashboard]} geometry={dashboard.dashboard.geom} />

          <Container>
            <Column ref={firstColumnRef} $filterHeight={toolbarHeight}>
              <Bookmark $left={firstColumnWidth ?? 0}>
                {firstColumnTopBookmarks.map(bookmark => (
                  <ButtonUp
                    key={bookmark.title}
                    accent={Accent.TERTIARY}
                    Icon={Icon.DoubleChevron}
                    onClick={() => scrollToSection(bookmark.ref)}
                  >
                    {bookmark.title}
                  </ButtonUp>
                ))}
              </Bookmark>
              <BottomBookmark $left={firstColumnWidth ?? 0}>
                {firstColumnBottomBookmarks.map(bookmark => (
                  <ButtonDown
                    key={bookmark.title}
                    accent={Accent.TERTIARY}
                    Icon={Icon.DoubleChevron}
                    onClick={() => scrollToSection(bookmark.ref)}
                  >
                    {bookmark.title}
                  </ButtonDown>
                ))}
              </BottomBookmark>
              <RegulatoryAreas
                ref={regulatoryAreaRef}
                columnWidth={firstColumnWidth ?? 0}
                isExpanded={expandedAccordionFirstColumn === Dashboard.Block.REGULATORY_AREAS}
                isSelectedAccordionOpen={previewSelectionFilter}
                regulatoryAreas={filteredRegulatoryAreas ?? []}
                selectedRegulatoryAreaIds={dashboard.dashboard.regulatoryAreaIds}
                setExpandedAccordion={() => handleAccordionClick(Dashboard.Block.REGULATORY_AREAS)}
              />

              <Amps
                ref={ampRef}
                amps={filteredAmps ?? []}
                columnWidth={firstColumnWidth ?? 0}
                isExpanded={expandedAccordionFirstColumn === Dashboard.Block.AMP}
                isSelectedAccordionOpen={previewSelectionFilter}
                selectedAmpIds={dashboard.dashboard.ampIds}
                setExpandedAccordion={() => handleAccordionClick(Dashboard.Block.AMP)}
              />
              <VigilanceAreas
                ref={vigilanceAreaRef}
                columnWidth={firstColumnWidth ?? 0}
                isExpanded={expandedAccordionFirstColumn === Dashboard.Block.VIGILANCE_AREAS}
                isSelectedAccordionOpen={previewSelectionFilter}
                selectedVigilanceAreaIds={dashboard.dashboard.vigilanceAreaIds}
                setExpandedAccordion={() => handleAccordionClick(Dashboard.Block.VIGILANCE_AREAS)}
                vigilanceAreas={filteredVigilanceAreas ?? []}
              />
            </Column>
            <Column ref={secondColumnRef} $filterHeight={toolbarHeight}>
              <Bookmark $left={secondColumnWidth ?? 0}>
                {secondColumnTopBookmarks.map(bookmark => (
                  <ButtonUp
                    key={bookmark.title}
                    accent={Accent.TERTIARY}
                    Icon={Icon.DoubleChevron}
                    onClick={() => scrollToSection(bookmark.ref)}
                  >
                    {bookmark.title}
                  </ButtonUp>
                ))}
              </Bookmark>
              <BottomBookmark $left={secondColumnWidth ?? 0}>
                {secondColumnBottomBookmarks.map(bookmark => (
                  <ButtonDown
                    key={bookmark.title}
                    accent={Accent.TERTIARY}
                    Icon={Icon.DoubleChevron}
                    onClick={() => scrollToSection(bookmark.ref)}
                  >
                    {bookmark.title}
                  </ButtonDown>
                ))}
              </BottomBookmark>
              <TerritorialPressure
                ref={territorialPressureRef}
                isExpanded={expandedAccordionSecondColumn === Dashboard.Block.TERRITORIAL_PRESSURE}
                setExpandedAccordion={() => handleAccordionClick(Dashboard.Block.TERRITORIAL_PRESSURE)}
              />

              <Reportings
                ref={reportingRef}
                isExpanded={expandedAccordionSecondColumn === Dashboard.Block.REPORTINGS}
                isSelectedAccordionOpen={previewSelectionFilter}
                reportings={filteredReportings ?? []}
                selectedReportingIds={dashboard.dashboard.reportingIds}
                setExpandedAccordion={() => handleAccordionClick(Dashboard.Block.REPORTINGS)}
              />
            </Column>
            <Column ref={thirdColumnRef} $filterHeight={toolbarHeight}>
              <Bookmark $left={thirdColumnWidth ?? 0}>
                {thirdColumnTopBookmarks.map(bookmark => (
                  <ButtonUp
                    key={bookmark.title}
                    accent={Accent.TERTIARY}
                    Icon={Icon.DoubleChevron}
                    onClick={() => scrollToSection(bookmark.ref)}
                  >
                    {bookmark.title}
                  </ButtonUp>
                ))}
              </Bookmark>
              <BottomBookmark $left={thirdColumnWidth ?? 0}>
                {thirdColumnBottomBookmarks.map(bookmark => (
                  <ButtonDown
                    key={bookmark.title}
                    accent={Accent.TERTIARY}
                    Icon={Icon.DoubleChevron}
                    onClick={() => scrollToSection(bookmark.ref)}
                  >
                    {bookmark.title}
                  </ButtonDown>
                ))}
              </BottomBookmark>
              <ControlUnits
                ref={controlUnitRef}
                controlUnits={activeControlUnits ?? []}
                isExpanded={expandedAccordionThirdColumn === Dashboard.Block.CONTROL_UNITS}
                isSelectedAccordionOpen={previewSelectionFilter}
                setExpandedAccordion={() => handleAccordionClick(Dashboard.Block.CONTROL_UNITS)}
              />
              <Comments
                ref={commentsRef}
                comments={dashboard.dashboard.comments}
                dashboardKey={key}
                isExpanded={expandedAccordionThirdColumn === Dashboard.Block.COMMENTS}
                setExpandedAccordion={() => handleAccordionClick(Dashboard.Block.COMMENTS)}
              />
              <Weather ref={weatherRef} geom={dashboard.dashboard.geom} />
            </Column>
          </Container>
          <Footer dashboard={dashboard.dashboard} defaultName={dashboard.defaultName} />
        </>
      )}
    </>
  )
}

const Container = styled(SideWindowContent)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  // gap and padding are 8px less than the mockup because of box-shadow is hidden because of overflow @see AccordionWrapper
  column-gap: 40px;
  padding: 16px 16px 0 16px;
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

  padding: 8px;
`

const ButtonDown = styled(Button)`
  box-shadow: 0px 3px 6px ${p => p.theme.color.gainsboro};
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  gap: 24px;
`

const ButtonUp = styled(ButtonDown)`
  .Element-IconBox {
    transform: rotate(180deg);
  }
`

const Bookmark = styled.div<{ $left: number }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  font-weight: bold;
  font-style: italic;
  margin-left: ${({ $left }) => `${$left}`};
  transform: translateX(-100%);
  margin-top: -24px;
  position: fixed;
  box-shadow: 0px 3px 6px ${p => p.theme.color.gainsboro};
  z-index: 1000;
`

const BottomBookmark = styled(Bookmark)`
  bottom: 66px;
`
