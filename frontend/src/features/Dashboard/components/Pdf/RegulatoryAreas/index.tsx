import { Dashboard } from '@features/Dashboard/types'
import { getRegulatoryEnvColorWithAlpha } from '@features/map/layers/styles/administrativeAndRegulatoryLayers.style'
import { THEME } from '@mtes-mct/monitor-ui'
import { Text, View } from '@react-pdf/renderer'
import { getRegulatoryAreaTitle } from '@utils/getRegulatoryAreaTitle'
import { displayTags } from '@utils/getTagsAsOptions'
import { displayThemes } from '@utils/getThemesAsOptions'
import { getTitle } from 'domain/entities/layers/utils'

import { Dot } from '../icons/Dot'
import { AreaImage } from '../Layout/AreaImage'
import { AreaLink } from '../Layout/AreaLink'
import { areaStyle, layoutStyle } from '../style'
import { getImage, getMinimap } from '../utils'

import type { ExportImageType } from '@features/Dashboard/hooks/useExportImages'
import type { RegulatoryArea } from '@features/RegulatoryArea/types'

export function RegulatoryAreas({
  images,
  regulatoryAreas
}: {
  images: ExportImageType[]
  regulatoryAreas: RegulatoryArea.RegulatoryAreaWithBbox[]
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
                          displayTags(regulatoryArea.tags),
                          getRegulatoryAreaTitle(regulatoryArea.polyName, regulatoryArea.resume),
                          regulatoryArea.plan
                        )
                      }
                    ]}
                  />
                  <Text> {getTitle(regulatoryArea.layerName)}</Text>
                </View>
                <View style={[areaStyle.content, { rowGap: 3 }]}>
                  {regulatoryArea.polyName?.length > 0 && (
                    <View>
                      <View style={areaStyle.description}>
                        <Text>Titre de la zone</Text>
                      </View>
                      <View style={areaStyle.details}>
                        <Text>{regulatoryArea.polyName}</Text>
                      </View>
                    </View>
                  )}
                  <View>
                    <View style={areaStyle.description}>
                      <Text>Résumé</Text>
                    </View>
                    <View style={areaStyle.details}>
                      <Text>{regulatoryArea.resume || 'AUCUN NOM'}</Text>
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
                      <Text>{displayThemes(regulatoryArea.themes) || '-'}</Text>
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
                {regulatoryArea.authorizationPeriods && (
                  <View style={[areaStyle.content, { borderTop: `1 solid ${THEME.color.gainsboro}` }]}>
                    <View style={[areaStyle.description, layoutStyle.row]}>
                      <Dot color={THEME.color.mediumSeaGreen} size={4} />
                      <Text>Période d&apos;autorisation</Text>
                    </View>
                    <View style={areaStyle.details}>
                      <Text>{regulatoryArea.authorizationPeriods}</Text>
                    </View>
                  </View>
                )}
                {regulatoryArea.prohibitionPeriods && (
                  <View style={[areaStyle.content, { borderTop: `1 solid ${THEME.color.gainsboro}` }]}>
                    <View style={[areaStyle.description, layoutStyle.row]}>
                      <Dot color={THEME.color.maximumRed} size={4} />
                      <Text>Période d&apos;interdiction</Text>
                    </View>
                    <View style={areaStyle.details}>
                      <Text>{regulatoryArea.prohibitionPeriods}</Text>
                    </View>
                  </View>
                )}
                <AreaLink text={regulatoryArea.refReg} url={regulatoryArea.url} />
              </View>
            </View>
          )
        })}
      </View>
    </>
  )
}
