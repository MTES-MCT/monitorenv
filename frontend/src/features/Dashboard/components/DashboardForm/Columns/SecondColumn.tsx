import { useObserverAccordion } from '@features/Dashboard/hooks/useObserverAccordion'
import { getFilteredReportings, type DashboardType } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { useAppSelector } from '@hooks/useAppSelector'
import { useEffect, useMemo, useRef, useState } from 'react'

import { Bookmark, type BookmarkType } from '../Bookmark'
import { Reportings } from '../Reportings'
import { getReportingFilters } from '../slice'
import { TerritorialPressure } from '../TerritorialPressure'
import { BaseColumn } from './style'
import { type ColumnProps } from './utils'
import { DashboardRecentActivity } from '../DashboardRecentActivity'

type SecondColumnProps = {
  dashboardForm: [string, DashboardType]
} & ColumnProps
export function SecondColumn({
  className,
  dashboardForm: [key, dashboard],
  expandedAccordion,
  isSelectedAccordionOpen,
  onExpandedAccordionClick
}: SecondColumnProps) {
  const [isMount, setIsMount] = useState<boolean>(false)
  const reportingFilters = useAppSelector(state => getReportingFilters(state.dashboardFilters, key))
  const filteredReportings = useAppSelector(state => getFilteredReportings(state.dashboard, reportingFilters))

  const columnRef = useRef<HTMLDivElement>(null)
  const territorialPressureRef = useRef<HTMLDivElement>(null)
  const recentActivityRef = useRef<HTMLDivElement>(null)
  const reportingRef = useRef<HTMLDivElement>(null)

  const [territorialPressionBookmark, setTerritorialPressionBookmark] = useState<BookmarkType>({
    ref: territorialPressureRef,
    title: 'Pression territoriale',
    visible: false
  })

  const [recentActivityBookmark, setRecentActivityBookmark] = useState<BookmarkType>({
    ref: recentActivityRef,
    title: 'Activité récente',
    visible: false
  })

  const [reportingBookmark, setReportingBookmark] = useState<BookmarkType>({
    ref: reportingRef,
    title: 'Signalements',
    visible: false
  })

  const topBookmarks = useMemo(
    () =>
      [territorialPressionBookmark, recentActivityBookmark, reportingBookmark].filter(
        bookmark => bookmark.visible && bookmark.orientation === 'top'
      ),
    [reportingBookmark, recentActivityBookmark, territorialPressionBookmark]
  )
  const bottomBookmarks = useMemo(
    () =>
      [territorialPressionBookmark, recentActivityBookmark].filter(
        bookmark => bookmark.visible && bookmark.orientation === 'bottom'
      ),
    [territorialPressionBookmark, recentActivityBookmark]
  )

  const [columnWidth, setColumnWidth] = useState<number | undefined>(undefined)

  useObserverAccordion(columnRef, [
    { ref: territorialPressureRef, setState: setTerritorialPressionBookmark },
    { ref: recentActivityRef, setState: setRecentActivityBookmark },
    { ref: reportingRef, setState: setReportingBookmark }
  ])

  useEffect(() => {
    setIsMount(true)
  }, [])

  useEffect(() => {
    if (isMount) {
      setColumnWidth(columnRef.current?.clientWidth)
    }
  }, [isMount])

  return (
    <>
      {isMount && (
        <BaseColumn ref={columnRef} className={className}>
          <Bookmark bottomBookmarks={bottomBookmarks} columnWidth={columnWidth} topBookmarks={topBookmarks} />

          <TerritorialPressure
            ref={territorialPressureRef}
            isExpanded={expandedAccordion === Dashboard.Block.TERRITORIAL_PRESSURE}
            setExpandedAccordion={() => onExpandedAccordionClick(Dashboard.Block.TERRITORIAL_PRESSURE)}
          />
          <DashboardRecentActivity
            ref={recentActivityRef}
            isExpanded={expandedAccordion === Dashboard.Block.RECENT_ACTIVITY}
            setExpandedAccordion={() => onExpandedAccordionClick(Dashboard.Block.RECENT_ACTIVITY)}
          />

          <Reportings
            ref={reportingRef}
            isExpanded={expandedAccordion === Dashboard.Block.REPORTINGS}
            isSelectedAccordionOpen={isSelectedAccordionOpen}
            reportings={filteredReportings ?? []}
            selectedReportingIds={dashboard.dashboard.reportingIds}
            setExpandedAccordion={() => onExpandedAccordionClick(Dashboard.Block.REPORTINGS)}
          />
        </BaseColumn>
      )}
    </>
  )
}
