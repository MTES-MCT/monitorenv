import { useGetRegulatoryLayersQuery } from '@api/regulatoryLayersAPI'
import { getOpenedPanel } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { LayerSelector } from '@features/layersSelector/utils/LayerSelector.style'
import { useAppSelector } from '@hooks/useAppSelector'
import { pluralize } from '@mtes-mct/monitor-ui'
import { groupBy } from 'lodash'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { Accordion } from '../Accordion'
import { SelectedAccordion } from '../SelectedAccordion'
import { ListLayerGroup } from './ListLayerGroup'
import { RegulatoryPanel } from './Panel'

import type { RegulatoryLayerCompactFromAPI } from 'domain/entities/regulatory'

type RegulatoriesAreasProps = {
  columnWidth: number
  isExpanded: boolean
  isSelectedAccordionOpen: boolean
  regulatoryAreas: RegulatoryLayerCompactFromAPI[]
  selectedRegulatoryAreaIds: number[]
  setExpandedAccordion: () => void
}
export function RegulatoryAreas({
  columnWidth,
  isExpanded,
  isSelectedAccordionOpen,
  regulatoryAreas,
  selectedRegulatoryAreaIds: selectedRegulatoryAreas,
  setExpandedAccordion
}: RegulatoriesAreasProps) {
  const openPanel = useAppSelector(state => getOpenedPanel(state.dashboard, Dashboard.Block.REGULATORY_AREAS))
  const [isExpandedSelectedAccordion, setExpandedSelectedAccordion] = useState(false)

  const regulatoryAreasByLayerName = groupBy(regulatoryAreas, r => r.layer_name)

  const { selectedRegulatoryAreasByLayerName } = useGetRegulatoryLayersQuery(undefined, {
    selectFromResult: ({ data }) => ({
      selectedRegulatoryAreasByLayerName: groupBy(
        Object.values(data?.entities ?? []).filter(regulatory => selectedRegulatoryAreas.includes(regulatory.id)),
        regulatory => regulatory.layer_name
      )
    })
  })

  useEffect(() => {
    if (isSelectedAccordionOpen) {
      setExpandedSelectedAccordion(isSelectedAccordionOpen)
    }
  }, [isSelectedAccordionOpen])

  return (
    <div>
      {openPanel && columnWidth && <StyledPanel $marginLeft={columnWidth} layerId={openPanel.id} />}

      <Accordion isExpanded={isExpanded} setExpandedAccordion={setExpandedAccordion} title="Zones réglementaires">
        <StyledLayerList
          $baseLayersLength={Object.values(regulatoryAreasByLayerName).length}
          $maxHeight={100}
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
                selectedRegulatoryAreaIds={selectedRegulatoryAreas}
              />
            )
          })}
        </StyledLayerList>
      </Accordion>
      <SelectedAccordion
        isExpanded={isExpandedSelectedAccordion}
        isReadOnly={selectedRegulatoryAreas.length === 0}
        setExpandedAccordion={() => setExpandedSelectedAccordion(!isExpandedSelectedAccordion)}
        title={`${selectedRegulatoryAreas.length} ${pluralize('zone', selectedRegulatoryAreas.length)} ${pluralize(
          'sélectionnée',
          selectedRegulatoryAreas.length
        )}`}
      >
        {Object.entries(selectedRegulatoryAreasByLayerName).map(([layerGroupName, layerIdsInGroup]) => {
          const layersId = layerIdsInGroup.map((layerId: any) => layerId.id)

          return (
            <ListLayerGroup
              key={layerGroupName}
              groupName={layerGroupName}
              isSelected
              layerIds={layersId}
              selectedRegulatoryAreaIds={selectedRegulatoryAreas}
            />
          )
        })}
      </SelectedAccordion>
    </div>
  )
}

const StyledLayerList = styled(LayerSelector.LayerList)`
  height: auto;
`
const StyledPanel = styled(RegulatoryPanel)<{ $marginLeft: number }>`
  left: ${p =>
    `calc(
    ${p.$marginLeft}px + 25px + 4px
  )`}; // 25px is the padding, 4px is the margin
`
