import { useGetAMPsQuery } from '@api/ampsAPI'
import { CenteredFingerprintLoader } from '@components/CenteredFingerprintLoader'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import { getTitle } from 'domain/entities/layers/utils'
import { useCallback } from 'react'
import styled from 'styled-components'

import { MonitorEnvLayers } from '../../../../domain/entities/layers/constants'
import { LayerLegend } from '../../utils/LayerLegend.style'
import { Key, Value, Fields, Field, Zone, Body, NoValue } from '../MetadataPanel.style'
import { RegulatorySummary } from '../RegulatorySummary'
import { closeMetadataPanel } from '../slice'

const FOUR_HOURS = 4 * 60 * 60 * 1000

export function AmpMetadata() {
  const dispatch = useAppDispatch()
  const { metadataLayerId, metadataPanelIsOpen } = useAppSelector(state => state.layersMetadata)

  const { ampMetadata } = useGetAMPsQuery(undefined, {
    pollingInterval: FOUR_HOURS,
    selectFromResult: result => ({
      ampMetadata: metadataLayerId && result?.data?.entities[metadataLayerId]
    })
  })

  const onCloseIconClicked = useCallback(() => {
    dispatch(closeMetadataPanel())
  }, [dispatch])

  return (
    <Wrapper $regulatoryMetadataPanelIsOpen={metadataPanelIsOpen}>
      {ampMetadata ? (
        <>
          <Header data-cy="regulatory-metadata-header">
            <LayerLegend layerType={MonitorEnvLayers.AMP} legendKey={ampMetadata?.name} type={ampMetadata?.type} />
            <Name title={getTitle(ampMetadata?.name)}>{getTitle(ampMetadata?.name)}</Name>
            <IconButton
              accent={Accent.TERTIARY}
              data-cy="regulatory-layers-metadata-close"
              Icon={Icon.Close}
              onClick={onCloseIconClicked}
            />
          </Header>
          <Content>
            <Zone>
              <Fields>
                <Body>
                  <Field>
                    <Key>Nature d&apos;AMP</Key>
                    <Value data-cy="metadata-panel-nature-amp">{ampMetadata.designation || <NoValue>-</NoValue>}</Value>
                  </Field>
                </Body>
              </Fields>
            </Zone>
            <RegulatorySummary regulatoryReference={ampMetadata?.refReg} type="AMP" url={ampMetadata?.urlLegicem} />
          </Content>
        </>
      ) : (
        <CenteredFingerprintLoader />
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div<{ $regulatoryMetadataPanelIsOpen: boolean }>`
  border-radius: 2px;
  width: 400px;
  display: block;
  color: ${p => p.theme.color.charcoal};
  opacity: ${p => (p.$regulatoryMetadataPanelIsOpen ? 1 : 0)};
  padding: 0;
  transition: all 0.5s;
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

const Header = styled.div`
  color: ${p => p.theme.color.gunMetal};
  margin-left: 6px;
  text-align: left;
  height: 40px;
  display: flex;
  font-weight: 500;
  font-size: 15px;
  align-items: center;
  justify-content: center;
  padding: 4px;
`

const Content = styled.div`
  border-radius: 2px;
  color: ${p => p.theme.color.lightGray};
  background: ${p => p.theme.color.white};
  overflow-y: auto;
  max-height: 72vh;
`
