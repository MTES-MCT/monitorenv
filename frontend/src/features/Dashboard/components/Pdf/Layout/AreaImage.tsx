import { Image, View } from '@react-pdf/renderer'

import { areaStyle } from '../style'

export function AreaImage({ image, minimap }: { image: string | undefined; minimap: string | undefined }) {
  return (
    <>
      {image && (
        <Image
          src={image}
          style={{
            height: 350,
            objectFit: 'cover',
            width: '100%'
          }}
        />
      )}

      {minimap && (
        <View style={areaStyle.minimap}>
          <Image
            src={minimap}
            style={{
              objectFit: 'cover'
            }}
          />
        </View>
      )}
    </>
  )
}
