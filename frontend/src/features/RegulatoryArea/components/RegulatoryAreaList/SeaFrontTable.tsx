import { getRegulatoryAreasBySeaFront } from '@api/regulatoryAreasAPI'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon } from '@mtes-mct/monitor-ui'
import { SeaFrontLabels } from 'domain/entities/seaFrontType'
import { Fragment, useState } from 'react'

import { RegulatoryAreaGroup } from './RegulatoryAreaGroup'
import { ControlPlanWrapper, GroupTitle, StyledIconButton, StyledLoadingIcon, Title } from './style'

import type { RegulatoryArea } from '@features/RegulatoryArea/types'

export function SeaFrontTable({ apiFilters, isLoading }: { apiFilters: any; isLoading: boolean }) {
  const groupedRegulatoryAreas = useAppSelector(state => getRegulatoryAreasBySeaFront(state, apiFilters)) as Record<
    string,
    Record<string, RegulatoryArea.RegulatoryAreaWithBbox[]>
  >

  const allSeaFronts = Object.values(SeaFrontLabels).map(seaFrontLabel => seaFrontLabel.label)

  const [seaFrontsExtented, setSeaFrontsExtented] = useState<string[]>([])

  const openOrCloseGroup = (value: string | undefined) => {
    const isGroupOpen = seaFrontsExtented.includes(value ?? '')
    let updatedExtentedSeaFronts = [...seaFrontsExtented, value ?? '']
    if (isGroupOpen) {
      updatedExtentedSeaFronts = seaFrontsExtented.filter(seaFront => seaFront !== value)
    }
    setSeaFrontsExtented(updatedExtentedSeaFronts ?? [])
  }

  if (isLoading) {
    return (
      <ControlPlanWrapper>
        {allSeaFronts.map(seaFront => (
          <GroupTitle key={seaFront}>
            <Title>{seaFront}</Title>
            <StyledLoadingIcon />
          </GroupTitle>
        ))}
      </ControlPlanWrapper>
    )
  }

  return (
    <ControlPlanWrapper>
      {allSeaFronts.map(seaFront => {
        if (!groupedRegulatoryAreas[seaFront]) {
          return null
        }

        return (
          <Fragment key={seaFront}>
            <GroupTitle onClick={() => openOrCloseGroup(seaFront)}>
              <Title>{seaFront}</Title>
              <StyledIconButton
                $isExpanded={seaFrontsExtented.includes(seaFront)}
                accent={Accent.TERTIARY}
                Icon={Icon.Chevron}
                onClick={() => openOrCloseGroup(seaFront)}
                title={
                  seaFrontsExtented.includes(seaFront)
                    ? `Replier le contenu de la façade ${seaFront}`
                    : `Déplier le contenu de la façade ${seaFront}`
                }
              />
            </GroupTitle>
            {seaFrontsExtented.includes(seaFront) &&
              Object.entries(groupedRegulatoryAreas[seaFront]).map(([key, regulatoryAreas]) => (
                <RegulatoryAreaGroup key={key} groupName={key} regulatoryAreas={regulatoryAreas} />
              ))}
          </Fragment>
        )
      })}
    </ControlPlanWrapper>
  )
}
