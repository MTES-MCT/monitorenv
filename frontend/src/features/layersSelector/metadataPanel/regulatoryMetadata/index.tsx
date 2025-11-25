import { useGetRegulatoryLayerByIdQuery } from '@api/regulatoryLayersAPI'
import { CenteredFingerprintLoader } from '@components/CenteredFingerprintLoader'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, IconButton, Size } from '@mtes-mct/monitor-ui'
import { skipToken } from '@reduxjs/toolkit/query'
import { getTitle } from 'domain/entities/layers/utils'
import { useCallback } from 'react'

import { Identification } from './Identification'
import { MonitorEnvLayers } from '../../../../domain/entities/layers/constants'
import { LayerLegend } from '../../utils/LayerLegend.style'
import { Content, Header, Name, Wrapper } from '../MetadataPanel.style'
import { RegulatorySummary } from '../RegulatorySummary'
import { closeMetadataPanel } from '../slice'

const FOUR_HOURS = 4 * 60 * 60 * 1000

export function RegulatoryMetadata() {
  const dispatch = useAppDispatch()
  const { metadataLayerId, metadataPanelIsOpen } = useAppSelector(state => state.layersMetadata)

  const { currentData: regulatoryMetadata } = useGetRegulatoryLayerByIdQuery(
    metadataLayerId ? Number(metadataLayerId) : skipToken,
    {
      pollingInterval: FOUR_HOURS
    }
  )

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
            <Name title={getTitle(regulatoryMetadata.layerName)}>{getTitle(regulatoryMetadata.layerName)}</Name>
            <IconButton
              accent={Accent.TERTIARY}
              data-cy="regulatory-layers-metadata-close"
              Icon={Icon.Close}
              onClick={onCloseIconClicked}
              size={Size.SMALL}
            />
          </Header>
          <Content>
            <Identification
              entityName={regulatoryMetadata.entityName}
              facade={regulatoryMetadata.facade}
              tags={regulatoryMetadata.tags}
              themes={regulatoryMetadata.themes}
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
        <CenteredFingerprintLoader />
      )}
    </Wrapper>
  )
}
