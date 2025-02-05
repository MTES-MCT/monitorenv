import { Dashboard } from '@features/Dashboard/types'
import { getAMPColorWithAlpha } from '@features/map/layers/AMP/AMPLayers.style'
import { THEME } from '@mtes-mct/monitor-ui'
import { Image, Link, Text, View } from '@react-pdf/renderer'
import { getTitle } from 'domain/entities/layers/utils'

import { areaStyle, layoutStyle } from '../style'
import { getImage } from '../utils'

import type { ExportImageType } from '../../../../hooks/useExportImages'
import type { AMPFromAPI } from 'domain/entities/AMPs'

export function Amps({ amps, images }: { amps: AMPFromAPI[]; images: ExportImageType[] }) {
  return (
    <>
      <View style={layoutStyle.header}>
        <Text style={layoutStyle.title}>Zones AMP</Text>
        <Text style={layoutStyle.selected}>{amps.length} sélectionnée(s)</Text>
      </View>
      <View style={layoutStyle.cardWrapper}>
        {amps.map(amp => {
          const image = getImage(images, Dashboard.Layer.DASHBOARD_AMP, amp.id)

          return (
            <View key={amp.id} style={areaStyle.wrapper} wrap={false}>
              {image && (
                <Image
                  src={image}
                  style={{
                    height: 350,
                    objectFit: 'cover',
                    width: '100%'
                  }}
                />
              )}
              <View style={areaStyle.card}>
                <View style={areaStyle.header}>
                  <View
                    style={[
                      areaStyle.layerLegend,
                      {
                        backgroundColor: getAMPColorWithAlpha(amp.type, amp.name)
                      }
                    ]}
                  />
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
                {amp.urlLegicem && (
                  <View style={[areaStyle.content, { borderTop: `1 solid ${THEME.color.gainsboro}` }]}>
                    <View>
                      <Text style={[areaStyle.description, { width: 'auto' }]}>Résumé réglementaire sur Légicem</Text>
                    </View>
                    <View style={(layoutStyle.row, { fontSize: 5.5, marginTop: 3.4, position: 'relative' })}>
                      <View style={{ fontSize: 10, left: 3, position: 'absolute', top: -3 }}>
                        <Text>→</Text>
                      </View>
                      <View style={{ paddingLeft: 18 }}>
                        <Link href={amp.urlLegicem}>
                          <Text>{amp.refReg}</Text>
                        </Link>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            </View>
          )
        })}
      </View>
    </>
  )
}
