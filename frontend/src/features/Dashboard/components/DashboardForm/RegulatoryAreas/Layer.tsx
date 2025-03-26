import { dashboardActions, getOpenedPanel } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { LayerLegend } from '@features/layersSelector/utils/LayerLegend.style'
import { LayerSelector } from '@features/layersSelector/utils/LayerSelector.style'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, IconButton, THEME, WSG84_PROJECTION, OPENLAYERS_PROJECTION } from '@mtes-mct/monitor-ui'
import { transformExtent } from 'ol/proj'
import Projection from 'ol/proj/Projection'
import { createRef } from 'react'
import styled from 'styled-components'

import { useGetRegulatoryLayersQuery } from '../../../../../api/regulatoryLayersAPI'
import { MonitorEnvLayers } from '../../../../../domain/entities/layers/constants'
import { setFitToExtent } from '../../../../../domain/shared_slices/Map'
import { useAppDispatch } from '../../../../../hooks/useAppDispatch'

type RegulatoryLayerProps = {
  isPinned?: boolean
  isSelected: boolean
  layerId: number
}

export function Layer({ isPinned = false, isSelected, layerId }: RegulatoryLayerProps) {
  const dispatch = useAppDispatch()
  const openPanel = useAppSelector(state => getOpenedPanel(state.dashboard, Dashboard.Block.REGULATORY_AREAS))

  const ref = createRef<HTMLSpanElement>()

  const { layer } = useGetRegulatoryLayersQuery(undefined, {
    selectFromResult: result => ({
      layer: result?.currentData?.entities[layerId]
    })
  })

  const handleSelectZone = e => {
    e.stopPropagation()

    const payload = { itemIds: [layerId], type: Dashboard.Block.REGULATORY_AREAS }
    if (isPinned) {
      dispatch(dashboardActions.removeItems(payload))
    } else {
      dispatch(dashboardActions.addItems(payload))
      if (!layer?.bbox) {
        return
      }
      const extent = transformExtent(
        layer?.bbox,
        new Projection({ code: WSG84_PROJECTION }),
        new Projection({ code: OPENLAYERS_PROJECTION })
      )
      dispatch(setFitToExtent(extent))
    }
  }

  const removeZone = e => {
    e.stopPropagation()
    dispatch(dashboardActions.removeItems({ itemIds: [layerId], type: Dashboard.Block.REGULATORY_AREAS }))
  }

  const toggleZoneMetadata = event => {
    event.stopPropagation()
    dispatch(
      dashboardActions.setDashboardPanel({ id: layerId, isPinned: isSelected, type: Dashboard.Block.REGULATORY_AREAS })
    )
    if (!layer?.bbox) {
      return
    }
    const extent = transformExtent(
      layer?.bbox,
      new Projection({ code: WSG84_PROJECTION }),
      new Projection({ code: OPENLAYERS_PROJECTION })
    )
    dispatch(setFitToExtent(extent))
  }

  return (
    <StyledLayer
      ref={ref}
      $isSelected={isSelected}
      $metadataIsShown={openPanel?.id === layerId && openPanel?.isPinned === isSelected}
      onClick={toggleZoneMetadata}
    >
      <LayerLegend
        layerType={MonitorEnvLayers.REGULATORY_ENV}
        legendKey={layer?.entityName ?? 'aucun'}
        type={layer?.tags.map(({ name }) => name).join(', ') ?? 'aucun'}
      />
      <LayerSelector.Name
        $withLargeWidth
        data-cy={`dashboard-${isSelected ? 'selected-' : ''}regulatory-area-zone-${layer?.id}`}
        title={layer?.entityName}
      >
        {layer?.entityName ?? 'AUCUN NOM'}
      </LayerSelector.Name>

      <LayerSelector.IconGroup>
        {isSelected ? (
          <IconButton
            accent={Accent.TERTIARY}
            color={THEME.color.slateGray}
            Icon={Icon.Close}
            onClick={removeZone}
            title="Supprimer la zone"
          />
        ) : (
          <IconButton
            accent={Accent.TERTIARY}
            color={isPinned ? THEME.color.blueGray : THEME.color.slateGray}
            data-cy="dashboard-regulatory-zone-check"
            Icon={isPinned ? Icon.PinFilled : Icon.Pin}
            onClick={handleSelectZone}
            title="Sélectionner la zone"
          />
        )}
      </LayerSelector.IconGroup>
    </StyledLayer>
  )
}

const StyledLayer = styled(LayerSelector.Layer)<{ $isSelected: boolean; $metadataIsShown: boolean }>`
  background: ${p => (p.$metadataIsShown ? p.theme.color.blueYonder25 : p.theme.color.white)};
  padding-left: 24px;
  padding-right: 24px;
  ${p =>
    p.$isSelected &&
    `
        padding-left: 20px;
        padding-right: 20px;
       
    `}
`
