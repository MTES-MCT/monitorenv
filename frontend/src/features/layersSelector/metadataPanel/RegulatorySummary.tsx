import { useGetCurrentUserAuthorizationQueryOverride } from '@hooks/useGetCurrentUserAuthorizationQueryOverride'
import { useTracking } from '@hooks/useTracking'
import styled from 'styled-components'

import { SectionTitle, Section, List } from './MetadataPanel.style'

type RegulatorySummaryProps = {
  regulatoryReference: string | undefined
  type?: 'REGULATORY' | 'AMP'
  url: string | undefined
}
export function RegulatorySummary({ regulatoryReference, type, url }: RegulatorySummaryProps) {
  const { trackEvent } = useTracking()
  const result = useGetCurrentUserAuthorizationQueryOverride()
  const isSuperUser = result?.isSuperUser ?? true

  const goToRegulatoryReference = () => {
    if (isSuperUser) {
      return
    }

    if (type === 'AMP') {
      trackEvent({
        action: 'Redirection lien Légicem',
        category: 'COUCHES CARTO – AMP',
        name: 'Lien Légicem depuis AMP'
      })
    } else if (type === 'REGULATORY') {
      trackEvent({
        action: 'Redirection lien Légicem',
        category: 'COUCHES CARTO – ZONES REG',
        name: 'Lien Légicem depuis Zone réglementaire'
      })
    }
  }

  return (
    regulatoryReference && (
      <Section>
        <SectionTitle>Résumé réglementaire sur Légicem</SectionTitle>
        <List>
          <Reference data-cy="metadata-panel-references">
            <Link href={url} onClick={goToRegulatoryReference} target="_blank">
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
