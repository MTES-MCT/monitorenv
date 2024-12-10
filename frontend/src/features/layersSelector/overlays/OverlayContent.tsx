import { Tooltip } from '@components/Tooltip'
import { Dashboard } from '@features/Dashboard/types'
import {
  getIsLinkingAMPToVigilanceArea,
  getIsLinkingRegulatoryToVigilanceArea,
  getIsLinkingZonesToVigilanceArea,
  vigilanceAreaActions
} from '@features/VigilanceArea/slice'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { endingOccurenceText, frequencyText } from '@features/VigilanceArea/utils'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, customDayjs, Icon, IconButton, Size, THEME } from '@mtes-mct/monitor-ui'
import { MonitorEnvLayers, type RegulatoryOrAMPOrViglanceAreaLayerType } from 'domain/entities/layers/constants'
import { type RegulatoryLayerCompactProperties } from 'domain/entities/regulatory'
import { layerSidebarActions } from 'domain/shared_slices/LayerSidebar'
import { mapActions } from 'domain/shared_slices/Map'
import styled from 'styled-components'

import { getGroupName, getLegendKey, getLegendType, getName, getTitle } from '../../../domain/entities/layers/utils'
import {
  closeMetadataPanel,
  getDisplayedMetadataLayerIdAndType,
  openAMPMetadataPanel,
  openRegulatoryMetadataPanel
} from '../metadataPanel/slice'
import { LayerLegend } from '../utils/LayerLegend.style'

import type { AMPProperties } from 'domain/entities/AMPs'
import type { OverlayItem } from 'domain/types/map'

type OverlayContentProps = {
  items:
    | OverlayItem<
        RegulatoryOrAMPOrViglanceAreaLayerType,
        AMPProperties | RegulatoryLayerCompactProperties | VigilanceArea.VigilanceAreaProperties
      >[]
    | undefined
}

function isRegulatoryLayer(type: RegulatoryOrAMPOrViglanceAreaLayerType) {
  return (
    type === MonitorEnvLayers.REGULATORY_ENV ||
    type === MonitorEnvLayers.REGULATORY_ENV_PREVIEW ||
    type === MonitorEnvLayers.REGULATORY_AREAS_LINKED_TO_VIGILANCE_AREA ||
    type === Dashboard.Layer.DASHBOARD_REGULATORY_AREAS
  )
}

function isAmpLayer(type: RegulatoryOrAMPOrViglanceAreaLayerType) {
  return (
    type === MonitorEnvLayers.AMP ||
    type === MonitorEnvLayers.AMP_PREVIEW ||
    type === MonitorEnvLayers.AMP_LINKED_TO_VIGILANCE_AREA ||
    type === Dashboard.Layer.DASHBOARD_AMP
  )
}

function isVigilanceAreaLayer(type: RegulatoryOrAMPOrViglanceAreaLayerType) {
  return (
    type === MonitorEnvLayers.VIGILANCE_AREA ||
    type === MonitorEnvLayers.VIGILANCE_AREA_PREVIEW ||
    type === Dashboard.Layer.DASHBOARD_VIGILANCE_AREAS
  )
}

export function OverlayContent({ items }: OverlayContentProps) {
  const dispatch = useAppDispatch()

  const isolatedLayer = useAppSelector(state => state.map.isolatedLayer)

  const { layerId, layerType } = useAppSelector(state => getDisplayedMetadataLayerIdAndType(state))
  const selectedVigilanceAreaId = useAppSelector(state => state.vigilanceArea.selectedVigilanceAreaId)
  const editingVigilanceAreaId = useAppSelector(state => state.vigilanceArea.editingVigilanceAreaId)

  const regulatoryAreasToAdd = useAppSelector(state => state.vigilanceArea.regulatoryAreasToAdd)
  const ampToAdd = useAppSelector(state => state.vigilanceArea.ampToAdd)
  const isLinkingRegulatoryToVigilanceArea = useAppSelector(state => getIsLinkingRegulatoryToVigilanceArea(state))
  const isLinkingAmpToVigilanceArea = useAppSelector(state => getIsLinkingAMPToVigilanceArea(state))
  const isLinkingZonesToVigilanceArea = useAppSelector(state => getIsLinkingZonesToVigilanceArea(state))

  const handleClick = (type, id) => () => {
    if (isAmpLayer(type)) {
      dispatch(openAMPMetadataPanel(id))
      dispatch(layerSidebarActions.toggleAmpResults(true))

      if (editingVigilanceAreaId) {
        dispatch(vigilanceAreaActions.setSelectedVigilanceAreaId(editingVigilanceAreaId))
      }
    }
    if (isRegulatoryLayer(type)) {
      dispatch(openRegulatoryMetadataPanel(id))
      dispatch(layerSidebarActions.toggleRegulatoryResults(true))

      if (editingVigilanceAreaId) {
        dispatch(vigilanceAreaActions.setSelectedVigilanceAreaId(editingVigilanceAreaId))
      }
    }
    if (
      type === MonitorEnvLayers.VIGILANCE_AREA ||
      type === MonitorEnvLayers.VIGILANCE_AREA_PREVIEW ||
      type === Dashboard.Layer.DASHBOARD_VIGILANCE_AREAS
    ) {
      dispatch(vigilanceAreaActions.setSelectedVigilanceAreaId(id))
      dispatch(closeMetadataPanel())
      dispatch(layerSidebarActions.toggleVigilanceAreaResults(true))
    }
  }

  const addRegulatoryToVigilanceArea = (e, id) => {
    e.stopPropagation()
    dispatch(vigilanceAreaActions.addRegulatoryAreasToVigilanceArea([id]))
  }

  const addAMPToVigilanceArea = (e, id) => {
    e.stopPropagation()
    dispatch(vigilanceAreaActions.addAmpIdsToVigilanceArea([id]))
  }

  const isolateLayer = (e, id, type) => {
    e.stopPropagation()

    if (isolatedLayer?.id === id) {
      dispatch(mapActions.setIsolateMode({ excludedLayers: [], isolatedLayer: undefined }))

      return
    }

    const layerToIsolate = {
      id,
      type
    }
    const excludedLayers =
      items?.map(item => ({ id: item.properties.id, type: item.layerType })).filter(item => item.id !== id) ?? []
    dispatch(mapActions.setIsolateMode({ excludedLayers, isolatedLayer: layerToIsolate }))
  }

  return (
    <Layerlist>
      {items
        ?.filter(item => {
          if (isLinkingZonesToVigilanceArea) {
            return (
              item.layerType !== MonitorEnvLayers.VIGILANCE_AREA &&
              item.layerType !== MonitorEnvLayers.VIGILANCE_AREA_PREVIEW &&
              item.layerType !== Dashboard.Layer.DASHBOARD_VIGILANCE_AREAS
            )
          }

          return item.properties
        })
        .map(item => {
          const { id } = item.properties
          const groupName = getGroupName(item.properties, item.layerType)
          const name = getName(item.properties, item.layerType)
          const legendType = getLegendType(item.properties, item.layerType)
          const legendKey = getLegendKey(item.properties, item.layerType)
          const isSelected =
            (id === layerId && !!layerType && item.layerType.includes(layerType)) || selectedVigilanceAreaId === id

          const isRegulatory = isRegulatoryLayer(item.layerType)
          const isAMP = isAmpLayer(item.layerType)
          const isVigilanceArea = isVigilanceAreaLayer(item.layerType)

          const isDisabled = id !== isolatedLayer?.id && !!isolatedLayer?.id

          let vigilanceAreaPeriod = ''
          if (isVigilanceArea) {
            if ((item.properties as VigilanceArea.VigilanceAreaProperties).isAtAllTimes) {
              vigilanceAreaPeriod = 'En tout temps'
            } else if ('startDatePeriod' in item.properties) {
              vigilanceAreaPeriod = `${[
                `${
                  item.properties.startDatePeriod
                    ? `Du ${customDayjs(item.properties.startDatePeriod).utc().format('DD/MM/YYYY')}`
                    : ''
                }  
            ${
              item.properties?.endDatePeriod
                ? `au ${customDayjs(item.properties.endDatePeriod).utc().format('DD/MM/YYYY')}`
                : ''
            }`,
                frequencyText(item.properties.frequency, false),
                endingOccurenceText(item.properties.endingCondition, item.properties.computedEndDate, false)
              ]
                .filter(Boolean)
                .join(', ')}`
            }
          }

          const isArchived = (item.properties as VigilanceArea.VigilanceAreaProperties)?.isArchived ?? false

          return (
            <LayerItem key={id} $isSelected={isSelected} onClick={handleClick(item.layerType, id)}>
              <Wrapper>
                <LayerLegend
                  isDisabled={isArchived || isDisabled}
                  layerType={item.layerType}
                  legendKey={legendKey}
                  size={Size.NORMAL}
                  type={legendType}
                />

                <GroupName $isDisabled={isDisabled} title={getTitle(groupName)}>
                  {getTitle(groupName)}
                </GroupName>
                {getTitle(name) && (
                  <Name $isDisabled={isDisabled} title={getTitle(name)}>{` / ${getTitle(name)}`}</Name>
                )}
                {items.length > 1 && isVigilanceArea && (
                  <StyledTooltip Icon={Icon.Calendar}>{vigilanceAreaPeriod}</StyledTooltip>
                )}
                {items.length > 1 && (
                  <StyledIconButton
                    accent={Accent.TERTIARY}
                    color={isolatedLayer?.id === id ? THEME.color.blueGray : THEME.color.charcoal}
                    Icon={Icon.FocusZones}
                    onClick={e => isolateLayer(e, id, item.layerType)}
                  />
                )}
                {isLinkingRegulatoryToVigilanceArea && isRegulatory && (
                  <IconButton
                    accent={Accent.TERTIARY}
                    disabled={regulatoryAreasToAdd.includes(id)}
                    Icon={Icon.Plus}
                    onClick={e => addRegulatoryToVigilanceArea(e, id)}
                    size={Size.SMALL}
                    title={`Ajouter la zone réglementaire ${name}`}
                  />
                )}
                {isLinkingAmpToVigilanceArea && isAMP && (
                  <IconButton
                    accent={Accent.TERTIARY}
                    disabled={ampToAdd.includes(id)}
                    Icon={Icon.Plus}
                    onClick={e => addAMPToVigilanceArea(e, id)}
                    size={Size.SMALL}
                    title={`Ajouter l'AMP ${name}`}
                  />
                )}
              </Wrapper>
              {items.length === 1 && isVigilanceArea && <Period>{vigilanceAreaPeriod}</Period>}
            </LayerItem>
          )
        })}
    </Layerlist>
  )
}

const Layerlist = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 470px;
  overflow-y: auto;
`

const LayerItem = styled.li<{ $isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 7px 8px 8px 8px;
  background-color: ${p => (p.$isSelected ? p.theme.color.blueYonder25 : p.theme.color.white)};
  border-bottom: 1px solid ${p => p.theme.color.lightGray};
`

// using average width of 7px per character to approximate min-width
// more precise calculation would require measuring text width with access to the dom
const GroupName = styled.span<{ $isDisabled: boolean }>`
  color: ${p => (p.$isDisabled ? p.theme.color.lightGray : p.theme.color.gunMetal)};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font: normal normal bold 13px/18px Marianne;
  min-width: ${p => (p.title?.length && p.title.length * 7 > 220 ? 200 : 0)}px;
  margin-left: 8px;
`

const Name = styled.span<{ $isDisabled: boolean }>`
  color: ${p => (p.$isDisabled ? p.theme.color.lightGray : p.theme.color.gunMetal)};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font: normal normal normal 13px/18px Marianne;
  flex: 1;
`

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`

const Period = styled.span`
  color: ${p => p.theme.color.slateGray};
  font-size: 13px;
  padding-left: 24px;
`

const StyledTooltip = styled(Tooltip)`
  display: flex;
  margin-left: auto;
`

const StyledIconButton = styled(IconButton)`
  > svg {
    height: 18px;
    width: 18px;
  }
`
