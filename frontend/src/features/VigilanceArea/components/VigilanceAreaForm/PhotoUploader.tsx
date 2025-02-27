import { ImageUploader } from '@components/Form/Images/ImageUploader'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { useFormikContext } from 'formik'

export function PhotoUploader() {
  const { setFieldValue, values } = useFormikContext<VigilanceArea.VigilanceArea>()

  return (
    <ImageUploader
      images={values.images}
      onDelete={images => setFieldValue('images', images)}
      onUpload={images => setFieldValue('images', images)}
    />
  )
}
