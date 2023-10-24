import { Icon, Size } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { SearchSemaphores } from './SearchSemaphores'
import { ReportingContext, VisibilityState, globalActions } from '../../../domain/shared_slices/Global'
import { reduceReportingFormOnMap } from '../../../domain/use_cases/reporting/reduceReportingFormOnMap'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { MenuWithCloseButton } from '../../commonStyles/map/MenuWithCloseButton'

export function SearchSemaphoreButton() {
  const dispatch = useAppDispatch()
  const global = useAppSelector(state => state.global)
  const mainWindow = useAppSelector(state => state.mainWindow)
  const openOrCloseSearchSemaphore = () => {
    dispatch(globalActions.hideDialogs())
    dispatch(reduceReportingFormOnMap())
    dispatch(globalActions.setDisplayedItems({ isSearchSemaphoreVisible: !global.isSearchSemaphoreVisible }))
  }

  return (
    <Wrapper
      $isShrinked={
        mainWindow.isSideDialogOpen ||
        (global.reportingFormVisibility.context === ReportingContext.MAP &&
          global.reportingFormVisibility.visibility !== VisibilityState.NONE)
      }
    >
      {global.isSearchSemaphoreVisible && <SearchSemaphores />}
      <MenuWithCloseButton.ButtonOnMap
        className={global.isSearchSemaphoreVisible ? '_active' : undefined}
        data-cy="semaphores-button"
        Icon={Icon.Semaphore}
        onClick={openOrCloseSearchSemaphore}
        size={Size.LARGE}
        title="Chercher un sémaphore"
      />
    </Wrapper>
  )
}

const Wrapper = styled.div<{
  $isShrinked: boolean
}>`
  position: absolute;
  top: 178px;
  right: ${p => (p.$isShrinked ? 0 : '10px')};
  display: flex;
  justify-content: flex-end;
  transition: right 0.3s ease-out;
`
