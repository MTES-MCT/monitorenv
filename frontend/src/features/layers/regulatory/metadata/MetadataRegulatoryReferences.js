import React from 'react'
import styled from 'styled-components'
import { SectionTitle, Section, List, Label } from './RegulatoryMetadata.style'
import { Link } from '../../../commonStyles/Link.style'
import { getRegulatoryZoneTextTypeAsText } from '../../../../domain/entities/regulatory'

const MetadataRegulatoryReferences = ({regulatoryReference, type, url}) => {
  
  return regulatoryReference && <Section>
    <SectionTitle>Références réglementaires</SectionTitle>
    <List>
      <Reference data-cy="regulatory-layers-metadata-references">
        <Label>{getRegulatoryZoneTextTypeAsText(type)}</Label>
        <Link href={url}>{regulatoryReference}</Link>
      </Reference>
    </List>
  </Section>
}

const Reference = styled.li`
  list-style-type: "→";
  padding-left: 10px;
  font-size: 13px;
`

export default MetadataRegulatoryReferences
