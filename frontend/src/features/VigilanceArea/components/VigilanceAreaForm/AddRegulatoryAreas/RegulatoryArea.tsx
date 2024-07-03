import { LayerLegend } from '@features/layersSelector/utils/LayerLegend.style'
import { Accent, Icon, IconButton, Size } from '@mtes-mct/monitor-ui'
import { MonitorEnvLayers } from 'domain/entities/layers/constants'
import styled from 'styled-components'

export function RegulatoryArea({ deleteRegulatoryArea, regulatoryArea }) {
  return (
    <RegulatoryAreaContainer key={regulatoryArea?.id}>
      <RegulatoryAreaName>
        <LayerLegend
          layerType={MonitorEnvLayers.REGULATORY_ENV}
          legendKey={regulatoryArea?.entity_name ?? 'aucun'}
          type={regulatoryArea?.thematique ?? 'aucun'}
        />
        <span title={regulatoryArea?.entity_name}>{regulatoryArea?.entity_name}</span>
      </RegulatoryAreaName>
      <IconButton accent={Accent.TERTIARY} Icon={Icon.Close} onClick={deleteRegulatoryArea} size={Size.SMALL} />
    </RegulatoryAreaContainer>
  )
}

const RegulatoryAreaContainer = styled.div`
  align-items: center;
  border-bottom: 1px solid ${p => p.theme.color.lightGray};
  display: flex;
  flex-direction: row;
  gap: 4px;
  justify-content: space-between;
  padding: 8px;
`
const RegulatoryAreaName = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
