import { useGetRegulatoryAreaByIdQuery } from '@api/regulatoryAreasAPI'
import { useGetRegulatoryLayerByIdQuery } from '@api/regulatoryLayersAPI'
import { CenteredFingerprintLoader } from '@components/CenteredFingerprintLoader'
import { Identification } from '@features/layersSelector/metadataPanel/regulatoryMetadata/Identification'
import { RegulatorySummary } from '@features/layersSelector/metadataPanel/RegulatorySummary'
import { LayerLegend } from '@features/layersSelector/utils/LayerLegend.style'
import { Accent, Icon, IconButton, THEME } from '@mtes-mct/monitor-ui'
import { getRegulatoryAreaTitle } from '@utils/getRegulatoryAreaTitle'
import { displayTags } from '@utils/getTagsAsOptions'
import { MonitorEnvLayers } from 'domain/entities/layers/constants'
import { getTitle } from 'domain/entities/layers/utils'
import { forwardRef } from 'react'
import styled from 'styled-components'

const FOUR_HOURS = 4 * 60 * 60 * 1000

type RegulatoryAreasPanelProps = {
  isNewRegulatoryArea?: boolean
  layerId: number
  onClose: () => void
}

export const RegulatoryAreasPanel = forwardRef<HTMLDivElement, RegulatoryAreasPanelProps>(
  ({ isNewRegulatoryArea = false, layerId, onClose, ...props }, ref) => {
    const { currentData: regulatoryLayer } = useGetRegulatoryLayerByIdQuery(layerId, {
      pollingInterval: FOUR_HOURS,
      skip: isNewRegulatoryArea
    })

    const { data: regulatoryArea } = useGetRegulatoryAreaByIdQuery(layerId, {
      pollingInterval: FOUR_HOURS,
      skip: !isNewRegulatoryArea
    })

    const regulatoryMetadata = regulatoryArea ?? regulatoryLayer

    const layerTitle = getRegulatoryAreaTitle(regulatoryMetadata?.polyName, regulatoryMetadata?.resume)

    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <Wrapper ref={ref} {...props}>
        {regulatoryMetadata ? (
          <>
            <Header>
              <LayerLegend
                layerType={MonitorEnvLayers.REGULATORY_ENV}
                legendKey={layerTitle}
                plan={regulatoryMetadata.plan}
                type={displayTags(regulatoryMetadata.tags)}
              />
              <RegulatoryZoneName title={getTitle(regulatoryMetadata.layerName)}>
                {getTitle(regulatoryMetadata.layerName)}
              </RegulatoryZoneName>
              <IconButton accent={Accent.TERTIARY} Icon={Icon.Close} onClick={onClose} />
            </Header>
            <Content>
              <Identification
                facade={regulatoryMetadata.facade}
                plan={regulatoryMetadata.plan}
                polyName={regulatoryMetadata.polyName}
                resume={getTitle(regulatoryMetadata.resume)}
                tags={regulatoryMetadata.tags}
                themes={regulatoryMetadata.themes}
                type={regulatoryMetadata.type}
              />
              <RegulatorySummary regulatoryReference={regulatoryMetadata.refReg} url={regulatoryMetadata.url} />
            </Content>
          </>
        ) : (
          <CenteredFingerprintLoader color={THEME.color.slateGray} />
        )}
      </Wrapper>
    )
  }
)

const Wrapper = styled.div`
  background-color: ${p => p.theme.color.white};
  box-shadow: 0px 3px 5px #70778540;
  position: absolute;
  width: 400px;
  z-index: 2;
`

const RegulatoryZoneName = styled.span`
  flex: 1;
  line-height: initial;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 15px;
  margin-left: 5px;
  margin-right: 5px;
`

const Header = styled.header`
  background-color: ${p => p.theme.color.gainsboro};
  color: ${p => p.theme.color.gunMetal};
  text-align: left;
  height: 40px;
  display: flex;
  font-weight: 500;
  font-size: 15px;
  align-items: center;
  justify-content: center;
  padding: 4px 4px 4px 10px;
`

const Content = styled.div`
  color: ${p => p.theme.color.lightGray};
  overflow-y: auto;
  max-height: 72vh;
`
