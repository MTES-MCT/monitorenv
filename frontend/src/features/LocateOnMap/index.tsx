import { Accent, Icon, IconButton, Search, Size } from '@mtes-mct/monitor-ui'
import { transformExtent } from 'ol/proj'
import { useState } from 'react'
import styled from 'styled-components'

import { getVisibilityState } from './utils'
import { getPlaceCoordinates, useGooglePlacesAPI } from '../../api/googlePlacesAPI/googlePlacesAPI'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../domain/entities/map/constants'
import { VisibilityState } from '../../domain/shared_slices/Global'
import { setFitToExtent } from '../../domain/shared_slices/Map'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'

export function LocateOnMap() {
  const dispatch = useAppDispatch()
  const global = useAppSelector(state => state.global)
  const [searchedLocation, setSearchedLocation] = useState<string | undefined>('')
  const results = useGooglePlacesAPI(searchedLocation)

  const visibilityState = getVisibilityState(global)

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
    <Wrapper $visibilityState={visibilityState}>
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

const Wrapper = styled.div<{ $visibilityState: VisibilityState }>`
  position: absolute;
  top: 10px;
  right: ${p => {
    switch (p.$visibilityState) {
      case VisibilityState.VISIBLE:
        return '512'
      case VisibilityState.VISIBLE_LEFT:
        return '560'
      default:
        return '10'
    }
  }}px;
  width: 365px;
  display: flex;
  transition: right 0.5s ease-out;

  > div {
    flex-grow: 1;
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
