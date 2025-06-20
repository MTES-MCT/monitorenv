import { Orientation, type ImageFront } from '@components/Form/types'
import { Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'

import { Headings } from '../Layout/Headings'
import { layoutStyle } from '../style'

export const style = StyleSheet.create({
  imageContainer: {
    flexGrow: 1,
    justifyContent: 'center'
  },
  imageLandscape: {
    alignSelf: 'center',
    height: '500pt',
    objectFit: 'contain',
    width: 'auto'
  },
  imagePortrait: {
    alignSelf: 'center',
    maxHeight: '650pt',
    objectFit: 'contain',
    width: '100%'
  }
})

export function ImagesAttachments({
  briefName,
  images,
  withPageTitle
}: {
  briefName: string
  images?: ImageFront[]
  withPageTitle: boolean
}) {
  return (
    <>
      {images?.map((image, index) => {
        const isLandscape = image.orientation === Orientation.LANDSCAPE
        const imageStyle = isLandscape ? style.imageLandscape : style.imagePortrait

        return (
          <Page key={image.name} orientation={image.orientation} size="A4" style={[layoutStyle.page]}>
            <Headings name={briefName} />
            {withPageTitle && index === 0 && (
              <View style={layoutStyle.header1}>
                <Text>Pièces jointes</Text>
              </View>
            )}
            {index === 0 && <Text style={layoutStyle.header2}>Photos</Text>}
            <View style={[layoutStyle.section, style.imageContainer]}>
              <Image src={image.image} style={imageStyle} />
            </View>
          </Page>
        )
      })}
    </>
  )
}
