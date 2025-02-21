import { getAMPColorWithAlpha } from '@features/map/layers/AMP/AMPLayers.style'
import { getRegulatoryEnvColorWithAlpha } from '@features/map/layers/styles/administrativeAndRegulatoryLayers.style'
import { getVigilanceAreaColorWithAlpha } from '@features/VigilanceArea/components/VigilanceAreaLayer/style'
import { THEME } from '@mtes-mct/monitor-ui'
import { StyleSheet, Text, View, Image } from '@react-pdf/renderer'
import { getTitle } from 'domain/entities/layers/utils'
import { groupBy } from 'lodash'
import { Fragment } from 'react/jsx-runtime'

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
    padding: '4.3 12',
    width: '50%'
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
    padding: '4.3 12',
    width: '50%'
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
    [...regulatoryAreas].sort((a, b) => a.layerName.localeCompare(b.layerName)),
    regulatory => regulatory.layerName
  )
  const nbColumn = 2

  // const nbCharAmps = amps.reduce((sum, amp) => sum + amp.name.length + (amp.type?.length ?? 0), 0)
  const totalSelected = amps.length + regulatoryAreas.length + vigilanceAreas.length

  const tableHeight = (nbCell: number) => Math.ceil(nbCell / nbColumn) * 20

  return (
    <>
      {image && <Image src={image.image} style={{ marginBottom: 6.2 }} />}

      <View>
        <View style={layoutStyle.header}>
          <Text style={layoutStyle.title}>Zones</Text>
          <Text style={layoutStyle.selected}>{totalSelected} sélectionnée(s)</Text>
        </View>

        <View style={[styles.regulatoryArea, styles.header]}>
          <Text>Zones réglementaires</Text>
          <Text>{regulatoryAreas.length} sélectionnée(s)</Text>
        </View>
        <View
          style={[
            styles.table,
            { height: tableHeight(Object.keys(groupedRegulatoryAreas).length + regulatoryAreas.length) }
          ]}
        >
          {Object.entries(groupedRegulatoryAreas).map(([groupName, layers]) => (
            <Fragment key={groupName}>
              <Text style={styles.layerGroup}>{getTitle(groupName)}</Text>
              {layers.map(layer => (
                <View key={layer.id} style={styles.cell} wrap={false}>
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
            </Fragment>
          ))}
        </View>

        <View style={[styles.amp, styles.header]}>
          <Text>Zones AMP</Text>
          <Text>{amps.length} sélectionnée(s)</Text>
        </View>
        <View style={[styles.table, { height: tableHeight(amps.length) }]}>
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
        <View style={[styles.vigilanceArea, styles.header]}>
          <Text>Zones de vigilance</Text>
          <Text>{vigilanceAreas.length} sélectionnée(s)</Text>
        </View>
        <View style={[styles.table, { height: tableHeight(vigilanceAreas.length) }]}>
          {vigilanceAreas.map(vigilanceArea => (
            <View key={vigilanceArea.id} debug style={styles.cell} wrap={false}>
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
    </>
  )
}
