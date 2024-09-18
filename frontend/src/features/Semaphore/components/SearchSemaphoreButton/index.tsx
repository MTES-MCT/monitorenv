import { MenuWithCloseButton } from '@features/commonStyles/map/MenuWithCloseButton'
import { ButtonWrapper } from '@features/MainWindow/components/RightMenu/ButtonWrapper'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Icon, Size } from '@mtes-mct/monitor-ui'
import { globalActions } from 'domain/shared_slices/Global'
import { reduceReportingFormOnMap } from 'domain/use_cases/reporting/reduceReportingFormOnMap'

import { SearchSemaphores } from './SearchSemaphores'

export function SearchSemaphoreButton({ isSuperUser }: { isSuperUser: boolean | undefined }) {
  const dispatch = useAppDispatch()
  const isSearchSemaphoreVisible = useAppSelector(state => state.global.isSearchSemaphoreVisible)

  const openOrCloseSearchSemaphore = () => {
    dispatch(globalActions.hideSideButtons())
    dispatch(reduceReportingFormOnMap())
    dispatch(globalActions.setDisplayedItems({ isSearchSemaphoreVisible: !isSearchSemaphoreVisible }))
  }

  return (
    <ButtonWrapper topPosition={isSuperUser ? 178 : 82}>
      {isSearchSemaphoreVisible && <SearchSemaphores />}
      <MenuWithCloseButton.ButtonOnMap
        className={isSearchSemaphoreVisible ? '_active' : undefined}
        data-cy="semaphores-button"
        Icon={Icon.Semaphore}
        onClick={openOrCloseSearchSemaphore}
        size={Size.LARGE}
        title="Chercher un sémaphore"
      />
    </ButtonWrapper>
  )
}
