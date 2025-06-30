import { Check } from '@features/Dashboard/components/Pdf/icons/Check'
import { Clock } from '@features/Dashboard/components/Pdf/icons/Clock'
import {
  getAllThemes,
  getTotalInfraction,
  getTotalNbControls,
  getTotalPV
} from '@features/Dashboard/components/Pdf/NearbyUnits/utils'
import { areaStyle, layoutStyle } from '@features/Dashboard/components/Pdf/style'
import { pluralize, THEME } from '@mtes-mct/monitor-ui'
import { StyleSheet, Text, View } from '@react-pdf/renderer'
import { displayThemes } from '@utils/getThemesAsOptions'

import { type Mission } from '../../../../../domain/entities/missions'
import { getDateRange } from '../../DashboardForm/NearbyUnits/utils'
import { Dot } from '../icons/Dot'

import type { LegacyControlUnit } from '../../../../../domain/entities/legacyControlUnit'

const styles = StyleSheet.create({
  card: {
    borderColor: THEME.color.gainsboro,
    borderRadius: 1,
    borderStyle: 'solid',
    borderWidth: 1,
    fontSize: 6.2,
    gap: 3.7,
    padding: '6 14',
    width: '31.5%'
  },
  controlUnit: {
    infractions: { color: THEME.color.gunMetal, fontSize: 6.8, fontWeight: 'bold' },
    name: { color: THEME.color.charcoal, fontSize: 8, fontWeight: 'bold', width: '70%' },
    nbControls: { color: THEME.color.gunMetal, fontSize: 6.8 },
    subTitle: { color: THEME.color.charcoal, fontSize: 6.8 },
    themes: { color: THEME.color.gunMetal, fontSize: 6.8, fontWeight: 'bold' }
  },
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

type NearbyUnitsProps = {
  controlUnit: LegacyControlUnit
  missions: Mission[]
  status: 'NOW' | 'PAST' | 'FUTURE'
}

export function UnitCard({ controlUnit, missions, status }: NearbyUnitsProps) {
  const envActions = missions.flatMap(mission => mission.envActions)
  const dateRange = getDateRange(missions)
  const themes = displayThemes(getAllThemes(envActions))
  const nbControls = getTotalNbControls(envActions)
  const nbInfractions = getTotalInfraction(envActions)
  const nbPV = getTotalPV(envActions)

  return (
    <View style={styles.card}>
      <View style={[layoutStyle.row, { alignItems: 'center', justifyContent: 'space-between' }]}>
        <Text style={styles.controlUnit.name}>
          {controlUnit.name} ({controlUnit.administration})
        </Text>
        {status === 'NOW' && (
          <View style={[layoutStyle.row, { gap: 2.5 }]}>
            <Clock color={THEME.color.blueGray} size={9} />
            <Text style={{ color: THEME.color.blueGray }}>En cours</Text>
          </View>
        )}
        {status === 'PAST' && (
          <View style={[layoutStyle.row, { gap: 2.5 }]}>
            <Check color={THEME.color.gunMetal} size={9} />
            <Text style={{ color: THEME.color.gunMetal }}>Terminée</Text>
          </View>
        )}
        {status === 'FUTURE' && (
          <View style={[layoutStyle.row, { gap: 2.5 }]}>
            <Clock color="#7CBEF4" dashed size={9} />
            <Text style={{ color: '#7CBEF4' }}>À venir</Text>
          </View>
        )}
      </View>

      <View style={[layoutStyle.row, styles.controlUnit.subTitle]}>
        {missions.length > 0 && <Text> {missions.length} missions • </Text>}
        <Text>{`Du ${dateRange?.start} au ${dateRange?.end}`}</Text>
      </View>

      <View style={styles.separator} />
      <Text style={styles.controlUnit.themes}>{themes}</Text>

      {nbControls > 0 && (
        <View style={[layoutStyle.row, { gap: 5 }]}>
          <Text style={styles.controlUnit.nbControls}>
            {nbControls} {pluralize('contrôle', nbControls)}
          </Text>
          {nbInfractions > 0 && (
            <View style={layoutStyle.row}>
              <Dot color={THEME.color.maximumRed} size={3} />
              <Text style={styles.controlUnit.infractions}>
                {nbInfractions} {pluralize('infraction', nbInfractions)}
              </Text>
              <Text style={styles.controlUnit.infractions}>, {nbPV} PV</Text>
            </View>
          )}
        </View>
      )}
    </View>
  )
}
