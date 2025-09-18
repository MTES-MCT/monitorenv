import { Item } from '@components/BannerStack/item'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { isDefined } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { backOfficeActions } from '../../slice'

export function BannerStack() {
  const dispatch = useAppDispatch()
  const bannerStack = useAppSelector(state => state.backOffice.bannerStack)
  const remove = (bannerStackRank: number) => {
    const bannerToRemove = bannerStack.entities[bannerStackRank]
    if (bannerToRemove?.props.isCollapsible) {
      return
    }
    dispatch(backOfficeActions.removeBanner(bannerStackRank))
  }

  const bannerStackItems = Object.values(bannerStack.entities).filter(isDefined)

  if (bannerStackItems.length === 0) {
    return <></>
  }

  return (
    <Wrapper data-cy="back-office-banner-stack">
      {bannerStackItems.map(({ id, props }) => (
        <Item key={`banner-${id}`} bannerProps={props} bannerStackId={id} onCloseOrAutoclose={remove} />
      ))}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
`
