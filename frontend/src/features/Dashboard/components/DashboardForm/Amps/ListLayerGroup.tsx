import { getNumberOfAMPByGroupName } from '@api/ampsAPI'
import { dashboardActions } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { StyledTransparentButton } from '@features/layersSelector/search'
import { LayerSelector } from '@features/layersSelector/utils/LayerSelector.style'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, IconButton, THEME } from '@mtes-mct/monitor-ui'
import { getTitle } from 'domain/entities/layers/utils'
import { intersection } from 'lodash'
import { useState } from 'react'
import styled from 'styled-components'

import { Layer } from './Layer'
import { getPinIcon, getSelectionState } from '../ToggleSelectAll/utils'

type ResultListLayerGroupProps = {
  groupName: string
  isSelected?: boolean
  layerIds: number[]
  selectedAmpIds: number[]
}
export function ListLayerGroup({ groupName, isSelected = false, layerIds, selectedAmpIds }: ResultListLayerGroupProps) {
  const dispatch = useAppDispatch()
  const [zonesAreOpen, setZonesAreOpen] = useState(false)

  const totalNumberOfZones = useAppSelector(state => getNumberOfAMPByGroupName(state, groupName))

  const zonesSelected = intersection(selectedAmpIds, layerIds)
  const topicSelectionState = getSelectionState(zonesSelected, layerIds)

  const handleCheckAllZones = e => {
    e.stopPropagation()
    const payload = { itemIds: layerIds, type: Dashboard.Block.AMP }

    if (topicSelectionState === 'ALL') {
      dispatch(dashboardActions.removeItems(payload))
    } else {
      dispatch(dashboardActions.addItems(payload))
    }
  }

  const removeAllZones = e => {
    e.stopPropagation()
    const payload = { itemIds: layerIds, type: Dashboard.Block.AMP }
    dispatch(dashboardActions.removeItems(payload))
  }

  const clickOnGroupZones = () => {
    setZonesAreOpen(!zonesAreOpen)
  }

  return (
    <li>
      <StyledGroupWrapper $isOpen={zonesAreOpen} $isSelected={isSelected} onClick={clickOnGroupZones}>
        <StyledTransparentButton>
          <LayerSelector.GroupName
            data-cy={`dashboard-${isSelected ? 'selected-' : ''}amp-result-group`}
            title={groupName}
          >
            {getTitle(groupName)}
          </LayerSelector.GroupName>
        </StyledTransparentButton>
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
            getPinIcon(topicSelectionState, handleCheckAllZones)
          )}
        </LayerSelector.IconGroup>
      </StyledGroupWrapper>
      <LayerSelector.SubGroup $isOpen={zonesAreOpen} $length={layerIds?.length}>
        {layerIds?.map(layerId => (
          <Layer key={layerId} isPinned={selectedAmpIds.includes(layerId)} isSelected={isSelected} layerId={layerId} />
        ))}
      </LayerSelector.SubGroup>
    </li>
  )
}

const StyledGroupWrapper = styled(LayerSelector.GroupWrapper)<{ $isSelected: boolean }>`
  background-color: ${p => p.theme.color.white};
  padding-left: 24px;
  padding-right: 24px;

  ${p =>
    p.$isSelected &&
    `
        padding-left: 20px;
        padding-right: 20px;
    `}
`
