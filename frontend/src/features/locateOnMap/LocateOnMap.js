import _ from 'lodash'
import { transformExtent, transform } from 'ol/proj'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Input, IconButton } from 'rsuite'
import styled from 'styled-components'

import { usePhotonAPI } from '../../api/photonAPI'
import { COLORS } from '../../constants/constants'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../domain/entities/map'
import { setFitToExtent } from '../../domain/shared_slices/Map'
import { ReactComponent as SearchIconSVG } from '../../uiMonitor/icons/Search.svg'

export function LocateOnMap() {
  const dispatch = useDispatch()
  const [searchedLocation, setSearchedLocation] = useState('')

  // const handleResetSearch = () => setSearchedLocation('')
  const handleOnchange = value => {
    setSearchedLocation(value)
  }

  let latlon
  if (window.location.hash !== '') {
    const hash = window.location.hash.replace('@', '').replace('#', '')
    const viewParts = hash.split(',')
    if (
      viewParts.length === 3 &&
      !Number.isNaN(viewParts[0]) &&
      !Number.isNaN(viewParts[1]) &&
      !Number.isNaN(viewParts[2])
    ) {
      latlon = transform([viewParts[1], viewParts[0]], OPENLAYERS_PROJECTION, WSG84_PROJECTION)
    }
  }

  const results = usePhotonAPI(searchedLocation, { latlon })
  const uniqueResults = _.uniqBy(
    _.filter(results, location => location?.properties.extent),
    location => location?.properties?.osm_id
  ).slice(0, 10)

  const handleSelectLocation = location => () => {
    dispatch(setFitToExtent(transformExtent(location.properties.extent, WSG84_PROJECTION, OPENLAYERS_PROJECTION)))
  }

  return (
    <Wrapper>
      <InputWrapper>
        <SearchBoxInput
          data-cy="location-search-input"
          onChange={handleOnchange}
          placeholder="rechercher un lieu (port, lieu-dit, baie...)"
          size="lg"
          type="text"
          value={searchedLocation}
        />
        <IconButton appearance="primary" icon={<SearchIcon />} size="lg" />
      </InputWrapper>
      <ResultsList>
        {uniqueResults &&
          uniqueResults?.map(location => (
            <Location key={location.properties.osm_id} onClick={handleSelectLocation(location)}>
              <Name>{location.properties.name}</Name>

              <Country>
                {[
                  location.properties.city || location.properties.osm_value,
                  location.properties.state,
                  location.properties.country
                ]
                  .filter(t => t)
                  .join(', ')}
              </Country>
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
  width: 306px;
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

const Country = styled.div`
  font-style: italic;
  text-align: right;
`
