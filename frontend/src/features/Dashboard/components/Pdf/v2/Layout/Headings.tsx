import { customDayjs } from '@mtes-mct/monitor-ui'
import { Text, View, StyleSheet } from '@react-pdf/renderer'
import { getDateAsLocalizedStringVeryCompact } from '@utils/getDateAsLocalizedString'

import { layoutStyle } from '../style'

export const styles = StyleSheet.create({
  headings: {
    display: 'flex',
    flexDirection: 'row',
    fontSize: 10,
    justifyContent: 'space-between',
    marginBottom: 22
  }
})

export function Headings({ name }: { name: string }) {
  return (
    <View fixed style={styles.headings}>
      <Text>
        Brief : <Text style={layoutStyle.bold}>{name}</Text>
      </Text>
      <Text style={{ ...layoutStyle.italic, marginRight: 40 }}>
        Édité le {getDateAsLocalizedStringVeryCompact(customDayjs().toISOString(), true)}
      </Text>
      <Text fixed render={({ pageNumber, totalPages }) => `p ${pageNumber} / ${totalPages}`} />
    </View>
  )
}
