import { Dashboard } from '@features/Dashboard/types'
import { getRegulatoryEnvColorWithAlpha } from '@features/map/layers/styles/administrativeAndRegulatoryLayers.style'
import { displayTags } from '@features/Tags/utils/getTagsAsOptions'
import { displayThemes } from '@features/Themes/utils/getThemesAsOptions'
import { THEME } from '@mtes-mct/monitor-ui'
import { Image, Link, Text, View } from '@react-pdf/renderer'
import { getTitle } from 'domain/entities/layers/utils'

import { areaStyle, layoutStyle } from '../style'
import { getImage } from '../utils'

import type { ExportImageType } from '@features/Dashboard/hooks/useExportImages'
import type { RegulatoryLayerWithMetadata } from 'domain/entities/regulatory'

export function RegulatoryAreas({
  images,
  regulatoryAreas
}: {
  images: ExportImageType[]
  regulatoryAreas: RegulatoryLayerWithMetadata[]
}) {
  return (
    <>
      <View style={layoutStyle.header2}>
        <Text style={layoutStyle.title}>Zones réglementaires</Text>
        <Text style={layoutStyle.selected}>{regulatoryAreas.length} sélectionnée(s)</Text>
      </View>
      <View style={layoutStyle.cardWrapper}>
        {regulatoryAreas.map(regulatoryArea => {
          const image = getImage(images, Dashboard.Layer.DASHBOARD_REGULATORY_AREAS, regulatoryArea.id)

          return (
            <View key={regulatoryArea.id} style={areaStyle.wrapper} wrap={false}>
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
                        backgroundColor: getRegulatoryEnvColorWithAlpha(
                          displayTags(regulatoryArea.tags),
                          regulatoryArea.entityName
                        )
                      }
                    ]}
                  />
                  <Text> {getTitle(regulatoryArea.layerName)}</Text>
                </View>
                <View style={areaStyle.content}>
                  <View style={[layoutStyle.row, { rowGap: 2 }]}>
                    <View style={areaStyle.description}>
                      <Text>Entité</Text>
                    </View>
                    <View style={areaStyle.details}>
                      <Text>{regulatoryArea.entityName || 'AUCUN NOM'}</Text>
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
                      <Text>{displayThemes(regulatoryArea.themes) || '-'}</Text>
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
                      <Link href={regulatoryArea.url} style={layoutStyle.link}>
                        {regulatoryArea.refReg}
                      </Link>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )
        })}
      </View>
    </>
  )
}
