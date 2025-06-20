import { Link as LinkComponent, StyleSheet, Text, View } from '@react-pdf/renderer'

import { layoutStyle } from '../style'

import type { Link } from '@components/Form/types'

export const style = StyleSheet.create({
  imageLandscape: {
    alignSelf: 'center',
    height: '650pt',
    objectFit: 'contain',
    width: 'auto'
  },
  imagePortrait: {
    alignSelf: 'center',
    maxHeight: '650pt',
    objectFit: 'contain',
    width: '100%'
  },
  imageWrapper: {
    ...layoutStyle.row,
    flexWrap: 'wrap',
    gap: 7.4
  }
})

export function LinksAttachments({ links }: { links: Link[] }) {
  return (
    <>
      <View style={layoutStyle.header1}>
        <Text>Pièces jointes</Text>
      </View>
      {links.length > 0 && (
        <View style={{ marginBottom: 20 }}>
          <Text style={layoutStyle.header2}>Liens utiles</Text>
          <View style={{ gap: 7.4 }}>
            {links.map(link => (
              <View key={link.linkUrl} style={layoutStyle.column}>
                <Text style={[layoutStyle.bold, { fontSize: 9 }]}>{link.linkText}</Text>
                <LinkComponent href={link.linkUrl} style={[layoutStyle.link, { fontSize: 8 }]}>
                  <Text>{link.linkUrl}</Text>
                </LinkComponent>
              </View>
            ))}
          </View>
        </View>
      )}
    </>
  )
}
