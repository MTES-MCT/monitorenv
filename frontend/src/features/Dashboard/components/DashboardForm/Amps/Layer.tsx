import { StyledTransparentButton } from '@components/style'
import { dashboardActions, getOpenedPanel } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { LayerLegend } from '@features/layersSelector/utils/LayerLegend.style'
import { LayerSelector } from '@features/layersSelector/utils/LayerSelector.style'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, IconButton, OPENLAYERS_PROJECTION, THEME, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { setFitToExtent } from 'domain/shared_slices/Map'
import { Projection, transformExtent } from 'ol/proj'
import { createRef } from 'react'

import { MonitorEnvLayers } from '../../../../../domain/entities/layers/constants'
import { LayerName, StyledLayer } from '../style'

import type { AMP } from '../../../../../domain/entities/AMPs'

type AmpLayerProps = {
  amp: AMP
  isPinned?: boolean
  isSelected: boolean
}

export function Layer({ amp, isPinned = false, isSelected }: AmpLayerProps) {
  const dispatch = useAppDispatch()
  const openPanel = useAppSelector(state => getOpenedPanel(state.dashboard, Dashboard.Block.AMP))
  const ref = createRef<HTMLLIElement>()

  const handleSelectZone = e => {
    e.stopPropagation()

    const payload = { itemIds: [amp.id], type: Dashboard.Block.AMP }
    if (isPinned) {
      dispatch(dashboardActions.removeItems(payload))
      dispatch(dashboardActions.removeAmpIdToDisplay(amp.id))
    } else {
      dispatch(dashboardActions.addItems(payload))
      dispatch(dashboardActions.addAmpIdToDisplay(amp.id))
    }
  }

  const removeZone = e => {
    e.stopPropagation()
    dispatch(dashboardActions.removeItems({ itemIds: [amp.id], type: Dashboard.Block.AMP }))
    dispatch(dashboardActions.removeAmpIdToDisplay(amp.id))
  }

  const toggleZoneMetadata = () => {
    dispatch(dashboardActions.setDashboardPanel({ id: amp.id, isPinned: isSelected, type: Dashboard.Block.AMP }))
    if (!amp?.extent) {
      return
    }
    const extent = transformExtent(
      amp?.extent,
      new Projection({ code: WSG84_PROJECTION }),
      new Projection({ code: OPENLAYERS_PROJECTION })
    )
    dispatch(setFitToExtent(extent))
  }

  return (
    <StyledLayer
      ref={ref}
      $isSelected={isSelected}
      $metadataIsShown={openPanel?.id === amp.id && openPanel?.isPinned === isSelected}
      onClick={toggleZoneMetadata}
    >
      <StyledTransparentButton>
        <LayerLegend layerType={MonitorEnvLayers.AMP} legendKey={amp?.name} type={amp?.type} />
        <LayerName
          data-cy={`dashboard-${isSelected ? 'selected-' : ''}amp-zone-${amp?.id}`}
          title={amp?.type ?? 'aucun'}
        >
          {amp?.type ?? 'AUCUN TYPE'}
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
