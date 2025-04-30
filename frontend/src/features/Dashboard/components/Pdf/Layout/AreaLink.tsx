import { THEME } from '@mtes-mct/monitor-ui'
import { View, Link, Text } from '@react-pdf/renderer'

import { ExternalLink } from '../icons/ExternalLink'
import { areaStyle, layoutStyle } from '../style'

type AreaLinkProps = {
  text: string | undefined
  url: string
}
export function AreaLink({ text, url }: AreaLinkProps) {
  return (
    <View style={[areaStyle.content, { borderTop: `1 solid ${THEME.color.gainsboro}` }]}>
      <Link href={url} style={layoutStyle.link}>
        <View style={[layoutStyle.row, { alignItems: 'center', marginBottom: 3, width: 'auto' }]}>
          <Text>Résumé réglementaire sur Légicem </Text>
          <ExternalLink color={layoutStyle.link.color} size={8} />
        </View>
      </Link>
      <Text style={[areaStyle.details, { fontSize: 6.2 }]}>{text}</Text>
    </View>
  )
}
