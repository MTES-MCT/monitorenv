import React from 'react'
import { useSelector } from 'react-redux'
import _ from 'lodash'
import styled from 'styled-components'

import RegulatoryLayerSearchResultLawType from './RegulatoryLayerSearchResultLawType'
import { COLORS } from '../../../../constants/constants'


const RegulatoryLayerSearchResultList = ({results}) => {
  const {
    advancedSearchIsOpen
  } = useSelector(state => state.regulatoryLayerSearch)

  const groupedResults = _.groupBy(results, r => r?.doc?.properties?.facade)
  return (
    <List $advancedSearchIsOpen={advancedSearchIsOpen}>
      {
        groupedResults && Object.entries(groupedResults).map(([categoryName, groupedResult]) => {
            return (
              <RegulatoryLayerSearchResultLawType
                key={categoryName}
                categoryName={categoryName}
                results={groupedResult}
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
