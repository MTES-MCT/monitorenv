import React from 'react'
import styled from 'styled-components'
import { GreenCircle, RedCircle } from '../../../commonStyles/Circle.style'
import { useSelector } from 'react-redux'
import { SectionTitle, Section, List } from './RegulatoryMetadata.style'
import GearsOrGearCategories from './GearsOrGearCategories'
import { COLORS } from '../../../../constants/constants'

const MetadataGears = () => {
  const { regulatoryGears } = useSelector(state => state.regulatory.regulatoryZoneMetadata)
  const {
    authorized,
    regulatedGears,
    regulatedGearCategories,
    derogation,
    otherInfo
  } = regulatoryGears

  return <>{regulatoryGears && authorized !== undefined &&
    <Section>
      <SectionTitle>{regulatoryGears.authorized
        ? <GreenCircle margin={'0 5px 0 0'} />
        : <RedCircle margin={'0 5px 0 0'} />}
        Engins {regulatoryGears.authorized ? 'réglementés' : 'interdits'}
      </SectionTitle>
      <List>
        <GearsOrGearCategories list={regulatedGears} />
        <GearsOrGearCategories list={regulatedGearCategories} />
      </List>
      {!authorized && derogation &&
        <Derogation>
          <DerogationMessage>
            {'Mesures dérogatoire: consulter les références réglementaires'}
          </DerogationMessage>
        </Derogation>
      }
      {otherInfo &&
      <><SectionTitle>Mesures techniques</SectionTitle>
        {otherInfo}
      </>}
    </Section>}
  </>
}

const Derogation = styled.span`
  display: flex;
  border: 1px solid ${COLORS.yellow};
  padding: 4px 15px 6px 8px;
`

const DerogationMessage = styled.span`
  color: ${COLORS.slateGray};
  margin-left: 4px;
`

export default MetadataGears
