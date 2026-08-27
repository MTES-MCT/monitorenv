import { useGetLayerNamesQuery } from '@api/regulatoryAreasAPI'
import { StyledTransparentButton } from '@components/style'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '@features/BackOffice/components/BackofficeMenu/constants'
import { LayerSelector } from '@features/layersSelector/utils/LayerSelector.style'
import { Accent, Icon, IconButton, THEME } from '@mtes-mct/monitor-ui'
import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'

import { RegulatoryAreaItem } from './RegulatoryAreaItem'
import { formatLayerName } from '../../utils'

import type { RegulatoryArea } from '@features/RegulatoryArea/types'

export function RegulatoryAreaGroup({ group }: { group: RegulatoryArea.RegulatoryAreaGroup }) {
  const navigate = useNavigate()
  const { data: layerNames } = useGetLayerNamesQuery()

  const layerGroupName = formatLayerName(group.group.layerName, group.group.location)

  const totalNumberOfZones = useMemo(
    () =>
      layerNames?.find(
        regulatoryArea =>
          formatLayerName(regulatoryArea.group.layerName, regulatoryArea.group.location) === layerGroupName
      )?.total ?? 0,
    [layerGroupName, layerNames]
  )

  const [isGroupNameOpen, setIsGroupNameOpen] = useState(false)

  const hasLeastOneNewLayer = group.regulatoryAreas.some(layer => layer.isNew)
  const hasLeastOneRecentlyUpdatedLayer = group.regulatoryAreas.some(layer => layer.isUpdatedRecently)
  const openGroupName = (event: React.MouseEvent) => {
    event.stopPropagation()
    setIsGroupNameOpen(!isGroupNameOpen)
  }

  const onEditGroup = () => {
    navigate(`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.REGULATORY_AREA_GROUP]}/${group.group.id}`)
  }

  return (
    <>
      <LayerSelector.GroupWrapper
        $isNew={hasLeastOneNewLayer}
        $isOpen={isGroupNameOpen}
        $isPadded
        $isRecentlyUpdated={hasLeastOneRecentlyUpdatedLayer}
        onClick={openGroupName}
      >
        <StyledTransparentButton>
          <LayerSelector.GroupName title={layerGroupName}>{layerGroupName}</LayerSelector.GroupName>
        </StyledTransparentButton>
        <LayerSelector.IconGroup>
          <LayerSelector.NumberOfZones>{`${group.regulatoryAreas?.length}/${totalNumberOfZones}`}</LayerSelector.NumberOfZones>
          <IconButton
            accent={Accent.TERTIARY}
            color={THEME.color.slateGray}
            Icon={Icon.Edit}
            onClick={onEditGroup}
            title={`Editer le groupe de réglementation ${layerGroupName}`}
          />
        </LayerSelector.IconGroup>
      </LayerSelector.GroupWrapper>
      <LayerSelector.GroupList $isOpen={isGroupNameOpen} $length={group.regulatoryAreas?.length}>
        {group.regulatoryAreas?.map(regulatoryArea => (
          <RegulatoryAreaItem key={regulatoryArea.id} groupId={group.group.id} regulatoryArea={regulatoryArea} />
        ))}
      </LayerSelector.GroupList>
    </>
  )
}
