import {
  getFilteredAmps,
  getFilteredRegulatoryAreas,
  getFilteredVigilanceAreas,
  type DashboardType
} from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { useAppSelector } from '@hooks/useAppSelector'
import { useEffect, useRef, useState } from 'react'

import { Amps } from '../Amps'
import { Bookmark, type BookmarkType } from '../Bookmark'
import { RegulatoryAreas } from '../RegulatoryAreas'
import { VigilanceAreas } from '../VigilanceAreas'
import { BaseColumn } from './style'
import { type ColumnProps } from './utils'
import { useObserverAccordion } from '../useObserverAccordion'

import type { DashboardFilters } from '../slice'

type FirstColumnProps = {
  dashboard: DashboardType
  filters: DashboardFilters | undefined
} & ColumnProps
export function FirstColumn({
  className,
  dashboard,
  expandedAccordion,
  filters,
  isSelectedAccordionOpen,
  onExpandedAccordionClick
}: FirstColumnProps) {
  const [isMount, setIsMount] = useState<boolean>(false)
  const columnRef = useRef<HTMLDivElement>(null)
  const regulatoryAreaRef = useRef<HTMLDivElement>(null)
  const ampRef = useRef<HTMLDivElement>(null)
  const vigilanceAreaRef = useRef<HTMLDivElement>(null)

  const [regBookmark, setRegBookmark] = useState<BookmarkType>({
    ref: regulatoryAreaRef,
    title: 'Zones REG',
    visible: false
  })

  const [ampBookmark, setAmpBookmark] = useState<BookmarkType>({ ref: ampRef, title: 'Zones AMP', visible: false })

  const [vigilanceBookmark, setVigilanceBookmark] = useState<BookmarkType>({
    ref: vigilanceAreaRef,
    title: 'Zones de vigilance',
    visible: false
  })
  const topBookmarks = [regBookmark, ampBookmark, vigilanceBookmark].filter(
    bookmark => bookmark.visible && bookmark.orientation === 'top'
  )
  const bottomBookmarks = [regBookmark, ampBookmark, vigilanceBookmark].filter(
    bookmark => bookmark.visible && bookmark.orientation === 'bottom'
  )

  const filteredAmps = useAppSelector(state => getFilteredAmps(state.dashboard, filters?.amps))
  const filteredRegulatoryAreas = useAppSelector(state =>
    getFilteredRegulatoryAreas(state.dashboard, filters?.regulatoryThemes)
  )
  const filteredVigilanceAreas = useAppSelector(state => getFilteredVigilanceAreas(state.dashboard, filters))

  const [columnWidth, setColumnWidth] = useState<number | undefined>(undefined)

  useObserverAccordion(columnRef, [
    { ref: regulatoryAreaRef, setState: setRegBookmark },
    { ref: ampRef, setState: setAmpBookmark },
    { ref: vigilanceAreaRef, setState: setVigilanceBookmark }
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
          <RegulatoryAreas
            ref={regulatoryAreaRef}
            columnWidth={columnWidth ?? 0}
            isExpanded={expandedAccordion === Dashboard.Block.REGULATORY_AREAS}
            isSelectedAccordionOpen={isSelectedAccordionOpen}
            regulatoryAreas={filteredRegulatoryAreas ?? []}
            selectedRegulatoryAreaIds={dashboard.dashboard.regulatoryAreaIds}
            setExpandedAccordion={() => onExpandedAccordionClick(Dashboard.Block.REGULATORY_AREAS)}
          />

          <Amps
            ref={ampRef}
            amps={filteredAmps ?? []}
            columnWidth={columnWidth ?? 0}
            isExpanded={expandedAccordion === Dashboard.Block.AMP}
            isSelectedAccordionOpen={isSelectedAccordionOpen}
            selectedAmpIds={dashboard.dashboard.ampIds}
            setExpandedAccordion={() => onExpandedAccordionClick(Dashboard.Block.AMP)}
          />
          <VigilanceAreas
            ref={vigilanceAreaRef}
            columnWidth={columnWidth ?? 0}
            isExpanded={expandedAccordion === Dashboard.Block.VIGILANCE_AREAS}
            isSelectedAccordionOpen={isSelectedAccordionOpen}
            selectedVigilanceAreaIds={dashboard.dashboard.vigilanceAreaIds}
            setExpandedAccordion={() => onExpandedAccordionClick(Dashboard.Block.VIGILANCE_AREAS)}
            vigilanceAreas={filteredVigilanceAreas ?? []}
          />
        </BaseColumn>
      )}
    </>
  )
}
