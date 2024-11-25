import { getFilteredReportings, type DashboardType } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { useAppSelector } from '@hooks/useAppSelector'
import { useEffect, useRef, useState } from 'react'

import { Bookmark, type BookmarkType } from '../Bookmark'
import { Reportings } from '../Reportings'
import { getReportingFilters } from '../slice'
import { TerritorialPressure } from '../TerritorialPressure'
import { useObserver } from '../useObserver'
import { BaseColumn } from './style'
import { type ColumnProps } from './utils'

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
  const reportingRef = useRef<HTMLDivElement>(null)

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

  const topBookmarks = [territorialPressionBookmark, reportingBookmark].filter(
    bookmark => bookmark.visible && bookmark.orientation === 'top'
  )
  const bottomBookmarks = [territorialPressionBookmark].filter(
    bookmark => bookmark.visible && bookmark.orientation === 'bottom'
  )

  const [columnWidth, setColumnWidth] = useState<number | undefined>(undefined)

  useObserver(columnRef, [
    { ref: territorialPressureRef, setState: setTerritorialPressionBookmark, state: territorialPressionBookmark },
    { ref: reportingRef, setState: setReportingBookmark, state: reportingBookmark }
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