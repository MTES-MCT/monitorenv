import { pluralize } from '@mtes-mct/monitor-ui'
import { type Reporting } from 'domain/entities/reporting'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { Accordion } from '../Accordion'
import { SelectedAccordion } from '../SelectedAccordion'
import { Filters } from './Filters'
import { Layer } from './Layer'

type ReportingsProps = {
  isExpanded: boolean
  isSelectedAccordionOpen: boolean
  reportings: Reporting[] | undefined
  selectedReportings: Reporting[]
  setExpandedAccordion: () => void
}
export function Reportings({
  isExpanded,
  isSelectedAccordionOpen,
  reportings,
  selectedReportings,
  setExpandedAccordion
}: ReportingsProps) {
  const [isExpandedSelectedAccordion, setExpandedSelectedAccordion] = useState(false)

  useEffect(() => {
    if (isSelectedAccordionOpen) {
      setExpandedSelectedAccordion(isSelectedAccordionOpen)
    }
  }, [isSelectedAccordionOpen])

  return (
    <div>
      <Accordion isExpanded={isExpanded} setExpandedAccordion={setExpandedAccordion} title="Signalements">
        <StyledFilters $isExpanded={isExpanded} />
        {reportings?.map(reporting => (
          <Layer key={reporting.id} isPinned={selectedReportings.includes(reporting)} reporting={reporting} />
        ))}
      </Accordion>
      <SelectedAccordion
        isExpanded={isExpandedSelectedAccordion}
        isReadOnly={selectedReportings?.length === 0}
        setExpandedAccordion={() => setExpandedSelectedAccordion(!isExpandedSelectedAccordion)}
        title={`${selectedReportings?.length ?? 0} ${pluralize(
          'signalement',
          selectedReportings?.length ?? 0
        )} ${pluralize('sélectionné', selectedReportings?.length ?? 0)}`}
      >
        {selectedReportings?.map(reporting => (
          <Layer key={reporting.id} isSelected reporting={reporting} />
        ))}
      </SelectedAccordion>
    </div>
  )
}

const StyledFilters = styled(Filters)<{ $isExpanded: boolean }>`
  visibility: ${({ $isExpanded }) => ($isExpanded ? 'visible' : 'hidden')};
  max-height: ${({ $isExpanded }) => ($isExpanded ? '100vh' : '0px')};
  transition: ${({ $isExpanded }) =>
    $isExpanded ? '0.5s max-height ease-in, 0.5s visibility' : '0.3s max-height ease-out, 0.3s visibility'};
`
