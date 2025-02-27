import { Image, Link as LinkComponent, StyleSheet, Text, View } from '@react-pdf/renderer'

import { layoutStyle } from '../style'

import type { ImageFront, Link } from '@components/Form/types'

export const style = StyleSheet.create({
  image: {
    height: 179,
    objectFit: 'cover'
  },
  imageWrapper: {
    ...layoutStyle.row,
    flexWrap: 'wrap',
    gap: 7.4
  }
})

export function Attachments({ images, links }: { images?: ImageFront[]; links: Link[] }) {
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
      {images && images.length > 0 && (
        <View>
          <Text style={layoutStyle.header2}>Photos</Text>
          <View style={style.imageWrapper}>
            {images.map(image => (
              <Image key={image.id} src={image.image} style={style.image} />
            ))}
          </View>
        </View>
      )}
    </>
  )
}
