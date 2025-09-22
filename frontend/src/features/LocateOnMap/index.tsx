import { useBeaches } from '@features/LocateOnMap/hook/useBeaches'
import {
  Accent,
  CustomSearch,
  Icon,
  IconButton,
  OPENLAYERS_PROJECTION,
  Search,
  Size,
  WSG84_PROJECTION
} from '@mtes-mct/monitor-ui'
import { getColorWithAlpha } from '@utils/utils'
import { transformExtent } from 'ol/proj'
import { useState } from 'react'
import styled from 'styled-components'

import { getPlaceCoordinates, useGooglePlacesAPI } from '../../api/googlePlacesAPI/googlePlacesAPI'
import { setFitToExtent, setLocateOnMap } from '../../domain/shared_slices/Map'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'

import type { Extent } from 'ol/extent'

export function LocateOnMap() {
  const dispatch = useAppDispatch()
  const hasFullHeightRightDialogOpen = useAppSelector(state => state.mainWindow.hasFullHeightRightDialogOpen)
  const isRightMenuOpened = useAppSelector(state => state.mainWindow.isRightMenuOpened)
  const locateOnMap = useAppSelector(state => state.map.locateOnMap)
  const [searchedLocation, setSearchedLocation] = useState<string | undefined>(undefined)
  const results = useGooglePlacesAPI(searchedLocation)
  const { beaches, error, options: beachesResults } = useBeaches()

  const handleSelectLocation = async (location: { id: string; name: string } | undefined) => {
    if (!location || !location?.id) {
      dispatch(setLocateOnMap(undefined))

      return
    }
    let extent: Extent | undefined

    if (location.id.startsWith('beaches')) {
      const selectedBeach = beaches.find(beach => beach.id === location.id)
      if (selectedBeach) {
        extent = transformExtent(selectedBeach.bbox, WSG84_PROJECTION, OPENLAYERS_PROJECTION)
      }
    } else {
      const place = await getPlaceCoordinates(location.id)
      if (place?.bbox) {
        extent = transformExtent(place.bbox, WSG84_PROJECTION, OPENLAYERS_PROJECTION)
      }
    }
    if (extent) {
      dispatch(setLocateOnMap({ extent, location }))
      dispatch(setFitToExtent(extent))
    }
  }

  const onQuery = (searchQuery: string | undefined) => {
    setSearchedLocation(searchQuery)
  }

  const options = [...results, ...beachesResults]

  const locateOnMapCustomSearch = new CustomSearch(options ?? [], ['label'])

  return (
    <Wrapper $hasFullHeightRightDialogOpen={hasFullHeightRightDialogOpen} $isRightMenuOpened={isRightMenuOpened}>
      <StyledSearch
        key="location-search"
        customSearch={locateOnMapCustomSearch}
        data-cy="location-search-input"
        error={error}
        isLabelHidden
        isLight
        isSearchIconHidden
        label="Rechercher un lieu"
        name="search-place"
        onChange={handleSelectLocation}
        onQuery={onQuery}
        options={options}
        optionValueKey="name"
        placeholder="rechercher un lieu (port, lieu-dit, baie...)"
        size={Size.LARGE}
        value={locateOnMap?.location}
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
