import { useAppDispatch } from '@hooks/useAppDispatch'
import { IconButton, Icon, Size, Accent } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { OverlayContent } from './OverlayContent'
import { closeLayerOverlay } from '../metadataPanel/slice'

import type { AMPProperties } from 'domain/entities/AMPs'
import type { RegulatoryOrAMPLayerType } from 'domain/entities/layers/constants'
import type { RegulatoryLayerCompactProperties } from 'domain/entities/regulatory'
import type { OverlayItem } from 'domain/types/map'

export function PinnedOverlay({
  items
}: {
  items: OverlayItem<RegulatoryOrAMPLayerType, AMPProperties | RegulatoryLayerCompactProperties>[]
}) {
  const dispatch = useAppDispatch()

  const close = () => {
    dispatch(closeLayerOverlay())
  }

  // component should not be called if items.length < 2
  if (items.length < 2) {
    return null
  }

  return (
    <Card>
      <Header>
        {items.length} zones superposées sur ce point{' '}
        <IconButton accent={Accent.TERTIARY} Icon={Icon.Close} onClick={close} size={Size.SMALL} />
      </Header>
      <OverlayContent items={items} />
    </Card>
  )
}

const Card = styled.div`
  width: 440px;
  box-shadow: 0px 2px 4px ${p => p.theme.color.slateGray}bf;
  cursor: pointer;
  > * {
    user-select: none;
  }
`
const Header = styled.div`
  display: flex;
  height: 32px;
  justify-content: space-between;
  align-items: center;
  background-color: ${p => p.theme.color.lightGray};
  color: ${p => p.theme.color.gunMetal};
  font: normal normal medium 13px/18px Marianne;
  padding: 8px 7px;
`
