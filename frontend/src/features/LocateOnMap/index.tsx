import { SearchLocation } from '@features/LocateOnMap/SearchLocation'
import { SearchSwitcher, SearchType } from '@features/LocateOnMap/SearchSwitcher'
import { SearchVessel } from '@features/Vessel/SearchVessels'
import { vesselAction } from '@features/Vessel/slice'
import { isVesselsEnabled } from '@features/Vessel/utils'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Accent, Icon, IconButton, Size } from '@mtes-mct/monitor-ui'
import { getColorWithAlpha } from '@utils/utils'
import { useState } from 'react'
import styled from 'styled-components'

import { useAppSelector } from '../../hooks/useAppSelector'

export function LocateOnMap() {
  const dispatch = useAppDispatch()
  const [searchType, setSearchType] = useState<SearchType>(SearchType.PLACES)
  const hasFullHeightRightDialogOpen = useAppSelector(state => state.mainWindow.hasFullHeightRightDialogOpen)
  const isRightMenuOpened = useAppSelector(state => state.mainWindow.isRightMenuOpened)
  const [shouldExpand, setIsExpand] = useState(false)

  const handleClickExpand = (nextExpandState: boolean) => {
    setIsExpand(nextExpandState)
  }

  const isSuperUser = useAppSelector(state => state.account.isSuperUser)

  return (
    <Wrapper $hasFullHeightRightDialogOpen={hasFullHeightRightDialogOpen} $isRightMenuOpened={isRightMenuOpened}>
      <SearchWrapper
        $shouldExpand={searchType === SearchType.VESSELS && shouldExpand}
        onClick={() => handleClickExpand(true)}
        onFocus={() => handleClickExpand(true)}
      >
        {searchType === SearchType.PLACES && <SearchLocation />}
        {searchType === SearchType.VESSELS && (
          <SearchVessel
            onChange={item => {
              if (item) {
                dispatch(vesselAction.setSelectedVesselId(item?.id))
              }
            }}
            optionsWidth="500px"
          />
        )}

        {isSuperUser && isVesselsEnabled() && (
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

const SearchWrapper = styled.div<{ $shouldExpand: boolean }>`
  display: flex;
  width: ${p => (p.$shouldExpand ? '500px' : '400px')};
  transition: width 0.2s ease-in-out;
  background-color: ${p => p.theme.color.white};
  ${p => `box-shadow: 0 3px 6px ${getColorWithAlpha(p.theme.color.slateGray, 0.25)}`};
`

// TODO delete padding when Monitor-ui component have good padding
const StyledIconButton = styled(IconButton)`
  padding: 6px;
  margin-left: 5px;
`
