import { useGetRegulatoryLayersQuery } from '@api/regulatoryLayersAPI'
import { dashboardActions } from '@features/Dashboard/slice'
import { LayerLegend } from '@features/layersSelector/utils/LayerLegend.style'
import { PanelInlineItemLabel, PanelSubPart } from '@features/VigilanceArea/components/VigilanceAreaForm/style'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, IconButton, OPENLAYERS_PROJECTION, THEME, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { MonitorEnvLayers } from 'domain/entities/layers/constants'
import { setFitToExtent } from 'domain/shared_slices/Map'
import { Projection, transformExtent } from 'ol/proj'
import { useState } from 'react'
import styled from 'styled-components'

import { RegulatoryAreasPanel } from '../../components/RegulatoryAreasPanel'

import type { RegulatoryLayerCompact } from 'domain/entities/regulatory'

export function RegulatoryAreas({ regulatoryAreaIds }: { regulatoryAreaIds: Array<number> | undefined }) {
  const dispatch = useAppDispatch()

  const { data: regulatoryLayers } = useGetRegulatoryLayersQuery()

  const regulatoryAreas = regulatoryAreaIds?.map(regulatoryArea => regulatoryLayers?.entities[regulatoryArea])
  const [regulatoryAreaId, setRegulatoryAreaId] = useState<number | undefined>(undefined)

  const activeDashboardId = useAppSelector(state => state.dashboard.activeDashboardId)
  const regulatoryIdsToBeDisplayed = useAppSelector(state =>
    activeDashboardId ? state.dashboard.dashboards?.[activeDashboardId]?.regulatoryIdsToBeDisplayed : undefined
  )

  const onClickRegulatoryZoneMetadata = (event, id: number | undefined) => {
    event.stopPropagation()
    if (regulatoryAreaId === id) {
      setRegulatoryAreaId(undefined)

      return
    }
    setRegulatoryAreaId(id)
  }

  const closeRegulatoryAreapanel = () => {
    setRegulatoryAreaId(undefined)
  }

  const showRegulatoryAreaLayer = (event, regulatoryArea: RegulatoryLayerCompact | undefined) => {
    event.stopPropagation()

    if (!regulatoryArea?.id) {
      return
    }
    if (regulatoryIdsToBeDisplayed?.includes(regulatoryArea.id)) {
      dispatch(dashboardActions.removeRegulatoryIdToBeDisplayed(regulatoryArea.id))
    } else {
      dispatch(dashboardActions.addRegulatoryIdToBeDisplayed(regulatoryArea.id))
      if (!regulatoryArea?.bbox) {
        return
      }
      const extent = transformExtent(
        regulatoryArea?.bbox,
        new Projection({ code: WSG84_PROJECTION }),
        new Projection({ code: OPENLAYERS_PROJECTION })
      )
      dispatch(setFitToExtent(extent))
    }
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
              onClick={e => onClickRegulatoryZoneMetadata(e, regulatoryArea?.id)}
            >
              <RegulatoryAreaName>
                <LayerLegend
                  layerType={MonitorEnvLayers.REGULATORY_ENV}
                  legendKey={regulatoryArea?.entity_name ?? 'aucun'}
                  type={regulatoryArea?.thematique ?? 'aucun'}
                />
                <span title={regulatoryArea?.entity_name}>{regulatoryArea?.entity_name}</span>
              </RegulatoryAreaName>

              <ButtonsContainer>
                <StyledButton
                  accent={Accent.TERTIARY}
                  color={regulatoryAreaId === regulatoryArea?.id ? THEME.color.charcoal : THEME.color.lightGray}
                  Icon={Icon.Summary}
                  onClick={e => onClickRegulatoryZoneMetadata(e, regulatoryArea?.id)}
                  title={
                    regulatoryAreaId === regulatoryArea?.id
                      ? 'Fermer la zone réglementaire'
                      : 'Afficher la réglementaire'
                  }
                />

                <StyledButton
                  accent={Accent.TERTIARY}
                  color={
                    regulatoryArea?.id && regulatoryIdsToBeDisplayed?.includes(regulatoryArea?.id)
                      ? THEME.color.charcoal
                      : THEME.color.lightGray
                  }
                  Icon={Icon.Display}
                  onClick={e => showRegulatoryAreaLayer(e, regulatoryArea)}
                  title={
                    regulatoryArea?.id && regulatoryIdsToBeDisplayed?.includes(regulatoryArea?.id)
                      ? 'Cacher la zone'
                      : 'Afficher la zone'
                  }
                />
              </ButtonsContainer>
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
const ButtonsContainer = styled.div`
  display: flex;
  gap: 8px;
`
const StyledButton = styled(IconButton)`
  padding: 0;
`
