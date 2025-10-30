import { useGetAMPsQuery } from '@api/ampsAPI'
import { CenteredFingerprintLoader } from '@components/CenteredFingerprintLoader'
import {
  Body,
  Field,
  Fields,
  Key,
  NoValue,
  Value,
  Zone
} from '@features/layersSelector/metadataPanel/MetadataPanel.style'
import { RegulatorySummary } from '@features/layersSelector/metadataPanel/RegulatorySummary'
import { LayerLegend } from '@features/layersSelector/utils/LayerLegend.style'
import { Accent, Icon, IconButton, THEME } from '@mtes-mct/monitor-ui'
import { MonitorEnvLayers } from 'domain/entities/layers/constants'
import { getTitle } from 'domain/entities/layers/utils'
import { type ComponentProps, forwardRef } from 'react'
import styled from 'styled-components'

export const AmpsPanel = forwardRef<HTMLDivElement, { layerId: number; onClose: () => void } & ComponentProps<'div'>>(
  ({ layerId, onClose, ...props }, ref) => {
    const { layer: ampMetadata } = useGetAMPsQuery(
      { withGeometry: false },
      {
        selectFromResult: result => ({
          layer: result?.currentData?.entities[layerId]
        })
      }
    )

    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <Wrapper ref={ref} {...props}>
        {ampMetadata ? (
          <>
            <Header data-cy="regulatory-metadata-header">
              <LayerLegend layerType={MonitorEnvLayers.AMP} legendKey={ampMetadata?.name} type={ampMetadata?.type} />
              <Name title={getTitle(ampMetadata?.name)}>{getTitle(ampMetadata?.name)}</Name>
              <IconButton
                accent={Accent.TERTIARY}
                data-cy="regulatory-layers-metadata-close"
                Icon={Icon.Close}
                onClick={onClose}
              />
            </Header>
            <Content>
              <Zone>
                <Fields>
                  <Body>
                    <Field>
                      <Key>Nature d&apos;AMP</Key>
                      <Value data-cy="metadata-panel-nature-amp">
                        {ampMetadata.designation || <NoValue>-</NoValue>}
                      </Value>
                    </Field>
                  </Body>
                </Fields>
              </Zone>
              <RegulatorySummary regulatoryReference={ampMetadata?.refReg} url={ampMetadata?.urlLegicem} />
            </Content>
          </>
        ) : (
          <CenteredFingerprintLoader color={THEME.color.lightGray} />
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

const Name = styled.span`
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
