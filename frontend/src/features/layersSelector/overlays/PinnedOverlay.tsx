import { getIsLinkingZonesToVigilanceArea } from '@features/VigilanceArea/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { IconButton, Icon, Size, Accent } from '@mtes-mct/monitor-ui'
import { type RegulatoryOrAMPOrViglanceAreaLayerType } from 'domain/entities/layers/constants'
import { mapActions } from 'domain/shared_slices/Map'
import { closeAreaOverlay } from 'domain/use_cases/map/closeAreaOverlay'
import styled from 'styled-components'

import { OverlayContent } from './OverlayContent'

import type { AMPProperties } from 'domain/entities/AMPs'
import type { RegulatoryLayerCompactProperties } from 'domain/entities/regulatory'
import type { OverlayItem } from 'domain/types/map'

export function PinnedOverlay({
  items
}: {
  items: OverlayItem<RegulatoryOrAMPOrViglanceAreaLayerType, AMPProperties | RegulatoryLayerCompactProperties>[]
}) {
  const dispatch = useAppDispatch()

  const isLinkingZonesToVigilanceArea = useAppSelector(state => getIsLinkingZonesToVigilanceArea(state))

  const close = () => {
    dispatch(closeAreaOverlay())
    dispatch(mapActions.setIsolateMode({ excludedLayers: [], isolatedLayer: undefined }))
  }

  // component should not be called if items.length < 2
  // or if user is linking a regulatory area to a vigilance area
  if (items.length < 2 && !isLinkingZonesToVigilanceArea) {
    return null
  }

  return (
    <Card>
      <Header>
        {items.length > 1 ? <>{items.length} zones superposées sur ce point </> : 'Zone sélectionnée'}
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
