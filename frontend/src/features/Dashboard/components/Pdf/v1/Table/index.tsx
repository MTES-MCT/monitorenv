import { getAMPColorWithAlpha } from '@features/map/layers/AMP/AMPLayers.style'
import { getRegulatoryEnvColorWithAlpha } from '@features/map/layers/styles/administrativeAndRegulatoryLayers.style'
import { getVigilanceAreaColorWithAlpha } from '@features/VigilanceArea/components/VigilanceAreaLayer/style'
import { THEME } from '@mtes-mct/monitor-ui'
import { Image, StyleSheet, Text, View } from '@react-pdf/renderer'
import { getTitle } from 'domain/entities/layers/utils'
import { groupBy } from 'lodash'

import { layoutStyle } from '../style'

import type { ExportImageType } from '../../../../hooks/useExportImages'
import type { VigilanceArea } from '@features/VigilanceArea/types'
import type { AMPFromAPI } from 'domain/entities/AMPs'
import type { RegulatoryLayerWithMetadata } from 'domain/entities/regulatory'

const maxHeightCell = 30
const styles = StyleSheet.create({
  amp: {
    backgroundColor: '#D6DF64',
    color: THEME.color.charcoal
  },
  cell: {
    alignItems: 'center',
    border: `0.5 solid ${THEME.color.blueGray25}`,
    flexDirection: 'row',
    fontSize: 6.8,
    maxHeight: maxHeightCell,
    padding: '4.3 5 4.3 5.6',
    width: '100%'
  },
  header: {
    flexDirection: 'row',
    fontSize: 6.8,
    fontWeight: 'bold',
    justifyContent: 'space-between',
    padding: '4.3 12',
    width: '100%'
  },
  layerGroup: {
    border: `0.5 solid ${THEME.color.blueGray25}`,
    fontSize: 6.8,
    fontWeight: 'bold',
    justifyContent: 'center',
    padding: '4.3 12',
    width: '20%'
  },
  layerLegend: {
    border: `0.5 solid ${THEME.color.slateGray}`,
    height: 8,
    marginRight: 5,
    width: 8
  },
  regulatoryArea: {
    backgroundColor: '#8CC3C0',
    color: THEME.color.white
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  },
  vigilanceArea: {
    backgroundColor: '#C58F7E',
    color: THEME.color.white
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
  const groupedRegulatoryAreas = groupBy(
    [...regulatoryAreas].sort((a, b) => a.layerName.localeCompare(b.layerName)),
    regulatory => regulatory.layerName
  )

  const totalSelected = amps.length + regulatoryAreas.length + vigilanceAreas.length

  return (
    <>
      {image && <Image src={image.image} style={{ marginBottom: 6.2 }} />}

      <View style={layoutStyle.header}>
        <Text style={layoutStyle.title}>Zones</Text>
        <Text style={layoutStyle.selected}>{totalSelected} sélectionnée(s)</Text>
      </View>

      <View style={[styles.regulatoryArea, styles.header]}>
        <Text>Zones réglementaires</Text>
        <Text>{regulatoryAreas.length} sélectionnée(s)</Text>
      </View>
      <View style={[styles.table, { marginBottom: 7.4 }]}>
        {Object.entries(groupedRegulatoryAreas).map(([groupName, layers]) => (
          <View
            key={groupName}
            style={[layoutStyle.row, { maxHeight: layers.length * maxHeightCell, width: '100%' }]}
            wrap={false}
          >
            <View style={[styles.layerGroup, { height: '100%' }]}>
              <Text>{getTitle(groupName)}</Text>
            </View>
            <View style={[layoutStyle.column, { height: '100%', width: '80%' }]}>
              {layers.map(layer => (
                <View key={layer.id} style={[styles.cell, { height: '100%' }]}>
                  <View
                    style={[
                      styles.layerLegend,
                      {
                        backgroundColor: getRegulatoryEnvColorWithAlpha(layer.thematique, layer.entityName)
                      }
                    ]}
                  />
                  <Text>{layer.entityName || 'AUCUN NOM'}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      <View break style={layoutStyle.row}>
        <View style={{ width: '50%' }}>
          <View style={[styles.amp, styles.header]}>
            <Text>Zones AMP</Text>
            <Text>{amps.length} sélectionnée(s)</Text>
          </View>
          <View style={styles.table}>
            {amps.map(amp => (
              <View key={amp.id} style={styles.cell} wrap={false}>
                <View
                  style={[
                    styles.layerLegend,
                    {
                      backgroundColor: getAMPColorWithAlpha(amp.type, amp.name)
                    }
                  ]}
                />
                <Text style={{ fontWeight: 'bold' }}>
                  {getTitle(amp.name)} <Text style={{ fontWeight: 'normal' }}> / {amp.type ?? 'AUCUN NOM'}</Text>
                </Text>
              </View>
            ))}
          </View>
        </View>
        <View style={{ width: '50%' }}>
          <View style={[styles.vigilanceArea, styles.header]}>
            <Text>Zones de vigilance</Text>
            <Text>{vigilanceAreas.length} sélectionnée(s)</Text>
          </View>
          <View style={styles.table}>
            {vigilanceAreas.map(vigilanceArea => (
              <View key={vigilanceArea.id} style={styles.cell} wrap={false}>
                <View
                  style={[
                    styles.layerLegend,
                    {
                      backgroundColor: getVigilanceAreaColorWithAlpha(vigilanceArea.name, vigilanceArea.comments)
                    }
                  ]}
                />
                <Text>{vigilanceArea.name}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </>
  )
}
