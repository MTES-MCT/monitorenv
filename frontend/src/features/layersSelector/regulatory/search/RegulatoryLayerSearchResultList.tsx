import _ from 'lodash'
import styled from 'styled-components'

import { COLORS } from '../../../../constants/constants'
import { RegulatoryLayerSearchResultGroupByLayer } from './RegulatoryLayerSearchResultGroupByLayer'

export function RegulatoryLayerSearchResultList({ results, searchedText }) {
  const layersByLayerName = _.groupBy(results, r => r?.doc?.properties?.layer_name)

  return (
    <List>
      {layersByLayerName &&
        Object.entries(layersByLayerName).map(([layerGroupName, groupedResult]) => (
          <RegulatoryLayerSearchResultGroupByLayer
            key={layerGroupName}
            groupName={layerGroupName}
            result={groupedResult}
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
