import { useGetRegulatoryLayersQuery } from '@api/regulatoryLayersAPI'
import { dashboardActions, getOpenedPanel } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { LayerLegend } from '@features/layersSelector/utils/LayerLegend.style'
import { PanelInlineItemLabel, PanelSubPart } from '@features/VigilanceArea/components/VigilanceAreaForm/style'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, OPENLAYERS_PROJECTION, THEME, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { MonitorEnvLayers } from 'domain/entities/layers/constants'
import { setFitToExtent } from 'domain/shared_slices/Map'
import { Projection, transformExtent } from 'ol/proj'
import styled from 'styled-components'

import { ButtonsContainer, Container, Name, StyledButton } from './style'
import { RegulatoryAreasPanel } from '../../components/RegulatoryAreasPanel'

import type { RegulatoryLayerCompact } from 'domain/entities/regulatory'

export function RegulatoryAreas({ regulatoryAreaIds }: { regulatoryAreaIds: number[] }) {
  const dispatch = useAppDispatch()

  const { data: regulatoryLayers } = useGetRegulatoryLayersQuery()

  const regulatoryAreas = regulatoryAreaIds.map(regulatoryArea => regulatoryLayers?.entities[regulatoryArea])

  const activeDashboardId = useAppSelector(state => state.dashboard.activeDashboardId)
  const regulatoryIdsToDisplay = useAppSelector(state =>
    activeDashboardId ? state.dashboard.dashboards?.[activeDashboardId]?.regulatoryIdsToDisplay : undefined
  )
  const openPanel = useAppSelector(state =>
    activeDashboardId ? getOpenedPanel(state.dashboard, Dashboard.Block.VIGILANCE_AREAS) : undefined
  )
  const isSubPanelOpened = !!(openPanel?.subPanel?.id && openPanel.subPanel.type === Dashboard.Block.REGULATORY_AREAS)

  const toggleMetadata = (event, id: number | undefined) => {
    event.stopPropagation()
    if (openPanel && id) {
      dispatch(
        dashboardActions.setDashboardPanel({ ...openPanel, subPanel: { id, type: Dashboard.Block.REGULATORY_AREAS } })
      )
    }
    if (openPanel?.subPanel?.id === id) {
      closePanel()
    }
  }

  const closePanel = () => {
    if (isSubPanelOpened) {
      dispatch(dashboardActions.setDashboardPanel({ ...openPanel, subPanel: undefined }))
    }
  }

  const showRegulatoryAreaLayer = (event, regulatoryArea: RegulatoryLayerCompact | undefined) => {
    event.stopPropagation()

    if (!regulatoryArea?.id) {
      return
    }
    if (regulatoryIdsToDisplay?.includes(regulatoryArea.id)) {
      dispatch(dashboardActions.removeRegulatoryIdToDisplay(regulatoryArea.id))
    } else {
      dispatch(dashboardActions.addRegulatoryIdToDisplay(regulatoryArea.id))
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
      {openPanel?.subPanel && isSubPanelOpened && (
        <StyledRegulatoryAreasPanel layerId={openPanel.subPanel.id} onClose={closePanel} />
      )}
      <PanelSubPart>
        <PanelInlineItemLabel>Réglementations en lien</PanelInlineItemLabel>
        {regulatoryAreas &&
          regulatoryAreas.map(regulatoryArea => (
            <Container key={regulatoryArea?.id}>
              <Name>
                <LayerLegend
                  layerType={MonitorEnvLayers.REGULATORY_ENV}
                  legendKey={regulatoryArea?.entityName ?? 'aucun'}
                  type={regulatoryArea?.themes.map(({ name }) => name).join(', ') ?? 'aucun'}
                />
                <span title={regulatoryArea?.entityName}>{regulatoryArea?.entityName}</span>
              </Name>

              <ButtonsContainer>
                <StyledButton
                  accent={Accent.TERTIARY}
                  color={
                    isSubPanelOpened && openPanel.subPanel?.id === regulatoryArea?.id
                      ? THEME.color.charcoal
                      : THEME.color.lightGray
                  }
                  Icon={Icon.Summary}
                  onClick={e => toggleMetadata(e, regulatoryArea?.id)}
                  title={
                    isSubPanelOpened && openPanel.subPanel?.id === regulatoryArea?.id
                      ? 'Fermer la réglementation de la zone'
                      : 'Afficher la réglementation de la zone'
                  }
                />

                <StyledButton
                  accent={Accent.TERTIARY}
                  color={
                    regulatoryArea?.id && regulatoryIdsToDisplay?.includes(regulatoryArea?.id)
                      ? THEME.color.charcoal
                      : THEME.color.lightGray
                  }
                  Icon={Icon.Display}
                  onClick={e => showRegulatoryAreaLayer(e, regulatoryArea)}
                  title={
                    regulatoryArea?.id && regulatoryIdsToDisplay?.includes(regulatoryArea?.id)
                      ? 'Cacher la zone'
                      : 'Afficher la zone'
                  }
                />
              </ButtonsContainer>
            </Container>
          ))}
      </PanelSubPart>
    </>
  )
}

const StyledRegulatoryAreasPanel = styled(RegulatoryAreasPanel)`
  top: 0;
  left: 404px;
`
