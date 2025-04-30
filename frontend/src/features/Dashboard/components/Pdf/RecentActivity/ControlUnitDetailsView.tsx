import { pluralize, type ControlUnit } from '@mtes-mct/monitor-ui'
import { Image, Text, View } from '@react-pdf/renderer'

import { layoutStyle } from '../style'
import { recentActivityStyles } from './style'

import type { ExportImageType } from '@features/Dashboard/hooks/useExportImages'

export function ControlUnitDetailsView({
  controlUnit,
  image,
  themesAndControlActions,
  totalControlActions,
  totalTargetByUnit
}: {
  controlUnit: ControlUnit.ControlUnit
  image: ExportImageType | undefined
  themesAndControlActions: Record<string, number>
  totalControlActions: number
  totalTargetByUnit: number
}) {
  const hasThemesAndControlActions = Object.keys(themesAndControlActions).length > 0

  return (
    <View style={{ flexDirection: 'column', width: '45%' }}>
      {image && (
        <View>
          <Image
            src={image.image}
            style={{
              height: 350,
              width: '100%'
            }}
          />
        </View>
      )}
      <Text style={recentActivityStyles.subTitle}>Pression de contrôles - {controlUnit.name}</Text>
      <Text style={layoutStyle.definition}>
        {totalControlActions} actions de contrôles et {totalTargetByUnit} cibles contrôlées
      </Text>

      {hasThemesAndControlActions && (
        <>
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
        </>
      )}
    </View>
  )
}
