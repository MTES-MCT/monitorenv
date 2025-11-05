import { SearchLocation } from '@features/LocateOnMap/SearchLocation'
import { SearchSwitcher, SearchType } from '@features/LocateOnMap/SearchSwitcher'
import { SearchVessel } from '@features/Vessel/SearchVessels'
import { vesselAction } from '@features/Vessel/slice'
import { isVesselsEnabled } from '@features/Vessel/utils'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Accent, Icon, IconButton, Size } from '@mtes-mct/monitor-ui'
import { useState } from 'react'
import styled from 'styled-components'

import { useAppSelector } from '../../hooks/useAppSelector'

export function LocateOnMap() {
  const dispatch = useAppDispatch()
  const [searchType, setSearchType] = useState<SearchType>(SearchType.PLACES)
  const hasFullHeightRightDialogOpen = useAppSelector(state => state.mainWindow.hasFullHeightRightDialogOpen)
  const isRightMenuOpened = useAppSelector(state => state.mainWindow.isRightMenuOpened)

  return (
    <Wrapper $hasFullHeightRightDialogOpen={hasFullHeightRightDialogOpen} $isRightMenuOpened={isRightMenuOpened}>
      <SearchWrapper>
        {searchType === SearchType.PLACES && <SearchLocation />}
        {searchType === SearchType.VESSELS && (
          <SearchVessel
            onChange={item => {
              if (item) {
                dispatch(vesselAction.setSelectedVesselId(item?.id))
              }
            }}
          />
        )}

        {isVesselsEnabled() && (
          <SearchSwitcher onChange={nextSearchType => setSearchType(nextSearchType)} searchType={searchType} />
        )}
      </SearchWrapper>
      <StyledIconButton accent={Accent.PRIMARY} Icon={Icon.Search} size={Size.LARGE} tabIndex={-1} title="Rechercher" />
    </Wrapper>
  )
}

const Wrapper = styled.div<{
  $hasFullHeightRightDialogOpen: boolean
  $isRightMenuOpened: boolean
}>`
  display: flex;
  position: absolute;
  right: ${p =>
    // eslint-disable-next-line no-nested-ternary
    p.$hasFullHeightRightDialogOpen ? (p.$isRightMenuOpened ? 560 : 512) : 10}px;
  top: 10px;
  transition: right 0.5s ease-out;
`

const SearchWrapper = styled.div`
  display: flex;
  width: 500px;
`

// TODO delete padding when Monitor-ui component have good padding
const StyledIconButton = styled(IconButton)`
  padding: 6px;
  margin-left: 5px;
`
