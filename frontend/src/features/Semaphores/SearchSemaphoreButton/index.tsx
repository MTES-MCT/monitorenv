import { Icon, Size } from '@mtes-mct/monitor-ui'

import { SearchSemaphores } from './SearchSemaphores'
import { globalActions } from '../../../domain/shared_slices/Global'
import { reduceReportingFormOnMap } from '../../../domain/use_cases/reporting/reduceReportingFormOnMap'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { MenuWithCloseButton } from '../../commonStyles/map/MenuWithCloseButton'
import { ButtonWrapper } from '../../MainWindow/components/RightMenu/ButtonWrapper'

export function SearchSemaphoreButton() {
  const dispatch = useAppDispatch()
  const isSearchSemaphoreVisible = useAppSelector(state => state.global.isSearchSemaphoreVisible)

  const openOrCloseSearchSemaphore = () => {
    dispatch(globalActions.hideSideButtons())
    dispatch(reduceReportingFormOnMap())
    dispatch(globalActions.setDisplayedItems({ isSearchSemaphoreVisible: !isSearchSemaphoreVisible }))
  }

  return (
    <ButtonWrapper topPosition={178}>
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
