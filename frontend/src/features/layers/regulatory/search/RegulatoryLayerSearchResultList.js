import React from 'react'
import { useSelector } from 'react-redux'
import _ from 'lodash'
import styled from 'styled-components'

import { RegulatoryLayerSearchResultGroupFirstLevel } from './RegulatoryLayerSearchResultGroupFirstLevel'
import { COLORS } from '../../../../constants/constants'


const RegulatoryLayerSearchResultList = ({results, searchedText}) => {
  const {
    advancedSearchIsOpen
  } = useSelector(state => state.regulatoryLayerSearch)

  const groupedResults = _.groupBy(results, r => r?.doc?.properties?.facade)
  return (
    <List $advancedSearchIsOpen={advancedSearchIsOpen}>
      {
        groupedResults && Object.entries(groupedResults).map(([groupName, groupedResult]) => {
            return (
              <RegulatoryLayerSearchResultGroupFirstLevel
                key={groupName}
                groupName={groupName}
                results={groupedResult}
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
  max-height: ${props => props.$advancedSearchIsOpen ? '55vh' : '74vh'};
  overflow-y: auto;
  overflow-x: hidden;
  color: ${COLORS.slateGray};
  transition: 0.5s all;
`

export default RegulatoryLayerSearchResultList
