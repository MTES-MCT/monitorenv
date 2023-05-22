import { Icon, Size } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { setDisplayedItems } from '../../../domain/shared_slices/Global'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { MenuWithCloseButton } from '../../commonStyles/map/MenuWithCloseButton'
import { SearchSemaphores } from './SearchSemaphores'

export function SemaphoresOnMap() {
  const dispatch = useAppDispatch()
  const { isSearchSemaphoreVisible } = useAppSelector(state => state.global)

  const openOrCloseSearchSemaphore = () => {
    dispatch(setDisplayedItems({ isSearchSemaphoreVisible: !isSearchSemaphoreVisible, missionsMenuIsOpen: false }))
  }

  return (
    <Wrapper>
      {isSearchSemaphoreVisible && <SearchSemaphores />}
      <MenuWithCloseButton.ButtonOnMap
        className={isSearchSemaphoreVisible ? '_active' : undefined}
        data-cy="semaphores-button"
        Icon={Icon.Semaphore}
        onClick={openOrCloseSearchSemaphore}
        size={Size.LARGE}
        title="Chercher un sémpahore"
      />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: absolute;
  top: 135px;
  right: 10px;
  display: flex;
  justify-content: flex-end;
`
