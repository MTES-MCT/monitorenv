import { Dashboard } from '@features/Dashboard/types'
import { getRegulatoryEnvColorWithAlpha } from '@features/map/layers/styles/administrativeAndRegulatoryLayers.style'
import { Text, View } from '@react-pdf/renderer'
import { getTitle } from 'domain/entities/layers/utils'

import { AreaImage } from '../Layout/AreaImage'
import { AreaLink } from '../Layout/AreaLink'
import { areaStyle, layoutStyle } from '../style'
import { getImage, getMinimap } from '../utils'

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
          const minimap = getMinimap(images, Dashboard.Layer.DASHBOARD_REGULATORY_AREAS, regulatoryArea.id)

          return (
            <View key={regulatoryArea.id} style={areaStyle.wrapper} wrap={false}>
              <AreaImage image={image} minimap={minimap} />
              <View style={areaStyle.card}>
                <View style={areaStyle.header}>
                  <View
                    style={[
                      areaStyle.layerLegend,
                      {
                        backgroundColor: getRegulatoryEnvColorWithAlpha(
                          regulatoryArea.themes.map(({ name }) => name).join(', '),
                          regulatoryArea.entityName
                        )
                      }
                    ]}
                  />
                  <Text> {getTitle(regulatoryArea.layerName)}</Text>
                </View>
                <View style={[areaStyle.content, { rowGap: 3 }]}>
                  <View>
                    <View style={areaStyle.description}>
                      <Text>Entité</Text>
                    </View>
                    <View style={areaStyle.details}>
                      <Text>{regulatoryArea.entityName || 'AUCUN NOM'}</Text>
                    </View>
                  </View>
                  <View>
                    <View style={areaStyle.description}>
                      <Text>Ensemble reg.</Text>
                    </View>
                    <View style={areaStyle.details}>
                      <Text>{regulatoryArea.type || '-'}</Text>
                    </View>
                  </View>
                  <View>
                    <View style={areaStyle.description}>
                      <Text>Thématique</Text>
                    </View>
                    <View style={areaStyle.details}>
                      <Text>{regulatoryArea.themes.map(({ name }) => name).join(', ') || '-'}</Text>
                    </View>
                  </View>
                  <View>
                    <View style={areaStyle.description}>
                      <Text>Façade</Text>
                    </View>
                    <View style={areaStyle.details}>
                      <Text>{regulatoryArea.facade || '-'}</Text>
                    </View>
                  </View>
                </View>
                <AreaLink text={regulatoryArea.refReg} url={regulatoryArea.url} />
              </View>
            </View>
          )
        })}
      </View>
    </>
  )
}
