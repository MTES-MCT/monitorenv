import { useGetRegulatoryLayerByIdQuery } from '@api/regulatoryLayersAPI'
import { Identification } from '@features/layersSelector/metadataPanel/regulatoryMetadata/Identification'
import { RegulatorySummary } from '@features/layersSelector/metadataPanel/RegulatorySummary'
import { LayerLegend } from '@features/layersSelector/utils/LayerLegend.style'
import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import { MonitorEnvLayers } from 'domain/entities/layers/constants'
import { getTitle } from 'domain/entities/layers/utils'
import { forwardRef } from 'react'
import { FingerprintSpinner } from 'react-epic-spinners'
import styled from 'styled-components'

const FOUR_HOURS = 4 * 60 * 60 * 1000

type RegulatoryAreasPanelProps = {
  layerId: number
  onClose: () => void
}

export const RegulatoryAreasPanel = forwardRef<HTMLDivElement, RegulatoryAreasPanelProps>(
  ({ layerId, onClose, ...props }, ref) => {
    const { currentData: regulatoryMetadata } = useGetRegulatoryLayerByIdQuery(layerId, {
      pollingInterval: FOUR_HOURS
    })

    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <Wrapper ref={ref} {...props}>
        {regulatoryMetadata ? (
          <>
            <Header>
              <LayerLegend
                layerType={MonitorEnvLayers.REGULATORY_ENV}
                legendKey={regulatoryMetadata?.entityName}
                type={regulatoryMetadata?.thematique}
              />
              <RegulatoryZoneName title={getTitle(regulatoryMetadata?.layerName)}>
                {getTitle(regulatoryMetadata?.layerName)}
              </RegulatoryZoneName>
              <IconButton accent={Accent.TERTIARY} Icon={Icon.Close} onClick={onClose} />
            </Header>
            <Content>
              <Identification
                entityName={regulatoryMetadata?.entityName}
                facade={regulatoryMetadata?.facade}
                thematique={regulatoryMetadata?.thematique}
                type={regulatoryMetadata?.type}
              />
              <RegulatorySummary regulatoryReference={regulatoryMetadata?.refReg} url={regulatoryMetadata?.url} />
            </Content>
          </>
        ) : (
          <CenteredFingerprintSpinner size={100} />
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

const CenteredFingerprintSpinner = styled(FingerprintSpinner)`
  position: initial !important;
  display: block;
  margin-top: 300px;
`
