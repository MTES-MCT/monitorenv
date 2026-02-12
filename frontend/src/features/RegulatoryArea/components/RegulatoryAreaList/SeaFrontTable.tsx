import { getRegulatoryAreasBySeaFront } from '@api/regulatoryAreasAPI'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon } from '@mtes-mct/monitor-ui'
import { SeaFrontLabels } from 'domain/entities/seaFrontType'
import { Fragment, useState } from 'react'

import { RegulatoryAreaGroup } from './RegulatoryAreaGroup'
import { ControlPlanWrapper, GroupTitle, StyledIconButton, Title } from './style'

import type { RegulatoryArea } from '@features/RegulatoryArea/types'

export function SeaFrontTable() {
  const filters = useAppSelector(state => state.regulatoryAreaTable.filtersState)
  const groupedRegulatoryAreas = useAppSelector(state =>
    getRegulatoryAreasBySeaFront(state, {
      ...filters,
      tags: filters.tags?.map(tag => tag.id),
      themes: filters.themes?.map(theme => theme.id)
    })
  ) as Record<string, Record<string, RegulatoryArea.RegulatoryAreaWithBbox[]>>

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
                title={seaFrontsExtented.includes(seaFront) ? 'Replier le contenu' : 'Déplier le contenu'}
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
