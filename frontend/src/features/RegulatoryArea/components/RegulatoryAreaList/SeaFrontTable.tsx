import { getRegulatoryAreasBySeaFront } from '@api/regulatoryAreasAPI'
import { useGetSeaFrontsQuery } from '@api/seaFrontsAPI'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon } from '@mtes-mct/monitor-ui'
import { Fragment, useState } from 'react'

import { RegulatoryAreaGroup } from './RegulatoryAreaGroup'
import { ControlPlanWrapper, GroupTitle, StyledIconButton, StyledLoadingIcon, Title } from './style'

import type { RegulatoryArea } from '@features/RegulatoryArea/types'

export function SeaFrontTable({ apiFilters, isLoading }: { apiFilters: any; isLoading: boolean }) {
  const groupedRegulatoryAreas = useAppSelector(state => getRegulatoryAreasBySeaFront(state, apiFilters)) as Record<
    string,
    Record<string, RegulatoryArea.RegulatoryAreaWithBbox[]>
  >

  const { data } = useGetSeaFrontsQuery()
  const seaFronts = data?.map(facade => facade).sort((a, b) => a.localeCompare(b))

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
        {seaFronts?.map(facade => (
          <GroupTitle key={facade}>
            <Title>{facade}</Title>
            <StyledLoadingIcon />
          </GroupTitle>
        ))}
      </ControlPlanWrapper>
    )
  }

  return (
    <ControlPlanWrapper>
      {seaFronts?.map(facade => {
        if (!groupedRegulatoryAreas[facade]) {
          return null
        }

        return (
          <Fragment key={facade}>
            <GroupTitle onClick={() => openOrCloseGroup(facade)}>
              <Title>{seaFronts}</Title>
              <StyledIconButton
                $isExpanded={seaFrontsExtented.includes(facade)}
                accent={Accent.TERTIARY}
                Icon={Icon.Chevron}
                onClick={() => openOrCloseGroup(facade)}
                title={
                  seaFrontsExtented.includes(facade)
                    ? `Replier le contenu de la façade ${facade}`
                    : `Déplier le contenu de la façade ${facade}`
                }
              />
            </GroupTitle>
            {seaFrontsExtented.includes(facade) &&
              Object.entries(groupedRegulatoryAreas[facade]).map(([key, regulatoryAreas]) => (
                <RegulatoryAreaGroup key={key} groupName={key} regulatoryAreas={regulatoryAreas} />
              ))}
          </Fragment>
        )
      })}
    </ControlPlanWrapper>
  )
}
