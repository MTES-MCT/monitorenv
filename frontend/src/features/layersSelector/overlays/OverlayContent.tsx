import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Size } from '@mtes-mct/monitor-ui'
import { MonitorEnvLayers, type RegulatoryOrAMPLayerType } from 'domain/entities/layers/constants'
import styled from 'styled-components'

import { getName, getType } from './utils'
import {
  getDisplayedMetadataLayerIdAndType,
  openAMPMetadataPanel,
  openRegulatoryMetadataPanel
} from '../metadataPanel/slice'
import { LayerLegend } from '../utils/LayerLegend.style'

import type { AMPProperties } from 'domain/entities/AMPs'
import type { RegulatoryLayerCompactProperties } from 'domain/entities/regulatory'
import type { OverlayItem } from 'domain/types/map'

type OverlayContentProps = {
  items: OverlayItem<RegulatoryOrAMPLayerType, AMPProperties | RegulatoryLayerCompactProperties>[] | undefined
}

export function OverlayContent({ items }: OverlayContentProps) {
  const dispatch = useAppDispatch()
  const { layerId, layerType } = useAppSelector(state => getDisplayedMetadataLayerIdAndType(state))

  const handleClick = (type, id) => () => {
    if (type === MonitorEnvLayers.AMP || type === MonitorEnvLayers.AMP_PREVIEW) {
      dispatch(openAMPMetadataPanel(id))
    }
    if (type === MonitorEnvLayers.REGULATORY_ENV || type === MonitorEnvLayers.REGULATORY_ENV_PREVIEW) {
      dispatch(openRegulatoryMetadataPanel(id))
    }
  }

  return (
    <Layerlist>
      {items?.map(item => {
        const name = getName(item.properties, item.layerType)
        const type = getType(item.properties, item.layerType)
        const isSelected = item.properties.id === layerId && item.layerType === layerType

        return (
          <LayerItem
            key={item.properties.id}
            $isSelected={isSelected}
            onClick={handleClick(item.layerType, item.properties.id)}
          >
            <LayerLegend layerType={item.layerType} name={name} size={Size.NORMAL} type={type} />
            <Name title={name}>{name}</Name>
            <Type title={type ?? ''}> / {type}</Type>
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

const Name = styled.span`
  color: ${p => p.theme.color.gunMetal};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font: normal normal bold 13px/18px Marianne;
`

const Type = styled.span`
  color: ${p => p.theme.color.gunMetal};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font: normal normal normal 13px/18px Marianne;
`
