import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import _ from 'lodash'
import {transformExtent} from 'ol/proj';

import { RightMenuButton } from "../commonComponents/RightMenuButton/RightMenuButton"
import { ReactComponent as ZoomIconSVG } from '../icons/Loupe.svg'
import { ReactComponent as SearchIconSVG } from '../icons/Loupe_dark.svg'
import { ReactComponent as CloseIconSVG } from '../icons/Croix_grise.svg'


import { COLORS } from '../../constants/constants'
import { setFitToExtent } from '../../domain/shared_slices/Map'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../domain/entities/map';
import { usePhotonAPI } from '../../api/photonAPI';

export const LocateOnMap = () => {
  const dispatch = useDispatch()
  const [searchedLocation, setSearchedLocation] = useState('')

  const handleResetSearch = () => setSearchedLocation('')

  const results = usePhotonAPI(searchedLocation)
  const uniqueResults = _.uniqBy(_.filter(results, location => location?.properties.extent), location => location?.properties?.osm_id)

  const handleSelectLocation = location => () => {
    dispatch(setFitToExtent({extent : transformExtent(location.properties.extent, WSG84_PROJECTION, OPENLAYERS_PROJECTION)}))
  }
  
  const handleOnClick = () => {
    setSearchedLocation('')
  }

  return (<RightMenuButton top={10} title={'locate on map'} onClick={handleOnClick} button={<ZoomIcon />}>
    <div>
      <div>
        <SearchBoxInput
          data-cy={'regulatory-search-input'}
          placeholder={'localiser la carte sur un lieu'}
          type="text"
          value={searchedLocation}
          onChange={e => setSearchedLocation(e.target.value)}/>
          {
            searchedLocation === ''
              ? <SearchIcon/>
              : <CloseIcon onClick={handleResetSearch }/>
          }
      </div>
      <ResultsList>
        {uniqueResults && uniqueResults?.map((location)=>{
          return (<Location onClick={handleSelectLocation(location)} key={location.properties.osm_id}>
              <Name>{location.properties.name}</Name>
              <Country>{location.properties.country}</Country>
            </Location>)
        })}
      </ResultsList>

    </div> 
  </RightMenuButton>)
}



const ZoomIcon = styled(ZoomIconSVG)`
  margin-top: 4px;
  width: 24px;
  height: 24px;
`
const SearchBoxInput = styled.input`
  margin: 0;
  background-color: white;
  border: none;
  border-radius: 0;
  color: ${COLORS.gunMetal};
  font-size: 13px;
  height: 40px;
  width: 250px;
  flex: 1;
  padding: 0 5px 0 10px;
  border-bottom: 1px ${COLORS.lightGray} solid;
  :hover, :focus {
    border-bottom: 1px ${COLORS.lightGray} solid;
  }
`
const SearchIcon = styled(SearchIconSVG)`
  width: 25px;
  height: 25px;
  padding: 9px 11px 6px 9px;
  background: ${COLORS.background};
  vertical-align: top;
  border-bottom: 1px ${COLORS.lightGray} solid;
`

const CloseIcon = styled(CloseIconSVG)`
  width: 20px;
  height: 17px;
  padding: 13px 11px 10px 9px;
  background: ${COLORS.background};
  vertical-align: top;
  border-bottom: 1px ${COLORS.lightGray} solid;
  cursor: pointer;
`

const ResultsList = styled.ul`
  list-style: none;
  padding: 0;
  text-align: left;
  background: ${COLORS.background}
`

const Location = styled.li`
  padding: 7px;
  display: flex;
  :hover, :focus {
    background: ${COLORS.gainsboro};
    cursor: pointer;
  }
`
const Name = styled.span`
  flex: 1;
`

const Country = styled.span`
  font-style: italic;
  text-align: right;
`