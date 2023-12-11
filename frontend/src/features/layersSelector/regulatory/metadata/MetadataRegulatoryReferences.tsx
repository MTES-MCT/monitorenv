import styled from 'styled-components'

import { SectionTitle, Section, List } from './RegulatoryMetadata.style'

export function MetadataRegulatoryReferences({ regulatoryReference, url }) {
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
export const Link = styled.a`
  color: ${p => p.theme.color.gunMetal};
  font-size: 13px;
  cursor: pointer;
  font-weight: 500;
`
