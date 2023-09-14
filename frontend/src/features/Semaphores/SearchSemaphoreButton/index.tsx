import { Icon, Size } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { SearchSemaphores } from './SearchSemaphores'
import { setDisplayedItems, ReportingContext, VisibilityState } from '../../../domain/shared_slices/Global'
import { reduceReportingFormOnMap } from '../../../domain/use_cases/reporting/reduceReportingFormOnMap'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { MenuWithCloseButton } from '../../commonStyles/map/MenuWithCloseButton'

export function SearchSemaphoreButton() {
  const dispatch = useAppDispatch()
  const { isSearchSemaphoreVisible, reportingFormVisibility } = useAppSelector(state => state.global)
  const openOrCloseSearchSemaphore = () => {
    dispatch(
      setDisplayedItems({
        isMapToolVisible: undefined,
        isSearchMissionsVisible: false,
        isSearchReportingsVisible: false,
        isSearchSemaphoreVisible: !isSearchSemaphoreVisible
      })
    )
    dispatch(reduceReportingFormOnMap())
  }

  return (
    <Wrapper
      reportingFormVisibility={
        reportingFormVisibility.context === ReportingContext.MAP
          ? reportingFormVisibility.visibility
          : VisibilityState.NONE
      }
    >
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

const Wrapper = styled.div<{ reportingFormVisibility: VisibilityState }>`
  position: absolute;
  top: 178px;
  right: ${p => (p.reportingFormVisibility === VisibilityState.VISIBLE ? '0' : '10')}px;
  display: flex;
  justify-content: flex-end;
  transition: right 0.3s ease-out;
`
