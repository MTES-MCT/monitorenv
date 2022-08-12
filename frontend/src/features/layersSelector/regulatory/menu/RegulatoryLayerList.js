import React from 'react'
import { useSelector } from 'react-redux'
import _ from 'lodash'
import styled from 'styled-components'

import { COLORS } from '../../../../constants/constants'
import {RegulatoryLayerGroupSecondLevel} from "./RegulatoryLayerGroupSecondLevel";


const RegulatoryLayerSearchResultList = ({results}) => {
  const {
      advancedSearchIsOpen
  } = useSelector(state => state.regulatoryLayerSearch)
  
  if (_.isEmpty(results)) {
      return (
      <List $advancedSearchIsOpen={advancedSearchIsOpen}> 
        <NoLayerSelected>Aucune zone sélectionnée</NoLayerSelected>
      </List>)
  }

  const groupedResults = _.groupBy(results, r => r?.properties?.layer_name)
  return (
    <List $advancedSearchIsOpen={advancedSearchIsOpen}>
      {
        groupedResults && Object.entries(groupedResults).map(([groupName, groupedResult]) => {
          return (
            <RegulatoryLayerGroupSecondLevel
              key={groupName}
              groupName={groupName}
              result={groupedResult}
            />
          )
        })
      }
    </List>
  )
}

const NoLayerSelected = styled.div`
  color: ${COLORS.grayDarkerTwo};
  margin: 10px;
  font-size: 13px;
  `

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
