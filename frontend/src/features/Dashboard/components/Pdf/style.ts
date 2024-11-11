import { THEME } from '@mtes-mct/monitor-ui'
import { StyleSheet } from '@react-pdf/renderer'

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
  comments: {
    fontSize: 7.5
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6.2
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
  page: {
    color: THEME.color.gunMetal,
    fontFamily: 'Mariane',
    fontWeight: 'normal',
    padding: '20 22'
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
    width: '30%'
  },
  content: {
    backgroundColor: THEME.color.white,
    padding: 5
  },
  description: {
    color: THEME.color.slateGray,
    fontSize: 5,
    width: '25%'
  },
  details: {
    color: THEME.color.charcoal,
    fontSize: 5.5,
    width: '75%'
  },
  header: {
    backgroundColor: THEME.color.gainsboro,
    fontSize: 5.5,
    minHeight: 12.4,
    padding: '2 14'
  }
})
