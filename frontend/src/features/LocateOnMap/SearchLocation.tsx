import { getPlaceCoordinates, useGooglePlacesAPI } from '@api/googlePlacesAPI/googlePlacesAPI'
import { useBeaches } from '@features/LocateOnMap/hook/useBeaches'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { CustomSearch, OPENLAYERS_PROJECTION, Search, Size, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { getColorWithAlpha } from '@utils/utils'
import { transformExtent } from 'ol/proj'
import { useState } from 'react'
import styled from 'styled-components'

import { setFitToExtent, setLocateOnMap } from '../../domain/shared_slices/Map'

import type { Extent } from 'ol/extent'

export function SearchLocation() {
  const dispatch = useAppDispatch()
  const locateOnMap = useAppSelector(state => state.map.locateOnMap)
  const [searchedLocation, setSearchedLocation] = useState<string | undefined>(undefined)
  const results = useGooglePlacesAPI(searchedLocation)
  const { beaches, error, options: beachesOptions } = useBeaches()

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
    if (extent && location?.id !== locateOnMap?.location.id) {
      dispatch(setLocateOnMap({ extent, location }))
      dispatch(setFitToExtent(extent))
    }
  }

  const onQuery = (searchQuery: string | undefined) => {
    setSearchedLocation(searchQuery)
  }

  const options = [...results, ...beachesOptions]

  const locateOnMapCustomSearch = new CustomSearch(options ?? [], ['label'])

  return (
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
      placeholder="Rechercher un lieu (port, lieu-dit, baie...)"
      size={Size.LARGE}
      value={locateOnMap?.location}
    />
  )
}

const StyledSearch = styled(Search)`
  box-shadow: 0px 3px 6px ${p => getColorWithAlpha(p.theme.color.slateGray, 0.25)};
  flex-grow: 1;
  width: 400px;
`
