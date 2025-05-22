import { getDateRange } from '@features/Dashboard/components/DashboardForm/NearbyUnits/utils'
import { layoutStyle } from '@features/Dashboard/components/Pdf/style'
import { customDayjs } from '@mtes-mct/monitor-ui'
import { Text, View } from '@react-pdf/renderer'

import { UnitCard } from './UnitCard'

import type { NearbyUnit } from '@features/Dashboard/components/DashboardForm/NearbyUnits/types'

type NearbyUnitsProps = {
  nearbyUnits: NearbyUnit[]
}

export function NearbyUnits({ nearbyUnits }: NearbyUnitsProps) {
  const startOfDay = customDayjs().utc().startOf('day')
  const endOfDay = customDayjs().utc().endOf('day')
  const now = customDayjs().utc()

  const unitsCurrentlyInArea: NearbyUnit[] = nearbyUnits
    .flatMap(nearbyUnit => ({
      controlUnit: nearbyUnit.controlUnit,
      missions: nearbyUnit.missions.filter(mission =>
        now.isBetween(customDayjs(mission.startDateTimeUtc), customDayjs(mission.endDateTimeUtc))
      )
    }))
    .filter(({ missions }) => missions.length > 0)

  const unitsRecentlyInArea: NearbyUnit[] = nearbyUnits
    .flatMap(nearbyUnit => ({
      controlUnit: nearbyUnit.controlUnit,
      missions: nearbyUnit.missions.filter(mission => customDayjs(mission.endDateTimeUtc).isBefore(startOfDay))
    }))
    .filter(({ missions }) => missions.length > 0)

  const dateRange = getDateRange(unitsRecentlyInArea.flatMap(({ missions }) => missions))

  const unitsToBeInArea: NearbyUnit[] = nearbyUnits
    .flatMap(nearbyUnit => ({
      controlUnit: nearbyUnit.controlUnit,
      missions: nearbyUnit.missions.filter(mission => customDayjs(mission.startDateTimeUtc).isAfter(endOfDay))
    }))
    .filter(({ missions }) => missions.length > 0)

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

      <View style={{ gap: 15 }}>
        {unitsCurrentlyInArea.length > 0 && (
          <View>
            <View style={layoutStyle.header2}>
              <Text>Actuellement sur zone</Text>
            </View>
            <View style={layoutStyle.cardWrapper}>
              {unitsCurrentlyInArea.map(unit => (
                <UnitCard
                  key={unit.controlUnit.id}
                  controlUnit={unit.controlUnit}
                  missions={unit.missions}
                  status="NOW"
                />
              ))}
            </View>
          </View>
        )}
        {unitsRecentlyInArea.length > 0 && (
          <View>
            <View style={[layoutStyle.header2, { alignItems: 'center', columnGap: 21 }]}>
              <Text>Récemment sur zone</Text>
              <Text style={{ fontSize: 8, fontWeight: 'bold' }}>{`Du ${dateRange?.start} au ${dateRange?.end}`}</Text>
            </View>
            <View style={layoutStyle.cardWrapper}>
              {unitsRecentlyInArea.map(unit => (
                <UnitCard
                  key={unit.controlUnit.id}
                  controlUnit={unit.controlUnit}
                  missions={unit.missions}
                  status="PAST"
                />
              ))}
            </View>
          </View>
        )}
        {unitsToBeInArea.length > 0 && (
          <View>
            <View style={layoutStyle.header2}>
              <Text>Bientôt sur zone</Text>
            </View>
            <Text style={[layoutStyle.definition, { marginBottom: 8 }]}>
              Ne figurent dans cette section que les missions déclarées au CACEM, c’est-à-dire une minorité.
            </Text>
            <View style={layoutStyle.cardWrapper}>
              {unitsToBeInArea.map(unit => (
                <UnitCard
                  key={unit.controlUnit.id}
                  controlUnit={unit.controlUnit}
                  missions={unit.missions}
                  status="FUTURE"
                />
              ))}
            </View>
          </View>
        )}
      </View>
    </>
  )
}
