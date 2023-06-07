import _ from 'lodash'
import styled from 'styled-components'

import { COLORS } from '../../../constants/constants'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { LayerGroup } from './LayerGroup'

export function ResultList({ searchedText }) {
  const { regulatoryLayersSearchResult: foundLayerIds } = useAppSelector(state => state.regulatoryLayerSearch)
  const { regulatoryLayersById } = useAppSelector(state => state.regulatory)
  const layersByLayerName = _.groupBy(foundLayerIds, r => regulatoryLayersById[r]?.properties.layer_name)

  return (
    <List>
      {layersByLayerName &&
        Object.entries(layersByLayerName).map(([layerGroupName, layerIdsInGroup]) => (
          <LayerGroup
            key={layerGroupName}
            groupName={layerGroupName}
            layerIds={layerIdsInGroup}
            searchedText={searchedText}
          />
        ))}
    </List>
  )
}

const List = styled.ul`
  margin: 0;
  background: ${COLORS.background};
  border-radius: 0;
  padding: 0;
  max-height: 50vh;
  overflow-y: auto;
  overflow-x: hidden;
  color: ${COLORS.slateGray};
  transition: 0.5s all;
  border-top: 2px solid ${COLORS.lightGray};
`
