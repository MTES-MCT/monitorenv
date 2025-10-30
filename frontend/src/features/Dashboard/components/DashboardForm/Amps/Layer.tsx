import { useGetAMPQuery } from '@api/ampsAPI'
import { StyledTransparentButton } from '@components/style'
import { dashboardActions, getOpenedPanel } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { LayerLegend } from '@features/layersSelector/utils/LayerLegend.style'
import { LayerSelector } from '@features/layersSelector/utils/LayerSelector.style'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, IconButton, OPENLAYERS_PROJECTION, THEME, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { setFitToExtent } from 'domain/shared_slices/Map'
import { Projection, transformExtent } from 'ol/proj'
import { createRef } from 'react'

import { MonitorEnvLayers } from '../../../../../domain/entities/layers/constants'
import { useAppDispatch } from '../../../../../hooks/useAppDispatch'
import { LayerName, StyledLayer } from '../style'

type AmpLayerProps = {
  isPinned?: boolean
  isSelected: boolean
  layerId: number
}

export function Layer({ isPinned = false, isSelected, layerId }: AmpLayerProps) {
  const dispatch = useAppDispatch()
  const openPanel = useAppSelector(state => getOpenedPanel(state.dashboard, Dashboard.Block.AMP))
  const ref = createRef<HTMLLIElement>()

  const { data: layer } = useGetAMPQuery(layerId)

  const handleSelectZone = e => {
    e.stopPropagation()

    const payload = { itemIds: [layerId], type: Dashboard.Block.AMP }
    if (isPinned) {
      dispatch(dashboardActions.removeItems(payload))
      dispatch(dashboardActions.removeAmpIdToDisplay(layerId))
    } else {
      dispatch(dashboardActions.addItems(payload))
      dispatch(dashboardActions.addAmpIdToDisplay(layerId))
    }
  }

  const removeZone = e => {
    e.stopPropagation()
    dispatch(dashboardActions.removeItems({ itemIds: [layerId], type: Dashboard.Block.AMP }))
    dispatch(dashboardActions.removeAmpIdToDisplay(layerId))
  }

  const toggleZoneMetadata = () => {
    dispatch(dashboardActions.setDashboardPanel({ id: layerId, isPinned: isSelected, type: Dashboard.Block.AMP }))
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
      <StyledTransparentButton>
        <LayerLegend layerType={MonitorEnvLayers.AMP} legendKey={layer?.name} type={layer?.type} />
        <LayerName
          data-cy={`dashboard-${isSelected ? 'selected-' : ''}amp-zone-${layer?.id}`}
          title={layer?.type ?? 'aucun'}
        >
          {layer?.type ?? 'AUCUN TYPE'}
        </LayerName>
      </StyledTransparentButton>
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
            data-cy="dashboard-amp-zone-check"
            Icon={isPinned ? Icon.PinFilled : Icon.Pin}
            onClick={handleSelectZone}
            title="Sélectionner la zone"
          />
        )}
      </LayerSelector.IconGroup>
    </StyledLayer>
  )
}
