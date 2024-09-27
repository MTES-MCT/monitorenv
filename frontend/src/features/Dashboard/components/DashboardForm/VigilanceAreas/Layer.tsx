import { dashboardActions } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { LayerLegend } from '@features/layersSelector/utils/LayerLegend.style'
import { LayerSelector } from '@features/layersSelector/utils/LayerSelector.style'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, IconButton, THEME } from '@mtes-mct/monitor-ui'
import { GeoJSON } from 'ol/format'
import { createRef } from 'react'
import styled from 'styled-components'

import { MonitorEnvLayers } from '../../../../../domain/entities/layers/constants'
import { OPENLAYERS_PROJECTION } from '../../../../../domain/entities/map/constants'
import { setFitToExtent } from '../../../../../domain/shared_slices/Map'
import { useAppDispatch } from '../../../../../hooks/useAppDispatch'

import type { VigilanceArea } from '@features/VigilanceArea/types'

type RegulatoryLayerProps = {
  dashboardId: number
  isSelected: boolean
  vigilanceArea: VigilanceArea.VigilanceArea
}

export function Layer({ dashboardId, isSelected, vigilanceArea }: RegulatoryLayerProps) {
  const dispatch = useAppDispatch()
  const ref = createRef<HTMLSpanElement>()

  const selectedVigilaneAreas = useAppSelector(
    state => state.dashboard.dashboards?.[dashboardId]?.[Dashboard.Block.VIGILANCE_AREAS]
  )

  const isZoneSelected = selectedVigilaneAreas?.includes(vigilanceArea.id)

  const handleSelectZone = e => {
    e.stopPropagation()

    const payload = { itemIds: [vigilanceArea.id], type: Dashboard.Block.VIGILANCE_AREAS }
    if (isZoneSelected) {
      dispatch(dashboardActions.removeItems(payload))
    } else {
      dispatch(dashboardActions.addItems(payload))

      const feature = new GeoJSON({
        featureProjection: OPENLAYERS_PROJECTION
      }).readFeature(vigilanceArea.geom)

      const extent = feature?.getGeometry()?.getExtent()
      if (extent) {
        dispatch(setFitToExtent(extent))
      }
    }
  }

  const removeZone = e => {
    e.stopPropagation()
    dispatch(dashboardActions.removeItems({ itemIds: [vigilanceArea.id], type: Dashboard.Block.VIGILANCE_AREAS }))
  }

  const toggleZoneMetadata = () => {
    dispatch(dashboardActions.setDashboardPanel({ id: vigilanceArea.id, type: Dashboard.Block.VIGILANCE_AREAS }))
    const feature = new GeoJSON({
      featureProjection: OPENLAYERS_PROJECTION
    }).readFeature(vigilanceArea.geom)

    const extent = feature?.getGeometry()?.getExtent()
    if (extent) {
      dispatch(setFitToExtent(extent))
    }
  }

  return (
    <StyledLayer ref={ref} $isSelected={isSelected} $withBorderBottom onClick={toggleZoneMetadata}>
      <NameContainer>
        <LayerLegend
          isArchived={vigilanceArea?.isArchived}
          layerType={MonitorEnvLayers.VIGILANCE_AREA}
          legendKey={vigilanceArea?.comments ?? 'aucun nom'}
          type={vigilanceArea?.name ?? 'aucun nom'}
        />
        <LayerSelector.Name data-cy={`vigilance-area-zone-${vigilanceArea?.name}`} title={vigilanceArea?.name}>
          {vigilanceArea?.name}
        </LayerSelector.Name>
      </NameContainer>

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
    </StyledLayer>
  )
}

const StyledLayer = styled(LayerSelector.Layer)<{ $isSelected: boolean }>`
  background-color: ${p => p.theme.color.white};
  justify-content: space-between;
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
const NameContainer = styled.div`
  align-items: center;
  display: flex;
`
