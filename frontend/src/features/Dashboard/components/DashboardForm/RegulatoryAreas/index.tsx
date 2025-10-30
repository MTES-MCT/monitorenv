import { useGetRegulatoryLayersQuery } from '@api/regulatoryLayersAPI'
import { dashboardActions, getOpenedPanel } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { pluralize } from '@mtes-mct/monitor-ui'
import { groupBy } from 'lodash'
import { forwardRef, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { Accordion, Title, TitleContainer } from '../Accordion'
import { SelectedAccordion } from '../SelectedAccordion'
import { ResultNumber, SelectedLayerList, StyledLayerList } from '../style'
import { ListLayerGroup } from './ListLayerGroup'
import { RegulatoryPanel } from './Panel'
import { StyledToggleSelectAll } from '../ToggleSelectAll'
import { getSelectionState, handleSelection } from '../ToggleSelectAll/utils'

import type { RegulatoryLayerCompactFromAPI } from 'domain/entities/regulatory'

type RegulatoriesAreasProps = {
  columnWidth: number
  isExpanded: boolean
  isSelectedAccordionOpen: boolean
  regulatoryAreas: RegulatoryLayerCompactFromAPI[]
  selectedRegulatoryAreaIds: number[]
  setExpandedAccordion: () => void
}
export const RegulatoryAreas = forwardRef<HTMLDivElement, RegulatoriesAreasProps>(
  (
    {
      columnWidth,
      isExpanded,
      isSelectedAccordionOpen,
      regulatoryAreas,
      selectedRegulatoryAreaIds,
      setExpandedAccordion
    },
    ref
  ) => {
    const dispatch = useAppDispatch()
    const openPanel = useAppSelector(state => getOpenedPanel(state.dashboard, Dashboard.Block.REGULATORY_AREAS))
    const [isExpandedSelectedAccordion, setExpandedSelectedAccordion] = useState(false)

    const regulatoryAreasByLayerName = groupBy(
      [...regulatoryAreas].sort((a, b) => a?.layerName.localeCompare(b?.layerName)) ?? [],
      regulatory => regulatory.layerName
    )

    // FIXME: replace with endpoint findByIds/groupName
    const { selectedRegulatoryAreasByLayerName } = useGetRegulatoryLayersQuery(
      { withGeometry: false },
      {
        selectFromResult: ({ data }) => ({
          selectedRegulatoryAreasByLayerName: groupBy(
            Object.values(data?.entities ?? [])
              .filter(regulatory => selectedRegulatoryAreaIds.includes(regulatory.id))
              .sort((a, b) => a.layerName.localeCompare(b.layerName)),
            regulatory => regulatory.layerName
          )
        })
      }
    )

    useEffect(() => {
      if (isSelectedAccordionOpen) {
        setExpandedSelectedAccordion(isSelectedAccordionOpen)
      }
    }, [isSelectedAccordionOpen])

    const selectionState = useMemo(
      () =>
        getSelectionState(
          selectedRegulatoryAreaIds,
          regulatoryAreas.map(amp => amp.id)
        ),
      [regulatoryAreas, selectedRegulatoryAreaIds]
    )

    return (
      <div>
        {openPanel && !!columnWidth && <StyledPanel $marginLeft={columnWidth} layerId={openPanel.id} />}

        <Accordion
          controls={
            (regulatoryAreas.length !== 0 || selectedRegulatoryAreaIds.length !== 0) && (
              <StyledToggleSelectAll
                onSelection={() =>
                  handleSelection({
                    allIds: regulatoryAreas.map(regulatoryArea => regulatoryArea.id),
                    onRemove: payload => dispatch(dashboardActions.removeItems(payload)),
                    onSelect: payload => dispatch(dashboardActions.addItems(payload)),
                    selectedIds: selectedRegulatoryAreaIds,
                    selectionState,
                    type: Dashboard.Block.REGULATORY_AREAS
                  })
                }
                selectionState={selectionState}
              />
            )
          }
          isExpanded={isExpanded}
          setExpandedAccordion={setExpandedAccordion}
          title={
            <TitleContainer>
              <Title>Zones réglementaires</Title>
              <ResultNumber>{`(${regulatoryAreas.length} ${pluralize(
                'résultat',
                regulatoryAreas.length
              )})`}</ResultNumber>
            </TitleContainer>
          }
          titleRef={ref}
        >
          <StyledLayerList
            $baseLayersLength={Object.values(regulatoryAreasByLayerName).length}
            $showBaseLayers={isExpanded}
            data-cy="dashboard-regulatory-areas-list"
          >
            {Object.entries(regulatoryAreasByLayerName).map(([layerGroupName, layerIdsInGroup]) => {
              const layersId = layerIdsInGroup.map((layerId: any) => layerId.id)

              return (
                <ListLayerGroup
                  key={layerGroupName}
                  groupName={layerGroupName}
                  layerIds={layersId}
                  selectedRegulatoryAreaIds={selectedRegulatoryAreaIds}
                />
              )
            })}
          </StyledLayerList>
        </Accordion>
        <SelectedAccordion
          isExpanded={isExpandedSelectedAccordion}
          isReadOnly={selectedRegulatoryAreaIds.length === 0}
          setExpandedAccordion={() => setExpandedSelectedAccordion(!isExpandedSelectedAccordion)}
          title={`${selectedRegulatoryAreaIds.length} ${pluralize(
            'zone',
            selectedRegulatoryAreaIds.length
          )} ${pluralize('sélectionnée', selectedRegulatoryAreaIds.length)}`}
        >
          <SelectedLayerList>
            {Object.entries(selectedRegulatoryAreasByLayerName).map(([layerGroupName, layerIdsInGroup]) => {
              const layersId = layerIdsInGroup.map((layerId: any) => layerId.id)

              return (
                <ListLayerGroup
                  key={layerGroupName}
                  groupName={layerGroupName}
                  isSelected
                  layerIds={layersId}
                  selectedRegulatoryAreaIds={selectedRegulatoryAreaIds}
                />
              )
            })}
          </SelectedLayerList>
        </SelectedAccordion>
      </div>
    )
  }
)

const StyledPanel = styled(RegulatoryPanel)<{ $marginLeft: number }>`
  left: ${p =>
    `calc(
    ${p.$marginLeft}px + 25px + 4px
  )`}; // 25px is the padding, 4px is the margin
  z-index: 10;
`
