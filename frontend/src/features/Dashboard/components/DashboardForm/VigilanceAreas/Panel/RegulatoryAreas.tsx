import { useGetRegulatoryLayersQuery } from '@api/regulatoryLayersAPI'
import { LayerLegend } from '@features/layersSelector/utils/LayerLegend.style'
import { PanelInlineItemLabel, PanelSubPart } from '@features/VigilanceArea/components/VigilanceAreaForm/style'
import { Accent, Icon, Size, IconButton } from '@mtes-mct/monitor-ui'
import { MonitorEnvLayers } from 'domain/entities/layers/constants'
import { useState } from 'react'
import styled from 'styled-components'

import { RegulatoryAreasPanel } from '../../components/RegulatoryAreasPanel'

export function RegulatoryAreas({ regulatoryAreaIds }: { regulatoryAreaIds: Array<number> | undefined }) {
  const { data: regulatoryLayers } = useGetRegulatoryLayersQuery()
  const regulatoryAreas = regulatoryAreaIds?.map(regulatoryArea => regulatoryLayers?.entities[regulatoryArea])
  const [regulatoryAreaId, setRegulatoryAreaId] = useState<number | undefined>(undefined)

  const toggleRegulatoryZoneMetadata = (id: number | undefined) => {
    setRegulatoryAreaId(id)
  }

  const closeRegulatoryAreapanel = () => {
    setRegulatoryAreaId(undefined)
  }

  return (
    <>
      {regulatoryAreaId && (
        <StyledRegulatoryAreasPanel className="" id={regulatoryAreaId} onClose={closeRegulatoryAreapanel} />
      )}
      <PanelSubPart>
        <PanelInlineItemLabel>Réglementations en lien</PanelInlineItemLabel>
        {regulatoryAreas &&
          regulatoryAreas.length > 0 &&
          regulatoryAreas.map(regulatoryArea => (
            <RegulatoryAreaContainer
              key={regulatoryArea?.id}
              data-cy="regulatory-area-item"
              onClick={() => toggleRegulatoryZoneMetadata(regulatoryArea?.id)}
            >
              <RegulatoryAreaName>
                <LayerLegend
                  layerType={MonitorEnvLayers.REGULATORY_ENV}
                  legendKey={regulatoryArea?.entity_name ?? 'aucun'}
                  type={regulatoryArea?.thematique ?? 'aucun'}
                />
                <span title={regulatoryArea?.entity_name}>{regulatoryArea?.entity_name}</span>
              </RegulatoryAreaName>

              <IconButton
                accent={Accent.TERTIARY}
                Icon={Icon.Close}
                onClick={() => toggleRegulatoryZoneMetadata(regulatoryArea?.id)}
                size={Size.SMALL}
                title={`vigilance-area-delete-regulatory-area-${regulatoryArea?.id}`}
              />
            </RegulatoryAreaContainer>
          ))}
      </PanelSubPart>
    </>
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
  cursor: pointer;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0px;
  }
`
const RegulatoryAreaName = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  > span {
    margin-left: 8px;
  }
`
const StyledRegulatoryAreasPanel = styled(RegulatoryAreasPanel)`
  top: 0;
  left: 404px;
`
