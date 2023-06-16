import { Checkbox } from '@mtes-mct/monitor-ui'
import _ from 'lodash'
import { useState } from 'react'
import styled from 'styled-components'

import { useGetAMPsQuery } from '../../../../api/ampsAPI'
import { COLORS } from '../../../../constants/constants'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { setIsAmpSearchResultsVisible, setIsRegulatorySearchResultsVisible } from '../LayerSearch.slice'
import { AMPLayerGroup } from './AMPLayerGroup'
import { RegulatoryLayerGroup } from './RegulatoryLayerGroup'

export function ResultList({ searchedText }) {
  const {
    ampsSearchResult,
    isAmpSearchResultsVisible,
    isRegulatorySearchResultsVisible,
    regulatoryLayersSearchResult
  } = useAppSelector(state => state.layerSearch)
  const dispatch = useAppDispatch()
  const { regulatoryLayersById } = useAppSelector(state => state.regulatory)
  const { data: amps } = useGetAMPsQuery()

  const [showRegulatory, setShowRegulatory] = useState<boolean>(true)
  const [showAMPs, setShowAMPs] = useState<boolean>(true)

  const ampsByAMPName = _.groupBy(amps?.entities, a => a?.name)
  const ampResulstsByAMPName = _.groupBy(ampsSearchResult, a => amps?.entities[a]?.name)

  const regulatoryLayersByLayerName = _.groupBy(
    regulatoryLayersSearchResult,
    r => regulatoryLayersById[r]?.properties.layer_name
  )
  const toggleRegulatory = () => {
    setShowRegulatory(!showRegulatory)
    setShowAMPs(false)
  }
  const toggleAMPs = () => {
    setShowRegulatory(false)
    setShowAMPs(!showAMPs)
  }

  const toggleAMPVisibility = () => {
    setShowAMPs(false)
    dispatch(setIsAmpSearchResultsVisible(!isAmpSearchResultsVisible))
  }
  const toggleRegulatoryVisibility = () => {
    setShowRegulatory(false)
    dispatch(setIsRegulatorySearchResultsVisible(!isRegulatorySearchResultsVisible))
  }

  return (
    <List>
      {regulatoryLayersSearchResult && (
        <>
          <Header onClick={toggleRegulatory}>
            <Checkbox
              checked={isRegulatorySearchResultsVisible}
              label=""
              name="isRegulatorySearchResultsVisible"
              onChange={toggleRegulatoryVisibility}
            />
            ZONES RÉGLEMENTAIRES{' '}
            <NumberOfResults>({regulatoryLayersSearchResult?.length || '0'} résultats)</NumberOfResults>
          </Header>
          <SubList $isExpanded={showRegulatory}>
            {Object.entries(regulatoryLayersByLayerName).map(([layerGroupName, layerIdsInGroup]) => (
              <RegulatoryLayerGroup
                key={layerGroupName}
                groupName={layerGroupName}
                layerIds={layerIdsInGroup}
                searchedText={searchedText}
              />
            ))}
          </SubList>
        </>
      )}
      {ampsSearchResult && (
        <>
          <HeaderAMP onClick={toggleAMPs}>
            <Checkbox
              checked={isAmpSearchResultsVisible}
              label=""
              name="isAmpSearchResultsVisible"
              onChange={toggleAMPVisibility}
            />{' '}
            ZONES AMP
            <NumberOfResults>( {ampsSearchResult?.length || '0'} résultats)</NumberOfResults>
          </HeaderAMP>
          <SubList $isExpanded={showAMPs}>
            {Object.entries(ampResulstsByAMPName).map(([ampName, ampIdsInGroup]) => (
              <AMPLayerGroup
                key={ampName}
                groupName={ampName}
                groups={ampsByAMPName}
                layerIds={ampIdsInGroup}
                searchedText={searchedText}
              />
            ))}
          </SubList>
        </>
      )}
    </List>
  )
}

const Header = styled.div`
  text-align: left;
  padding: 8px 16px;
  font-weight: bold;
  cursor: pointer;
  height: 36px;
  color: ${COLORS.gunMetal};
  border-bottom: 1px solid ${COLORS.lightGray};
`
const HeaderAMP = styled(Header)`
  background: ${COLORS.ampBackground};
`
const NumberOfResults = styled.span`
  color: ${COLORS.slateGray};
  font-weight: normal;
`
const SubList = styled.ul<{ $isExpanded: boolean }>`
  padding: 0;
  margin: 0;
  display: ${({ $isExpanded }) => ($isExpanded ? 'block' : 'none')};
  max-height: calc(50vh - 72px);
  overflow-y: auto;
`
const List = styled.div`
  background: ${COLORS.background};
  border-radius: 0;
  max-height: 50vh;
  color: ${COLORS.slateGray};
  transition: 0.5s all;
  border-top: 2px solid ${COLORS.lightGray};
  overflow-y: hidden;
`
