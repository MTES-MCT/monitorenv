import { Accent, IconButton, Search, Size } from '@mtes-mct/monitor-ui'
import { transformExtent } from 'ol/proj'
import { useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { useNominatimAPI } from '../../api/nominatimAPI'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../domain/entities/map/constants'
import { setFitToExtent } from '../../domain/shared_slices/Map'
import { ReactComponent as SearchIconSVG } from '../../uiMonitor/icons/Search.svg'

export function LocateOnMap() {
  const dispatch = useDispatch()
  const [searchedLocation, setSearchedLocation] = useState<string | undefined>('')
  const results = useNominatimAPI(searchedLocation)
  const resultsAsOptions = useMemo(
    () => results.map(value => ({ label: value.display_name, value: value.place_id })),
    [results]
  )

  const handleSelectLocation = placeId => {
    const location = results.find(place => place.place_id === placeId)
    const boundingBox = location?.boundingbox?.map(v => v)
    if (!boundingBox || !boundingBox[0] || !boundingBox[1] || !boundingBox[2] || !boundingBox[3]) {
      return
    }

    const extent = [boundingBox[2], boundingBox[0], boundingBox[3], boundingBox[1]]
    dispatch(setFitToExtent(transformExtent(extent, WSG84_PROJECTION, OPENLAYERS_PROJECTION)))
  }

  return (
    <Wrapper>
      <Search
        data-cy="location-search-input"
        defaultValue={undefined}
        isLabelHidden
        isLight
        isSearchIconHidden
        label="Rechercher un lieu"
        name="search-place"
        onChange={placeId => handleSelectLocation(placeId)}
        onQuery={value => setSearchedLocation(value)}
        options={resultsAsOptions}
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
