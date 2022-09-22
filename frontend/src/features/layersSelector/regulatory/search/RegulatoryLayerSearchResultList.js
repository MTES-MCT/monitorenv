import _ from 'lodash'
import React from 'react'
import styled from 'styled-components'

import { COLORS } from '../../../../constants/constants'
import { RegulatoryLayerSearchResultGroupByLayer } from './RegulatoryLayerSearchResultGroupByLayer'

function RegulatoryLayerSearchResultList({ results, searchedText }) {
  const groupedResults = _.groupBy(results, r => r?.doc?.properties?.layer_name)

  return (
    <List>
      {groupedResults &&
        Object.entries(groupedResults).map(([groupName, groupedResult]) => (
          <RegulatoryLayerSearchResultGroupByLayer
            key={groupName}
            groupName={groupName}
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
`

export default RegulatoryLayerSearchResultList
