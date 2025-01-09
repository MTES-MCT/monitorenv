import { THEME } from '@mtes-mct/monitor-ui'
import { StyleSheet, Text, View, Image } from '@react-pdf/renderer'

import { layoutStyle } from '../style'

import type { ExportImageType } from '../../Layers/ExportLayer'
import type { VigilanceArea } from '@features/VigilanceArea/types'
import type { AMPFromAPI } from 'domain/entities/AMPs'
import type { RegulatoryLayerWithMetadata } from 'domain/entities/regulatory'

const styles = StyleSheet.create({
  amp: {
    backgroundColor: '#C58F7E',
    color: THEME.color.white
  },
  cell: {
    border: `1 solid ${THEME.color.blueGray25}`,
    borderTop: 'none',
    fontSize: 6.8,
    padding: '4.3 12'
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '3 12'
  },
  headers: {
    flexDirection: 'row',
    fontSize: 6.8,
    fontWeight: 'bold'
  },
  regulatoryArea: {
    backgroundColor: '#8CC3C0',
    color: THEME.color.white
  },
  table: {
    display: 'flex',
    flexDirection: 'column'
  },
  vigilanceArea: {
    backgroundColor: '#D6DF64',
    color: THEME.color.charcoal
  }
})

export function AreaTable({
  amps,
  image,
  regulatoryAreas,
  vigilanceAreas
}: {
  amps: AMPFromAPI[]
  image: ExportImageType | undefined
  regulatoryAreas: RegulatoryLayerWithMetadata[]
  vigilanceAreas: VigilanceArea.VigilanceArea[]
}) {
  return (
    <>
      <View style={layoutStyle.header}>
        <Text style={layoutStyle.title}>Zones</Text>
        <Text style={layoutStyle.selected}>
          {amps.length + regulatoryAreas.length + vigilanceAreas.length} sélectionnée(s)
        </Text>
      </View>
      <View style={styles.table}>
        <View style={styles.headers}>
          <View style={[styles.regulatoryArea, styles.header]}>
            <Text>Zones réglementaires</Text>
            <Text>{regulatoryAreas.length} sélectionnée(s)</Text>
          </View>
          <View style={[styles.amp, styles.header]}>
            <Text>Zones AMP </Text>
            <Text>{amps.length} sélectionnée(s)</Text>
          </View>
          <View style={[styles.vigilanceArea, styles.header]}>
            <Text>Zones de vigilance</Text>
            <Text>{vigilanceAreas.length} sélectionnée(s)</Text>
          </View>
        </View>

        <View style={layoutStyle.row}>
          <View style={{ flex: 1 }}>
            {regulatoryAreas.map(regulatoryArea => (
              <Text key={regulatoryArea.id} style={styles.cell} wrap={false}>
                {regulatoryArea.entity_name || 'AUCUN NOM'}
              </Text>
            ))}
          </View>
          <View style={{ flex: 1 }}>
            {amps.map(amp => (
              <Text key={amp.id} style={styles.cell} wrap={false}>
                {amp.name}
              </Text>
            ))}
          </View>
          <View style={{ flex: 1 }}>
            {vigilanceAreas.map(vigilanceArea => (
              <Text key={vigilanceArea.id} style={styles.cell} wrap={false}>
                {vigilanceArea.name}
              </Text>
            ))}
          </View>
        </View>
      </View>
      {image && <Image src={image.image} style={{ marginTop: 4.3 }} />}
    </>
  )
}
