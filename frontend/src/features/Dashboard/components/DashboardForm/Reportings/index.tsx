import { useGetReportingsByIdsQuery } from '@api/reportingsAPI'
import { pluralize } from '@mtes-mct/monitor-ui'
import { forwardRef, useEffect, useState } from 'react'

import { Accordion } from '../Accordion'
import { SelectedAccordion } from '../SelectedAccordion'
import { Filters } from './Filters'
import { Layer } from './Layer'

import type { Reporting } from 'domain/entities/reporting'

type ReportingsProps = {
  isExpanded: boolean
  isSelectedAccordionOpen: boolean
  reportings: Reporting[]
  selectedReportingIds: number[]
  setExpandedAccordion: () => void
}
export const Reportings = forwardRef<HTMLDivElement, ReportingsProps>(
  ({ isExpanded, isSelectedAccordionOpen, reportings, selectedReportingIds, setExpandedAccordion }, ref) => {
    const [isExpandedSelectedAccordion, setExpandedSelectedAccordion] = useState(false)

    useEffect(() => {
      if (isSelectedAccordionOpen) {
        setExpandedSelectedAccordion(isSelectedAccordionOpen)
      }
    }, [isSelectedAccordionOpen])

    const { data: selectedReportings } = useGetReportingsByIdsQuery(selectedReportingIds)

    return (
      <div>
        <Accordion
          isExpanded={isExpanded}
          setExpandedAccordion={setExpandedAccordion}
          title="Signalements"
          titleRef={ref}
        >
          <Filters />
          {reportings?.map(reporting => (
            <Layer key={reporting.id} isPinned={selectedReportingIds.includes(+reporting.id)} reporting={reporting} />
          ))}
        </Accordion>
        <SelectedAccordion
          isExpanded={isExpandedSelectedAccordion}
          isReadOnly={selectedReportingIds?.length === 0}
          setExpandedAccordion={() => setExpandedSelectedAccordion(!isExpandedSelectedAccordion)}
          title={`${selectedReportingIds?.length ?? 0} ${pluralize(
            'signalement',
            selectedReportingIds?.length ?? 0
          )} ${pluralize('sélectionné', selectedReportingIds?.length ?? 0)}`}
        >
          {Object.values(selectedReportings?.entities ?? []).map(reporting => (
            <Layer key={reporting.id} isSelected reporting={reporting} />
          ))}
        </SelectedAccordion>
      </div>
    )
  }
)
