import { Dashboard } from '@features/Dashboard/types'
import { useAppSelector } from '@hooks/useAppSelector'
import { ControlUnit, pluralize } from '@mtes-mct/monitor-ui'
import { useState } from 'react'
import styled from 'styled-components'

import { ControlUnitAccordion } from './ControlUnitAccordion'
import { SelectedAccordion } from '../../SelectedAccordion'

export function SelectedControlUnits({ controlUnits }: { controlUnits: ControlUnit.ControlUnit[] }) {
  const [isExpandedSelectedAccordion, setExpandedSelectedAccordion] = useState(false)
  const [controlUnitIdExpanded, setControlUnitIdExpanded] = useState<number | undefined>(undefined)

  const activeDashboardId = useAppSelector(state => state.dashboard.activeDashboardId)
  const selectedControlUnitIds = useAppSelector(state =>
    activeDashboardId ? state.dashboard.dashboards?.[activeDashboardId]?.[Dashboard.Block.CONTROL_UNITS] : []
  )

  const expandedControlUnit = id => {
    if (id === controlUnitIdExpanded) {
      setControlUnitIdExpanded(undefined)

      return
    }
    setControlUnitIdExpanded(id)
  }

  return (
    <StyledSelectedAccordion
      className="control-units-selected-accordion"
      isExpanded={isExpandedSelectedAccordion}
      isReadOnly={selectedControlUnitIds?.length === 0}
      setExpandedAccordion={() => setExpandedSelectedAccordion(!isExpandedSelectedAccordion)}
      title={`${selectedControlUnitIds?.length ?? 0} ${pluralize(
        'unité',
        selectedControlUnitIds?.length ?? 0
      )} ${pluralize('sélectionée', selectedControlUnitIds?.length ?? 0)}`}
    >
      {selectedControlUnitIds?.map(controlUnitId => {
        const controlUnit = controlUnits.find(({ id }) => id === controlUnitId)

        return (
          <ControlUnitAccordion
            controlUnit={controlUnit}
            controlUnitIdExpanded={controlUnitIdExpanded}
            expandUnit={expandedControlUnit}
          />
        )
      })}
    </StyledSelectedAccordion>
  )
}
const StyledSelectedAccordion = styled(SelectedAccordion)`
  gap: 2px;
`
