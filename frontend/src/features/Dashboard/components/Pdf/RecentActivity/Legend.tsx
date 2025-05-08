import { MEDIUM_DOT_SIZE } from '@features/RecentActivity/components/RecentActivityLegend'
import { CONTROLS_COLORS, MAX_CONTROLS, MIN_CONTROLS } from '@features/RecentActivity/constants'
import { THEME } from '@mtes-mct/monitor-ui'
import { View, StyleSheet, Text } from '@react-pdf/renderer'

export const style = StyleSheet.create({
  body: {
    backgroundColor: THEME.color.white,
    bottom: 0,
    height: 80,
    padding: 5,
    position: 'absolute',
    right: 0,
    width: 60
  },
  circle: {
    borderColor: THEME.color.slateGray,
    borderRadius: 50,
    borderStyle: 'solid',
    borderWidth: 0.5,
    position: 'absolute'
  },
  circle1: {
    height: 8,
    top: 3,
    width: 8
  },
  circle2: {
    height: 5,
    left: 1.5,
    top: 6,
    width: 5
  },
  circle3: {
    height: 2.5,
    left: 2.8,
    top: 8.3,
    width: 2.5
  },
  circleNumbers: {
    color: THEME.color.gunMetal,
    display: 'flex',
    flexDirection: 'column',
    fontSize: 4,
    position: 'absolute',
    right: 10.5
  },
  colorLabel: {
    color: THEME.color.slateGray,
    fontSize: 4
  },
  colorLegend: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1.5
  },
  colorLegendContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    gap: 2.5
  },
  colorSquare: {
    height: 5,
    width: 5
  },
  dottedLine: {
    borderBottomColor: THEME.color.gainsboro,
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    position: 'absolute'
  },
  dottedLine1: {
    right: -6,
    top: 2.8,
    width: 40
  },
  dottedLine2: {
    right: -7,
    top: 5.9,
    width: 45
  },
  dottedLine3: {
    right: -9,
    top: 9.3,
    width: 47
  },
  title: {
    color: THEME.color.slateGray,
    fontSize: 4.5,
    marginBottom: 1.2
  },
  totalControlLabel: {
    color: THEME.color.slateGray,
    fontSize: 4,
    position: 'absolute'
  },
  totalControlLabel1: {
    left: 8
  },
  totalControlLabel2: {
    left: 10,
    top: 3.7
  },
  totalControlLabel3: {
    left: 13,
    top: 6.5
  },
  totalControlsLegend: {
    height: 17.7
  }
})
export function Legend() {
  return (
    <View style={style.body}>
      <Text style={style.title}>Nombre de contrôles</Text>
      <View style={style.totalControlsLegend}>
        <View style={style.circleNumbers}>
          <Text style={[style.totalControlLabel, style.totalControlLabel1]}>{MAX_CONTROLS}</Text>
          <View style={[style.dottedLine1, style.dottedLine]} />
          <Text style={[style.totalControlLabel, style.totalControlLabel2]}>{MEDIUM_DOT_SIZE}</Text>
          <View style={[style.dottedLine2, style.dottedLine]} />
          <Text style={[style.totalControlLabel, style.totalControlLabel3]}>{MIN_CONTROLS}</Text>
          <View style={[style.dottedLine3, style.dottedLine]} />
        </View>

        <View>
          <View style={[style.circle1, style.circle]} />
          <View style={[style.circle2, style.circle]} />
          <View style={[style.circle3, style.circle]} />
        </View>
      </View>

      <Text style={style.title}>Proportion d&apos;infraction</Text>
      <View style={style.colorLegend}>
        <View style={style.colorLegendContainer}>
          <View style={[style.colorSquare, { backgroundColor: CONTROLS_COLORS[0] }]} />
          <Text style={style.colorLabel}>0-5%</Text>
        </View>
        <View style={style.colorLegendContainer}>
          <View style={[style.colorSquare, { backgroundColor: CONTROLS_COLORS[1] }]} />
          <Text style={style.colorLabel}>6-10%</Text>
        </View>
        <View style={style.colorLegendContainer}>
          <View style={[style.colorSquare, { backgroundColor: CONTROLS_COLORS[2] }]} />
          <Text style={style.colorLabel}>11-25%</Text>
        </View>
        <View style={style.colorLegendContainer}>
          <View style={[style.colorSquare, { backgroundColor: CONTROLS_COLORS[3] }]} />
          <Text style={style.colorLabel}>26-50%</Text>
        </View>
        <View style={style.colorLegendContainer}>
          <View style={[style.colorSquare, { backgroundColor: CONTROLS_COLORS[4] }]} />
          <Text style={style.colorLabel}>51-75%</Text>
        </View>
        <View style={style.colorLegendContainer}>
          <View style={[style.colorSquare, { backgroundColor: CONTROLS_COLORS[5] }]} />
          <Text style={style.colorLabel}>76-90%</Text>
        </View>
        <View style={style.colorLegendContainer}>
          <View style={[style.colorSquare, { backgroundColor: CONTROLS_COLORS[6] }]} />
          <Text style={style.colorLabel}>91-100%</Text>
        </View>
      </View>
    </View>
  )
}
