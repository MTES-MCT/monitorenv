import { getFormattedReportingId, getTargetDetailsSubText, getTargetName } from '@features/Reportings/utils'
import { THEME } from '@mtes-mct/monitor-ui'
import { G, Path, Rect, StyleSheet, Svg, Text, View } from '@react-pdf/renderer'
import { getDateAsLocalizedStringCompact } from '@utils/getDateAsLocalizedString'
import { getReportingStatus, ReportingStatusEnum, ReportingTypeEnum, type Reporting } from 'domain/entities/reporting'

import { layoutStyle } from '../style'

import type { ControlPlansSubThemeCollection, ControlPlansThemeCollection } from 'domain/entities/controlPlan'

const styles = StyleSheet.create({
  legendCard: {
    borderColor: THEME.color.gainsboro,
    borderRadius: 1,
    borderStyle: 'solid',
    borderWidth: 1,
    fontSize: 6.8,
    padding: '6 3',
    width: '31.5%'
  },
  reportingCard: {
    borderColor: THEME.color.gainsboro,
    borderRadius: 1,
    borderStyle: 'solid',
    borderWidth: 1,
    fontSize: 6.8,
    fontWeight: 'bold',
    padding: '6 14',
    width: '31.5%'
  },
  reportingDate: {
    color: THEME.color.slateGray,
    fontSize: 5.5,
    fontWeight: 'normal',
    marginBottom: 3.7,
    marginTop: 3.1
  },
  reportingHeader: {
    flexDirection: 'row'
  },
  reportingTarget: {
    fontSize: 6.2
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

const getTargetText = (reporting: Reporting) => {
  const targetName = getTargetName({
    target: reporting.targetDetails?.[0],
    targetType: reporting.targetType,
    vehicleType: reporting.vehicleType
  })

  const targetDetails = getTargetDetailsSubText({
    target: reporting.targetDetails?.[0],
    targetType: reporting.targetType,
    vehicleType: reporting.vehicleType
  })

  return `${targetName} ${targetDetails ? `(${targetDetails})` : ''}`.trim()
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
        {reportings.length > 0 && (
          <View style={styles.legendCard}>
            <View style={layoutStyle.row}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: 'bold' }}>Signalements en cours</Text>
                <View style={[layoutStyle.row, { fontSize: 6.2, marginTop: 6 }]}>
                  <Flag color={THEME.color.blueGray} />
                  <Text>Observation</Text>
                </View>
                <View style={[layoutStyle.row, { fontSize: 6.2, marginTop: 6 }]}>
                  <Flag color={THEME.color.maximumRed} /> <Text>Suspicion d&apos;infraction</Text>
                </View>
                <View style={[layoutStyle.row, { fontSize: 6.2, marginTop: 6 }]}>
                  <Flag color={THEME.color.mediumSeaGreen} /> <Text>Rattaché à une mission</Text>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: 'bold' }}>Signalements archivés</Text>
                <View style={[layoutStyle.row, { fontSize: 6.2, marginTop: 6 }]}>
                  <FlagArchivedObservation /> <Text>Observation</Text>
                </View>
                <View style={[layoutStyle.row, { fontSize: 6.2, marginTop: 6 }]}>
                  <FlagArchivedInfraction /> <Text>Suspicion d&apos;infraction</Text>
                </View>
                <View style={[layoutStyle.row, { fontSize: 6.2, marginTop: 6 }]}>
                  <FlagArchivedWithMission /> <Text>Rattaché à une mission</Text>
                </View>
              </View>
            </View>
          </View>
        )}
        {reportings.map(reporting => (
          <View key={reporting.id} style={[styles.reportingCard, { position: 'relative' }]}>
            <View style={{ left: 3, position: 'absolute', top: 9 }}>{reportingStatusFlag(reporting)}</View>
            <Text>
              S. {getFormattedReportingId(reporting.reportingId)} -{' '}
              {reporting.reportingSources?.map(source => source.displayedSource).join(', ')}
            </Text>
            <Text style={styles.reportingTarget}>{getTargetText(reporting)}</Text>
            {reporting.createdAt && (
              <Text style={styles.reportingDate}>{getDateAsLocalizedStringCompact(reporting.createdAt, true)}</Text>
            )}
            {!!reporting.themeId && (
              <Text>
                {themes[reporting.themeId]?.theme} /{' '}
                {reporting.subThemeIds?.map(subThemeid => subThemes[subThemeid]?.subTheme).join(', ')} -{' '}
              </Text>
            )}
            <Text style={layoutStyle.regular}>{reporting.description}</Text>
          </View>
        ))}
      </View>
    </>
  )
}
