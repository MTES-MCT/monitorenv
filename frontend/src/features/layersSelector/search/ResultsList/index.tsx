import { closeMetadataPanel } from '@features/layersSelector/metadataPanel/slice'
import { Checkbox } from '@mtes-mct/monitor-ui'
import { layerSidebarActions } from 'domain/shared_slices/LayerSidebar'
import _ from 'lodash'
import styled from 'styled-components'

import { AMPLayerGroup } from './AMPLayerGroup'
import { RegulatoryLayerGroup } from './RegulatoryLayerGroup'
import { useGetAMPsQuery } from '../../../../api/ampsAPI'
import { useGetRegulatoryLayersQuery } from '../../../../api/regulatoryLayersAPI'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { setIsAmpSearchResultsVisible, setIsRegulatorySearchResultsVisible } from '../slice'

type ResultListProps = {
  searchedText: string
}

export function ResultList({ searchedText }: ResultListProps) {
  const dispatch = useAppDispatch()

  const ampsSearchResult = useAppSelector(state => state.layerSearch.ampsSearchResult)
  const isAmpSearchResultsVisible = useAppSelector(state => state.layerSearch.isAmpSearchResultsVisible)
  const isRegulatorySearchResultsVisible = useAppSelector(state => state.layerSearch.isRegulatorySearchResultsVisible)
  const regulatoryLayersSearchResult = useAppSelector(state => state.layerSearch.regulatoryLayersSearchResult)
  const areRegulatoryResultsOpen = useAppSelector(state => state.layerSidebar.areRegulatoryResultsOpen)
  const areAmpsResultsOpen = useAppSelector(state => state.layerSidebar.areAmpsResultsOpen)

  const isLinkingRegulatoryToVigilanceArea = useAppSelector(state => isLinkingRegulatoryToVigilanceArea(state))

  const { data: regulatoryLayers } = useGetRegulatoryLayersQuery()
  const { data: amps } = useGetAMPsQuery()

  const ampResulstsByAMPName = _.groupBy(ampsSearchResult, a => amps?.entities[a]?.name)

  const regulatoryLayersByLayerName = _.groupBy(
    regulatoryLayersSearchResult,
    r => regulatoryLayers?.entities[r]?.layer_name
  )
  const toggleRegulatory = () => {
    if (!isRegulatorySearchResultsVisible) {
      dispatch(setIsRegulatorySearchResultsVisible(true))
    }
    dispatch(closeMetadataPanel())
    dispatch(layerSidebarActions.toggleRegulatoryResults())
  }
  const toggleAMPs = () => {
    if (!isAmpSearchResultsVisible) {
      dispatch(setIsAmpSearchResultsVisible(true))
    }
    dispatch(closeMetadataPanel())
    dispatch(layerSidebarActions.toggleAmpResults())
  }

  const toggleAMPVisibility = (isChecked: boolean | undefined) => {
    if (!isChecked) {
      dispatch(layerSidebarActions.toggleAmpResults(false))
    }
    dispatch(closeMetadataPanel())
    dispatch(setIsAmpSearchResultsVisible(!!isChecked))
  }

  const toggleRegulatoryVisibility = (isChecked: boolean | undefined) => {
    if (!isChecked) {
      dispatch(layerSidebarActions.toggleRegulatoryResults(false))
    }
    dispatch(closeMetadataPanel())
    dispatch(setIsRegulatorySearchResultsVisible(!!isChecked))
  }

  return (
    <List>
      {regulatoryLayersSearchResult && (
        <>
          <Header>
            <StyledCheckbox
              checked={isRegulatorySearchResultsVisible}
              label=""
              name="isRegulatorySearchResultsVisible"
              onChange={toggleRegulatoryVisibility}
            />
            <Title data-cy="regulatory-layers-result-title" onClick={toggleRegulatory}>
              ZONES RÉGLEMENTAIRES &nbsp;
              <NumberOfResults>({regulatoryLayersSearchResult?.length || '0'} résultats)</NumberOfResults>
            </Title>
          </Header>
          <SubList $isExpanded={areRegulatoryResultsOpen}>
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
      {ampsSearchResult && !isLinkingRegulatoryToVigilanceArea && (
        <>
          <HeaderAMP>
            <StyledCheckbox
              checked={isAmpSearchResultsVisible}
              label=""
              name="isAmpSearchResultsVisible"
              onChange={toggleAMPVisibility}
            />
            <Title data-cy="amp-results-list-button" onClick={toggleAMPs}>
              ZONES AMP &nbsp;<NumberOfResults> ({ampsSearchResult?.length || '0'} résultats)</NumberOfResults>
            </Title>
          </HeaderAMP>
          <SubListAMP $isExpanded={areAmpsResultsOpen} data-cy="amp-result-list">
            {Object.entries(ampResulstsByAMPName).map(([ampName, ampIdsInGroup]) => (
              <AMPLayerGroup key={ampName} groupName={ampName} layerIds={ampIdsInGroup} searchedText={searchedText} />
            ))}
          </SubListAMP>
        </>
      )}
    </List>
  )
}

const Header = styled.div`
  display: flex;
  text-align: left;
  font-weight: bold;
  cursor: pointer;
  height: 36px;
  color: ${p => p.theme.color.gunMetal};
  border-bottom: 1px solid ${p => p.theme.color.lightGray};
`
const Title = styled.div`
  padding: 8px 0px 8px 8px;
  width: 100%;
`

const StyledCheckbox = styled(Checkbox)`
  margin: 5px 0px 0px 8px;
`

const HeaderAMP = styled(Header)`
  background: ${p => p.theme.color.chineseRed}1A;
`
const NumberOfResults = styled.span`
  color: ${p => p.theme.color.slateGray};
  font-weight: normal;
`
const SubList = styled.ul<{ $isExpanded: boolean }>`
  padding: 0;
  margin: 0;
  display: ${({ $isExpanded }) => ($isExpanded ? 'block' : 'none')};
  max-height: calc(50vh - 72px);
  overflow-y: auto;
  background: ${p => p.theme.color.white};
`
const SubListAMP = styled(SubList)`
  background: ${p => p.theme.color.chineseRed}1A;
`
const List = styled.div`
  background: ${p => p.theme.color.white};
  border-radius: 0;
  max-height: 50vh;
  color: ${p => p.theme.color.slateGray};
  transition: 0.5s all;
  border-top: 2px solid ${p => p.theme.color.lightGray};
  overflow-y: hidden;
`
