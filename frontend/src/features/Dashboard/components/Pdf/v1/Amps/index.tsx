import { THEME } from '@mtes-mct/monitor-ui'
import { Link, Text, View } from '@react-pdf/renderer'
import { getTitle } from 'domain/entities/layers/utils'

import { areaStyle, layoutStyle } from '../style'

import type { AMPFromAPI } from 'domain/entities/AMPs'

export function Amps({ amps }: { amps: AMPFromAPI[] }) {
  return (
    <>
      <View style={layoutStyle.header}>
        <Text style={layoutStyle.title}>Zones AMP</Text>
        <Text style={layoutStyle.selected}>{amps.length} sélectionnée(s)</Text>
      </View>
      <View style={layoutStyle.cardWrapper}>
        {amps.map(amp => (
          <View key={amp.id} style={areaStyle.card} wrap={false}>
            <View style={areaStyle.header}>
              <Text> {getTitle(amp.name)}</Text>
            </View>
            <View style={areaStyle.content}>
              <View style={[layoutStyle.row]}>
                <View style={areaStyle.description}>
                  <Text>Nature d&apos;AMP</Text>
                </View>
                <View style={areaStyle.details}>
                  <Text>{amp.designation || '-'}</Text>
                </View>
              </View>
            </View>
            {amp.url_legicem && (
              <View style={[areaStyle.content, { borderTop: `1 solid ${THEME.color.gainsboro}` }]}>
                <View>
                  <Text style={[areaStyle.description, { width: 'auto' }]}>Résumé réglementaire sur Légicem</Text>
                </View>
                <View style={(layoutStyle.row, { fontSize: 5.5, marginTop: 3.4, position: 'relative' })}>
                  <View style={{ fontSize: 10, left: 3, position: 'absolute', top: -3 }}>
                    <Text>→</Text>
                  </View>
                  <View style={{ paddingLeft: 18 }}>
                    <Link href={amp.url_legicem}>
                      <Text>{amp.ref_reg}</Text>
                    </Link>
                  </View>
                </View>
              </View>
            )}
          </View>
        ))}
      </View>
    </>
  )
}
