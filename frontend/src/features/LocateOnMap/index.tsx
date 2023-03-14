import { Accent, IconButton, Search, Size } from '@mtes-mct/monitor-ui'
import { transformExtent } from 'ol/proj'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { getPlaceCoordinates, useGooglePlacesAPI } from '../../api/googlePlacesAPI'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../domain/entities/map/constants'
import { setFitToExtent } from '../../domain/shared_slices/Map'
import { ReactComponent as SearchIconSVG } from '../../uiMonitor/icons/Search.svg'

export function LocateOnMap() {
  const dispatch = useDispatch()
  const [searchedLocation, setSearchedLocation] = useState<string | undefined>('')
  const results = useGooglePlacesAPI(searchedLocation)

  const handleSelectLocation = async placeId => {
    const boundingBox = await getPlaceCoordinates(placeId)
    dispatch(setFitToExtent(transformExtent(boundingBox, WSG84_PROJECTION, OPENLAYERS_PROJECTION)))
  }

  return (
    <Wrapper>
      <Search
        data-cy="location-search-input"
        isLabelHidden
        isLight
        isSearchIconHidden
        label="Rechercher un lieu"
        name="search-place"
        onChange={placeId => handleSelectLocation(placeId)}
        onQuery={value => setSearchedLocation(value)}
        options={results}
        placeholder="rechercher un lieu (port, lieu-dit, baie...)"
      />
      <IconButton accent={Accent.PRIMARY} Icon={SearchIcon} size={Size.LARGE} />
    </Wrapper>
  )
}

const SearchIcon = styled(SearchIconSVG)`
  width: 24px;
  height: 24px;
  margin-left: auto;
`

const Wrapper = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 365px;
  z-index: 1001;
  display: flex;

  > div {
    flex-grow: 1;
  }
`
