import { Accent, Icon, IconButton, Search, Size } from '@mtes-mct/monitor-ui'
import { transformExtent } from 'ol/proj'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { getPlaceCoordinates, useGooglePlacesAPI } from '../../api/googlePlacesAPI/googlePlacesAPI'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../domain/entities/map/constants'
import { setFitToExtent } from '../../domain/shared_slices/Map'

export function LocateOnMap() {
  const dispatch = useDispatch()
  const [searchedLocation, setSearchedLocation] = useState<string | undefined>('')
  const results = useGooglePlacesAPI(searchedLocation)

  // value is integer, which does not satisfy Rsuite PropType
  // However, it's the only way to hack the broken behavior of Autocomplete
  // displaying value instead of label after selection
  // FIXME: see https://github.com/MTES-MCT/monitor-ui/issues/332
  const options = results.map(r => ({ label: r.label, value: r.value })) as any

  const handleSelectLocation = async placeId => {
    const originalResult = results.find(r => r.value === placeId)
    if (!originalResult) {
      return
    }
    const boundingBox = await getPlaceCoordinates(originalResult?.placeId)
    if (boundingBox) {
      dispatch(setFitToExtent(transformExtent(boundingBox, WSG84_PROJECTION, OPENLAYERS_PROJECTION)))
    }
  }

  return (
    <Wrapper>
      <StyledSearch
        data-cy="location-search-input"
        isLabelHidden
        isLight
        isSearchIconVisible={false}
        label="Rechercher un lieu"
        name="search-place"
        onChange={placeId => handleSelectLocation(placeId)}
        onQuery={value => setSearchedLocation(value)}
        options={options}
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
