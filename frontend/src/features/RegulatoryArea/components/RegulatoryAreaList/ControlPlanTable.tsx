import { getRegulatoryLayersByControlPlan } from '@api/regulatoryLayersAPI'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon } from '@mtes-mct/monitor-ui'
import { useState } from 'react'

import { RegulatoryAreaGroup } from './RegulatoryAreaGroup'
import { ControlPlanWrapper, GroupTitle, StyledIconButton, Title } from './style'

import type { RegulatoryLayerCompact } from 'domain/entities/regulatory'

export function ControlPlanTable() {
  const groupedRegulatoryAreas = useAppSelector(state => getRegulatoryLayersByControlPlan(state)) as Record<
    'PIRC' | 'PSCEM',
    Record<string, RegulatoryLayerCompact[]>
  >

  const [controlPlansExtented, setControlPlansExtented] = useState<string[]>([])

  const PIRCRegulatoryAreas = Object.entries(groupedRegulatoryAreas?.PIRC ?? [])
  const isPIRCGroupOpen = controlPlansExtented.includes('PIRC')

  const PSCEMRegulatoryAreas = Object.entries(groupedRegulatoryAreas?.PSCEM ?? [])
  const isPSCEMGroupOpen = controlPlansExtented.includes('PSCEM')

  const openOrCloseGroup = (value: string | undefined) => {
    const isGroupOpen = controlPlansExtented.includes(value ?? '')
    let updatedExtentedControlPlans = [...controlPlansExtented, value ?? '']
    if (isGroupOpen) {
      updatedExtentedControlPlans = controlPlansExtented.filter(cp => cp !== value)
    }
    setControlPlansExtented(updatedExtentedControlPlans ?? [])
  }

  return (
    <>
      <ControlPlanWrapper>
        <GroupTitle onClick={() => openOrCloseGroup('PIRC')}>
          <Title>PIRC</Title>
          <StyledIconButton
            $isExpanded={isPIRCGroupOpen}
            accent={Accent.TERTIARY}
            Icon={Icon.Chevron}
            onClick={() => openOrCloseGroup('PIRC')}
            title={isPIRCGroupOpen ? 'Replier le contenu' : 'Déplier le contenu'}
          />
        </GroupTitle>
        {isPIRCGroupOpen &&
          PIRCRegulatoryAreas?.map(([key, regulatoryAreas]) => (
            <RegulatoryAreaGroup key={key} groupName={key} regulatoryAreas={regulatoryAreas} />
          ))}

        <GroupTitle onClick={() => openOrCloseGroup('PSCEM')}>
          <Title>PSCEM</Title>
          <StyledIconButton
            $isExpanded={isPSCEMGroupOpen}
            accent={Accent.TERTIARY}
            Icon={Icon.Chevron}
            onClick={() => openOrCloseGroup('PSCEM')}
            title={isPSCEMGroupOpen ? 'Replier le contenu' : 'Déplier le contenu'}
          />
        </GroupTitle>
        {isPSCEMGroupOpen &&
          PSCEMRegulatoryAreas?.map(([key, regulatoryAreas]) => (
            <RegulatoryAreaGroup key={key} groupName={key} regulatoryAreas={regulatoryAreas} />
          ))}
      </ControlPlanWrapper>
    </>
  )
}
