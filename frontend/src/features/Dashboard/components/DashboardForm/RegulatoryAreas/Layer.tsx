import { dashboardActions } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { LayerLegend } from '@features/layersSelector/utils/LayerLegend.style'
import { LayerSelector } from '@features/layersSelector/utils/LayerSelector.style'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, IconButton, THEME, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { transformExtent } from 'ol/proj'
import Projection from 'ol/proj/Projection'
import { createRef } from 'react'
import styled from 'styled-components'

import { useGetRegulatoryLayersQuery } from '../../../../../api/regulatoryLayersAPI'
import { MonitorEnvLayers } from '../../../../../domain/entities/layers/constants'
import { OPENLAYERS_PROJECTION } from '../../../../../domain/entities/map/constants'
import { setFitToExtent } from '../../../../../domain/shared_slices/Map'
import { useAppDispatch } from '../../../../../hooks/useAppDispatch'

type RegulatoryLayerProps = {
  dashboardId: number
  isSelected: boolean
  layerId: number
}

export function Layer({ dashboardId, isSelected, layerId }: RegulatoryLayerProps) {
  const dispatch = useAppDispatch()
  const ref = createRef<HTMLSpanElement>()

  const selectedRegulatoryAreas = useAppSelector(
    state => state.dashboard.dashboards?.[dashboardId]?.[Dashboard.Block.REGULATORY_AREAS]
  )

  const isZoneSelected = selectedRegulatoryAreas?.includes(layerId)
  const { layer } = useGetRegulatoryLayersQuery(undefined, {
    selectFromResult: result => ({
      layer: result?.currentData?.entities[layerId]
    })
  })

  const handleSelectZone = e => {
    e.stopPropagation()

    const payload = { itemIds: [layerId], type: Dashboard.Block.REGULATORY_AREAS }
    if (isZoneSelected) {
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
    dispatch(dashboardActions.setDashboardPanel({ id: layerId, type: Dashboard.Block.REGULATORY_AREAS }))
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
      <LayerLegend
        layerType={MonitorEnvLayers.REGULATORY_ENV}
        legendKey={layer?.entity_name ?? 'aucun'}
        type={layer?.thematique ?? 'aucun'}
      />
      <LayerSelector.Name $withLargeWidth title={layer?.entity_name}>
        {layer?.entity_name ?? 'AUCUN NOM'}
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
  ${p =>
    p.$isSelected &&
    `
        padding-left: 20px;
        padding-right: 20px;
        margin-left: 4px;
        margin-right: 4px;
    `}
`
