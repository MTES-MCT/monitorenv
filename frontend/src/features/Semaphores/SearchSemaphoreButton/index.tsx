import { Icon, Size } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { SearchSemaphores } from './SearchSemaphores'
import { setDisplayedItems, setReportingFormVisibility } from '../../../domain/shared_slices/Global'
import { ReportingFormVisibility } from '../../../domain/shared_slices/ReportingState'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { MenuWithCloseButton } from '../../commonStyles/map/MenuWithCloseButton'

export function SearchSemaphoreButton() {
  const dispatch = useAppDispatch()
  const { isSearchSemaphoreVisible, reportingFormVisibility } = useAppSelector(state => state.global)

  const openOrCloseSearchSemaphore = () => {
    dispatch(
      setDisplayedItems({
        isSearchSemaphoreVisible: !isSearchSemaphoreVisible,

        missionsMenuIsOpen: false
      })
    )
    if (reportingFormVisibility !== ReportingFormVisibility.NOT_VISIBLE) {
      dispatch(setReportingFormVisibility(ReportingFormVisibility.REDUCE))
    }
  }

  return (
    <Wrapper className={reportingFormVisibility}>
      {isSearchSemaphoreVisible && <SearchSemaphores />}
      <MenuWithCloseButton.ButtonOnMap
        className={isSearchSemaphoreVisible ? '_active' : undefined}
        data-cy="semaphores-button"
        Icon={Icon.Semaphore}
        onClick={openOrCloseSearchSemaphore}
        size={Size.LARGE}
        title="Chercher un sémaphore"
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
  transition: right 0.3s ease-out;
  &.visible {
    right: 0px;
  }
`
