import { useGetRegulatoryLayersQuery } from '@api/regulatoryLayersAPI'
import { LayerSelector } from '@features/layersSelector/utils/LayerSelector.style'
import { groupBy } from 'lodash'
import styled from 'styled-components'

import { ListLayerGroup } from './ListLayerGroup'
import { RegulatoryPanel } from './Panel'
import { Accordion } from '../Accordion'

type RegulatoriesAreasProps = {
  isExpanded: boolean
  setExpandedAccordion: () => void
}
export function RegulatoryAreas({ isExpanded, setExpandedAccordion }: RegulatoriesAreasProps) {
  const { data: regulatoryLayers } = useGetRegulatoryLayersQuery()

  const regulatoryAreasByLayerName = groupBy(
    Object.values(regulatoryLayers?.ids ?? {}),
    r => regulatoryLayers?.entities[r]?.layer_name
  )

  return (
    <Container>
      <RegulatoryPanel isOpen />
      <Accordion isExpanded={isExpanded} setExpandedAccordion={setExpandedAccordion} title="Zones règlementaires">
        <StyledLayerList
          $baseLayersLength={Object.values(regulatoryAreasByLayerName).length}
          $maxHeight={100}
          $showBaseLayers={isExpanded}
        >
          {Object.entries(regulatoryAreasByLayerName).map(([layerGroupName, layerIdsInGroup]) => (
            <ListLayerGroup key={layerGroupName} groupName={layerGroupName} layerIds={layerIdsInGroup} />
          ))}
        </StyledLayerList>
      </Accordion>
    </Container>
  )
}

const Container = styled.div`
  position: relative;
`
const StyledLayerList = styled(LayerSelector.LayerList)`
  height: auto;
`
