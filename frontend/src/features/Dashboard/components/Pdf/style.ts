import { THEME } from '@mtes-mct/monitor-ui'
import MarianeBold from '@mtes-mct/monitor-ui/assets/fonts/Marianne-Bold.woff2'
import MarianeBoldItalic from '@mtes-mct/monitor-ui/assets/fonts/Marianne-Bold_Italic.woff2'
import MarianeLight from '@mtes-mct/monitor-ui/assets/fonts/Marianne-Light.woff2'
import MarianeMedium from '@mtes-mct/monitor-ui/assets/fonts/Marianne-Medium.woff2'
import MarianeRegular from '@mtes-mct/monitor-ui/assets/fonts/Marianne-Regular.woff2'
import MarianeRegularItalic from '@mtes-mct/monitor-ui/assets/fonts/Marianne-Regular_Italic.woff2'
import { Font, StyleSheet } from '@react-pdf/renderer'

// Note: in order to convert pixels to pt you must multiply by approximately 0.31. Ex: 20px * 0.31 = 6.2pt

export const registerFonts = () => {
  Font.register({
    family: 'Mariane',
    fontWeight: 'bold',
    src: MarianeBold
  })
  Font.register({
    family: 'Mariane',
    fontWeight: 'normal',
    src: MarianeRegular
  })
  Font.register({
    family: 'Mariane',
    fontWeight: 'medium',
    src: MarianeMedium
  })
  Font.register({
    family: 'Mariane',
    fontWeight: 'light',
    src: MarianeLight
  })
  Font.register({
    family: 'Mariane',
    fontStyle: 'italic',
    fontWeight: 'bold',
    src: MarianeBoldItalic
  })
  Font.register({
    family: 'Mariane',
    fontStyle: 'italic',
    fontWeight: 'normal',
    src: MarianeRegularItalic
  })
}

export const layoutStyle = StyleSheet.create({
  bold: {
    fontWeight: 'bold'
  },
  cardWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 13
  },
  column: {
    flexDirection: 'column'
  },
  definition: { fontSize: 8, fontStyle: 'italic' },
  header1: {
    fontSize: 18.6,
    fontWeight: 'bold',
    marginBottom: 16
  },
  header2: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8
  },
  headings: {
    display: 'flex',
    flexDirection: 'row',
    fontSize: 10,
    justifyContent: 'space-between',
    marginBottom: 22
  },
  italic: {
    fontFamily: 'Mariane',
    fontStyle: 'italic'
  },
  link: {
    color: '#295edb'
  },
  page: {
    fontFamily: 'Mariane',
    fontWeight: 'normal',
    padding: '20 22',
    position: 'relative'
  },
  regular: {
    fontWeight: 'normal'
  },
  row: {
    flexDirection: 'row'
  },
  section: {
    marginBottom: 15.5
  },
  selected: {
    fontSize: 8,
    marginTop: 4.3
  },
  title: {
    fontSize: 13
  }
})

export const areaStyle = StyleSheet.create({
  card: {
    borderColor: THEME.color.gainsboro,
    borderRadius: 1,
    borderStyle: 'solid',
    borderWidth: 1,
    fontSize: 6.8,
    left: 10,
    position: 'absolute',
    top: 10,
    width: '25%'
  },
  content: {
    backgroundColor: THEME.color.white,
    padding: 5.5
  },
  description: {
    color: THEME.color.slateGray
  },
  details: {
    color: THEME.color.gunMetal
  },
  header: {
    alignItems: 'center',
    backgroundColor: THEME.color.gainsboro,
    flexDirection: 'row',
    minHeight: 12.4,
    padding: 2
  },
  layerLegend: {
    border: `0.5 solid ${THEME.color.slateGray}`,
    flexDirection: 'row',
    height: 8,
    marginRight: 2,
    width: 8
  },
  minimap: {
    borderColor: THEME.color.white,
    borderStyle: 'solid',
    borderWidth: 2.5,
    bottom: 7.4,
    position: 'absolute',
    right: 7.4,
    width: 93
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    gap: 6,
    position: 'relative',
    width: '100%'
  }
})
