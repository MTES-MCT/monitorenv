import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import { skipToken } from '@reduxjs/toolkit/query'
import { useCallback } from 'react'
import { FingerprintSpinner } from 'react-epic-spinners'
import styled from 'styled-components'

import { Identification } from './Identification'
import { MetadataRegulatoryReferences } from './MetadataRegulatoryReferences'
import { useGetRegulatoryLayerByIdQuery } from '../../../api/regulatoryLayersAPI'
import { MonitorEnvLayers } from '../../../domain/entities/layers/constants'
import { getTitle } from '../../../domain/entities/regulatory'
import { closeRegulatoryMetadataPanel } from '../../../domain/shared_slices/RegulatoryMetadata'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { LayerLegend } from '../utils/LayerLegend.style'

const FOUR_HOURS = 4 * 60 * 60 * 1000

export function RegulatoryLayerZoneMetadata() {
  const dispatch = useAppDispatch()
  const regulatoryMetadataLayerId = useAppSelector(state => state.regulatoryMetadata.regulatoryMetadataLayerId)
  const regulatoryMetadataPanelIsOpen = useAppSelector(state => state.regulatoryMetadata.regulatoryMetadataPanelIsOpen)

  const { currentData } = useGetRegulatoryLayerByIdQuery(regulatoryMetadataLayerId ?? skipToken, {
    pollingInterval: FOUR_HOURS
  })
  const regulatoryMetadata = currentData

  const onCloseIconClicked = useCallback(() => {
    dispatch(closeRegulatoryMetadataPanel())
  }, [dispatch])

  return (
    <Wrapper $regulatoryMetadataPanelIsOpen={regulatoryMetadataPanelIsOpen}>
      {regulatoryMetadata ? (
        <>
          <Header data-cy="regulatory-metadata-header">
            <LayerLegend
              layerType={MonitorEnvLayers.REGULATORY_ENV}
              name={regulatoryMetadata?.entity_name}
              type={regulatoryMetadata?.thematique}
            />
            <RegulatoryZoneName title={getTitle(regulatoryMetadata?.layer_name)}>
              {getTitle(regulatoryMetadata?.layer_name)}
            </RegulatoryZoneName>
            <IconButton
              accent={Accent.TERTIARY}
              data-cy="regulatory-layers-metadata-close"
              Icon={Icon.Close}
              onClick={onCloseIconClicked}
            />
          </Header>
          <Warning>
            <Icon.Warning size={30} />
            Travail en cours, bien vérifier dans Légicem la validité de la référence et des infos réglementaires
          </Warning>
          <Content>
            <Identification
              entity_name={regulatoryMetadata?.entity_name}
              facade={regulatoryMetadata?.facade}
              thematique={regulatoryMetadata?.thematique}
              type={regulatoryMetadata?.type}
            />
            <MetadataRegulatoryReferences
              regulatoryReference={regulatoryMetadata?.ref_reg}
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

const Warning = styled.div`
  align-items: center;
  background: ${p => p.theme.color.goldenPoppy};
  color: ${p => p.theme.color.gunMetal};
  display: flex;
  font: normal normal bold 13px/18px Marianne;
  gap: 16px;
  padding: 10px;
  text-align: left;
`

const CenteredFingerprintSpinner = styled(FingerprintSpinner)`
  position: initial !important;
  display: block;
  margin-top: 300px;
`
