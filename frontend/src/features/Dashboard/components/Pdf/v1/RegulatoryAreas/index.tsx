import { THEME } from '@mtes-mct/monitor-ui'
import { Link, Text, View } from '@react-pdf/renderer'
import { getTitle } from 'domain/entities/layers/utils'

import { areaStyle, layoutStyle } from '../style'

import type { RegulatoryLayerWithMetadata } from 'domain/entities/regulatory'

export function RegulatoryAreas({ regulatoryAreas }: { regulatoryAreas: RegulatoryLayerWithMetadata[] }) {
  return (
    <>
      <View style={layoutStyle.header}>
        <Text style={layoutStyle.title}>Zones réglementaires</Text>
        <Text style={layoutStyle.selected}>{regulatoryAreas.length} sélectionnée(s)</Text>
      </View>
      <View style={layoutStyle.cardWrapper}>
        {regulatoryAreas.map(regulatoryArea => (
          <View key={regulatoryArea.id} style={areaStyle.card} wrap={false}>
            <View style={areaStyle.header}>
              <Text> {getTitle(regulatoryArea.layer_name)}</Text>
            </View>
            <View style={areaStyle.content}>
              <View style={[layoutStyle.row, { rowGap: 2 }]}>
                <View style={areaStyle.description}>
                  <Text>Entité</Text>
                </View>
                <View style={areaStyle.details}>
                  <Text>{regulatoryArea.entity_name || 'AUCUN NOM'}</Text>
                </View>
              </View>
              <View style={layoutStyle.row}>
                <View style={areaStyle.description}>
                  <Text>Ensemble reg.</Text>
                </View>
                <View style={areaStyle.details}>
                  <Text>{regulatoryArea.type || '-'}</Text>
                </View>
              </View>
              <View style={layoutStyle.row}>
                <View style={areaStyle.description}>
                  <Text>Thématique</Text>
                </View>
                <View style={areaStyle.details}>
                  <Text>{regulatoryArea.thematique || '-'}</Text>
                </View>
              </View>
              <View style={layoutStyle.row}>
                <View style={areaStyle.description}>
                  <Text>Façade</Text>
                </View>
                <View style={areaStyle.details}>
                  <Text>{regulatoryArea.facade || '-'}</Text>
                </View>
              </View>
            </View>
            <View style={[areaStyle.content, { borderTop: `1 solid ${THEME.color.gainsboro}` }]}>
              <View>
                <Text style={[areaStyle.description, { width: 'auto' }]}>Résumé réglementaire sur Légicem</Text>
              </View>
              <View style={(layoutStyle.row, { fontSize: 5.5, marginTop: 3.4, position: 'relative' })}>
                <View style={{ fontSize: 10, left: 3, position: 'absolute', top: -3 }}>
                  <Text>→</Text>
                </View>
                <View style={{ paddingLeft: 18 }}>
                  <Link href={regulatoryArea.url}>{regulatoryArea.ref_reg}</Link>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </>
  )
}
