import React from 'react'
import _ from 'lodash'
import styled from 'styled-components'

import { RegulatoryLayerSearchResultGroupByLayer } from './RegulatoryLayerSearchResultGroupByLayer'
import { COLORS } from '../../../../constants/constants'


const RegulatoryLayerSearchResultList = ({results, searchedText}) => {
  const groupedResults = _.groupBy(results, r => r?.doc?.properties?.layer_name)
  return (
    <List>
      {
        groupedResults && Object.entries(groupedResults).map(([groupName, groupedResult]) => {
            return (
              <RegulatoryLayerSearchResultGroupByLayer
                key={groupName}
                groupName={groupName}
                result={groupedResult}
                searchedText={searchedText}
              />
            )
          })
      }
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
