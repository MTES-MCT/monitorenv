import styled from 'styled-components'

import { getName, getType } from './utils'
import { LayerLegend } from '../utils/LayerLegend.style'

import type { OverlayItem } from 'domain/types/map'

type OverlayContentProps = {
  items: OverlayItem[] | undefined
}

export function OverlayContent({ items }: OverlayContentProps) {
  return (
    <Layerlist>
      {items?.slice(0, 3).map(item => {
        const name = getName(item.properties, item.layerType)
        const type = getType(item.properties, item.layerType)

        return (
          <LayerItem key={item.properties.id}>
            <LayerLegend layerType={item.layerType} name={name} type={type} />
            <Name>{name}</Name>
            <Type> / {type}</Type>
          </LayerItem>
        )
      })}
      {items?.length === 4 && <More>1 autre zone</More>}
      {items && items.length > 4 && <More>{items.length - 2} autres zones</More>}
    </Layerlist>
  )
}

const Layerlist = styled.ul`
  min-width: 200px;
  min-height: 100px;
  border: 1px solid red;
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
const More = styled.li`
  background-color: white;
  color: ${p => p.theme.color.slateGray};
  font: italic normal bold 13px/18px Marianne;
  padding: 5px;
`
