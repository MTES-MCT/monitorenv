import { Dashboard } from '@features/Dashboard/types'
import { useAppSelector } from '@hooks/useAppSelector'
import { pluralize } from '@mtes-mct/monitor-ui'
import { type Reporting } from 'domain/entities/reporting'
import { useState } from 'react'
import styled from 'styled-components'

import { Filters } from './Filters'
import { Layer } from './Layer'
import { Accordion } from '../Accordion'
import { SelectedAccordion } from '../SelectedAccordion'

type ReportingsProps = {
  dashboardId: number
  isExpanded: boolean
  reportings: Reporting[] | undefined
  setExpandedAccordion: () => void
}
export function Reportings({ dashboardId, isExpanded, reportings, setExpandedAccordion }: ReportingsProps) {
  const selectedReportings = useAppSelector(
    state => state.dashboard.dashboards?.[dashboardId]?.[Dashboard.Block.REPORTINGS]
  )
  const [isExpandedSelectedAccordion, setExpandedSelectedAccordion] = useState(false)

  return (
    <div>
      <>
        <Accordion isExpanded={isExpanded} setExpandedAccordion={setExpandedAccordion} title="Signalements">
          <StyledFilters $isExpanded={isExpanded} />
          {reportings?.map(reporting => (
            <Layer key={reporting.id} dashboardId={dashboardId} reporting={reporting} />
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
            <Layer key={reporting.id} dashboardId={dashboardId} isSelected reporting={reporting} />
          ))}
        </SelectedAccordion>
      </>
    </div>
  )
}

const StyledFilters = styled(Filters)<{ $isExpanded: boolean }>`
  visibility: ${({ $isExpanded }) => ($isExpanded ? 'visible' : 'hidden')};
  max-height: ${({ $isExpanded }) => ($isExpanded ? '100vh' : '0px')};
  transition: ${({ $isExpanded }) =>
    $isExpanded ? '0.5s max-height ease-in, 0.5s visibility' : '0.3s max-height ease-out, 0.3s visibility'};
`
