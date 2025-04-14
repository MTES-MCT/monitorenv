import { RTK_DEFAULT_QUERY_OPTIONS } from '@api/constants'
import { useGetControlUnitsQuery } from '@api/controlUnitsAPI'
import { useObserverAccordion } from '@features/Dashboard/hooks/useObserverAccordion'
import { type DashboardType } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { isNotArchived } from '@utils/isNotArchived'
import { useEffect, useMemo, useRef, useState } from 'react'

import { Comments } from '../Comments'
import { ControlUnits } from '../ControlUnits'
import { Weather } from '../Weather'
import { BaseColumn } from './style'
import { type ColumnProps } from './utils'
import { Attachments } from '../Attachments'
import { type BookmarkType, Bookmark } from '../Bookmark'

type ThirdColumnProps = {
  dashboardForm: [string, DashboardType]
} & ColumnProps
export function ThirdColumn({
  className,
  dashboardForm: [key, dashboard],
  expandedAccordion,
  isSelectedAccordionOpen,
  onExpandedAccordionClick
}: ThirdColumnProps) {
  const [isMount, setIsMount] = useState<boolean>(false)
  const { data: controlUnits } = useGetControlUnitsQuery(undefined, RTK_DEFAULT_QUERY_OPTIONS)
  const activeControlUnits = useMemo(() => controlUnits?.filter(isNotArchived), [controlUnits])

  const columnRef = useRef<HTMLDivElement>(null)

  const controlUnitRef = useRef<HTMLDivElement>(null)
  const commentsRef = useRef<HTMLDivElement>(null)
  const weatherRef = useRef<HTMLDivElement>(null)
  const attachmentsRef = useRef<HTMLDivElement>(null)

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
  const [attachmentsBookmark, setAttachmentsBookmark] = useState<BookmarkType>({
    ref: attachmentsRef,
    title: 'Pièces jointes',
    visible: false
  })
  const topBookmarks = [controlUnitBookmark, commentsBookmark, attachmentsBookmark, weatherBookmark].filter(
    bookmark => bookmark.visible && bookmark.orientation === 'top'
  )
  const bottomBookmarks = [controlUnitBookmark, commentsBookmark, attachmentsBookmark, weatherBookmark].filter(
    bookmark => bookmark.visible && bookmark.orientation === 'bottom'
  )

  const [columnWidth, setColumnWidth] = useState<number | undefined>(undefined)

  useObserverAccordion(columnRef, [
    { ref: controlUnitRef, setState: setControlUnitBookmark },
    { ref: commentsRef, setState: setCommentsBookmark },
    { ref: weatherRef, setState: setWeatherBookmark },
    { ref: attachmentsRef, setState: setAttachmentsBookmark }
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

          <ControlUnits
            ref={controlUnitRef}
            controlUnits={activeControlUnits ?? []}
            isExpanded={expandedAccordion === Dashboard.Block.CONTROL_UNITS}
            isSelectedAccordionOpen={isSelectedAccordionOpen}
            setExpandedAccordion={() => onExpandedAccordionClick(Dashboard.Block.CONTROL_UNITS)}
          />
          <Comments
            ref={commentsRef}
            comments={dashboard.dashboard.comments}
            dashboardKey={key}
            isExpanded={expandedAccordion === Dashboard.Block.COMMENTS}
            setExpandedAccordion={() => onExpandedAccordionClick(Dashboard.Block.COMMENTS)}
          />
          <Attachments
            ref={attachmentsRef}
            images={dashboard.dashboard.images}
            isExpanded={expandedAccordion === Dashboard.Block.ATTACHMENTS}
            links={dashboard.dashboard.links}
            setExpandedAccordion={() => onExpandedAccordionClick(Dashboard.Block.ATTACHMENTS)}
          />
          <Weather ref={weatherRef} geom={dashboard.dashboard.geom} />
        </BaseColumn>
      )}
    </>
  )
}
