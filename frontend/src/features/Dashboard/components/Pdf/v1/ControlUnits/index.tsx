import { ControlUnit, THEME } from '@mtes-mct/monitor-ui'
import { StyleSheet, Text, View } from '@react-pdf/renderer'

import { layoutStyle } from '../style'

const styles = StyleSheet.create({
  controlUnit: {
    color: THEME.color.charcoal,
    fontSize: 13,
    fontWeight: 'bold'
  }
})

export function ControlUnits({ controlUnits }: { controlUnits: ControlUnit.ControlUnit[] }) {
  return (
    <>
      <View style={layoutStyle.header}>
        <Text style={layoutStyle.title}>Unité(s)</Text>
        <Text style={layoutStyle.selected}>{controlUnits.length} sélectionnée(s)</Text>
      </View>
      {controlUnits.map(({ administration, id, name }) => (
        <Text key={id} style={styles.controlUnit}>
          {name} - {administration.name}
        </Text>
      ))}
    </>
  )
}
