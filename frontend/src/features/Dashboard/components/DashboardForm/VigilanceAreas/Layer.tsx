import { dashboardActions, getOpenedPanel } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { LayerLegend } from '@features/layersSelector/utils/LayerLegend.style'
import { LayerSelector } from '@features/layersSelector/utils/LayerSelector.style'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, IconButton, THEME } from '@mtes-mct/monitor-ui'
import { getFeature } from '@utils/getFeature'
import { createRef } from 'react'
import styled from 'styled-components'

import { MonitorEnvLayers } from '../../../../../domain/entities/layers/constants'
import { setFitToExtent } from '../../../../../domain/shared_slices/Map'
import { useAppDispatch } from '../../../../../hooks/useAppDispatch'

import type { VigilanceArea } from '@features/VigilanceArea/types'

type VigilanceAreaLayerProps = {
  isPinned?: boolean
  isSelected: boolean
  vigilanceArea: VigilanceArea.VigilanceAreaLayer | VigilanceArea.VigilanceAreaFromApi
}

export function Layer({ isPinned = false, isSelected, vigilanceArea }: VigilanceAreaLayerProps) {
  const dispatch = useAppDispatch()
  const openPanel = useAppSelector(state => getOpenedPanel(state.dashboard, Dashboard.Block.VIGILANCE_AREAS))

  const ref = createRef<HTMLSpanElement>()

  const handleSelectZone = e => {
    e.stopPropagation()

    const payload = { itemIds: [vigilanceArea.id], type: Dashboard.Block.VIGILANCE_AREAS }
    if (isPinned) {
      dispatch(dashboardActions.removeItems(payload))
    } else {
      dispatch(dashboardActions.addItems(payload))
    }
  }

  const removeZone = e => {
    e.stopPropagation()
    dispatch(dashboardActions.removeItems({ itemIds: [vigilanceArea.id], type: Dashboard.Block.VIGILANCE_AREAS }))
  }

  const toggleZoneMetadata = () => {
    dispatch(
      dashboardActions.setDashboardPanel({
        id: vigilanceArea.id,
        isPinned: isSelected,
        type: Dashboard.Block.VIGILANCE_AREAS
      })
    )

    dispatch(dashboardActions.setDashboardPanel({ id: vigilanceArea.id, type: Dashboard.Block.VIGILANCE_AREAS }))
    const feature = getFeature(vigilanceArea.geom)

    const extent = feature?.getGeometry()?.getExtent()
    if (extent) {
      dispatch(setFitToExtent(extent))
    }
  }

  return (
    <StyledLayer
      ref={ref}
      $isSelected={isSelected}
      $metadataIsShown={openPanel?.id === vigilanceArea.id && openPanel?.isPinned === isSelected}
      $withBorderBottom
      onClick={toggleZoneMetadata}
    >
      <NameContainer>
        <LayerLegend
          isArchived={vigilanceArea?.isArchived}
          layerType={MonitorEnvLayers.VIGILANCE_AREA}
          legendKey={vigilanceArea?.comments ?? 'aucun nom'}
          type={vigilanceArea?.name ?? 'aucun nom'}
        />
        <LayerSelector.Name
          data-cy={`dashboard-${isSelected ? 'selected-' : ''}vigilance-area-zone-${vigilanceArea?.name}`}
          title={vigilanceArea?.name}
        >
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
          color={isPinned ? THEME.color.blueGray : THEME.color.slateGray}
          data-cy={`dashboard-vigilance-area-zone-check-${vigilanceArea.id}`}
          Icon={isPinned ? Icon.PinFilled : Icon.Pin}
          onClick={handleSelectZone}
        />
      )}
    </StyledLayer>
  )
}

const StyledLayer = styled(LayerSelector.Layer)<{ $isSelected: boolean }>`
  background: ${p => (p.$metadataIsShown ? p.theme.color.blueYonder25 : p.theme.color.white)};
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
