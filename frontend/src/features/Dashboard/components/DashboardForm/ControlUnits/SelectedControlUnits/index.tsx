import { ControlUnit, pluralize } from '@mtes-mct/monitor-ui'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { ControlUnitAccordion } from './ControlUnitAccordion'
import { SelectedAccordion } from '../../SelectedAccordion'

export function SelectedControlUnits({
  isSelectedAccordionOpen,
  selectedControlUnits
}: {
  isSelectedAccordionOpen: boolean
  selectedControlUnits: ControlUnit.ControlUnit[]
}) {
  const [isExpandedSelectedAccordion, setExpandedSelectedAccordion] = useState(false)
  const [controlUnitIdExpanded, setControlUnitIdExpanded] = useState<number | undefined>(undefined)

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
      isReadOnly={selectedControlUnits?.length === 0}
      setExpandedAccordion={() => setExpandedSelectedAccordion(!isExpandedSelectedAccordion)}
      title={`${selectedControlUnits?.length ?? 0} ${pluralize('unité', selectedControlUnits?.length ?? 0)} ${pluralize(
        'sélectionnée',
        selectedControlUnits?.length ?? 0
      )}`}
    >
      {selectedControlUnits.map(controlUnit => (
        <ControlUnitAccordion
          key={controlUnit.id}
          controlUnit={controlUnit}
          controlUnitIdExpanded={controlUnitIdExpanded}
          expandUnit={expandedControlUnit}
        />
      ))}
    </StyledSelectedAccordion>
  )
}
const StyledSelectedAccordion = styled(SelectedAccordion)`
  gap: 2px;
`
