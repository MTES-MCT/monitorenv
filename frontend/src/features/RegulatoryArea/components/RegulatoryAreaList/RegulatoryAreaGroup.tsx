import { getNumberOfRegulatoryLayerZonesByGroupName } from '@api/regulatoryLayersAPI'
import { StyledTransparentButton } from '@components/style'
import { LayerSelector } from '@features/layersSelector/utils/LayerSelector.style'
import { useAppSelector } from '@hooks/useAppSelector'
import { getTitle } from 'domain/entities/layers/utils'
import { useState } from 'react'

import { RegulatoryAreaItem } from './RegulatoryAreaItem'

import type { RegulatoryLayerCompact } from 'domain/entities/regulatory'

export function RegulatoryAreaGroup({
  groupName,
  regulatoryAreas
}: {
  groupName: string
  regulatoryAreas: RegulatoryLayerCompact[]
}) {
  const totalNumberOfZones = useAppSelector(state => getNumberOfRegulatoryLayerZonesByGroupName(state, groupName))
  const layerGroupName = getTitle(groupName)
  const [isGroupNameOpen, setIsGroupNameOpen] = useState(false)

  const openGroupName = event => {
    event.stopPropagation()
    setIsGroupNameOpen(!isGroupNameOpen)
  }

  return (
    <>
      <LayerSelector.GroupWrapper $isOpen={isGroupNameOpen} $isPadded onClick={openGroupName}>
        <StyledTransparentButton $width="70%" onClick={() => {}}>
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
