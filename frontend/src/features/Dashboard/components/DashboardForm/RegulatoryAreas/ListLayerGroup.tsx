import { getNumberOfRegulatoryLayerZonesByGroupName } from '@api/regulatoryLayersAPI'
import { dashboardActions } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { LayerSelector } from '@features/layersSelector/utils/LayerSelector.style'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, IconButton, THEME } from '@mtes-mct/monitor-ui'
import { getTitle } from 'domain/entities/layers/utils'
import { includes, intersection } from 'lodash'
import { useState } from 'react'
import styled from 'styled-components'

import { Layer } from './Layer'

type ResultListLayerGroupProps = {
  dashboardId: number
  groupName: string
  isSelected?: boolean
  layerIds: number[]
}
export function ListLayerGroup({ dashboardId, groupName, isSelected = false, layerIds }: ResultListLayerGroupProps) {
  const dispatch = useAppDispatch()
  const [zonesAreOpen, setZonesAreOpen] = useState(false)

  const totalNumberOfZones = useAppSelector(state => getNumberOfRegulatoryLayerZonesByGroupName(state, groupName))

  const selectedLayerIds = useAppSelector(
    state => state.dashboard.dashboards?.[dashboardId]?.[Dashboard.Block.REGULATORY_AREAS]
  )
  const zonesSelected = intersection(selectedLayerIds, layerIds)
  const allTopicZonesAreChecked = zonesSelected?.length === layerIds?.length
  const forceZonesAreOpen = selectedLayerIds?.some(id => includes(layerIds, id)) ?? false

  const handleCheckAllZones = e => {
    e.stopPropagation()
    const payload = { itemIds: layerIds, type: Dashboard.Block.REGULATORY_AREAS }

    if (allTopicZonesAreChecked) {
      dispatch(dashboardActions.removeItems(payload))
    } else {
      dispatch(dashboardActions.addItems(payload))
    }
  }

  const removeAllZones = e => {
    e.stopPropagation()
    const payload = { itemIds: layerIds, type: Dashboard.Block.REGULATORY_AREAS }
    dispatch(dashboardActions.removeItems(payload))
  }

  const clickOnGroupZones = () => {
    setZonesAreOpen(!zonesAreOpen)
  }

  return (
    <>
      <StyledGroupWrapper $isOpen={forceZonesAreOpen || zonesAreOpen} onClick={clickOnGroupZones}>
        <LayerSelector.GroupName data-cy="result-group" title={groupName}>
          {getTitle(groupName) ?? ''}
        </LayerSelector.GroupName>
        <LayerSelector.IconGroup>
          <LayerSelector.ZonesNumber>{`${layerIds.length}/${totalNumberOfZones}`}</LayerSelector.ZonesNumber>
          {isSelected ? (
            <IconButton
              accent={Accent.TERTIARY}
              aria-label="Supprimer la/les zone(s)"
              color={THEME.color.slateGray}
              Icon={Icon.Close}
              onClick={removeAllZones}
              title="Supprimer la/les zone(s)"
            />
          ) : (
            <IconButton
              accent={Accent.TERTIARY}
              aria-label="Sélectionner la/les zone(s)"
              color={allTopicZonesAreChecked ? THEME.color.blueGray : THEME.color.slateGray}
              Icon={allTopicZonesAreChecked ? Icon.PinFilled : Icon.Pin}
              onClick={handleCheckAllZones}
              title="Sélectionner la/les zone(s)"
            />
          )}
        </LayerSelector.IconGroup>
      </StyledGroupWrapper>
      <LayerSelector.SubGroup isOpen={forceZonesAreOpen || zonesAreOpen} length={layerIds?.length}>
        {layerIds?.map(layerId => (
          <Layer key={layerId} dashboardId={dashboardId} isSelected={isSelected} layerId={layerId} />
        ))}
      </LayerSelector.SubGroup>
    </>
  )
}

const StyledGroupWrapper = styled(LayerSelector.GroupWrapper)`
  padding-left: 24px;
  padding-right: 24px;
`
