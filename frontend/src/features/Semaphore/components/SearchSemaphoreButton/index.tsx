import { MenuWithCloseButton } from '@features/commonStyles/map/MenuWithCloseButton'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Icon, Size } from '@mtes-mct/monitor-ui'
import { globalActions } from 'domain/shared_slices/Global'

import { SearchSemaphores } from './SearchSemaphores'

import type { MenuButtonProps } from '@components/Menu'

export function SearchSemaphoreButton({ onClickMenuButton, onVisibiltyChange }: MenuButtonProps) {
  const dispatch = useAppDispatch()
  const isSearchSemaphoreVisible = useAppSelector(state => state.global.visibility.isSearchSemaphoreVisible)

  const openOrCloseSearchSemaphore = () => {
    onClickMenuButton()
    dispatch(globalActions.setDisplayedItems({ visibility: { isSearchSemaphoreVisible: !isSearchSemaphoreVisible } }))
  }

  return (
    <>
      {isSearchSemaphoreVisible && <SearchSemaphores onVisibiltyChange={onVisibiltyChange} />}
      <MenuWithCloseButton.ButtonOnMap
        className={isSearchSemaphoreVisible ? '_active' : undefined}
        data-cy="semaphores-button"
        Icon={Icon.Semaphore}
        onClick={openOrCloseSearchSemaphore}
        size={Size.LARGE}
        title="Chercher un sémaphore"
      />
    </>
  )
}
