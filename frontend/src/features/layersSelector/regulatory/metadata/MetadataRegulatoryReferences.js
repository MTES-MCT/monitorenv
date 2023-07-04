import React from 'react'
import styled from 'styled-components'

import { SectionTitle, Section, List } from './RegulatoryMetadata.style'
import { Link } from '../../../../ui/Link'

function MetadataRegulatoryReferences({ regulatoryReference, url }) {
  return (
    regulatoryReference && (
      <Section>
        <SectionTitle>Résumé réglementaire sur Légicem</SectionTitle>
        <List>
          <Reference data-cy="regulatory-layers-metadata-references">
            <Link href={url} target="_blank">
              {regulatoryReference}
            </Link>
          </Reference>
        </List>
      </Section>
    )
  )
}

const Reference = styled.li`
  list-style-type: '→';
  padding-left: 10px;
  font-size: 13px;
`

export default MetadataRegulatoryReferences
