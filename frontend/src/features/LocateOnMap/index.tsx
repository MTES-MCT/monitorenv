import { Accent, Icon, IconButton, Search, Size } from '@mtes-mct/monitor-ui'
import { transformExtent } from 'ol/proj'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { getPlaceCoordinates, useGooglePlacesAPI } from '../../api/googlePlacesAPI/googlePlacesAPI'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../domain/entities/map/constants'
import { setFitToExtent } from '../../domain/shared_slices/Map'
import { useAppSelector } from '../../hooks/useAppSelector'

export function LocateOnMap() {
  const dispatch = useDispatch()
  const { isReportFormOpen } = useAppSelector(state => state.global)
  const [searchedLocation, setSearchedLocation] = useState<string | undefined>('')
  const results = useGooglePlacesAPI(searchedLocation)

  const handleSelectLocation = async placeId => {
    if (!placeId) {
      return
    }
    const boundingBox = await getPlaceCoordinates(placeId)
    if (boundingBox) {
      dispatch(setFitToExtent(transformExtent(boundingBox, WSG84_PROJECTION, OPENLAYERS_PROJECTION)))
    }
  }

  return (
    <Wrapper className={isReportFormOpen ? 'left' : undefined}>
      <StyledSearch
        data-cy="location-search-input"
        isLabelHidden
        isLight
        isSearchIconVisible={false}
        label="Rechercher un lieu"
        name="search-place"
        onChange={handleSelectLocation}
        onQuery={setSearchedLocation}
        options={results}
        placeholder="rechercher un lieu (port, lieu-dit, baie...)"
      />
      <StyledIconButton accent={Accent.PRIMARY} Icon={Icon.Search} size={Size.LARGE} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 365px;
  z-index: 1001;
  display: flex;
  transition: right 0.5s ease-out;

  > div {
    flex-grow: 1;
  }

  &.left {
    right: 512px;
  }
`
const StyledSearch = styled(Search)`
  box-shadow: 0px 3px 6px ${p => p.theme.color.slateGray};
`

// TODO delete padding when Monitor-ui component have good padding
const StyledIconButton = styled(IconButton)`
  padding: 6px;
  margin-left: 5px;
`
