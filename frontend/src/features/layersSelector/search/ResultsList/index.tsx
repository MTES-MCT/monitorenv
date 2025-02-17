import { closeMetadataPanel } from '@features/layersSelector/metadataPanel/slice'
import {
  getIsLinkingAMPToVigilanceArea,
  getIsLinkingRegulatoryToVigilanceArea,
  getIsLinkingZonesToVigilanceArea
} from '@features/VigilanceArea/slice'
import { Checkbox, pluralize } from '@mtes-mct/monitor-ui'
import { layerSidebarActions } from 'domain/shared_slices/LayerSidebar'
import { groupBy } from 'lodash-es'
import { useMemo } from 'react'
import styled from 'styled-components'

import { AMPLayerGroup } from './AMPLayerGroup'
import { RegulatoryLayerGroup } from './RegulatoryLayerGroup'
import { VigilanceAreaLayer } from './VigilanceAreaLayer'
import { useGetAMPsQuery } from '../../../../api/ampsAPI'
import { useGetRegulatoryLayersQuery } from '../../../../api/regulatoryLayersAPI'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { useGetFilteredVigilanceAreasForMapQuery } from '../hooks/useGetFilteredVigilanceAreasForMapQuery'
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
  const regulatoryLayersByLayerName = useMemo(
    () =>
      groupBy(
        !regulatoryLayersSearchResult && areRegulatoryResultsOpen
          ? regulatoryLayers?.ids
          : regulatoryLayersSearchResult ?? [],
        r => regulatoryLayers?.entities[r]?.layerName
      ),
    [regulatoryLayersSearchResult, areRegulatoryResultsOpen, regulatoryLayers]
  )

  const sortedRegulatoryResultsByLayerName = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(regulatoryLayersByLayerName).sort(([layerNameA], [layerNameB]) =>
          layerNameA.localeCompare(layerNameB)
        )
      ),
    [regulatoryLayersByLayerName]
  )
  const totalRegulatoryAreas = regulatoryLayersSearchResult?.length ?? regulatoryLayers?.ids?.length ?? 0

  const { data: amps } = useGetAMPsQuery()
  const ampResultsByAMPName = useMemo(
    () =>
      groupBy(
        !ampsSearchResult && areAmpsResultsOpen ? amps?.ids : ampsSearchResult ?? [],
        a => amps?.entities[a]?.name
      ),
    [ampsSearchResult, areAmpsResultsOpen, amps]
  )
  const sortedAmpResultsByName = useMemo(
    () =>
      Object.fromEntries(Object.entries(ampResultsByAMPName).sort(([nameA], [nameB]) => nameA.localeCompare(nameB))),
    [ampResultsByAMPName]
  )

  const totalAmps = ampsSearchResult?.length ?? amps?.ids?.length ?? 0

  const { vigilanceAreas } = useGetFilteredVigilanceAreasForMapQuery()
  const vigilanceAreasResults = useMemo(
    () =>
      !vigilanceAreaSearchResult && areMyVigilanceAreasOpen ? vigilanceAreas?.ids : vigilanceAreaSearchResult ?? [],
    [vigilanceAreaSearchResult, areMyVigilanceAreasOpen, vigilanceAreas]
  )

  const sortedVigilanceAreasResultsByName = useMemo(
    () =>
      vigilanceAreasResults
        .map(id => vigilanceAreas?.entities[id])
        .filter(vigilanceArea => !!vigilanceArea)
        .sort((vigilanceAreaA, vigilanceAreaB) =>
          (vigilanceAreaA?.name ?? '').localeCompare(vigilanceAreaB?.name ?? '')
        ),
    [vigilanceAreasResults, vigilanceAreas]
  )

  const totalVigilanceAreas =
    sortedVigilanceAreasResultsByName.length > 0
      ? sortedVigilanceAreasResultsByName.length
      : vigilanceAreaSearchResult?.length ?? vigilanceAreas?.ids.length ?? 0

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
      {!isLinkingAmpToVigilanceArea && (
        <>
          <Header>
            <StyledCheckbox
              checked={isRegulatorySearchResultsVisible}
              label=""
              name="isRegulatorySearchResultsVisible"
              onChange={toggleRegulatoryVisibility}
            />
            <Title data-cy="regulatory-result-list-button" onClick={toggleRegulatory}>
              ZONES RÉGLEMENTAIRES &nbsp;
              <NumberOfResults>
                ({totalRegulatoryAreas} {pluralize('résultat', totalRegulatoryAreas)})
              </NumberOfResults>
            </Title>
          </Header>
          <SubList $isExpanded={areRegulatoryResultsOpen} data-cy="regulatory-result-list">
            {Object.entries(sortedRegulatoryResultsByLayerName).map(([layerGroupName, layerIdsInGroup]) => (
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

      {!isLinkingRegulatoryToVigilanceArea && (
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
                ({totalAmps} {pluralize('résultat', totalAmps)})
              </NumberOfResults>
            </Title>
          </HeaderAMP>
          <SubListAMP $isExpanded={areAmpsResultsOpen} data-cy="amp-result-list">
            {Object.entries(sortedAmpResultsByName).map(([ampName, ampIdsInGroup]) => (
              <AMPLayerGroup key={ampName} groupName={ampName} layerIds={ampIdsInGroup} searchedText={searchedText} />
            ))}
          </SubListAMP>
        </>
      )}

      {!isLinkingZonesToVigilanceArea && (
        <>
          <Header>
            <StyledCheckbox
              checked={isVigilanceAreaSearchResultsVisible}
              label=""
              name="isVigilanceAreaSearchResultsVisible"
              onChange={toggleVigilanceAreaVisibility}
            />
            <Title data-cy="vigilance-area-results-list-button" onClick={toggleVigilanceAreas}>
              ZONES DE VIGILANCE &nbsp;
              <NumberOfResults>
                ({totalVigilanceAreas} {pluralize('résultat', totalVigilanceAreas)})
              </NumberOfResults>
            </Title>
          </Header>
          <SubList $isExpanded={areMyVigilanceAreasOpen} data-cy="vigilance-area-result-list">
            {sortedVigilanceAreasResultsByName?.map(vigilanceArea => (
              <VigilanceAreaLayer key={vigilanceArea.id} layer={vigilanceArea} searchedText={searchedText} />
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
