import { useGetAMPsQuery } from '@api/ampsAPI'
import { dashboardActions } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { LayerLegend } from '@features/layersSelector/utils/LayerLegend.style'
import { LayerSelector } from '@features/layersSelector/utils/LayerSelector.style'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, IconButton, OPENLAYERS_PROJECTION, THEME, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { hideAmpLayer, showAmpLayer } from 'domain/shared_slices/Amp'
import { setFitToExtent } from 'domain/shared_slices/Map'
import { Projection, transformExtent } from 'ol/proj'
import { createRef } from 'react'
import styled from 'styled-components'

import { MonitorEnvLayers } from '../../../../../domain/entities/layers/constants'
import { useAppDispatch } from '../../../../../hooks/useAppDispatch'

type AmpLayerProps = {
  dashboardId: number
  isSelected: boolean
  layerId: number
}

export function Layer({ dashboardId, isSelected, layerId }: AmpLayerProps) {
  const dispatch = useAppDispatch()
  const ref = createRef<HTMLSpanElement>()

  const selectedAmps = useAppSelector(state => state.dashboard.dashboards?.[dashboardId]?.[Dashboard.Block.AMP])

  const isZoneSelected = selectedAmps?.includes(layerId)
  const { layer } = useGetAMPsQuery(undefined, {
    selectFromResult: result => ({
      layer: result?.currentData?.entities[layerId]
    })
  })

  const handleSelectZone = e => {
    e.stopPropagation()

    const payload = { itemIds: [layerId], type: Dashboard.Block.AMP }
    if (isZoneSelected) {
      dispatch(hideAmpLayer(layerId))
      dispatch(dashboardActions.removeItems(payload))
    } else {
      dispatch(showAmpLayer([layerId]))
      dispatch(dashboardActions.addItems(payload))
    }
  }

  const removeZone = e => {
    e.stopPropagation()
    dispatch(dashboardActions.removeItems({ itemIds: [layerId], type: Dashboard.Block.AMP }))
  }

  const toggleZoneMetadata = () => {
    dispatch(dashboardActions.setDashboardPanel({ id: layerId, type: Dashboard.Block.AMP }))
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
    <StyledLayer ref={ref} onClick={toggleZoneMetadata}>
      <Wrapper>
        <LayerLegend layerType={MonitorEnvLayers.AMP} legendKey={layer?.name} type={layer?.type} />
        <LayerSelector.Name data-cy="amp-layer-type" title={layer?.type ?? 'aucun'}>
          {layer?.type ?? 'AUCUN TYPE'}
        </LayerSelector.Name>
      </Wrapper>
      <LayerSelector.IconGroup>
        {isSelected ? (
          <IconButton
            accent={Accent.TERTIARY}
            aria-label="Supprimer la zone"
            color={THEME.color.slateGray}
            Icon={Icon.Close}
            onClick={removeZone}
            title="Supprimer la/ zone"
          />
        ) : (
          <IconButton
            accent={Accent.TERTIARY}
            aria-label="Sélectionner la zone"
            color={isZoneSelected ? THEME.color.blueGray : THEME.color.slateGray}
            data-cy="regulatory-zone-check"
            Icon={isZoneSelected ? Icon.PinFilled : Icon.Pin}
            onClick={handleSelectZone}
          />
        )}
      </LayerSelector.IconGroup>
    </StyledLayer>
  )
}

const StyledLayer = styled(LayerSelector.Layer)`
  background-color: ${p => p.theme.color.white};
  padding-left: 24px;
  padding-right: 24px;
  justify-content: space-between;
`

const Wrapper = styled.div`
  display: flex;
  justify-content: baseline;
`
