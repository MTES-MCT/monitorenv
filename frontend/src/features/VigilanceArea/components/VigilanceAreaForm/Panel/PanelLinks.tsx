import {
  PanelInlineItemLabel,
  PanelInlineItemValue,
  PanelLinkContainer,
  PanelLinkText,
  PanelLinkUrl,
  PanelSubPart
} from '../style'

import type { Link } from '@components/Form/types'

export function PanelLinks({ links }: { links: Link[] }) {
  return (
    <PanelSubPart>
      <PanelInlineItemLabel>Liens utiles</PanelInlineItemLabel>
      <PanelInlineItemValue>
        {links.map(link => (
          <PanelLinkContainer key={`${link.linkText}-${link.linkUrl}`}>
            <PanelLinkText>{link.linkText}</PanelLinkText>
            <PanelLinkUrl href={link.linkUrl} rel="external" target="_blank">
              {link.linkUrl}
            </PanelLinkUrl>
          </PanelLinkContainer>
        ))}
      </PanelInlineItemValue>
    </PanelSubPart>
  )
}
