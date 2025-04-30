import { THEME } from '@mtes-mct/monitor-ui'
import { StyleSheet } from '@react-pdf/renderer'

const maxHeightCell = 30
const minHeightCell = 20

export const recentActivityStyles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    border: `0.5 solid ${THEME.color.lightGray}`,
    flexDirection: 'row',
    fontSize: 6.8,
    justifyContent: 'space-between',
    maxHeight: maxHeightCell,
    minHeight: minHeightCell
  },
  cellText: {
    padding: '0 4.3'
  },
  header: {
    fontSize: 18.6,
    fontWeight: 'bold'
  },
  period: {
    fontSize: 10,
    fontWeight: 'bold'
  },
  rowContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  subTitle: {
    fontSize: 8,
    fontWeight: 'bold'
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  },
  tableHeader: {
    backgroundColor: THEME.color.gainsboro,
    color: THEME.color.slateGray,
    flexDirection: 'row',
    fontSize: 6.8,
    fontWeight: 'bold',
    justifyContent: 'space-between',
    marginTop: 10,
    padding: '4.3',
    width: '100%'
  },
  totalControlCellText: {
    color: THEME.color.slateGray
  }
})
