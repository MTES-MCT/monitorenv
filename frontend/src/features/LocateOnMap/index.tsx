import { SearchLocation } from '@features/LocateOnMap/SearchLocation'
import { SearchSwitcher, SearchType } from '@features/LocateOnMap/SearchSwitcher'
import { SearchVessel } from '@features/Vessel/SearchVessels'
import { Accent, Icon, IconButton, Size } from '@mtes-mct/monitor-ui'
import { useState } from 'react'
import styled from 'styled-components'

import { useAppSelector } from '../../hooks/useAppSelector'

export const isVesselsEnabled = () => import.meta.env.FRONTEND_VESSELS_ENABLED === 'true'

export function LocateOnMap() {
  const [searchType, setSearchType] = useState<SearchType>(SearchType.PLACES)
  const hasFullHeightRightDialogOpen = useAppSelector(state => state.mainWindow.hasFullHeightRightDialogOpen)
  const isRightMenuOpened = useAppSelector(state => state.mainWindow.isRightMenuOpened)

  return (
    <Wrapper $hasFullHeightRightDialogOpen={hasFullHeightRightDialogOpen} $isRightMenuOpened={isRightMenuOpened}>
      {searchType === SearchType.PLACES && <SearchLocation />}
      {searchType === SearchType.VESSELS && <SearchVessel />}

      {isVesselsEnabled() && (
        <SearchSwitcher onChange={nextSearchType => setSearchType(nextSearchType)} searchType={searchType} />
      )}
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

// TODO delete padding when Monitor-ui component have good padding
const StyledIconButton = styled(IconButton)`
  padding: 6px;
  margin-left: 5px;
`
