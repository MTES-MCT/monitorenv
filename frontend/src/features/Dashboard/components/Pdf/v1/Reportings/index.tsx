import { getFormattedReportingId } from '@features/Reportings/utils'
import { THEME } from '@mtes-mct/monitor-ui'
import { G, Path, Rect, StyleSheet, Svg, Text, View } from '@react-pdf/renderer'
import { formatCoordinates } from '@utils/coordinates'
import { getDateAsLocalizedStringCompact } from '@utils/getDateAsLocalizedString'
import { CoordinatesFormat } from 'domain/entities/map/constants'
import { getReportingStatus, ReportingStatusEnum, ReportingTypeEnum, type Reporting } from 'domain/entities/reporting'
import { ReportingTargetTypeLabels } from 'domain/entities/targetType'
import { vehicleTypeLabels } from 'domain/entities/vehicleType'
import { vesselTypeLabel } from 'domain/entities/vesselType'
import { Fragment } from 'react/jsx-runtime'

import { areaStyle, layoutStyle } from '../style'

import type { ControlPlansSubThemeCollection, ControlPlansThemeCollection } from 'domain/entities/controlPlan'
import type { Coordinate } from 'ol/coordinate'

const REPORTING_INDEXS_BREAK = [6, 15, 24, 33]

const styles = StyleSheet.create({
  description: { ...areaStyle.description, width: '50%' },
  details: { ...areaStyle.details, fontWeight: 'bold' },
  legendCard: {
    borderColor: THEME.color.gainsboro,
    borderRadius: 1,
    borderStyle: 'solid',
    borderWidth: 1,
    fontSize: 6.8,
    padding: '6 3',
    width: '100%'
  },
  legendLabel: { ...layoutStyle.row, fontSize: 6.2, gap: 4 },
  reportingCard: {
    borderColor: THEME.color.gainsboro,
    borderRadius: 1,
    borderStyle: 'solid',
    borderWidth: 1,
    fontSize: 6.2,
    gap: 3.7,
    padding: '6 14',
    width: '31.5%'
  },
  reportingDate: {
    color: THEME.color.slateGray,
    fontSize: 5.5,
    fontWeight: 'normal'
  },
  reportingHeader: {
    flexDirection: 'row',
    fontSize: 6.8,
    fontWeight: 'bold'
  },
  separator: {
    borderTop: `1 solid ${THEME.color.gainsboro}`
  }
})

function FlagArchivedObservation() {
  return (
    <Svg height="8.4" viewBox="0 0 26 26" width="8.4">
      <G transform="translate(61 -19)">
        <Path d="M-38.9,27.58-54.5,20.3V43.7h2.6V33.889Z" fill="#fff" stroke="#5697D2" stroke-width="1.5" />
        <Path d="M-61,19h26V45H-61Z" fill="none" />
        <Rect fill="none" height="26" transform="translate(-61 19)" width="26" />
      </G>
    </Svg>
  )
}

function FlagArchivedInfraction() {
  return (
    <Svg height="8.4" viewBox="0 0 26 26" width="8.4">
      <G transform="translate(61 -19)">
        <Path d="M-38.9,27.58-54.5,20.3V43.7h2.6V33.889Z" fill="#fff" stroke="#E1000F" stroke-width="1.5" />
        <Path d="M-61,19h26V45H-61Z" fill="none" />
        <Rect fill="none" height="26" transform="translate(-61 19)" width="26" />
      </G>
    </Svg>
  )
}

function FlagArchivedWithMission() {
  return (
    <Svg height="8.4" viewBox="0 0 26 26" width="8.4">
      <G transform="translate(61 -19)">
        <Path d="M-38.9,27.58-54.5,20.3V43.7h2.6V33.889Z" fill="#fff" stroke="#29b361" stroke-width="1.5" />
        <Path d="M-61,19h26V45H-61Z" fill="none" />
        <Rect fill="none" height="26" transform="translate(-61 19)" width="26" />
      </G>
    </Svg>
  )
}

function FlagArchived() {
  return (
    <Svg height="8.4" viewBox="0 0 26 26" width="8.4">
      <G transform="translate(61 -19)">
        <Path
          d="M-38.9,27.58-54.5,20.3V43.7h2.6V33.889Z"
          fill="#fff"
          stroke="THEME.color.gunMetal"
          stroke-width="1.5"
        />
        <Path d="M-61,19h26V45H-61Z" fill="none" />
        <Rect fill="none" height="26" transform="translate(-61 19)" width="26" />
      </G>
    </Svg>
  )
}

function Flag({ color }: { color: string }) {
  return (
    <Svg height="8.4" viewBox="0 0 20 20" width="8.4">
      <Rect fill="none" height="20" width="20" />
      <Path d="M-143,6.6-155,1V19h2V11.453Z" fill={color} transform="translate(160)" />
    </Svg>
  )
}

const reportingStatusFlag = (reporting: Reporting) => {
  const reportingStatus = getReportingStatus({ ...reporting })

  if (reporting.attachedMission && reportingStatus !== ReportingStatusEnum.ARCHIVED) {
    return <Flag color={THEME.color.mediumSeaGreen} />
  }

  switch (reportingStatus) {
    case ReportingStatusEnum.ARCHIVED:
      return getReportingArchivedFlag()
    case ReportingStatusEnum.IN_PROGRESS:
      return <Flag color={THEME.color.blueGray} />
    case ReportingStatusEnum.INFRACTION_SUSPICION:
      return <Flag color={THEME.color.maximumRed} />
    case ReportingStatusEnum.OBSERVATION:
      return <Flag color={THEME.color.blueGray} />

    default:
      return <Flag color={THEME.color.slateGray} />
  }

  function getReportingArchivedFlag() {
    if (reporting.attachedMission) {
      return <FlagArchivedWithMission />
    }
    switch (reporting.reportType) {
      case ReportingTypeEnum.INFRACTION_SUSPICION:
        return <FlagArchivedInfraction />
      case ReportingTypeEnum.OBSERVATION:
        return <FlagArchivedObservation />
      default:
        return <FlagArchived />
    }
  }
}

export function Reportings({
  reportings,
  subThemes,
  themes
}: {
  reportings: Reporting[]
  subThemes: ControlPlansSubThemeCollection
  themes: ControlPlansThemeCollection
}) {
  return (
    <>
      <View style={layoutStyle.header}>
        <Text style={layoutStyle.title}>Signalements</Text>
        <Text style={layoutStyle.selected}>{reportings.length} sélectionnée(s)</Text>
      </View>

      <View style={layoutStyle.cardWrapper}>
        <View style={styles.legendCard}>
          <View style={layoutStyle.row}>
            <View style={{ marginRight: 16 }}>
              <View style={styles.legendLabel}>
                <Flag color={THEME.color.slateGray} />
                <Text style={{ fontWeight: 'bold' }}>Signalements en cours</Text>
              </View>
              <View style={[styles.legendLabel, { marginLeft: 6, marginTop: 6 }]}>
                <Flag color={THEME.color.blueGray} />
                <Text>Observation</Text>
              </View>
              <View style={[styles.legendLabel, { marginLeft: 6, marginTop: 6 }]}>
                <Flag color={THEME.color.maximumRed} /> <Text>Suspicion d&apos;infraction</Text>
              </View>
              <View style={[styles.legendLabel, { marginLeft: 6, marginTop: 6 }]}>
                <Flag color={THEME.color.mediumSeaGreen} /> <Text>Rattaché à une mission</Text>
              </View>
            </View>
            <View>
              <View style={styles.legendLabel}>
                <FlagArchived />
                <Text style={{ fontWeight: 'bold' }}>Signalements archivés</Text>
              </View>
              <View style={[styles.legendLabel, { marginLeft: 6, marginTop: 6 }]}>
                <FlagArchivedObservation /> <Text>Observation</Text>
              </View>
              <View style={[styles.legendLabel, { marginLeft: 6, marginTop: 6 }]}>
                <FlagArchivedInfraction /> <Text>Suspicion d&apos;infraction</Text>
              </View>
              <View style={[styles.legendLabel, { marginLeft: 6, marginTop: 6 }]}>
                <FlagArchivedWithMission /> <Text>Rattaché à une mission</Text>
              </View>
            </View>
          </View>
        </View>
        {reportings.map((reporting, index) => (
          <View
            key={reporting.id}
            break={REPORTING_INDEXS_BREAK.includes(index)}
            style={[styles.reportingCard, { position: 'relative' }]}
          >
            <View style={{ left: 3, position: 'absolute', top: 9 }}>{reportingStatusFlag(reporting)}</View>
            <Text>S. {getFormattedReportingId(reporting.reportingId)}</Text>
            {reporting.createdAt && (
              <Text style={styles.reportingDate}>{getDateAsLocalizedStringCompact(reporting.createdAt, true)}</Text>
            )}
            {!!reporting.themeId && (
              <View style={(layoutStyle.row, { flexWrap: 'wrap' })}>
                <Text style={{ fontWeight: 'bold' }}>{themes[reporting.themeId]?.theme} /</Text>
                <Text> {reporting.subThemeIds?.map(subThemeid => subThemes[subThemeid]?.subTheme).join(', ')}</Text>
              </View>
            )}
            <View style={[layoutStyle.row, { rowGap: 2 }]}>
              <View style={styles.description}>
                <Text>Localisation</Text>
              </View>
              <View style={styles.details}>
                {reporting.geom?.coordinates && reporting.geom?.coordinates.length > 0 && (
                  <Text>
                    {
                      formatCoordinates(
                        reporting.geom.coordinates[0] as Coordinate,
                        CoordinatesFormat.DEGREES_MINUTES_SECONDS
                      )
                        .replace(/\u2032/g, "'") // Replace prime by quote
                        .replace(/\u2033/g, '"') // Replace doubleprime by doublequote
                    }
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.separator} />
            <View style={[layoutStyle.row, { rowGap: 2 }]}>
              <View style={styles.description}>
                <Text>Source</Text>
              </View>
              <View style={styles.details}>
                <Text>{reporting.reportingSources?.map(source => source.displayedSource).join(', ')}</Text>
              </View>
            </View>
            {reporting.targetDetails.map(target => (
              <Fragment key={target.mmsi}>
                <View style={[layoutStyle.row, { rowGap: 2 }]}>
                  <View style={styles.description}>
                    <Text>Type de cible</Text>
                  </View>
                  <View style={styles.details}>
                    <Text>{reporting.targetType ? ReportingTargetTypeLabels[reporting.targetType] : '-'}</Text>
                  </View>
                </View>
                <View style={[layoutStyle.row, { rowGap: 2 }]}>
                  <View style={styles.description}>
                    <Text>Type de véhicule</Text>
                  </View>
                  <View style={styles.details}>
                    <Text>{reporting.vehicleType ? vehicleTypeLabels[reporting.vehicleType].label : '-'}</Text>
                  </View>
                </View>
                <View style={[layoutStyle.row, { rowGap: 2 }]}>
                  <View style={styles.description}>
                    <Text>MMSI</Text>
                  </View>
                  <View style={styles.details}>
                    <Text>{target.mmsi ?? '-'}</Text>
                  </View>
                </View>
                <View style={[layoutStyle.row, { rowGap: 2 }]}>
                  <View style={styles.description}>
                    <Text>IMO</Text>
                  </View>
                  <View style={styles.details}>
                    <Text>{target.imo ?? '-'}</Text>
                  </View>
                </View>
                <View style={[layoutStyle.row, { rowGap: 2 }]}>
                  <View style={styles.description}>
                    <Text>Nom du capitaine</Text>
                  </View>
                  <View style={styles.details}>
                    <Text>{target.operatorName ?? '-'}</Text>
                  </View>
                </View>
                <View style={[layoutStyle.row, { rowGap: 2 }]}>
                  <View style={styles.description}>
                    <Text>Immatriculation</Text>
                  </View>
                  <View style={styles.details}>
                    <Text>{target.externalReferenceNumber ?? '-'}</Text>
                  </View>
                </View>
                <View style={[layoutStyle.row, { rowGap: 2 }]}>
                  <View style={styles.description}>
                    <Text>Taille</Text>
                  </View>
                  <View style={styles.details}>
                    <Text>{target.size ? `${target.size} m` : '-'}</Text>
                  </View>
                </View>
                <View style={[layoutStyle.row, { rowGap: 2 }]}>
                  <View style={styles.description}>
                    <Text>Type de navire</Text>
                  </View>
                  <View style={styles.details}>
                    <Text>{target.vesselType ? vesselTypeLabel[target.vesselType] : '-'}</Text>
                  </View>
                </View>
                <View style={styles.separator} />
              </Fragment>
            ))}
            <Text style={[styles.description, { width: 'auto' }]}>Description du signalement</Text>
            <Text>{reporting.description}</Text>
          </View>
        ))}
      </View>
    </>
  )
}
