import { addMainWindowBanner } from '@features/MainWindow/useCases/addMainWindowBanner'
import { addSideWindowBanner } from '@features/SideWindow/useCases/addSideWindowBanner'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Accent, Button, Icon, Label, Level, Size, useNewWindow } from '@mtes-mct/monitor-ui'
import { useRef, useState } from 'react'
import styled from 'styled-components'

import { Orientation, type ImageApi } from '../types'
import { useImageConverter } from './hook/useImageConverter'
import { ImageViewer } from './ImageViewer'
import { areFilesValid, compressImage, createInMemoryImage, IMAGES_INFORMATIONS_TEXT } from './utils'

export const IMAGES_WIDTH_LANDSCAPE = '122px'
export const IMAGES_WIDTH_PORTRAIT = '57px'

type ImageUploaderProps = {
  images?: ImageApi[]
  isSideWindow?: boolean
  onDelete: (images: ImageApi[]) => void
  onUpload: (images: ImageApi[]) => void
}

export function ImageUploader({ images, isSideWindow = false, onDelete, onUpload }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const dispatch = useAppDispatch()

  const [imageViewerCurrentIndex, setImageViewerCurrentIndex] = useState<number>(-1)
  const [imagesText, setImagesText] = useState<string>(IMAGES_INFORMATIONS_TEXT)
  const imagesFront = useImageConverter(images, isSideWindow)
  const { newWindowContainerRef } = useNewWindow()

  const handleFileChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { current } = inputRef
    e.preventDefault()
    current?.click()
  }

  const uploadImageDisplay = async () => {
    const { current } = inputRef

    if (!current?.files) {
      return
    }

    const uploadImages = async (filesToUpload: FileList) => {
      const compressedImages: ImageApi[] = []
      try {
        await Promise.all(
          Array.from(filesToUpload).map(async file => {
            const { container, img } = createInMemoryImage(
              isSideWindow ? newWindowContainerRef.current : document.body,
              file
            )

            await img.decode()
            const base64Image = compressImage(img, file.type)
            const content = base64Image.split(',')[1] ?? ''
            const compressedImageForApi = {
              content,
              mimeType: file.type,
              name: file.name,
              size: file.size
            }
            if (isSideWindow) {
              newWindowContainerRef.current.removeChild(container)
            } else {
              document.body.removeChild(container)
            }
            compressedImages.push(compressedImageForApi)
          })
        )

        onUpload([...(images ?? []), ...compressedImages])
      } catch (error) {
        const errorMessage = "Un problème est survenu lors de l'ajout de la photo. Veuillez recommencer"
        dispatch(
          isSideWindow
            ? addSideWindowBanner({
                children: errorMessage,
                isClosable: true,
                isFixed: true,
                level: Level.ERROR,
                withAutomaticClosing: true
              })
            : addMainWindowBanner({
                children: errorMessage,
                isClosable: true,
                isFixed: true,
                level: Level.ERROR,
                withAutomaticClosing: true
              })
        )
      }
    }

    if (!areFilesValid(current.files.length + (images ?? []).length, setImagesText)) {
      return
    }

    uploadImages(current.files)
  }

  const deleteImage = (indexToRemove: number) => {
    const updatedImages = (images ?? []).filter((__, index) => index !== indexToRemove)
    areFilesValid(updatedImages.length, setImagesText)
    onDelete(updatedImages)
  }
  const openImageViewer = (currentIndex: number) => {
    setImageViewerCurrentIndex(currentIndex)
  }

  return (
    <div>
      <Label>Image</Label>

      <input
        ref={inputRef}
        accept="image/png, image/jpeg, image/webp"
        hidden
        multiple
        onChange={uploadImageDisplay}
        type="file"
      />
      <Button
        accent={Accent.SECONDARY}
        disabled={imagesFront && imagesFront.length >= 5}
        Icon={Icon.Plus}
        isFullWidth
        onClick={handleFileChange}
      >
        Ajouter une image
      </Button>
      <Text $hasError={imagesText !== IMAGES_INFORMATIONS_TEXT}>{imagesText}</Text>
      <PreviewList>
        {imagesFront?.map((image, index) => (
          <PreviewImagesContainer key={image.id ?? image.name}>
            <StyledImageButton onClick={() => openImageViewer(index)} type="button">
              <img
                alt={image.name}
                height="82px"
                src={image.image}
                width={image.orientation === Orientation.LANDSCAPE ? IMAGES_WIDTH_LANDSCAPE : IMAGES_WIDTH_PORTRAIT}
              />
            </StyledImageButton>
            <StyledButton
              accent={Accent.SECONDARY}
              Icon={Icon.Delete}
              onClick={() => deleteImage(index)}
              size={Size.SMALL}
            />
          </PreviewImagesContainer>
        ))}
      </PreviewList>
      {imageViewerCurrentIndex !== -1 && (
        <ImageViewer
          currentIndex={imageViewerCurrentIndex}
          images={imagesFront ?? []}
          isSideWindow={isSideWindow}
          onClose={() => setImageViewerCurrentIndex(-1)}
        />
      )}
    </div>
  )
}

const PreviewList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  list-style-type: none;
  margin-top: 10px;
  padding: 0px;
`

const PreviewImagesContainer = styled.li`
  position: relative;
  > button > img {
    object-fit: cover;
  }
`

const StyledImageButton = styled.button`
  cursor: zoom-in;
  background: none;
  border: none;
  padding: 0px;
`

const StyledButton = styled(Button)`
  background-color: ${p => p.theme.color.white};
  bottom: 4px;
  padding: 4px !important;
  position: absolute;
  right: 4px;
  > span {
    margin-right: 0px !important;
    > svg {
      height: 16px;
      width: 16px;
    }
  }
`

const Text = styled.p<{ $hasError: boolean }>`
  color: ${p => (p.$hasError ? p.theme.color.maximumRed : p.theme.color.slateGray)};
  font-style: italic;
  margin-bottom: 4px;
  margin-top: 4px;
`
