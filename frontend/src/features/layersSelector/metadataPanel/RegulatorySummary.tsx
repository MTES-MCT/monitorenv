import styled from 'styled-components'

import { SectionTitle, Section, List } from './MetadataPanel.style'

export function RegulatorySummary({ regulatoryReference, url }) {
  return (
    regulatoryReference && (
      <Section>
        <SectionTitle>Résumé réglementaire sur Légicem</SectionTitle>
        <List>
          <Reference data-cy="metadata-panel-references">
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
