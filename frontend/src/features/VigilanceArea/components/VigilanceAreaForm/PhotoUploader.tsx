import { addMainWindowBanner } from '@features/MainWindow/useCases/addMainWindowBanner'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { FileUploader, Level, UploadMode } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import { useCallback } from 'react'

export function PhotoUploader() {
  const dispatch = useAppDispatch()
  const { setFieldValue, values } = useFormikContext<VigilanceArea.VigilanceArea>()
  const onError = useCallback(
    (errorMessage: string) => {
      dispatch(
        addMainWindowBanner({
          children: errorMessage,
          isClosable: true,
          isFixed: true,
          level: Level.ERROR,
          withAutomaticClosing: true
        })
      )
    },
    [dispatch]
  )

  return (
    <FileUploader
      files={values.images}
      mode={UploadMode.IMAGES}
      onDelete={images => setFieldValue('images', images)}
      onError={onError}
      onUpload={images => setFieldValue('images', images)}
    />
  )
}
