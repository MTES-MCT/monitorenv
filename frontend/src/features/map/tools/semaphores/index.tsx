import { Icon, IconButton, Size } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { setDisplayedItems } from '../../../../domain/shared_slices/Global'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { SearchSemaphores } from './SearchSemaphores'

export function SemaphoreMapButton() {
  const dispatch = useAppDispatch()
  const { isSearchSemaphoreVisible } = useAppSelector(state => state.global)

  const openOrCloseSearchSemaphore = () => {
    dispatch(setDisplayedItems({ isSearchSemaphoreVisible: !isSearchSemaphoreVisible, missionsMenuIsOpen: false }))
  }

  return (
    <Wrapper>
      <SearchSemaphores />
      <StyledIconButton
        data-cy="semaphores-button"
        Icon={Icon.Vms}
        onClick={openOrCloseSearchSemaphore}
        size={Size.LARGE}
        title="Chercher un sémpahore"
      />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: absolute;
  top: 100px;
  right: 10px;
  display: flex;
  justify-content: flex-end;
`
const StyledIconButton = styled(IconButton)`
  height: fit-content;
`
