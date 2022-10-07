import React, { useCallback } from 'react'
import { FingerprintSpinner } from 'react-epic-spinners'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { useGetRegulatoryLayerQuery } from '../../../../api/regulatoryLayersAPI'
import { COLORS } from '../../../../constants/constants'
import { getTitle } from '../../../../domain/entities/regulatory'
import { closeRegulatoryZoneMetadata } from '../../../../domain/use_cases/regulatory/closeRegulatoryZoneMetadata'
import { ReactComponent as AlertSVG } from '../../../../uiMonitor/icons/Attention_controles.svg'
import { ReactComponent as CloseSVG } from '../../../../uiMonitor/icons/Close.svg'
import { ReactComponent as SummarySVG } from '../../../../uiMonitor/icons/Summary.svg'
import Identification from './Identification'
import MetadataRegulatoryReferences from './MetadataRegulatoryReferences'

const FOUR_HOURS = 4 * 60 * 60 * 1000
function RegulatoryLayerZoneMetadata() {
  const dispatch = useDispatch()
  const { regulatoryMetadataLayerId, regulatoryMetadataPanelIsOpen } = useSelector(state => state.regulatoryMetadata)
  const { currentData } = useGetRegulatoryLayerQuery({ id: regulatoryMetadataLayerId }, { pollingInterval: FOUR_HOURS })
  const regulatoryMetadata = currentData?.properties

  const onCloseIconClicked = useCallback(() => {
    dispatch(closeRegulatoryZoneMetadata())
  }, [dispatch])

  return (
    <Wrapper $regulatoryMetadataPanelIsOpen={regulatoryMetadataPanelIsOpen}>
      {regulatoryMetadata ? (
        <>
          <Header>
            <REGPaperIcon />
            <RegulatoryZoneName title={getTitle(regulatoryMetadata?.layer_name)}>
              {getTitle(regulatoryMetadata?.layer_name)}
            </RegulatoryZoneName>
            <CloseSVG data-cy="regulatory-layers-metadata-close" onClick={onCloseIconClicked} />
          </Header>
          <Warning>
            <WarningIcon />
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
        // eslint-disable-next-line react/forbid-component-props
        <FingerprintSpinner className="radar" color={COLORS.background} size={100} />
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  border-radius: 2px;
  width: 400px;
  display: block;
  color: ${COLORS.charcoal};
  opacity: ${props => (props.$regulatoryMetadataPanelIsOpen ? 1 : 0)};
  z-index: -1;
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
  color: ${COLORS.gunMetal};
  margin-left: 6px;
  text-align: left;
  height: 40px;
  display: flex;
  font-weight: 500;
  font-size: 15px;
  align-items: center;
  justify-content: center;
`

const Content = styled.div`
  border-radius: 2px;
  color: ${COLORS.lightGray};
  background: ${COLORS.background};
  overflow-y: auto;
  max-height: 72vh;
`

const Warning = styled.div`
  font-size: 13px;
  color: ${COLORS.gunMetal};
  background: ${COLORS.orange};
  display: flex;
  text-align: left;
  font: normal normal bold 13px/18px Marianne;
  padding: 10px;
`

const WarningIcon = styled(AlertSVG)`
  width: 30px;
  flex: 57px;
  height: 30px;
  margin: 4px 10px 0px 0;
`

const REGPaperIcon = styled(SummarySVG)`
  margin-left: 3px;
  width: 25px;
`

export default RegulatoryLayerZoneMetadata
