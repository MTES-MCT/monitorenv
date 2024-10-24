import { useAppSelector } from '@hooks/useAppSelector'
import { ControlUnit, pluralize } from '@mtes-mct/monitor-ui'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { ControlUnitAccordion } from './ControlUnitAccordion'
import { SelectedAccordion } from '../../SelectedAccordion'

export function SelectedControlUnits({
  controlUnits,
  isSelectedAccordionOpen
}: {
  controlUnits: ControlUnit.ControlUnit[]
  isSelectedAccordionOpen: boolean
}) {
  const [isExpandedSelectedAccordion, setExpandedSelectedAccordion] = useState(false)
  const [controlUnitIdExpanded, setControlUnitIdExpanded] = useState<number | undefined>(undefined)

  const activeDashboardId = useAppSelector(state => state.dashboard.activeDashboardId)
  const selectedControlUnitIds = useAppSelector(state =>
    activeDashboardId ? state.dashboard.dashboards?.[activeDashboardId]?.dashboard.controlUnitIds : []
  )

  const expandedControlUnit = id => {
    if (id === controlUnitIdExpanded) {
      setControlUnitIdExpanded(undefined)

      return
    }
    setControlUnitIdExpanded(id)
  }

  useEffect(() => {
    if (isSelectedAccordionOpen) {
      setExpandedSelectedAccordion(isSelectedAccordionOpen)
    }
  }, [isSelectedAccordionOpen])

  return (
    <StyledSelectedAccordion
      className="control-units-selected-accordion"
      isExpanded={isExpandedSelectedAccordion}
      isReadOnly={selectedControlUnitIds?.length === 0}
      setExpandedAccordion={() => setExpandedSelectedAccordion(!isExpandedSelectedAccordion)}
      title={`${selectedControlUnitIds?.length ?? 0} ${pluralize(
        'unité',
        selectedControlUnitIds?.length ?? 0
      )} ${pluralize('sélectionnée', selectedControlUnitIds?.length ?? 0)}`}
    >
      {selectedControlUnitIds?.map(controlUnitId => {
        const controlUnit = controlUnits.find(({ id }) => id === controlUnitId)

        return (
          <ControlUnitAccordion
            key={controlUnit?.id}
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
