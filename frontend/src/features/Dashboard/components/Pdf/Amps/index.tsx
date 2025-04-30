import { Dashboard } from '@features/Dashboard/types'
import { getAMPColorWithAlpha } from '@features/map/layers/AMP/AMPLayers.style'
import { Text, View } from '@react-pdf/renderer'
import { getTitle } from 'domain/entities/layers/utils'

import { AreaImage } from '../Layout/AreaImage'
import { AreaLink } from '../Layout/AreaLink'
import { areaStyle, layoutStyle } from '../style'
import { getImage, getMinimap } from '../utils'

import type { ExportImageType } from '@features/Dashboard/hooks/useExportImages'
import type { AMPFromAPI } from 'domain/entities/AMPs'

export function Amps({ amps, images }: { amps: AMPFromAPI[]; images: ExportImageType[] }) {
  return (
    <>
      <View style={layoutStyle.header2}>
        <Text style={layoutStyle.title}>Aires marines protégées</Text>
        <Text style={layoutStyle.selected}>{amps.length} sélectionnée(s)</Text>
      </View>
      <View style={layoutStyle.cardWrapper}>
        {amps.map(amp => {
          const image = getImage(images, Dashboard.Layer.DASHBOARD_AMP, amp.id)
          const minimap = getMinimap(images, Dashboard.Layer.DASHBOARD_AMP, amp.id)

          return (
            <View key={amp.id} style={areaStyle.wrapper} wrap={false}>
              <AreaImage image={image} minimap={minimap} />
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
                <View style={[areaStyle.content, { rowGap: 3 }]}>
                  <View>
                    <View style={areaStyle.description}>
                      <Text>Nature d&apos;AMP</Text>
                    </View>
                    <View style={areaStyle.details}>
                      <Text>{amp.designation || '-'}</Text>
                    </View>
                  </View>
                </View>
                {amp.urlLegicem && <AreaLink text={amp.refReg} url={amp.urlLegicem} />}
              </View>
            </View>
          )
        })}
      </View>
    </>
  )
}
