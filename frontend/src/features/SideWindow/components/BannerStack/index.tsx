import { sideWindowActions } from '@features/SideWindow/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { isDefined } from '@mtes-mct/monitor-ui'
import { isMissionPage } from '@utils/routes'
import styled from 'styled-components'

import { Item } from './Item'

export function BannerStack() {
  const dispatch = useAppDispatch()
  const bannerStack = useAppSelector(state => state.sideWindow.bannerStack)
  const currentPath = useAppSelector(state => state.sideWindow.currentPath)

  const isCurrentPathIsMissionPage = isMissionPage(currentPath)

  const remove = (bannerStackRank: number) => {
    const bannerToRemove = bannerStack.entities[bannerStackRank]
    if (bannerToRemove?.props.isCollapsible) {
      return
    }
    dispatch(sideWindowActions.removeBanner(bannerStackRank))
  }

  const bannerStackItems = Object.values(bannerStack.entities).filter(isDefined)

  if (bannerStackItems.length === 0) {
    return <></>
  }

  return (
    <Wrapper $isMission={isCurrentPathIsMissionPage} data-cy="side-window-banner-stack">
      {bannerStackItems.map(({ id, props }) => (
        <Item key={`banner-${id}`} bannerProps={props} bannerStackId={id} onCloseOrAutoclose={remove} />
      ))}
    </Wrapper>
  )
}

const Wrapper = styled.div<{ $isMission: boolean }>`
  display: flex;
  flex-direction: column;
  left: 64px;
  position: absolute;
  top: ${p => (p.$isMission ? '48px' : '0')};
  // 64px is the sidemenu width
  width: calc(100% - 64px);
`
