import { Dashboard } from '@features/Dashboard/types'
import { LayerSelector } from '@features/layersSelector/utils/LayerSelector.style'
import { useAppSelector } from '@hooks/useAppSelector'
import { pluralize } from '@mtes-mct/monitor-ui'
import { groupBy } from 'lodash'
import { useRef, useState } from 'react'
import styled from 'styled-components'

import { ListLayerGroup } from './ListLayerGroup'
import { RegulatoryPanel } from './Panel'
import { Accordion } from '../Accordion'
import { SmallAccordion } from '../SmallAccordion'

import type { RegulatoryLayerCompactFromAPI } from 'domain/entities/regulatory'

type RegulatoriesAreasProps = {
  dashboardId: number
  isExpanded: boolean
  regulatoryAreas: RegulatoryLayerCompactFromAPI[] | undefined
  setExpandedAccordion: () => void
}
export function RegulatoryAreas({
  dashboardId,
  isExpanded,
  regulatoryAreas,
  setExpandedAccordion
}: RegulatoriesAreasProps) {
  const ref = useRef<HTMLDivElement>(null)
  const width = ref.current?.clientWidth

  const selectedLayerIds = useAppSelector(
    state => state.dashboard.dashboards?.[dashboardId]?.[Dashboard.Block.REGULATORY_AREAS]
  )
  const [isExpandedSmallAccordion, setExpandedSmallAccordion] = useState(false)

  const regulatoryAreasByLayerName = groupBy(regulatoryAreas, r => r.layer_name)

  const selectedRegulatoryAreaIds = regulatoryAreas?.filter(({ id }) => selectedLayerIds?.includes(id))
  const selectedRegulatoryAreasByLayerName = groupBy(selectedRegulatoryAreaIds, r => r.layer_name)

  return (
    <div ref={ref}>
      <RegulatoryPanel $marginLeft={width ?? 0} dashboardId={dashboardId} />

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
      <SmallAccordion
        isExpanded={isExpandedSmallAccordion}
        isReadOnly={selectedLayerIds?.length === 0}
        setExpandedAccordion={() => setExpandedSmallAccordion(!isExpandedSmallAccordion)}
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
      </SmallAccordion>
    </div>
  )
}

const StyledLayerList = styled(LayerSelector.LayerList)`
  height: auto;
`
