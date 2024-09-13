import { addMainWindowBanner } from '@features/MainWindow/useCases/addMainWindowBanner'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Accent, Button, Icon, Label, Level, Size } from '@mtes-mct/monitor-ui'
import Compressor from 'compressorjs'
import { useFormikContext } from 'formik'
import { forwardRef, useState } from 'react'
import styled from 'styled-components'

import { ImageViewer } from './ImageViewer'

const IMAGES_INFORMATIONS_TEXT = '5 photos maximum'
const IMAGES_INFORMATIONS_LIMIT_MAX_ERROR = "Vous avez atteint le nombre maximum d'images"
const IMAGES_INFORMATIONS_REACHED_LIMIT_ERROR = 'Vous ne pouvez charger que 5 images au total'

const getBase64 = async (file: Blob) =>
  new Promise<string>(resolve => {
    let baseURL = ''

    const reader = new FileReader()

    reader.readAsDataURL(file)
    reader.onload = () => {
      baseURL = reader.result as string

      resolve(baseURL)
    }
  })

export function PhotoUploaderWithRef(_, ref) {
  const { setFieldValue, values } = useFormikContext<VigilanceArea.VigilanceArea>()
  const dispatch = useAppDispatch()

  const [imageViewerCurrentIndex, setImageViewerCurrentIndex] = useState<number>(-1)
  const [imagesText, setImagesText] = useState<string>(IMAGES_INFORMATIONS_TEXT)
  const [imagesList, setImagesList] = useState<VigilanceArea.ImageForFrontProps[]>([])

  const handleFileChange = e => {
    const { current } = ref
    e.preventDefault()
    current?.click()
    setImagesText(IMAGES_INFORMATIONS_TEXT)
  }

  const uploadImageDisplay = async () => {
    const { current } = ref
    if (!current) {
      return
    }

    if ([...current.files].length + imagesList.length > 5) {
      setImagesText(IMAGES_INFORMATIONS_REACHED_LIMIT_ERROR)

      return
    }

    const tempImageListForFront = [] as VigilanceArea.ImageForFrontProps[]
    const tempImageList = [] as VigilanceArea.ImagePropsForApi[]
    try {
      await Promise.all(
        [...current.files].map(async file => {
          const img = new Image()
          img.src = URL.createObjectURL(file)

          await img.decode()
          const { naturalHeight, naturalWidth } = img

          await new Promise<void>((resolve, reject) => {
            // eslint-disable-next-line no-new
            new Compressor(file, {
              error(err) {
                reject(err)
              },
              quality: 0.4,
              async success(result) {
                try {
                  const base64Image = await getBase64(result)
                  const base64String = base64Image.split(',')[1] ?? ''
                  const compressedImage = {
                    content: base64String,
                    mimeType: result.type,
                    name: file.name,
                    size: result.size,
                    vigilanceAreaId: values.id
                  }
                  const compressedImageForFront = {
                    image: base64Image,
                    orientation:
                      naturalWidth > naturalHeight
                        ? VigilanceArea.Orientation.LANDSCAPE
                        : VigilanceArea.Orientation.PORTAIT
                  }

                  tempImageListForFront.push(compressedImageForFront)
                  tempImageList.push(compressedImage)
                  resolve()
                } catch (error) {
                  reject(error)
                }
              }
            })
          })
        })
      )

      if (tempImageList.length + imagesList.length === 5) {
        setImagesText(IMAGES_INFORMATIONS_LIMIT_MAX_ERROR)
      }

      setFieldValue('images', [...values.images, ...tempImageList])
      setImagesList([...imagesList, ...tempImageListForFront])
    } catch (error) {
      dispatch(
        addMainWindowBanner({
          children: "Un problème est survenu lors de l'ajout de la photo. Veuillez recommencer",
          isClosable: true,
          isFixed: true,
          level: Level.ERROR,
          withAutomaticClosing: true
        })
      )
    }
  }

  const deleteImage = (idToRemove: string | undefined) => {
    if (!imagesList || !idToRemove) {
      return
    }

    const newFileList = [...imagesList].filter(file => file?.id !== idToRemove)

    setImagesList(newFileList)

    if (imagesList.length === 5) {
      setImagesText(IMAGES_INFORMATIONS_TEXT)
    }
  }
  const openImageViewer = (currentIndex: number) => {
    setImageViewerCurrentIndex(currentIndex)
  }

  return (
    <div>
      <Label>Image</Label>

      <input ref={ref} accept="image/*" hidden id="file" multiple onChange={uploadImageDisplay} type="file" />
      <Button
        accent={Accent.SECONDARY}
        disabled={imagesList.length >= 5}
        Icon={Icon.Plus}
        isFullWidth
        onClick={handleFileChange}
        title="Ajouter une image"
      >
        Ajouter une image
      </Button>
      <Text $hasError={imagesText !== IMAGES_INFORMATIONS_TEXT}>{imagesText}</Text>
      <PreviewList>
        {imagesList &&
          imagesList.map((image, index) => (
            <PreviewContainer key={Math.random()}>
              <img
                alt="vigilance_area"
                aria-hidden="true"
                height="82px"
                onClick={() => openImageViewer(index)}
                src={image?.image}
                width={image?.orientation === VigilanceArea.Orientation.LANDSCAPE ? '122px' : '57px'}
              />
              <StyledButton
                accent={Accent.SECONDARY}
                Icon={Icon.Delete}
                onClick={() => deleteImage(image?.id)}
                size={Size.SMALL}
              />
            </PreviewContainer>
          ))}
      </PreviewList>
      {imageViewerCurrentIndex >= 0 && (
        <ImageViewer
          currentIndex={imageViewerCurrentIndex}
          images={imagesList.map(image => image.image)}
          onClose={() => setImageViewerCurrentIndex(-1)}
        />
      )}
    </div>
  )
}

export const PhotoUploader = forwardRef(PhotoUploaderWithRef)

const PreviewContainer = styled.div`
  position: relative;
`
const PreviewList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`
const StyledButton = styled(Button)`
  background-color: ${p => p.theme.color.white};
  bottom: 4px;
  padding: 4px !important;
  position: absolute;
  right: 4px;
  > span {
    margin-right: 0px !important;
  }
`
const Text = styled.p<{ $hasError: boolean }>`
  color: ${p => (p.$hasError ? p.theme.color.maximumRed : p.theme.color.slateGray)};
  font-style: italic;
  margin-bottom: 4px;
  margin-top: 4px;
`
