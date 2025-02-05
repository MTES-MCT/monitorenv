import { getAMPColorWithAlpha } from '@features/map/layers/AMP/AMPLayers.style'
import { getRegulatoryEnvColorWithAlpha } from '@features/map/layers/styles/administrativeAndRegulatoryLayers.style'
import { getVigilanceAreaColorWithAlpha } from '@features/VigilanceArea/components/VigilanceAreaLayer/style'
import { THEME } from '@mtes-mct/monitor-ui'
import { StyleSheet, Text, View, Image } from '@react-pdf/renderer'
import { getTitle } from 'domain/entities/layers/utils'
import { groupBy } from 'lodash'

import { layoutStyle } from '../style'

import type { ExportImageType } from '../../../../hooks/useExportImages'
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
    border: `0.5 solid ${THEME.color.blueGray25}`,
    flexDirection: 'row',
    fontSize: 6.8,
    height: 20,
    padding: '4.3 12',
    width: 185
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
    fontWeight: 'bold',
    height: 20,
    justifyContent: 'space-between',
    padding: '4.3 12',
    width: 185
  },
  layerGroup: {
    border: `0.5 solid ${THEME.color.blueGray25}`,
    fontSize: 6.8,
    fontWeight: 'bold',
    height: 20,
    padding: '4.3 12',
    width: 185
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
    flexWrap: 'wrap',
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
    regulatoryAreas.sort((a, b) => a.layerName.localeCompare(b.layerName)),
    regulatory => regulatory.layerName
  )

  const groupedAmps = groupBy(
    [...amps].sort((a, b) => a.name.localeCompare(b.name)),
    r => r.name
  )

  const totalSelected = amps.length + regulatoryAreas.length + vigilanceAreas.length
  const tableHeight = ((totalSelected + 3) * 40) / 3

  return (
    <>
      <View style={layoutStyle.header}>
        <Text style={layoutStyle.title}>Zones</Text>
        <Text style={layoutStyle.selected}>{totalSelected} sélectionnée(s)</Text>
      </View>
      {image && <Image src={image.image} style={{ paddingBottom: 36 }} />}

      <View break style={[styles.table, { height: tableHeight }]}>
        <View style={[styles.regulatoryArea, styles.headers]}>
          <Text>Zones réglementaires</Text>
          <Text>{regulatoryAreas.length} sélectionnée(s)</Text>
        </View>

        {Object.entries(groupedRegulatoryAreas).map(([groupName, layers]) => (
          <View key={groupName}>
            <Text style={styles.layerGroup}>{getTitle(groupName)}</Text>
            {layers.map(layer => (
              <View key={layer.id} style={styles.cell}>
                <View
                  style={[
                    styles.layerLegend,
                    {
                      backgroundColor: getRegulatoryEnvColorWithAlpha(layer.thematique, layer.entityName)
                    }
                  ]}
                />
                <Text>{layer.entityName ?? 'AUCUN NOM'}</Text>
              </View>
            ))}
          </View>
        ))}

        <View style={[styles.amp, styles.headers]}>
          <Text>Zones AMP</Text>
          <Text>{amps.length} sélectionnée(s)</Text>
        </View>

        {Object.entries(groupedAmps).map(([groupName, layers]) => (
          <View key={groupName}>
            <Text style={styles.layerGroup}>{getTitle(groupName)}</Text>
            {layers.map(layer => (
              <View key={layer.id} style={styles.cell}>
                <View
                  style={[
                    styles.layerLegend,
                    {
                      backgroundColor: getAMPColorWithAlpha(layer.type, layer.name)
                    }
                  ]}
                />
                <Text>{layer.name ?? 'AUCUN NOM'}</Text>
              </View>
            ))}
          </View>
        ))}

        <View style={[styles.vigilanceArea, styles.headers]}>
          <Text>Zones de vigilance</Text>
          <Text>{vigilanceAreas.length} sélectionnée(s)</Text>
        </View>

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
            <Text>{vigilanceArea.name}</Text>
          </View>
        ))}
      </View>
    </>
  )
}
