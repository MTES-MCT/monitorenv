import { StyleSheet, Text, View } from '@react-pdf/renderer'

import { layoutStyle } from '../style'

const styles = StyleSheet.create({
  comments: {
    flex: 1,
    fontSize: 7.5
  }
})

const THRESHOLD = 250

export function Comments({ comments }: { comments: string | undefined }) {
  function getPrettyComments(uglyComments: string): string[] {
    if (uglyComments.length < THRESHOLD) {
      return [uglyComments]
    }
    const middle = Math.floor(uglyComments.length / 2)
    const breakPointDot = uglyComments.lastIndexOf('.', middle)
    const breakPointBreakline = uglyComments.lastIndexOf('\n', middle)
    const breakPoint = Math.max(breakPointDot, breakPointBreakline)

    return [uglyComments.slice(0, breakPoint + 1), uglyComments.slice(breakPoint + 1)]
  }

  return (
    <>
      <Text style={layoutStyle.title}>Commentaires</Text>
      <View style={{ flexDirection: 'row', gap: 10.5 }}>
        {!!comments && getPrettyComments(comments).map(comment => <Text style={styles.comments}>{comment}</Text>)}
      </View>
    </>
  )
}