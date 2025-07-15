import {
  getDateRangeFormatted,
  getUnitsCurrentlyInArea,
  getUnitsRecentlyInArea,
  getUnitsToBeInArea
} from '@features/Dashboard/components/DashboardForm/NearbyUnits/utils'
import { layoutStyle } from '@features/Dashboard/components/Pdf/style'
import { Text, View } from '@react-pdf/renderer'

import { UnitCard } from './UnitCard'

import type { NearbyUnit } from '@features/Dashboard/components/DashboardForm/NearbyUnits/types'

type NearbyUnitsProps = {
  nearbyUnits: NearbyUnit[]
}

export function NearbyUnits({ nearbyUnits }: NearbyUnitsProps) {
  const unitsCurrentlyInArea: NearbyUnit[] = getUnitsCurrentlyInArea(nearbyUnits)
  const unitsRecentlyInArea: NearbyUnit[] = getUnitsRecentlyInArea(nearbyUnits)
  const unitsToBeInArea: NearbyUnit[] = getUnitsToBeInArea(nearbyUnits)
  const dateRange = getDateRangeFormatted(unitsRecentlyInArea.flatMap(({ missions }) => missions))

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
                  status="IN_PROGRESS"
                />
              ))}
            </View>
          </View>
        )}
        {unitsRecentlyInArea.length > 0 && (
          <View>
            <View style={[layoutStyle.header2, { alignItems: 'center', columnGap: 21 }]}>
              <Text>Récemment sur zone</Text>
              <Text style={{ fontSize: 8, fontWeight: 'bold' }}>
                {dateRange?.isSingleDayRange ? `Le ${dateRange?.start}` : `Du ${dateRange?.start} au ${dateRange?.end}`}
              </Text>
            </View>
            <View style={layoutStyle.cardWrapper}>
              {unitsRecentlyInArea.map(unit => (
                <UnitCard
                  key={unit.controlUnit.id}
                  controlUnit={unit.controlUnit}
                  missions={unit.missions}
                  status="DONE"
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
