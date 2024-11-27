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

  const goToRegulatoryReference = () => {
    if (type === 'AMP') {
      trackEvent({
        action: 'AMP_TO_LEGICEM',
        category: 'AMP',
        name: 'goToLegicemFromAmp'
      })
    } else if (type === 'REGULATORY') {
      trackEvent({
        action: 'REGULATORY_TO_LEGICEM',
        category: 'REGULATORY',
        name: 'goToLegicemFromRegulatory'
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
