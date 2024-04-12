import styled from 'styled-components'

import { OverlayContent } from './OverlayContent'

import type { OverlayItem } from 'domain/types/map'

export function OverlayMenu({ items, pixel }: { items: OverlayItem[]; pixel: number[] }) {
  if (!pixel) {
    return null
  }

  const [x, y] = pixel

  return (
    <Menu x={x} y={y}>
      <OverlayContent items={items} />
    </Menu>
  )
}

const Menu = styled.div<{ x: number | undefined; y: number | undefined }>`
  position: absolute;
  top: ${p => String(p.y ?? 0 + 10)}px;
  left: ${p => String(p.x ?? 0 + 10)}px;
  max-width: 440px;
  box-shadow: 0px 2px 4px #707785bf;
  pointer-events: none;
`
