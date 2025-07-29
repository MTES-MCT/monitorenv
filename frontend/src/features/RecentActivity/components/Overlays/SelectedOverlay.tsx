import { recentActivityActions } from '@features/RecentActivity/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Accent, Icon, IconButton, Size } from '@mtes-mct/monitor-ui'
import { useRef } from 'react'
import styled from 'styled-components'

import { OverlayContent } from './OverlayContent'

import type { RecentActivity } from '@features/RecentActivity/types'
import type { OverlayItem } from 'domain/types/map'

export function SelectedOverlay({ items }: { items: OverlayItem<string, RecentActivity.RecentControlsActivity>[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const dispatch = useAppDispatch()

  const close = () => {
    dispatch(recentActivityActions.setIsControlsListClicked(false))
  }

  // component should not be called if items.length < 2
  if (items.length < 2) {
    return null
  }

  return (
    <Card ref={ref}>
      <Header>
        {items.length > 1 && <>{items.length} contrôles superposés sur ce point </>}
        <IconButton accent={Accent.TERTIARY} Icon={Icon.Close} onClick={close} size={Size.SMALL} />
      </Header>
      <OverlayContent isSelected items={items} />
    </Card>
  )
}

const Card = styled.div`
  box-shadow: 0 2px 4px ${p => p.theme.color.slateGray}bf;
  cursor: pointer;
  width: 470px;
  > * {
    user-select: none;
  }
`
const Header = styled.div`
  align-items: center;
  background-color: ${p => p.theme.color.lightGray};
  color: ${p => p.theme.color.gunMetal};
  display: flex;
  height: 32px;
  justify-content: space-between;
  padding: 8px 7px;
`
