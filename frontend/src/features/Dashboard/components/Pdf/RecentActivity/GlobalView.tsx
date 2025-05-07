import { pluralize, type ControlUnit } from '@mtes-mct/monitor-ui'
import { Image, Text, View } from '@react-pdf/renderer'

import { layoutStyle } from '../style'
import { Legend } from './Legend'
import { recentActivityStyles } from './style'

import type { ExportImageType } from '@features/Dashboard/hooks/useExportImages'

export function GlobalView({
  controlUnits,
  gobalImage,
  themesAndControlActions,
  totalControlActions,
  totalTarget
}: {
  controlUnits: ControlUnit.ControlUnit[]
  gobalImage: ExportImageType | undefined
  themesAndControlActions: Record<string, number>
  totalControlActions: number
  totalTarget: number
}) {
  return (
    <View style={{ flexDirection: 'column', width: '50%' }}>
      {gobalImage && (
        <View>
          <Image
            src={gobalImage.image}
            style={{
              height: 178,
              width: 270
            }}
          />
          <Legend />
        </View>
      )}

      <Text style={recentActivityStyles.subTitle}>Pression de contrôles - toutes unités confondues</Text>
      <Text style={layoutStyle.definition}>
        {totalControlActions} actions de contrôles et {totalTarget} cibles contrôlées
      </Text>

      <View style={recentActivityStyles.tableHeader}>
        <Text>Thématiques</Text>
      </View>
      <View style={recentActivityStyles.table}>
        {Object.entries(themesAndControlActions).map(([theme, totalControl]) => (
          <View key={theme} style={recentActivityStyles.cell}>
            <Text style={[recentActivityStyles.cellText, { fontWeight: 'bold' }]}>{theme}</Text>
            <Text style={[recentActivityStyles.cellText, recentActivityStyles.totalControlCellText]}>
              {totalControl} {pluralize('action', totalControl)} de ctrl
            </Text>
          </View>
        ))}
      </View>

      <View style={recentActivityStyles.tableHeader}>
        <Text>Unités concernées</Text>
        <Text>{controlUnits.length}</Text>
      </View>
      <View style={recentActivityStyles.table}>
        {controlUnits.map(unit => (
          <View key={unit.id} style={recentActivityStyles.cell}>
            <Text style={[recentActivityStyles.cellText, { fontWeight: 'bold' }]}>{unit.name}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}
