import { EMPTY_VALUE } from '@features/VigilanceArea/constants'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { endingOccurenceText, frequencyText } from '@features/VigilanceArea/utils'
import { customDayjs, THEME } from '@mtes-mct/monitor-ui'
import { Link, Text, View } from '@react-pdf/renderer'

import { areaStyle, layoutStyle } from '../style'

import type { AMPFromAPI } from 'domain/entities/AMPs'
import type { RegulatoryLayerWithMetadata } from 'domain/entities/regulatory'

export function VigilanceAreas({
  linkedAMPs,
  linkedRegulatoryAreas,
  vigilanceAreas
}: {
  linkedAMPs: AMPFromAPI[]
  linkedRegulatoryAreas: RegulatoryLayerWithMetadata[]
  vigilanceAreas: VigilanceArea.VigilanceArea[]
}) {
  return (
    <>
      <View style={layoutStyle.header}>
        <Text style={layoutStyle.title}>Zones de vigilances</Text>
        <Text style={layoutStyle.selected}>{vigilanceAreas.length} sélectionnée(s)</Text>
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

          return (
            <View key={vigilanceArea.id} style={areaStyle.card}>
              <View style={areaStyle.header}>
                <Text> {vigilanceArea.name}</Text>
              </View>
              <View style={areaStyle.content}>
                <View style={[layoutStyle.row]}>
                  <View style={areaStyle.description}>
                    <Text>Période</Text>
                  </View>
                  <View style={areaStyle.details}>
                    <Text>
                      {formattedStartPeriod ? `Du ${formattedStartPeriod} au ${formattedEndPeriod}` : EMPTY_VALUE}
                    </Text>
                    <Text>{frequencyText(vigilanceArea?.frequency)}</Text>
                    <Text> {endingOccurenceText(vigilanceArea?.endingCondition, vigilanceArea?.computedEndDate)}</Text>
                  </View>
                </View>
                <View style={[layoutStyle.row]}>
                  <View style={areaStyle.description}>
                    <Text>Thématique</Text>
                  </View>
                  <View style={areaStyle.details}>
                    <Text> {vigilanceArea.themes ? vigilanceArea?.themes.join(', ') : EMPTY_VALUE}</Text>
                  </View>
                </View>
                <View style={[layoutStyle.row]}>
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
                        {linkedRegulatoryArea.entity_name}
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
              {vigilanceArea.links?.length > 0 && (
                <View style={[areaStyle.content, { borderTop: `1 solid ${THEME.color.gainsboro}` }]}>
                  <View>
                    <Text style={[areaStyle.description, { width: 'auto' }]}>Liens utiles</Text>
                    {vigilanceArea.links.map(link => (
                      // eslint-disable-next-line jsx-a11y/anchor-is-valid
                      <Link key={link.linkUrl} src={link.linkUrl}>
                        <Text>{link.linkText}</Text>
                      </Link>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )
        })}
      </View>
    </>
  )
}