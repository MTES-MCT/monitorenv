import { getOpenedPanel } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { LayerSelector } from '@features/layersSelector/utils/LayerSelector.style'
import { useAppSelector } from '@hooks/useAppSelector'
import { pluralize } from '@mtes-mct/monitor-ui'
import { groupBy } from 'lodash'
import { useState } from 'react'
import styled from 'styled-components'

import { ListLayerGroup } from './ListLayerGroup'
import { RegulatoryPanel } from './Panel'
import { Accordion } from '../Accordion'
import { SelectedAccordion } from '../SelectedAccordion'

import type { RegulatoryLayerCompactFromAPI } from 'domain/entities/regulatory'

type RegulatoriesAreasProps = {
  columnWidth: number
  dashboardId: number
  isExpanded: boolean
  regulatoryAreas: RegulatoryLayerCompactFromAPI[] | undefined
  setExpandedAccordion: () => void
}
export function RegulatoryAreas({
  columnWidth,
  dashboardId,
  isExpanded,
  regulatoryAreas,
  setExpandedAccordion
}: RegulatoriesAreasProps) {
  const selectedLayerIds = useAppSelector(
    state => state.dashboard.dashboards?.[dashboardId]?.[Dashboard.Block.REGULATORY_AREAS]
  )

  const openPanel = useAppSelector(state => getOpenedPanel(state.dashboard, Dashboard.Block.REGULATORY_AREAS))
  const [isExpandedSelectedAccordion, setExpandedSelectedAccordion] = useState(false)

  const regulatoryAreasByLayerName = groupBy(regulatoryAreas, r => r.layer_name)

  const selectedRegulatoryAreaIds = regulatoryAreas?.filter(({ id }) => selectedLayerIds?.includes(id))
  const selectedRegulatoryAreasByLayerName = groupBy(selectedRegulatoryAreaIds, r => r.layer_name)

  return (
    <div>
      {openPanel && <StyledPanel $marginLeft={columnWidth ?? 0} layerId={openPanel.id} />}

      <Accordion isExpanded={isExpanded} setExpandedAccordion={setExpandedAccordion} title="Zones règlementaires">
        <StyledLayerList
          $baseLayersLength={Object.values(regulatoryAreasByLayerName).length}
          $maxHeight={100}
          $showBaseLayers={isExpanded}
        >
          {Object.entries(regulatoryAreasByLayerName).map(([layerGroupName, layerIdsInGroup]) => {
            const layersId = layerIdsInGroup.map((layerId: any) => layerId.id)

            return (
              <ListLayerGroup
                key={layerGroupName}
                dashboardId={dashboardId}
                groupName={layerGroupName}
                layerIds={layersId}
              />
            )
          })}
        </StyledLayerList>
      </Accordion>
      <SelectedAccordion
        isExpanded={isExpandedSelectedAccordion}
        isReadOnly={selectedLayerIds?.length === 0}
        setExpandedAccordion={() => setExpandedSelectedAccordion(!isExpandedSelectedAccordion)}
        title={`${selectedLayerIds?.length ?? 0} ${pluralize('zone', selectedLayerIds?.length ?? 0)} ${pluralize(
          'sélectionée',
          selectedLayerIds?.length ?? 0
        )}`}
      >
        {Object.entries(selectedRegulatoryAreasByLayerName).map(([layerGroupName, layerIdsInGroup]) => {
          const layersId = layerIdsInGroup.map((layerId: any) => layerId.id)

          return (
            <ListLayerGroup
              key={layerGroupName}
              dashboardId={dashboardId}
              groupName={layerGroupName}
              isSelected
              layerIds={layersId}
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
    ${p.$marginLeft}px + 25px + 64px + 4px
  )`}; // 25px is the padding, 64px is the width of the sidebar, 4px is the margin
`
