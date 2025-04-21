import { Tooltip } from '@components/Tooltip'
import { pluralize } from '@mtes-mct/monitor-ui'
import { forwardRef } from 'react'
import styled from 'styled-components'

import { Accordion, Title } from '../Accordion'
import { Filters } from './Filters'
import { SelectedAccordion } from '../SelectedAccordion'

type RecentActivityProps = {
  isExpanded: boolean
  setExpandedAccordion: () => void
}

export const DashboardRecentActivity = forwardRef<HTMLDivElement, RecentActivityProps>(
  ({ isExpanded, setExpandedAccordion }, ref) => {
    // TODO: Replace with actual data fetching logic
    const totalControls = [1, 2, 3, 4, 5]

    // TODO : Replace with good wording
    const titleWithTooltip = (
      <TitleContainer>
        <Title>Activité récente</Title>
        <Tooltip isSideWindow>XXXXXXX - A remplir</Tooltip>
      </TitleContainer>
    )

    return (
      <div>
        <Accordion
          isExpanded={isExpanded}
          name="Activité récente"
          setExpandedAccordion={setExpandedAccordion}
          title={titleWithTooltip}
          titleRef={ref}
        >
          <Filters />
        </Accordion>
        <SelectedAccordion
          isExpanded={false}
          isReadOnly
          title={`${totalControls?.length ?? 0} ${pluralize('contrôle', totalControls?.length ?? 0)} `}
        />
      </div>
    )
  }
)
const TitleContainer = styled.div`
  display: flex;
  gap: 8px;
`
