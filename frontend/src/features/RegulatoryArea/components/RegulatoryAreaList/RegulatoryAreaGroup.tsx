import { useGetLayerNamesQuery } from '@api/regulatoryAreasAPI'
import { StyledTransparentButton } from '@components/style'
import { LayerSelector } from '@features/layersSelector/utils/LayerSelector.style'
import { getTitle } from 'domain/entities/layers/utils'
import { useMemo, useState } from 'react'

import { RegulatoryAreaItem } from './RegulatoryAreaItem'

import type { RegulatoryArea } from '@features/RegulatoryArea/types'

export function RegulatoryAreaGroup({
  groupName,
  regulatoryAreas
}: {
  groupName: string
  regulatoryAreas: RegulatoryArea.RegulatoryAreaWithBbox[]
}) {
  const { data: layerNames } = useGetLayerNamesQuery()

  const totalNumberOfZones = useMemo(() => layerNames?.layerNames[groupName] ?? 0, [layerNames, groupName])

  const layerGroupName = getTitle(groupName)
  const [isGroupNameOpen, setIsGroupNameOpen] = useState(false)

  const openGroupName = (event: React.MouseEvent) => {
    event.stopPropagation()
    setIsGroupNameOpen(!isGroupNameOpen)
  }

  return (
    <>
      <LayerSelector.GroupWrapper $isOpen={isGroupNameOpen} $isPadded onClick={openGroupName}>
        <StyledTransparentButton $width="70%">
          <LayerSelector.GroupName title={layerGroupName}>{layerGroupName}</LayerSelector.GroupName>
        </StyledTransparentButton>
        <LayerSelector.IconGroup>
          <LayerSelector.NumberOfZones>{`${regulatoryAreas?.length}/${totalNumberOfZones}`}</LayerSelector.NumberOfZones>
        </LayerSelector.IconGroup>
      </LayerSelector.GroupWrapper>
      <LayerSelector.GroupList $isOpen={isGroupNameOpen} $length={regulatoryAreas?.length}>
        {regulatoryAreas?.map(regulatoryArea => (
          <RegulatoryAreaItem key={regulatoryArea.id} regulatoryArea={regulatoryArea} />
        ))}
      </LayerSelector.GroupList>
    </>
  )
}
