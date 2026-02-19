import { getRegulatoryAreasByControlPlan } from '@api/regulatoryAreasAPI'
import { RegulatoryArea } from '@features/RegulatoryArea/types'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon } from '@mtes-mct/monitor-ui'
import { useState } from 'react'

import { RegulatoryAreaGroup } from './RegulatoryAreaGroup'
import { ControlPlanWrapper, GroupTitle, StyledIconButton, StyledLoadingIcon, Title } from './style'

export function ControlPlanTable({ apiFilters, isLoading }: { apiFilters: any; isLoading: boolean }) {
  const groupedRegulatoryAreas = useAppSelector(state => getRegulatoryAreasByControlPlan(state, apiFilters)) as Record<
    RegulatoryArea.RegulatoryAreaControlPlan.PSCEM | RegulatoryArea.RegulatoryAreaControlPlan.PIRC,
    Record<string, RegulatoryArea.RegulatoryAreaWithBbox[]>
  >

  const [controlPlansExtented, setControlPlansExtented] = useState<string[]>([])

  const PIRCRegulatoryAreas = Object.entries(groupedRegulatoryAreas?.PIRC ?? [])
  const isPIRCGroupOpen = controlPlansExtented.includes(RegulatoryArea.RegulatoryAreaControlPlan.PIRC)

  const PSCEMRegulatoryAreas = Object.entries(groupedRegulatoryAreas?.PSCEM ?? [])
  const isPSCEMGroupOpen = controlPlansExtented.includes(RegulatoryArea.RegulatoryAreaControlPlan.PSCEM)

  const openOrCloseGroup = (value: string | undefined) => {
    const isGroupOpen = controlPlansExtented.includes(value ?? '')
    let updatedExtentedControlPlans = [...controlPlansExtented, value ?? '']
    if (isGroupOpen) {
      updatedExtentedControlPlans = controlPlansExtented.filter(cp => cp !== value)
    }
    setControlPlansExtented(updatedExtentedControlPlans ?? [])
  }

  if (isLoading) {
    return (
      <ControlPlanWrapper>
        <GroupTitle>
          <Title>PIRC</Title>
          <StyledLoadingIcon />
        </GroupTitle>
        <GroupTitle>
          <Title>PSCEM</Title>
          <StyledLoadingIcon />
        </GroupTitle>
      </ControlPlanWrapper>
    )
  }

  return (
    <>
      <ControlPlanWrapper>
        {PIRCRegulatoryAreas.length > 0 && (
          <>
            <GroupTitle onClick={() => openOrCloseGroup(RegulatoryArea.RegulatoryAreaControlPlan.PIRC)}>
              <Title>PIRC</Title>
              <StyledIconButton
                $isExpanded={isPIRCGroupOpen}
                accent={Accent.TERTIARY}
                Icon={Icon.Chevron}
                onClick={() => openOrCloseGroup(RegulatoryArea.RegulatoryAreaControlPlan.PIRC)}
                title={isPIRCGroupOpen ? 'Replier le contenu des zones PIRC' : 'Déplier le contenu des zones PIRC'}
              />
            </GroupTitle>
            {isPIRCGroupOpen &&
              PIRCRegulatoryAreas?.map(([key, regulatoryAreas]) => (
                <RegulatoryAreaGroup key={key} groupName={key} regulatoryAreas={regulatoryAreas} />
              ))}
          </>
        )}

        {PSCEMRegulatoryAreas.length > 0 && (
          <>
            <GroupTitle onClick={() => openOrCloseGroup(RegulatoryArea.RegulatoryAreaControlPlan.PSCEM)}>
              <Title>PSCEM</Title>
              <StyledIconButton
                $isExpanded={isPSCEMGroupOpen}
                accent={Accent.TERTIARY}
                Icon={Icon.Chevron}
                onClick={() => openOrCloseGroup(RegulatoryArea.RegulatoryAreaControlPlan.PSCEM)}
                title={isPSCEMGroupOpen ? 'Replier le contenu des zones PSCEM' : 'Déplier le contenu des zones PSCEM'}
              />
            </GroupTitle>
            {isPSCEMGroupOpen &&
              PSCEMRegulatoryAreas?.map(([key, regulatoryAreas]) => (
                <RegulatoryAreaGroup key={key} groupName={key} regulatoryAreas={regulatoryAreas} />
              ))}
          </>
        )}
      </ControlPlanWrapper>
    </>
  )
}
