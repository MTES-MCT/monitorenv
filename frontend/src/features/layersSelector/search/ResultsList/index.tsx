import { closeMetadataPanel } from '@features/layersSelector/metadataPanel/slice'
import {
  getIsLinkingAMPToVigilanceArea,
  getIsLinkingRegulatoryToVigilanceArea,
  getIsLinkingZonesToVigilanceArea
} from '@features/VigilanceArea/slice'
import { useGetCurrentUserAuthorizationQueryOverride } from '@hooks/useGetCurrentUserAuthorizationQueryOverride'
import { Checkbox, pluralize } from '@mtes-mct/monitor-ui'
import { layerSidebarActions } from 'domain/shared_slices/LayerSidebar'
import { groupBy } from 'lodash'
import styled from 'styled-components'

import { AMPLayerGroup } from './AMPLayerGroup'
import { RegulatoryLayerGroup } from './RegulatoryLayerGroup'
import { VigilanceAreaLayer } from './VigilanceAreaLayer'
import { useGetAMPsQuery } from '../../../../api/ampsAPI'
import { useGetRegulatoryLayersQuery } from '../../../../api/regulatoryLayersAPI'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import {
  setIsAmpSearchResultsVisible,
  setIsRegulatorySearchResultsVisible,
  setIsVigilanceAreaSearchResultsVisible
} from '../slice'

type ResultListProps = {
  searchedText: string
}

export function ResultList({ searchedText }: ResultListProps) {
  const dispatch = useAppDispatch()

  const { data: user } = useGetCurrentUserAuthorizationQueryOverride()
  const isSuperUser = user?.isSuperUser

  const ampsSearchResult = useAppSelector(state => state.layerSearch.ampsSearchResult)
  const isAmpSearchResultsVisible = useAppSelector(state => state.layerSearch.isAmpSearchResultsVisible)
  const areAmpsResultsOpen = useAppSelector(state => state.layerSidebar.areAmpsResultsOpen)

  const isRegulatorySearchResultsVisible = useAppSelector(state => state.layerSearch.isRegulatorySearchResultsVisible)
  const regulatoryLayersSearchResult = useAppSelector(state => state.layerSearch.regulatoryLayersSearchResult)
  const areRegulatoryResultsOpen = useAppSelector(state => state.layerSidebar.areRegulatoryResultsOpen)

  const isVigilanceAreaSearchResultsVisible = useAppSelector(
    state => state.layerSearch.isVigilanceAreaSearchResultsVisible
  )
  const vigilanceAreaSearchResult = useAppSelector(state => state.layerSearch.vigilanceAreaSearchResult)
  const areMyVigilanceAreasOpen = useAppSelector(state => state.layerSidebar.areMyVigilanceAreasOpen)

  const isLinkingRegulatoryToVigilanceArea = useAppSelector(state => getIsLinkingRegulatoryToVigilanceArea(state))
  const isLinkingAmpToVigilanceArea = useAppSelector(state => getIsLinkingAMPToVigilanceArea(state))
  const isLinkingZonesToVigilanceArea = useAppSelector(state => getIsLinkingZonesToVigilanceArea(state))

  const { data: regulatoryLayers } = useGetRegulatoryLayersQuery()
  const { data: amps } = useGetAMPsQuery()

  const ampResulstsByAMPName = groupBy(ampsSearchResult, a => amps?.entities[a]?.name)

  const regulatoryLayersByLayerName = groupBy(
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

  const toggleVigilanceAreas = () => {
    if (!isVigilanceAreaSearchResultsVisible) {
      dispatch(setIsVigilanceAreaSearchResultsVisible(true))
    }
    dispatch(closeMetadataPanel())
    dispatch(layerSidebarActions.toggleVigilanceAreaResults())
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

  const toggleVigilanceAreaVisibility = (isChecked: boolean | undefined) => {
    if (!isChecked) {
      dispatch(layerSidebarActions.toggleVigilanceAreaResults(false))
    }
    dispatch(closeMetadataPanel())
    dispatch(setIsVigilanceAreaSearchResultsVisible(!!isChecked))
  }

  return (
    <List>
      {regulatoryLayersSearchResult && !isLinkingAmpToVigilanceArea && (
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
              <NumberOfResults>
                ({regulatoryLayersSearchResult?.length || '0'}{' '}
                {pluralize('résultat', regulatoryLayersSearchResult?.length)})
              </NumberOfResults>
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
              ZONES AMP &nbsp;
              <NumberOfResults>
                {' '}
                ({ampsSearchResult?.length || '0'} {pluralize('résultat', ampsSearchResult?.length)})
              </NumberOfResults>
            </Title>
          </HeaderAMP>
          <SubListAMP $isExpanded={areAmpsResultsOpen} data-cy="amp-result-list">
            {Object.entries(ampResulstsByAMPName).map(([ampName, ampIdsInGroup]) => (
              <AMPLayerGroup key={ampName} groupName={ampName} layerIds={ampIdsInGroup} searchedText={searchedText} />
            ))}
          </SubListAMP>
        </>
      )}
      {isSuperUser && vigilanceAreaSearchResult && !isLinkingZonesToVigilanceArea && (
        <>
          <Header>
            <StyledCheckbox
              checked={isVigilanceAreaSearchResultsVisible}
              label=""
              name="isVigilanceAreaSearchResultsVisible"
              onChange={toggleVigilanceAreaVisibility}
            />
            <Title data-cy="vigilance-area-results-list" onClick={toggleVigilanceAreas}>
              ZONES DE VIGILANCE &nbsp;
              <NumberOfResults>
                {' '}
                ({vigilanceAreaSearchResult?.length || '0'} {pluralize('résultat', vigilanceAreaSearchResult?.length)})
              </NumberOfResults>
            </Title>
          </Header>
          <SubList $isExpanded={areMyVigilanceAreasOpen} data-cy="vigilance-area-result-list">
            {vigilanceAreaSearchResult.map(id => (
              <VigilanceAreaLayer key={id} layerId={id} searchedText={searchedText} />
            ))}
          </SubList>
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
  background: ${p => p.theme.color.gainsboro};
`
const NumberOfResults = styled.span`
  color: ${p => p.theme.color.slateGray};
  font-weight: normal;
`
const SubList = styled.ul<{ $isExpanded: boolean }>`
  padding: 0;
  margin: 0;
  display: ${({ $isExpanded }) => ($isExpanded ? 'block' : 'none')};
  max-height: calc(50vh - 110px);
  overflow-y: auto;
  background: ${p => p.theme.color.white};
`
const SubListAMP = styled(SubList)`
  background: ${p => p.theme.color.gainsboro};
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
