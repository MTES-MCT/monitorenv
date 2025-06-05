import { Clock } from '@features/Dashboard/components/Pdf/icons/Clock'
import { areaStyle, layoutStyle } from '@features/Dashboard/components/Pdf/style'
import { customDayjs, pluralize, THEME } from '@mtes-mct/monitor-ui'
import { StyleSheet, Text, View } from '@react-pdf/renderer'
import { displayThemes } from '@utils/getThemesAsOptions'
import { Fragment } from 'react'

import { ActionTypeEnum, type EnvActionControl } from '../../../../../domain/entities/missions'
import { Dot } from '../icons/Dot'

import type { NearbyUnit } from '@api/nearbyUnitsAPI'

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
    date: { color: THEME.color.charcoal, fontSize: 6.8 },
    infractions: { color: THEME.color.gunMetal, fontSize: 6.8, fontWeight: 'bold' },
    name: { color: THEME.color.charcoal, fontSize: 8, fontWeight: 'bold' },
    nbControls: { color: THEME.color.gunMetal, fontSize: 6.8 },
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
  nearbyUnits: NearbyUnit[]
}

const getTotalInfraction = (envAction: EnvActionControl) =>
  envAction.infractions.reduce((totalInfraction, infraction) => totalInfraction + infraction.nbTarget, 0)

export function NearbyUnits({ nearbyUnits }: NearbyUnitsProps) {
  const startOfDay = customDayjs().startOf('day').utc()
  const endOfDay = customDayjs().endOf('day').utc()
  const unitCurrentlyInArea = nearbyUnits.flatMap(nearbyUnit => ({
    controlUnit: nearbyUnit.controlUnit,
    envActions: nearbyUnit.missions
      .flatMap(mission => mission.envActions)
      .filter(
        envAction =>
          envAction.actionType === ActionTypeEnum.CONTROL || envAction.actionType === ActionTypeEnum.SURVEILLANCE
      )
      .filter(
        envAction =>
          customDayjs(envAction.actionStartDateTimeUtc).isBetween(startOfDay, endOfDay) ||
          customDayjs(envAction.actionEndDateTimeUtc).isBetween(startOfDay, endOfDay)
      )
  }))

  return (
    <>
      <Text style={layoutStyle.header1}>Unités proches</Text>
      <View style={[layoutStyle.definition, { marginBottom: 15 }]}>
        <Text>
          Les unités présentes sont seulement celles qui ont déclaré des actions de contrôle ou de surveillance.
        </Text>
        <Text>
          Le décompte des actions (contrôles, infractions et PV) est uniquement ceux présents dans le périmètre de la
          mission, et non le nombre total effectué lors de la mission.
        </Text>
      </View>

      {unitCurrentlyInArea.length > 0 && (
        <View>
          <View style={layoutStyle.header2}>
            <Text>Actuellement sur zone</Text>
          </View>
          <View style={layoutStyle.cardWrapper}>
            {unitCurrentlyInArea.map(unit => (
              <Fragment key={unit.controlUnit.id}>
                {/* FIXME: IT IS A CARD PER UNIT WITHIN TIME RANGE NOT PER ENVACTIONS */}
                {unit.envActions.map(envAction => (
                  <View key={envAction.id} style={styles.card}>
                    <View style={[layoutStyle.row, { alignItems: 'center', justifyContent: 'space-between' }]}>
                      <Text style={styles.controlUnit.name}>{unit.controlUnit.name}</Text>
                      <View style={[layoutStyle.row, { gap: 2.5 }]}>
                        <Clock color={THEME.color.blueGray} size={9} />
                        <Text style={{ color: THEME.color.blueGray }}>En cours</Text>
                      </View>
                    </View>
                    {envAction.actionType === ActionTypeEnum.CONTROL ? (
                      <Text style={styles.controlUnit.date}>{`Le ${customDayjs(envAction.actionStartDateTimeUtc).format(
                        'DD/MM/YYYY'
                      )}`}</Text>
                    ) : (
                      <Text style={styles.controlUnit.date}>{`Du ${customDayjs(envAction.actionStartDateTimeUtc).format(
                        'DD/MM/YYYY'
                      )} au ${customDayjs(envAction.actionEndDateTimeUtc).format('DD/MM/YYYY')}`}</Text>
                    )}
                    <View style={styles.separator} />
                    <Text style={styles.controlUnit.themes}>{displayThemes(envAction.themes)}</Text>
                    {envAction.actionType === ActionTypeEnum.CONTROL && envAction.actionNumberOfControls && (
                      <View style={[layoutStyle.row, { gap: 14 }]}>
                        <Text style={styles.controlUnit.nbControls}>
                          {envAction.actionNumberOfControls} {pluralize('contrôle', envAction.actionNumberOfControls)}
                        </Text>
                        <View style={layoutStyle.row}>
                          <Dot color={THEME.color.maximumRed} size={3} />
                          <Text style={styles.controlUnit.infractions}>
                            {getTotalInfraction(envAction)} {pluralize('infraction', getTotalInfraction(envAction))}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                ))}
              </Fragment>
            ))}
          </View>
        </View>
      )}
    </>
  )
}
