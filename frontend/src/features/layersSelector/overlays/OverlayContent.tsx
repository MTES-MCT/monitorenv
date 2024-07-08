import { vigilanceAreaActions, VigilanceAreaFormTypeOpen } from '@features/VigilanceArea/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, IconButton, Size } from '@mtes-mct/monitor-ui'
import { MonitorEnvLayers, type RegulatoryOrAMPOrViglanceAreaLayerType } from 'domain/entities/layers/constants'
import { type RegulatoryLayerCompactProperties } from 'domain/entities/regulatory'
import styled from 'styled-components'

import { getGroupName, getLegendKey, getLegendType, getName, getTitle } from '../../../domain/entities/layers/utils'
import {
  closeMetadataPanel,
  getDisplayedMetadataLayerIdAndType,
  openAMPMetadataPanel,
  openRegulatoryMetadataPanel
} from '../metadataPanel/slice'
import { LayerLegend } from '../utils/LayerLegend.style'

import type { VigilanceArea } from '@features/VigilanceArea/types'
import type { AMPProperties } from 'domain/entities/AMPs'
import type { OverlayItem } from 'domain/types/map'

type OverlayContentProps = {
  items:
    | OverlayItem<
        RegulatoryOrAMPOrViglanceAreaLayerType,
        AMPProperties | RegulatoryLayerCompactProperties | VigilanceArea.VigilanceAreaProperties
      >[]
    | undefined
}

export function OverlayContent({ items }: OverlayContentProps) {
  const dispatch = useAppDispatch()

  const { layerId, layerType } = useAppSelector(state => getDisplayedMetadataLayerIdAndType(state))
  const selectedVigilanceAreaId = useAppSelector(state => state.vigilanceArea.selectedVigilanceAreaId)
  const editingVigilanceAreaId = useAppSelector(state => state.vigilanceArea.editingVigilanceAreaId)
  const vigilanceAreaFormType = useAppSelector(state => state.vigilanceArea.formTypeOpen)
  const regulatoryAreasToAdd = useAppSelector(state => state.vigilanceArea.regulatoryAreasToAdd)
  const isLinkingRegulatoryToVigilanceArea = vigilanceAreaFormType === VigilanceAreaFormTypeOpen.ADD_REGULATORY

  const handleClick = (type, id) => () => {
    if (type === MonitorEnvLayers.AMP || type === MonitorEnvLayers.AMP_PREVIEW) {
      dispatch(openAMPMetadataPanel(id))
      dispatch(vigilanceAreaActions.setSelectedVigilanceAreaId(editingVigilanceAreaId))
    }
    if (type === MonitorEnvLayers.REGULATORY_ENV || type === MonitorEnvLayers.REGULATORY_ENV_PREVIEW) {
      dispatch(openRegulatoryMetadataPanel(id))
      dispatch(vigilanceAreaActions.setSelectedVigilanceAreaId(editingVigilanceAreaId))
    }
    if (type === MonitorEnvLayers.VIGILANCE_AREA) {
      dispatch(vigilanceAreaActions.setSelectedVigilanceAreaId(id))
      dispatch(closeMetadataPanel())
    }
  }

  const adRegulatoryToVigilanceArea = (e, id) => {
    e.stopPropagation()
    dispatch(vigilanceAreaActions.addRegulatoryAreasToVigilanceArea([id]))
  }

  return (
    <Layerlist>
      {items?.map(item => {
        if (!item.properties) {
          return null
        }
        const { id } = item.properties
        const groupName = getGroupName(item.properties, item.layerType)
        const name = getName(item.properties, item.layerType)
        const legendType = getLegendType(item.properties, item.layerType)
        const legendKey = getLegendKey(item.properties, item.layerType)
        const isSelected =
          (id === layerId && !!layerType && item.layerType.includes(layerType)) || selectedVigilanceAreaId === id
        const isRegulatory =
          item.layerType === MonitorEnvLayers.REGULATORY_ENV ||
          item.layerType === MonitorEnvLayers.REGULATORY_ENV_PREVIEW

        return (
          <LayerItem key={id} $isSelected={isSelected} onClick={handleClick(item.layerType, id)}>
            <LayerLegend layerType={item.layerType} legendKey={legendKey} size={Size.NORMAL} type={legendType} />
            <GroupName title={getTitle(groupName)}>{getTitle(groupName)} </GroupName>
            <Name title={getTitle(name) || ''}>&nbsp;/ {getTitle(name) || ''}</Name>
            {isLinkingRegulatoryToVigilanceArea && isRegulatory && (
              <IconButton
                accent={Accent.TERTIARY}
                disabled={regulatoryAreasToAdd?.includes(id)}
                Icon={Icon.Plus}
                onClick={e => adRegulatoryToVigilanceArea(e, id)}
                size={Size.SMALL}
                title={`Ajouter la zone réglementaire ${name}`}
              />
            )}
          </LayerItem>
        )
      })}
    </Layerlist>
  )
}

const Layerlist = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 320px;
  overflow-y: auto;
`

const LayerItem = styled.li<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  height: 32px;
  padding: 7px 8px 8px 8px;
  background-color: ${p => (p.$isSelected ? p.theme.color.blueYonder25 : p.theme.color.white)};
  border-bottom: 1px solid ${p => p.theme.color.lightGray};
`

// using average width of 7px per character to approximate min-width
// more precise calculation would require measuring text width with access to the dom
const GroupName = styled.span`
  color: ${p => p.theme.color.gunMetal};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font: normal normal bold 13px/18px Marianne;
  min-width: ${p => (p.title?.length && p.title.length * 7 > 220 ? 200 : 0)}px;
`

const Name = styled.span`
  color: ${p => p.theme.color.gunMetal};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font: normal normal normal 13px/18px Marianne;
  flex: 1;
`
