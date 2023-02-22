import { transformExtent } from 'ol/proj'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Input, IconButton } from 'rsuite'
import styled from 'styled-components'

import { useNominatimAPI } from '../../api/nominatimAPI'
import { COLORS } from '../../constants/constants'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../domain/entities/map/constants'
import { setFitToExtent } from '../../domain/shared_slices/Map'
import { ReactComponent as SearchIconSVG } from '../../uiMonitor/icons/Search.svg'

export function LocateOnMap() {
  const dispatch = useDispatch()
  const [searchedLocation, setSearchedLocation] = useState('')

  const results = useNominatimAPI(searchedLocation)

  const handleSelectLocation = location => () => {
    const bb = location?.boundingbox?.map(v => parseFloat(v))
    const extent = [bb[2], bb[0], bb[3], bb[1]]
    dispatch(setFitToExtent(transformExtent(extent, WSG84_PROJECTION, OPENLAYERS_PROJECTION)))
  }

  return (
    <Wrapper>
      <InputWrapper>
        <SearchBoxInput
          data-cy="location-search-input"
          onChange={setSearchedLocation}
          placeholder="rechercher un lieu (port, lieu-dit, baie...)"
          size="lg"
          type="text"
          value={searchedLocation}
        />
        <IconButton appearance="primary" icon={<SearchIcon />} size="lg" />
      </InputWrapper>
      <ResultsList>
        {results &&
          results?.map(location => (
            <Location key={location.osm_id} onClick={handleSelectLocation(location)}>
              <Name>{location?.display_name}</Name>
            </Location>
          ))}
      </ResultsList>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 365px;
  z-index: 1001;
`
const InputWrapper = styled.div`
  border: 0;
  display: flex;
  width: 365px;
`

const SearchBoxInput = styled(Input)`
  display: inline-block;
  background-color: white;
  box-shadow: 0px 3px 6px ${COLORS.slateGray};
  :focus-within {
    outline: none !important;
    border-bottom: 2px solid ${COLORS.blueGray};
  }
  padding-left: 16px;
  padding-top: 9px;
  padding-bottom: 10px;
  font-size: 13px;
  line-height: 18px;
  width: 320px;
  :focus {
    outline: none !important;
  }
  .rs-input-group-addon {
    padding-top: 10px;
    padding-bottom: 10px;
  }
  margin-right: auto;
`
const SearchIcon = styled(SearchIconSVG)`
  width: 26px;
  height: 26px;
`

const ResultsList = styled.ul`
  width: 318px;
  list-style: none;
  padding: 0;
  text-align: left;
  background: ${COLORS.background};
`

const Location = styled.li`
  padding: 7px;
  display: flex;
  flex-direction: column;
  :hover,
  :focus {
    background: ${COLORS.gainsboro};
    cursor: pointer;
  }
`
const Name = styled.div`
  flex: 1;
`
