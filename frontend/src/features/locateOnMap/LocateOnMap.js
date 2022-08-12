import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import _ from 'lodash'
import { IconButton, Input } from 'rsuite';
import {transformExtent} from 'ol/proj';
import { transform } from 'ol/proj'

import { ReactComponent as SearchIconSVG } from '../icons/Loupe.svg'
import { ReactComponent as CloseIconSVG } from '../icons/Croix_grise.svg'


import { COLORS } from '../../constants/constants'
import { setFitToExtent } from '../../domain/shared_slices/Map'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../domain/entities/map';
import { usePhotonAPI } from '../../api/photonAPI';

export const LocateOnMap = () => {
  const dispatch = useDispatch()
  const [searchedLocation, setSearchedLocation] = useState('')

  const handleResetSearch = () => setSearchedLocation('')
  const handleOnchange = value => {
    console.log("onchange", value)
    setSearchedLocation(value)}

  let latlon
  if (window.location.hash !== '') {
    const hash = window.location.hash.replace('@', '').replace('#', '')
    const viewParts = hash.split(',')
    if (viewParts.length === 3 && !Number.isNaN(viewParts[0]) && !Number.isNaN(viewParts[1]) && !Number.isNaN(viewParts[2])) {
      latlon = transform([viewParts[1], viewParts[0]], OPENLAYERS_PROJECTION, WSG84_PROJECTION)
    }
  }
  
  const results = usePhotonAPI(searchedLocation, {latlon})
  const uniqueResults = _.uniqBy(_.filter(results, location => location?.properties.extent), location => location?.properties?.osm_id).slice(0,10)

  const handleSelectLocation = location => () => {
    dispatch(setFitToExtent({extent : transformExtent(location.properties.extent, WSG84_PROJECTION, OPENLAYERS_PROJECTION)}))
  }
  

  return (
    <Wrapper>
      <InputWrapper>
        <SearchBoxInput
          data-cy={'regulatory-search-input'}
          placeholder={'localiser la carte sur un lieu'}
          type="text"
          value={searchedLocation}
          onChange={handleOnchange}/>
          
        <IconButton 
          title={'chercher un lieu'} 
          onClick={handleResetSearch} 
          icon={searchedLocation === '' ? <SearchIcon className={'rs-icon'} /> : <CloseIcon className={'rs-icon'}/>}
          appearance='primary'
          />
      </InputWrapper>
      <ResultsList>
        {uniqueResults && uniqueResults?.map((location)=>{
          return (<Location onClick={handleSelectLocation(location)} key={location.properties.osm_id}>
              <Name>{location.properties.name}</Name>
              
              <Country>{[location.properties.city || location.properties.osm_value, location.properties.state, location.properties.country].filter(t=>t).join(', ')}</Country>
            </Location>)
        })}
      </ResultsList>

    </Wrapper> 
  )
}


const Wrapper = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`
const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

const SearchBoxInput = styled(Input)`
  display: inline-block;
  background-color: white;
  padding-left: 4px;
  width: ${props => props.value?.length > 0 ? '300px' :'200px'};
  transition: all 0.5s;
  :focus {
    width: 300px;
  }
`

const SearchIcon = styled(SearchIconSVG)`
  width: 16px;
  height: 16px;
`

const CloseIcon = styled(CloseIconSVG)`
  width: 16px;
  height: 16px;
`

const ResultsList = styled.ul`
  width: 306px;
  list-style: none;
  padding: 0;
  text-align: left;
  background: ${COLORS.background}
`

const Location = styled.li`
  padding: 7px;
  display: flex;
  flex-direction: column;
  :hover, :focus {
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