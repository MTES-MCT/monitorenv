import { type OverlayItem } from 'domain/types/map'
import styled from 'styled-components'

import { OverlayContent } from './OverlayContent'

import type { RecentActivity } from '@features/RecentActivity/types'
import type OpenLayerMap from 'ol/Map'

export function HoveredOverlay({
  items,
  map,
  pixel
}: {
  items: OverlayItem<string, RecentActivity.RecentControlsActivity>[]
  map: OpenLayerMap
  pixel: number[]
}) {
  if (!pixel) {
    return null
  }
  const [x, y] = pixel

  return (
    <Menu $x={x} $y={y}>
      <OverlayContent items={items?.slice(0, 3)} map={map} />
      {items?.length > 1 && (
        <Footer>
          {items?.length === 4 && <More>1 autre contrôle</More>}
          {items && items.length > 4 && <More>{items.length - 2} autres contrôles</More>}
          <ClickForMore>{items && items.length > 3 && ' – '}cliquez pour tout afficher</ClickForMore>
        </Footer>
      )}
    </Menu>
  )
}

const Menu = styled.div<{ $x: number | undefined; $y: number | undefined }>`
  font-size: 13px;
  position: absolute;
  top: ${p => String(p.$y)}px;
  left: ${p => String(p.$x)}px;
  box-shadow: 0px 2px 4px ${p => p.theme.color.slateGray}bf;
  pointer-events: none;
`
const Footer = styled.div`
  background-color: ${p => p.theme.color.white};
  color: ${p => p.theme.color.slateGray};
  padding: 5px;
  padding-left: 10px;
`
const More = styled.span`
  font-weight: 700;
  font-style: italic;
`
const ClickForMore = styled.span`
  font-style: italic;
`
