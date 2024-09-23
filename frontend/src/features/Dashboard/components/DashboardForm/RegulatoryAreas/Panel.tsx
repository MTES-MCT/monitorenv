import { useGetRegulatoryLayerByIdQuery } from '@api/regulatoryLayersAPI'
import { dashboardActions } from '@features/Dashboard/slice'
import { Identification } from '@features/layersSelector/metadataPanel/regulatoryMetadata/Identification'
import { RegulatorySummary } from '@features/layersSelector/metadataPanel/RegulatorySummary'
import { LayerLegend } from '@features/layersSelector/utils/LayerLegend.style'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import { skipToken } from '@reduxjs/toolkit/query'
import { MonitorEnvLayers } from 'domain/entities/layers/constants'
import { getTitle } from 'domain/entities/layers/utils'
import { FingerprintSpinner } from 'react-epic-spinners'
import styled from 'styled-components'

const FOUR_HOURS = 4 * 60 * 60 * 1000

export function RegulatoryPanel({ dashboardId }: { dashboardId: number }) {
  const dispatch = useAppDispatch()
  const openPanel = useAppSelector(state => state.dashboard.dashboards?.[dashboardId]?.openPanel)

  const { currentData: regulatoryMetadata } = useGetRegulatoryLayerByIdQuery(openPanel?.id ?? skipToken, {
    pollingInterval: FOUR_HOURS
  })

  const onCloseIconClicked = () => {
    dispatch(dashboardActions.setDashboardPanel())
  }

  return (
    <Wrapper $isOpen={!!openPanel}>
      {regulatoryMetadata ? (
        <>
          <Header data-cy="regulatory-metadata-header">
            <LayerLegend
              layerType={MonitorEnvLayers.REGULATORY_ENV}
              legendKey={regulatoryMetadata?.entity_name}
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
          <Content>
            <Identification
              entity_name={regulatoryMetadata?.entity_name}
              facade={regulatoryMetadata?.facade}
              thematique={regulatoryMetadata?.thematique}
              type={regulatoryMetadata?.type}
            />
            <RegulatorySummary regulatoryReference={regulatoryMetadata?.ref_reg} url={regulatoryMetadata?.url} />
          </Content>
        </>
      ) : (
        <CenteredFingerprintSpinner size={100} />
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div<{ $isOpen: boolean }>`
  background-color: ${p => p.theme.color.white};
  box-shadow: 0px 3px 5px #70778540;
  display: block;
  margin-left: 37px;
  opacity: ${p => (p.$isOpen ? 1 : 0)};
  position: absolute;
  transform: translateX(100%);
  transition: all 0.5s;
  width: 400px;
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
