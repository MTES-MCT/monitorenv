import { type ImageFront, Orientation } from '@components/Form/types'
import { Dashboard } from '@features/Dashboard/types'
import { getVigilanceAreaColorWithAlpha } from '@features/VigilanceArea/components/VigilanceAreaLayer/style'
import { EMPTY_VALUE } from '@features/VigilanceArea/constants'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { endingOccurenceText, frequencyText } from '@features/VigilanceArea/utils'
import { customDayjs, THEME } from '@mtes-mct/monitor-ui'
import { Image, Link, Text, View } from '@react-pdf/renderer'
import { displayTags } from '@utils/getTagsAsOptions'

import { ArrowRight } from '../icons/ArrowRight'
import { ExternalLink } from '../icons/ExternalLink'
import { AreaImage } from '../Layout/AreaImage'
import { areaStyle, layoutStyle } from '../style'
import { getImage, getMinimap } from '../utils'

import type { ExportImageType } from '@features/Dashboard/hooks/useExportImages'
import type { AMPFromAPI } from 'domain/entities/AMPs'
import type { RegulatoryLayerWithMetadata } from 'domain/entities/regulatory'

function chunkArray(array: ImageFront[], size: number) {
  const result: ImageFront[][] = []
  for (let i = 0; i < array.length; i += size) {
    const slicedImages = array.slice(i, i + size)
    result.push(slicedImages)
  }

  return result
}

function ImageGrid({ images }) {
  const rows = chunkArray(images, 3)
  const isLandscape = img => img.orientation === Orientation.LANDSCAPE

  const landscapeImageStyle = {
    maxWidth: '200pt',
    objectFit: 'contain'
  }

  const portraitImageStyle = {
    maxHeight: '250pt',
    objectFit: 'contain'
  }

  return (
    <>
      {rows.map((row, rowIndex) => (
        <View
          // eslint-disable-next-line react/no-array-index-key
          key={rowIndex}
          style={{
            alignItems: 'flex-start',
            flexDirection: 'row',
            gap: 6,
            marginBottom: 6
          }}
        >
          {row.map(img => (
            <Image key={img.id} src={img.image} style={isLandscape(img) ? landscapeImageStyle : portraitImageStyle} />
          ))}
        </View>
      ))}
    </>
  )
}

export function VigilanceAreas({
  images,
  linkedAMPs,
  linkedRegulatoryAreas,
  vigilanceAreas
}: {
  images: ExportImageType[]
  linkedAMPs: AMPFromAPI[]
  linkedRegulatoryAreas: RegulatoryLayerWithMetadata[]
  vigilanceAreas: Dashboard.VigilanceAreaWithImages[]
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
          const formattedStartPeriod = (startDatePeriod?: string) =>
            startDatePeriod ? customDayjs(startDatePeriod).utc().format('DD/MM/YYYY') : undefined
          const formattedEndPeriod = (endDatePeriod?: string) =>
            endDatePeriod ? customDayjs(endDatePeriod).utc().format('DD/MM/YYYY') : undefined

          const amps = linkedAMPs.filter(amp => vigilanceArea.linkedAMPs?.includes(amp.id))
          const regulatoryAreas = linkedRegulatoryAreas.filter(regulatoryArea =>
            vigilanceArea.linkedRegulatoryAreas?.includes(regulatoryArea.id)
          )

          const image = getImage(images, Dashboard.Layer.DASHBOARD_VIGILANCE_AREAS, vigilanceArea.id)
          const minimap = getMinimap(images, Dashboard.Layer.DASHBOARD_VIGILANCE_AREAS, vigilanceArea.id)

          return (
            <View key={vigilanceArea.id}>
              <View style={areaStyle.wrapper} wrap={false}>
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
                        <Text>Période(s)</Text>
                      </View>
                      {vigilanceArea.periods?.map(period => (
                        <View key={period.id} style={areaStyle.details}>
                          {period.isAtAllTimes ? (
                            <Text>En tout temps</Text>
                          ) : (
                            <>
                              <Text>
                                {formattedStartPeriod(period.startDatePeriod)
                                  ? `Du ${formattedStartPeriod(period.startDatePeriod)} au ${formattedEndPeriod(
                                      period.endDatePeriod
                                    )}`
                                  : EMPTY_VALUE}
                              </Text>
                              <Text>{frequencyText(period?.frequency)}</Text>
                              <Text>{endingOccurenceText(period?.endingCondition, period?.computedEndDate)}</Text>
                            </>
                          )}
                        </View>
                      ))}
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
                  {regulatoryAreas.length > 0 && regulatoryAreas.length < 3 && (
                    <View style={[areaStyle.content, { borderTop: `1 solid ${THEME.color.gainsboro}` }]}>
                      <Text style={[areaStyle.description, { width: 'auto' }]}>Réglementations en lien</Text>
                      {regulatoryAreas.map((linkedRegulatoryArea, index) => (
                        <View
                          key={linkedRegulatoryArea.id}
                          style={{ marginBottom: index === regulatoryAreas.length - 1 ? 0 : 7 }}
                        >
                          <Link href={linkedRegulatoryArea.url} style={layoutStyle.link}>
                            <View style={[layoutStyle.row, { alignItems: 'center', marginBottom: 3, width: 'auto' }]}>
                              <Text>Résumé réglementaire sur Légicem </Text>
                              <ExternalLink color={layoutStyle.link.color} size={8} />
                            </View>
                          </Link>
                          <Text style={[areaStyle.details, { fontSize: 6.2 }]}>{linkedRegulatoryArea.refReg}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                  {amps.length > 0 && (
                    <View style={[areaStyle.content, { borderTop: `1 solid ${THEME.color.gainsboro}` }]}>
                      <Text style={[areaStyle.description, { width: 'auto' }]}>AMP en lien</Text>
                      {amps.map(linkedAmp => (
                        <View key={linkedAmp.id} style={[areaStyle.details, { width: 'auto' }]}>
                          <Text style={{ fontWeight: 'bold' }}>{linkedAmp.name} /</Text>
                          <Text>{linkedAmp.type}</Text>
                        </View>
                      ))}
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
              {regulatoryAreas.length > 0 && regulatoryAreas.length > 2 && (
                <View
                  style={[
                    areaStyle.content,
                    {
                      border: `1 solid ${THEME.color.gainsboro}`,
                      borderBottom: vigilanceArea.comments ? 'none' : `1 solid ${THEME.color.gainsboro}`,
                      fontSize: 6.8
                    }
                  ]}
                  wrap
                >
                  <Text style={[areaStyle.description, { width: 'auto' }]}>Résumés réglementaires sur Légicem</Text>

                  {regulatoryAreas.map(linkedRegulatoryArea => (
                    <View
                      key={linkedRegulatoryArea.id}
                      style={[layoutStyle.row, { alignItems: 'center', marginBottom: 3, width: 'auto' }]}
                    >
                      <ArrowRight color={THEME.color.slateGray} size={10} />
                      <Link href={linkedRegulatoryArea.url}>
                        <Text style={[layoutStyle.link, { fontSize: 6.2 }]}>{linkedRegulatoryArea.refReg}</Text>
                      </Link>
                    </View>
                  ))}
                </View>
              )}

              <View style={[areaStyle.content, { border: `1 solid ${THEME.color.gainsboro}`, fontSize: 6.8 }]} wrap>
                <View>
                  <Text style={[areaStyle.description, { width: 'auto' }]}>Commentaires</Text>
                  <Text style={[areaStyle.details, { width: 'auto' }]}>{vigilanceArea.comments}</Text>
                </View>
              </View>

              {vigilanceArea.images && vigilanceArea.images.length > 0 && (
                <View wrap>
                  <Text style={[layoutStyle.selected, layoutStyle.bold, { marginBottom: 4, marginTop: 13 }]}>
                    Photos
                  </Text>
                  <ImageGrid images={vigilanceArea.images} />
                </View>
              )}
            </View>
          )
        })}
      </View>
    </>
  )
}
