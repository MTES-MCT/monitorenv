import { useGetAMPsQuery } from '@api/ampsAPI'
import { CenteredFingerprintLoader } from '@components/CenteredFingerprintLoader'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import { getTitle } from 'domain/entities/layers/utils'
import { useCallback } from 'react'

import { MonitorEnvLayers } from '../../../../domain/entities/layers/constants'
import { LayerLegend } from '../../utils/LayerLegend.style'
import { Body, Content, Field, Fields, Header, Key, Name, NoValue, Value, Wrapper, Zone } from '../MetadataPanel.style'
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
          <Header data-cy="amp-metadata-header">
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
