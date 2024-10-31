import { sideWindowActions } from '@features/SideWindow/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { isDefined } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { Item } from './Item'

export function BannerStack() {
  const dispatch = useAppDispatch()
  const bannerStack = useAppSelector(state => state.sideWindow.bannerStack)

  const remove = (bannerStackRank: number) => {
    dispatch(sideWindowActions.removeBanner(bannerStackRank))
  }

  const bannerStackItems = Object.values(bannerStack.entities).filter(isDefined)

  if (bannerStackItems.length === 0) {
    return <></>
  }

  return (
    <Wrapper data-cy="banner-stack">
      {bannerStackItems.map(({ id, props }) => (
        <Item key={`banner-${id}`} bannerProps={props} bannerStackId={id} onCloseOrAutoclose={remove} />
      ))}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  left: 64px;
  position: absolute;
  top: 48px;
  // 64px is the sidemenu width
  width: calc(100% - 64px);
`
