import { useGetAMPsQuery } from '@api/ampsAPI'
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
import { AmpsPanel } from '../../components/AmpsPanel'

import type { AMP } from 'domain/entities/AMPs'

export function Amps({ ampIds }: { ampIds: number[] }) {
  const dispatch = useAppDispatch()

  // TODO: either send extend of layer OR findById
  const { data: ampLayers } = useGetAMPsQuery({ withGeometry: false })

  const amps = ampIds.map(amp => ampLayers?.entities[amp])

  const activeDashboardId = useAppSelector(state => state.dashboard.activeDashboardId)
  const ampIdsToDisplay = useAppSelector(state =>
    activeDashboardId ? state.dashboard.dashboards?.[activeDashboardId]?.ampIdsToDisplay : undefined
  )
  const openPanel = useAppSelector(state =>
    activeDashboardId ? getOpenedPanel(state.dashboard, Dashboard.Block.VIGILANCE_AREAS) : undefined
  )

  const isSubPanelOpened = !!(openPanel?.subPanel?.id && openPanel.subPanel.type === Dashboard.Block.AMP)

  const toggleMetadata = (event, id: number | undefined) => {
    event.stopPropagation()
    if (openPanel && id) {
      dispatch(dashboardActions.setDashboardPanel({ ...openPanel, subPanel: { id, type: Dashboard.Block.AMP } }))
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

  const showLayer = (event, amp: AMP | undefined) => {
    event.stopPropagation()

    if (!amp?.id) {
      return
    }
    if (ampIdsToDisplay?.includes(amp.id)) {
      dispatch(dashboardActions.removeAmpIdToDisplay(amp.id))
    } else {
      dispatch(dashboardActions.addAmpIdToDisplay(amp.id))
      if (!amp?.bbox) {
        return
      }
      const extent = transformExtent(
        amp?.bbox,
        new Projection({ code: WSG84_PROJECTION }),
        new Projection({ code: OPENLAYERS_PROJECTION })
      )
      dispatch(setFitToExtent(extent))
    }
  }

  return (
    <>
      {openPanel?.subPanel && isSubPanelOpened && <StyledPanel layerId={openPanel.subPanel.id} onClose={closePanel} />}
      <PanelSubPart>
        <PanelInlineItemLabel>AMP en lien</PanelInlineItemLabel>
        {amps?.map(amp => (
          <Container key={amp?.id}>
            <Name>
              <LayerLegend
                layerType={MonitorEnvLayers.AMP}
                legendKey={amp?.name ?? 'aucun'}
                type={amp?.type ?? 'aucun'}
              />
              <span title={amp?.name}>{amp?.type}</span>
            </Name>

            <ButtonsContainer>
              <StyledButton
                accent={Accent.TERTIARY}
                color={
                  isSubPanelOpened && openPanel?.subPanel?.id === amp?.id ? THEME.color.charcoal : THEME.color.lightGray
                }
                Icon={Icon.Summary}
                onClick={e => toggleMetadata(e, amp?.id)}
                title={
                  isSubPanelOpened && openPanel?.subPanel?.id === amp?.id
                    ? 'Fermer la réglementation de la zone'
                    : 'Afficher la réglementation de la zone'
                }
              />

              <StyledButton
                accent={Accent.TERTIARY}
                color={amp?.id && ampIdsToDisplay?.includes(amp?.id) ? THEME.color.charcoal : THEME.color.lightGray}
                Icon={Icon.Display}
                onClick={e => showLayer(e, amp)}
                title={amp?.id && ampIdsToDisplay?.includes(amp?.id) ? 'Cacher la zone' : 'Afficher la zone'}
              />
            </ButtonsContainer>
          </Container>
        ))}
      </PanelSubPart>
    </>
  )
}

export const StyledPanel = styled(AmpsPanel)`
  top: 0;
  left: 404px;
`
