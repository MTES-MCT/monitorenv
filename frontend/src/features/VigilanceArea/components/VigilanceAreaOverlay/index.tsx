import { closeMetadataPanel } from '@features/layersSelector/metadataPanel/slice'
import { GroupName } from '@features/layersSelector/overlays/OverlayContent'
import { LayerLegend } from '@features/layersSelector/utils/LayerLegend.style'
import { vigilanceAreaActions } from '@features/VigilanceArea/slice'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { computeVigilanceAreaPeriod } from '@features/VigilanceArea/utils'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Accent, Icon, Size, Tag, THEME } from '@mtes-mct/monitor-ui'
import { MonitorEnvLayers, type RegulatoryOrAMPOrViglanceAreaLayerType } from 'domain/entities/layers/constants'
import { getGroupName, getLegendKey, getLegendType, getName, getTitle } from 'domain/entities/layers/utils'
import { layerSidebarActions } from 'domain/shared_slices/LayerSidebar'
import styled from 'styled-components'

import { isOutOfPeriod, isWithinPeriod } from '../VigilanceAreaForm/utils'

import type { OverlayItem } from 'domain/types/map'

export function VigilanceAreaOverlay({
  vigilanceAreaItem
}: {
  vigilanceAreaItem: OverlayItem<RegulatoryOrAMPOrViglanceAreaLayerType, VigilanceArea.VigilanceAreaProperties>
}) {
  const dispatch = useAppDispatch()
  const vigilanceArea = vigilanceAreaItem.properties
  const { id, periods, sources, visibility } = vigilanceArea as VigilanceArea.VigilanceArea

  const tags = getName(vigilanceArea, MonitorEnvLayers.VIGILANCE_AREA)
  const groupName = getGroupName(vigilanceArea, MonitorEnvLayers.VIGILANCE_AREA)
  const legendType = getLegendType(vigilanceArea, MonitorEnvLayers.VIGILANCE_AREA)
  const legendKey = getLegendKey(vigilanceArea, MonitorEnvLayers.VIGILANCE_AREA)

  const vigilanceAreaPeriod = periods?.map(period => computeVigilanceAreaPeriod(period, false))

  const handleClick = () => {
    dispatch(vigilanceAreaActions.setSelectedVigilanceAreaId(id))
    dispatch(closeMetadataPanel())
    dispatch(layerSidebarActions.toggleVigilanceAreaResults(true))
  }

  return (
    <Wrapper onClick={handleClick}>
      <TitleWrapper>
        <LayerLegend
          border={isWithinPeriod(periods, true) ? `2px solid ${THEME.color.maximumRed}` : undefined}
          isDisabled={isOutOfPeriod(periods)}
          layerType={vigilanceAreaItem.layerType}
          legendKey={legendKey}
          size={Size.NORMAL}
          type={legendType}
        />

        <GroupName $isDisabled={false} title={getTitle(groupName)}>
          {getTitle(groupName)}
        </GroupName>
      </TitleWrapper>
      {tags && <TagsWrapper title={tags}>{tags}</TagsWrapper>}
      {visibility === VigilanceArea.Visibility.PRIVATE && (
        <StyledTag accent={Accent.TERTIARY} Icon={Icon.Unlock}>
          Confidentiel
        </StyledTag>
      )}
      <PeriodWrapper>
        {periods && periods.length > 1 && (
          <MultiplePeriods>
            <span>Périodes multiples</span>
            <Icon.Reset size={12} />
          </MultiplePeriods>
        )}
        {periods && periods.length === 1 && <span>{vigilanceAreaPeriod}</span>}
      </PeriodWrapper>
      <SourcesWrapper>
        {sources?.map(source => {
          const sourceLabel = source.type === VigilanceArea.VigilanceAreaSourceType.INTERNAL ? 'CACEM' : 'externe'

          return (
            <li key={source.id}>
              <Label>Source {sourceLabel}:</Label>
              <span> {source.name}</span>
            </li>
          )
        })}
      </SourcesWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background-color: ${$p => $p.theme.color.white};
  display: flex;
  flex-direction: column;
  max-height: 350px;
  padding: 8px;
`

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
`

const StyledTag = styled(Tag)`
  margin: 4px 0px 4px 24px;
`
const PeriodWrapper = styled.div`
  color: ${$p => $p.theme.color.slateGray};
  font-size: 13px;
  margin-left: 24px;
`
const MultiplePeriods = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`
const SourcesWrapper = styled.ul`
  color: ${$p => $p.theme.color.slateGray};
  display: flex;
  flex-direction: column;
  font-size: 13px;
  margin-left: 24px;
`
const Label = styled.span`
  font-weight: 500;
`

const TagsWrapper = styled.div`
  color: ${$p => $p.theme.color.slateGray};
  font-size: 13px;
  margin-left: 24px;
`
