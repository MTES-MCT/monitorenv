import { getregulatoryAreasByControlPlan } from '@api/regulatoryAreasAPI'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon } from '@mtes-mct/monitor-ui'
import { useState } from 'react'

import { RegulatoryAreaGroup } from './RegulatoryAreaGroup'
import { ControlPlanWrapper, GroupTitle, StyledIconButton, Title } from './style'

import type { RegulatoryArea } from '@features/RegulatoryArea/types'

export function ControlPlanTable() {
  const filters = useAppSelector(state => state.regulatoryAreaTable.filtersState)
  const groupedRegulatoryAreas = useAppSelector(state =>
    getregulatoryAreasByControlPlan(state, {
      ...filters,
      tags: filters.tags?.map(tag => tag.id),
      themes: filters.themes?.map(theme => theme.id)
    })
  ) as Record<'PIRC' | 'PSCEM', Record<string, RegulatoryArea.RegulatoryAreaWithBbox[]>>

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
