import { useGetRegulatoryLayerByIdQuery } from '@api/regulatoryLayersAPI'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import { skipToken } from '@reduxjs/toolkit/query'
import { getTitle } from 'domain/entities/layers/utils'
import { useCallback } from 'react'
import { FingerprintSpinner } from 'react-epic-spinners'
import styled from 'styled-components'

import { Identification } from './Identification'
import { MonitorEnvLayers } from '../../../../domain/entities/layers/constants'
import { LayerLegend } from '../../utils/LayerLegend.style'
import { RegulatorySummary } from '../RegulatorySummary'
import { closeMetadataPanel } from '../slice'

const FOUR_HOURS = 4 * 60 * 60 * 1000

export function RegulatoryMetadata() {
  const dispatch = useAppDispatch()
  const { metadataLayerId, metadataPanelIsOpen } = useAppSelector(state => state.layersMetadata)

  const { currentData: regulatoryMetadata } = useGetRegulatoryLayerByIdQuery(metadataLayerId ?? skipToken, {
    pollingInterval: FOUR_HOURS
  })

  const onCloseIconClicked = useCallback(() => {
    dispatch(closeMetadataPanel())
  }, [dispatch])

  return (
    <Wrapper $regulatoryMetadataPanelIsOpen={metadataPanelIsOpen}>
      {regulatoryMetadata ? (
        <>
          <Header data-cy="regulatory-metadata-header">
            <LayerLegend
              layerType={MonitorEnvLayers.REGULATORY_ENV}
              legendKey={regulatoryMetadata.entityName}
              type={regulatoryMetadata.tags.map(({ name }) => name).join(', ')}
            />
            <RegulatoryZoneName title={getTitle(regulatoryMetadata.layerName)}>
              {getTitle(regulatoryMetadata.layerName)}
            </RegulatoryZoneName>
            <IconButton
              accent={Accent.TERTIARY}
              data-cy="regulatory-layers-metadata-close"
              Icon={Icon.Close}
              onClick={onCloseIconClicked}
            />
          </Header>
          <Content>
            <Identification
              entityName={regulatoryMetadata.entityName}
              facade={regulatoryMetadata.facade}
              tags={regulatoryMetadata.tags}
              type={regulatoryMetadata.type}
            />
            <RegulatorySummary
              regulatoryReference={regulatoryMetadata?.refReg}
              type="REGULATORY"
              url={regulatoryMetadata?.url}
            />
          </Content>
        </>
      ) : (
        <CenteredFingerprintSpinner size={100} />
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

const CenteredFingerprintSpinner = styled(FingerprintSpinner)`
  position: initial !important;
  display: block;
  margin-top: 300px;
`
