import { useBeaches } from '@features/LocateOnMap/hook/useBeaches'
import { Accent, Icon, IconButton, OPENLAYERS_PROJECTION, Search, Size, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { getColorWithAlpha } from '@utils/utils'
import { transformExtent } from 'ol/proj'
import { useState } from 'react'
import styled from 'styled-components'

import { getPlaceCoordinates, useGooglePlacesAPI } from '../../api/googlePlacesAPI/googlePlacesAPI'
import { setFitToExtent } from '../../domain/shared_slices/Map'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'

export function LocateOnMap() {
  const dispatch = useAppDispatch()
  const hasFullHeightRightDialogOpen = useAppSelector(state => state.mainWindow.hasFullHeightRightDialogOpen)
  const isRightMenuOpened = useAppSelector(state => state.mainWindow.isRightMenuOpened)

  const [searchedLocation, setSearchedLocation] = useState<string | undefined>('')
  const results = useGooglePlacesAPI(searchedLocation)
  const { beaches, options: beachesResults } = useBeaches()

  const handleSelectLocation = async (placeId: string) => {
    if (!placeId) {
      return
    }
    if (placeId.startsWith('beaches')) {
      const bbox = beaches.find(beach => beach.id === placeId)?.bbox
      if (bbox) {
        dispatch(setFitToExtent(transformExtent(bbox, WSG84_PROJECTION, OPENLAYERS_PROJECTION)))

        return
      }
    }
    const boundingBox = await getPlaceCoordinates(placeId)
    if (boundingBox) {
      dispatch(setFitToExtent(transformExtent(boundingBox, WSG84_PROJECTION, OPENLAYERS_PROJECTION)))
    }
  }

  return (
    <Wrapper $hasFullHeightRightDialogOpen={hasFullHeightRightDialogOpen} $isRightMenuOpened={isRightMenuOpened}>
      <StyledSearch
        data-cy="location-search-input"
        isLabelHidden
        isLight
        isSearchIconHidden
        label="Rechercher un lieu"
        name="search-place"
        onChange={handleSelectLocation}
        onQuery={setSearchedLocation}
        options={[...results, ...beachesResults]}
        placeholder="rechercher un lieu (port, lieu-dit, baie...)"
        size={Size.LARGE}
      />
      <StyledIconButton accent={Accent.PRIMARY} Icon={Icon.Search} size={Size.LARGE} />
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
  width: 365px;
`
const StyledSearch = styled(Search)`
  box-shadow: 0px 3px 6px ${p => getColorWithAlpha(p.theme.color.slateGray, 0.25)};
  flex-grow: 1;
`

// TODO delete padding when Monitor-ui component have good padding
const StyledIconButton = styled(IconButton)`
  padding: 6px;
  margin-left: 5px;
`
