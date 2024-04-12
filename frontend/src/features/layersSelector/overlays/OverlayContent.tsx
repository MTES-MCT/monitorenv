import { useAppDispatch } from '@hooks/useAppDispatch'
import { MonitorEnvLayers } from 'domain/entities/layers/constants'
import styled from 'styled-components'

import { getName, getType } from './utils'
import { openAMPMetadataPanel, openRegulatoryMetadataPanel } from '../metadataPanel/slice'
import { LayerLegend } from '../utils/LayerLegend.style'

import type { OverlayItem } from 'domain/types/map'

type OverlayContentProps = {
  items: OverlayItem[] | undefined
}

export function OverlayContent({ items }: OverlayContentProps) {
  const dispatch = useAppDispatch()
  const handleClick = (type, id) => () => {
    if (type === MonitorEnvLayers.AMP) {
      dispatch(openAMPMetadataPanel(id))
    }
    if (type === MonitorEnvLayers.REGULATORY_ENV) {
      dispatch(openRegulatoryMetadataPanel(id))
    }
  }

  return (
    <Layerlist>
      {items?.map(item => {
        const name = getName(item.properties, item.layerType)
        const type = getType(item.properties, item.layerType)

        return (
          <LayerItem key={item.properties.id} onClick={handleClick(item.layerType, item.properties.id)}>
            <LayerLegend layerType={item.layerType} name={name} type={type} />
            <Name>{name}</Name>
            <Type> / {type}</Type>
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
`

const LayerItem = styled.li`
  padding: 5px;
  background-color: white;
  border-bottom: 1px solid #cccfd6; ;
`
const Name = styled.span`
  color: ${p => p.theme.color.gunMetal};
  font: normal normal bold 13px/18px Marianne;
`

const Type = styled.span`
  color: ${p => p.theme.color.gunMetal};
  font: normal normal normal 13px/18px Marianne;
`
