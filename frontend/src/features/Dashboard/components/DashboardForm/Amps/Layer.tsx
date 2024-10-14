import { useGetAMPsQuery } from '@api/ampsAPI'
import { dashboardActions } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { LayerLegend } from '@features/layersSelector/utils/LayerLegend.style'
import { LayerSelector } from '@features/layersSelector/utils/LayerSelector.style'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, IconButton, OPENLAYERS_PROJECTION, THEME, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { setFitToExtent } from 'domain/shared_slices/Map'
import { Projection, transformExtent } from 'ol/proj'
import { createRef } from 'react'
import styled from 'styled-components'

import { MonitorEnvLayers } from '../../../../../domain/entities/layers/constants'
import { useAppDispatch } from '../../../../../hooks/useAppDispatch'

type AmpLayerProps = {
  dashboardId: string
  isSelected: boolean
  layerId: number
}

export function Layer({ dashboardId, isSelected, layerId }: AmpLayerProps) {
  const dispatch = useAppDispatch()
  const ref = createRef<HTMLSpanElement>()

  const selectedAmps = useAppSelector(state => state.dashboard.dashboards?.[dashboardId]?.dashboard.amps)

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
    <StyledLayer ref={ref} $isSelected={isSelected} onClick={toggleZoneMetadata}>
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
            color={THEME.color.slateGray}
            Icon={Icon.Close}
            onClick={removeZone}
            title="Supprimer la zone"
          />
        ) : (
          <IconButton
            accent={Accent.TERTIARY}
            color={isZoneSelected ? THEME.color.blueGray : THEME.color.slateGray}
            data-cy="regulatory-zone-check"
            Icon={isZoneSelected ? Icon.PinFilled : Icon.Pin}
            onClick={handleSelectZone}
            title="Sélectionner la zone"
          />
        )}
      </LayerSelector.IconGroup>
    </StyledLayer>
  )
}

const StyledLayer = styled(LayerSelector.Layer)<{ $isSelected: boolean }>`
  background-color: ${p => p.theme.color.white};
  padding-left: 24px;
  padding-right: 24px;
  justify-content: space-between;

  ${p =>
    p.$isSelected &&
    `
        padding-left: 20px;
        padding-right: 20px;
        margin-left: 4px;
        margin-right: 4px;
    `}
`

const Wrapper = styled.div`
  display: flex;
  justify-content: baseline;
`
