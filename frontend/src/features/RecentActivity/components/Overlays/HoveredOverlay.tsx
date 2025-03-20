import { type OverlayItem } from 'domain/types/map'
import styled from 'styled-components'

import { OverlayContent } from './OverlayContent'

import type { RecentActivity } from '@features/RecentActivity/types'

export function HoveredOverlay({
  items,
  pixel
}: {
  items: OverlayItem<string, RecentActivity.RecentControlsActivity>[]
  pixel: number[]
}) {
  if (!pixel) {
    return null
  }
  const [x, y] = pixel

  return (
    <Menu $x={x} $y={y}>
      <OverlayContent items={items?.slice(0, 3)} />
      {items?.length > 1 && (
        <Footer>
          {items?.length === 4 && <More>1 autre zone</More>}
          {items && items.length > 4 && <More>{items.length - 2} autres zones</More>}
          <ClickForMore>
            {items && items.length > 3 && ' – '}cliquez pour tout afficher et sélectionner une zone
          </ClickForMore>
        </Footer>
      )}
    </Menu>
  )
}

const Menu = styled.div<{ $x: number | undefined; $y: number | undefined }>`
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
  font: italic normal bold 13px/18px Marianne;
`
const ClickForMore = styled.span`
  font: italic normal normal 13px/18px Marianne;
`
