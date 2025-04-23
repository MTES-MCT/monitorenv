import { Dashboard } from '@features/Dashboard/types'
import { getVigilanceAreaColorWithAlpha } from '@features/VigilanceArea/components/VigilanceAreaLayer/style'
import { EMPTY_VALUE } from '@features/VigilanceArea/constants'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { endingOccurenceText, frequencyText } from '@features/VigilanceArea/utils'
import { customDayjs, THEME } from '@mtes-mct/monitor-ui'
import { Link, Text, View } from '@react-pdf/renderer'
import { displayTags } from '@utils/getTagsAsOptions'

import { ExternalLink } from '../icons/ExternalLink'
import { AreaImage } from '../Layout/AreaImage'
import { areaStyle, layoutStyle } from '../style'
import { getImage, getMinimap } from '../utils'

import type { ExportImageType } from '@features/Dashboard/hooks/useExportImages'
import type { AMPFromAPI } from 'domain/entities/AMPs'
import type { RegulatoryLayerWithMetadata } from 'domain/entities/regulatory'

export function VigilanceAreas({
  images,
  linkedAMPs,
  linkedRegulatoryAreas,
  vigilanceAreas
}: {
  images: ExportImageType[]
  linkedAMPs: AMPFromAPI[]
  linkedRegulatoryAreas: RegulatoryLayerWithMetadata[]
  vigilanceAreas: VigilanceArea.VigilanceArea[]
}) {
  return (
    <>
      <View style={layoutStyle.header2}>
        <Text style={layoutStyle.title}>Zones de vigilances</Text>
        <Text style={layoutStyle.selected}>{vigilanceAreas.length} sélectionnée(s)</Text>
      </View>
      <View style={[layoutStyle.definition, { marginBottom: 15 }]}>
        <Text>
          Une zone de vigilance permet d&apos;orienter les contrôles en attirant l&apos;attention et rappelant des
          informations utiles sur un endroit / une période donnés.
        </Text>
        <Text>
          Les informations consignées dans les ZV ont – contrairement aux signalements – une validité dans le temps plus
          longue ou récurrente.
        </Text>
      </View>
      <View style={layoutStyle.cardWrapper}>
        {vigilanceAreas.map(vigilanceArea => {
          const formattedStartPeriod = vigilanceArea.startDatePeriod
            ? customDayjs(vigilanceArea.startDatePeriod).utc().format('DD/MM/YYYY')
            : undefined
          const formattedEndPeriod = vigilanceArea.endDatePeriod
            ? customDayjs(vigilanceArea.endDatePeriod).utc().format('DD/MM/YYYY')
            : undefined

          const amps = linkedAMPs.filter(amp => vigilanceArea.linkedAMPs?.includes(amp.id))
          const regulatoryAreas = linkedRegulatoryAreas.filter(regulatoryArea =>
            vigilanceArea.linkedRegulatoryAreas?.includes(regulatoryArea.id)
          )

          const image = getImage(images, Dashboard.Layer.DASHBOARD_VIGILANCE_AREAS, vigilanceArea.id)
          const minimap = getMinimap(images, Dashboard.Layer.DASHBOARD_VIGILANCE_AREAS, vigilanceArea.id)

          return (
            <View key={vigilanceArea.id} style={areaStyle.wrapper} wrap={false}>
              <AreaImage image={image} minimap={minimap} />
              <View style={areaStyle.card}>
                <View style={areaStyle.header}>
                  <View
                    style={[
                      areaStyle.layerLegend,
                      {
                        backgroundColor: getVigilanceAreaColorWithAlpha(vigilanceArea.name, vigilanceArea.comments)
                      }
                    ]}
                  />
                  <Text> {vigilanceArea.name}</Text>
                </View>
                <View style={[areaStyle.content, { rowGap: 3 }]}>
                  <View>
                    <View style={areaStyle.description}>
                      <Text>Période</Text>
                    </View>
                    <View style={areaStyle.details}>
                      <Text>
                        {formattedStartPeriod ? `Du ${formattedStartPeriod} au ${formattedEndPeriod}` : EMPTY_VALUE}
                      </Text>
                      <Text>{frequencyText(vigilanceArea?.frequency)}</Text>
                      <Text>{endingOccurenceText(vigilanceArea?.endingCondition, vigilanceArea?.computedEndDate)}</Text>
                    </View>
                  </View>
                  <View>
                    <View style={areaStyle.description}>
                      <Text>Thématique</Text>
                    </View>
                    <View style={areaStyle.details}>
                      <Text>{vigilanceArea.tags ? displayTags(vigilanceArea.tags) : EMPTY_VALUE}</Text>
                    </View>
                  </View>
                  <View>
                    <View style={areaStyle.description}>
                      <Text>Visibilité</Text>
                    </View>
                    <View style={areaStyle.details}>
                      <Text>
                        {vigilanceArea.visibility
                          ? VigilanceArea.VisibilityLabel[vigilanceArea?.visibility]
                          : EMPTY_VALUE}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={[areaStyle.content, { borderTop: `1 solid ${THEME.color.gainsboro}` }]}>
                  <View>
                    <Text style={[areaStyle.description, { width: 'auto' }]}>Commentaires</Text>
                    <Text style={[areaStyle.details, { width: 'auto' }]}>{vigilanceArea.comments}</Text>
                  </View>
                </View>
                {regulatoryAreas.length > 0 && (
                  <View style={[areaStyle.content, { borderTop: `1 solid ${THEME.color.gainsboro}` }]}>
                    <View>
                      <Text style={[areaStyle.description, { width: 'auto' }]}>Réglementations en lien</Text>
                      {regulatoryAreas.map(linkedRegulatoryArea => (
                        <Text key={linkedRegulatoryArea.id} style={[areaStyle.details, { width: 'auto' }]}>
                          {linkedRegulatoryArea.entityName}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}
                {amps.length > 0 && (
                  <View style={[areaStyle.content, { borderTop: `1 solid ${THEME.color.gainsboro}` }]}>
                    <View>
                      <Text style={[areaStyle.description, { width: 'auto' }]}>AMP en lien</Text>
                      {amps.map(linkedAmp => (
                        <Text key={linkedAmp.id} style={[areaStyle.details, { width: 'auto' }]}>
                          {linkedAmp.name}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}
                {vigilanceArea.links && vigilanceArea.links?.length > 0 && (
                  <View style={[areaStyle.content, { borderTop: `1 solid ${THEME.color.gainsboro}` }]}>
                    <View>
                      <Text style={[areaStyle.description, { width: 'auto' }]}>Liens utiles</Text>
                      {vigilanceArea.links.map(link => (
                        <Link key={link.linkUrl} href={link.linkUrl} style={layoutStyle.link}>
                          <View style={[layoutStyle.row, { alignItems: 'center', marginBottom: 3, width: 'auto' }]}>
                            <Text>{link.linkText} </Text>
                            <ExternalLink color={layoutStyle.link.color} size={8} />
                          </View>
                        </Link>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            </View>
          )
        })}
      </View>
    </>
  )
}
