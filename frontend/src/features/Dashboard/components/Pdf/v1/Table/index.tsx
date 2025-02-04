import { getAMPColorWithAlpha } from '@features/map/layers/AMP/AMPLayers.style'
import { getRegulatoryEnvColorWithAlpha } from '@features/map/layers/styles/administrativeAndRegulatoryLayers.style'
import { getVigilanceAreaColorWithAlpha } from '@features/VigilanceArea/components/VigilanceAreaLayer/style'
import { THEME } from '@mtes-mct/monitor-ui'
import { StyleSheet, Text, View, Image } from '@react-pdf/renderer'
import { getTitle } from 'domain/entities/layers/utils'
import { groupBy } from 'lodash'

import { layoutStyle } from '../style'

import type { ExportImageType } from '@features/Dashboard/hooks/useExportImages'
import type { VigilanceArea } from '@features/VigilanceArea/types'
import type { AMPFromAPI } from 'domain/entities/AMPs'
import type { RegulatoryLayerWithMetadata } from 'domain/entities/regulatory'

const styles = StyleSheet.create({
  amp: {
    backgroundColor: '#D6DF64',
    color: THEME.color.charcoal
  },
  cell: {
    alignItems: 'center',
    border: `1 solid ${THEME.color.blueGray25}`,
    borderTop: 'none',
    flexDirection: 'row',
    fontSize: 6.8,
    padding: '4.3 12'
  },
  groupName: {
    border: `1 solid ${THEME.color.blueGray25}`,
    borderTop: 'none',
    fontSize: 6.8,
    fontWeight: 'bold',
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
    paddingTop: 36
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
    regulatoryAreas.sort((a, b) => a.layerName.localeCompare(b.layerName)),
    regulatory => regulatory.layerName
  )

  const groupedAmps = groupBy(
    [...amps].sort((a, b) => a.name.localeCompare(b.name)),
    r => r.name
  )

  return (
    <>
      <View style={layoutStyle.header}>
        <Text style={layoutStyle.title}>Zones</Text>
        <Text style={layoutStyle.selected}>
          {amps.length + regulatoryAreas.length + vigilanceAreas.length} sélectionnée(s)
        </Text>
      </View>
      {image && <Image src={image.image} />}
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
            {Object.entries(groupedRegulatoryAreas).map(([groupName, layers]) => (
              <View key={groupName} wrap={false}>
                <Text style={styles.groupName}>{getTitle(groupName)}</Text>
                {layers.map(layer => (
                  <View style={styles.cell}>
                    <View
                      style={[
                        styles.layerLegend,
                        {
                          backgroundColor: getRegulatoryEnvColorWithAlpha(layer.thematique, layer.entityName)
                        }
                      ]}
                    />
                    <Text key={layer.id} wrap={false}>
                      {layer.entityName || 'AUCUN NOM'}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
          <View style={{ flex: 1 }}>
            {Object.entries(groupedAmps).map(([groupName, layers]) => (
              <View key={groupName} wrap={false}>
                <Text style={styles.groupName}>{getTitle(groupName)}</Text>
                {layers.map(layer => (
                  <View style={styles.cell}>
                    <View
                      style={[
                        styles.layerLegend,
                        {
                          backgroundColor: getAMPColorWithAlpha(layer.type, layer.name)
                        }
                      ]}
                    />
                    <Text key={layer.id} wrap={false}>
                      {layer.name || 'AUCUN NOM'}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
          <View style={{ flex: 1 }}>
            {vigilanceAreas.map(vigilanceArea => (
              <View key={vigilanceArea.id} style={styles.cell}>
                <View
                  style={[
                    styles.layerLegend,
                    {
                      backgroundColor: getVigilanceAreaColorWithAlpha(vigilanceArea.name, vigilanceArea.comments)
                    }
                  ]}
                />
                <Text wrap={false}>{vigilanceArea.name}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </>
  )
}
