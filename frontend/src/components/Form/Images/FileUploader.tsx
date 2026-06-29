import { TransparentButton } from '@components/style'
import { addMainWindowBanner } from '@features/MainWindow/useCases/addMainWindowBanner'
import { addSideWindowBanner } from '@features/SideWindow/useCases/addSideWindowBanner'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Accent, Button, Icon, IconButton, Label, Level, Size, useNewWindow } from '@mtes-mct/monitor-ui'
import React, { type ChangeEvent, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

import { type FileApi, Orientation } from '../types'
import { useFileConverter } from './hook/useFileConverter'
import { ImageViewer } from './ImageViewer'
import {
  areFilesValid,
  compressImage,
  createInMemoryImage,
  fileToBase64,
  getUploadParameters,
  humanFileSize
} from './utils'

export const IMAGES_WIDTH_LANDSCAPE = '122px'
export const IMAGES_WIDTH_PORTRAIT = '57px'

export type UploadMode = 'IMAGES' | 'DOCUMENTS' | 'FILES'
type FileUploaderProps = {
  files?: FileApi[]
  isSideWindow?: boolean
  mode: UploadMode
  onDelete: (images: FileApi[]) => void
  onUpload: (images: FileApi[]) => void
}

export function FileUploader({ files, isSideWindow = false, mode = 'IMAGES', onDelete, onUpload }: FileUploaderProps) {
  const parameter = getUploadParameters(mode)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const dispatch = useAppDispatch()

  const [fileViewerCurrentIndex, setFileViewerCurrentIndex] = useState<number>(-1)
  const [fileText, setFileText] = useState<string | undefined>(parameter?.message)
  const documents = useMemo(() => files?.filter(file => file.mimeType.includes('application/pdf')), [files])
  const fileFront = useFileConverter(files, isSideWindow)
  const { newWindowContainerRef } = useNewWindow()

  const uploadFileDisplay = async (filesToUpload: FileList) => {
    const uploadFiles = async () => {
      const compressedImages: FileApi[] = []
      try {
        await Promise.all(
          Array.from(filesToUpload).map(async file => {
            if (file.type.startsWith('image/')) {
              const { container, img } = createInMemoryImage(
                isSideWindow ? newWindowContainerRef.current : document.body,
                file
              )

              await img.decode()

              const base64Image = compressImage(img, file.type)
              container.remove()
              const content = base64Image.split(',')[1] ?? ''
              const compressedImageForApi = {
                content,
                mimeType: file.type,
                name: file.name,
                size: file.size
              }

              compressedImages.push(compressedImageForApi)
            } else {
              const content = await fileToBase64(file)
              compressedImages.push({
                content,
                mimeType: file.type,
                name: file.name,
                size: file.size
              })
            }
          })
        )

        onUpload([...(files ?? []), ...compressedImages])
      } catch (error) {
        const errorMessage = "Un problème est survenu lors de l'ajout du fichier. Veuillez recommencer"
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

    if (!areFilesValid(filesToUpload.length + (files ?? []).length, setFileText, mode)) {
      return
    }

    uploadFiles()
  }

  const deleteFile = (indexToRemove: number) => {
    const updatedFiles = (files ?? []).filter((__, index) => index !== indexToRemove)
    areFilesValid(updatedFiles.length, setFileText, mode)
    onDelete(updatedFiles)
  }

  const openFileViewer = (currentIndex: number) => {
    setFileViewerCurrentIndex(currentIndex)
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (!e.dataTransfer?.files) {
      return
    }
    uploadFileDisplay(e.dataTransfer.files)
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.currentTarget.files) {
      return
    }
    uploadFileDisplay(e.currentTarget.files)
  }

  return (
    <Wrapper
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Label>{parameter?.title}</Label>
      <LoadFileZone $isDragging={isDragging}>
        <Icon.Download />
        <TransparentButton onClick={() => inputRef.current?.click()}>
          <Underline>Charger</Underline> ou <Underline>glisser-déposer</Underline> une image
        </TransparentButton>

        <input
          ref={inputRef}
          accept={parameter?.acceptedFiles}
          hidden
          multiple
          onChange={handleFileSelect}
          type="file"
        />
        <Text $hasError={fileText !== parameter?.message}>{fileText}</Text>
      </LoadFileZone>
      <ul>
        {(mode === 'FILES' || mode === 'DOCUMENTS') &&
          documents?.map((file, index) => (
            <li key={file.id}>
              <FileItem>
                <Icon.Document />
                <span>
                  {file.name} <FileSize>{humanFileSize(file.size)}</FileSize>
                </span>
                <IconButton
                  accent={Accent.TERTIARY}
                  Icon={Icon.Close}
                  onClick={() => deleteFile(index)}
                  style={{ marginLeft: 'auto' }}
                />
              </FileItem>
            </li>
          ))}
      </ul>
      <PreviewList>
        {(mode === 'FILES' || mode === 'IMAGES') &&
          fileFront?.map((image, index) => (
            <PreviewImagesContainer key={image.id ?? image.name}>
              <StyledImageButton onClick={() => openFileViewer(index)} type="button">
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
                onClick={() => deleteFile(index)}
                size={Size.SMALL}
              />
            </PreviewImagesContainer>
          ))}
      </PreviewList>
      {fileViewerCurrentIndex !== -1 && (
        <ImageViewer
          currentIndex={fileViewerCurrentIndex}
          images={fileFront ?? []}
          isSideWindow={isSideWindow}
          onClose={() => setFileViewerCurrentIndex(-1)}
        />
      )}
    </Wrapper>
  )
}

const PreviewList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  list-style-type: none;
  margin-top: 10px;
  padding: 0;
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
  padding: 0;
`

const StyledButton = styled(Button)`
  background-color: ${p => p.theme.color.white};
  bottom: 4px;
  padding: 4px !important;
  position: absolute;
  right: 4px;

  > span {
    margin-right: 0 !important;

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

const Wrapper = styled.div`
  padding: 16px 20px;
`

const LoadFileZone = styled.div<{ $isDragging: boolean }>`
  align-items: center;
  border-width: 1px;
  border-style: dashed;
  display: flex;
  flex-direction: column;
  gap: 6px;
  justify-content: center;
  ${({ $isDragging, theme }) =>
    $isDragging &&
    `background-color: ${theme.color.blueYonder25}; border-color: ${theme.color.blueGray}; border-width: 1px;`}
  padding: 16px 20px;
`

const Underline = styled.span`
  text-decoration: underline;
`

const FileItem = styled.span`
  background: ${p => p.theme.color.gainsboro};
  display: flex;
  gap: 8px;
  padding: 8px 12px;
`
const FileSize = styled.span`
  white-space: pre;
`
