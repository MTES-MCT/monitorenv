import { FileList } from '@components/Form/Images/FileList'
import { FilePreview } from '@components/Form/Images/FilePreview'
import { TransparentButton } from '@components/style'
import { addMainWindowBanner } from '@features/MainWindow/useCases/addMainWindowBanner'
import { addSideWindowBanner } from '@features/SideWindow/useCases/addSideWindowBanner'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Icon, Label, Level, useNewWindow } from '@mtes-mct/monitor-ui'
import React, { type ChangeEvent, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

import { type FileApi } from '../types'
import { areFilesValid, compressImage, createInMemoryImage, fileToBase64, getUploadParameters } from './utils'

export const IMAGES_WIDTH_LANDSCAPE = '122px'
export const IMAGES_WIDTH_PORTRAIT = '57px'

export type UploadMode = 'IMAGES' | 'DOCUMENTS' | 'FILES'

type FileUploaderProps = {
  files?: FileApi[]
  isSideWindow?: boolean
  mode: UploadMode
  onDelete: (files: FileApi[]) => void
  onUpload: (files: FileApi[]) => void
}

export function FileUploader({ files, isSideWindow = false, mode = 'IMAGES', onDelete, onUpload }: FileUploaderProps) {
  const parameter = getUploadParameters(mode)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const dispatch = useAppDispatch()

  const [fileText, setFileText] = useState<string | undefined>(parameter?.warningMessage)
  const documents = useMemo(() => files?.filter(file => file.mimeType.includes('application/pdf')), [files])
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
      <Container>
        <LoadFileZone $isDragging={isDragging}>
          <Icon.Download />
          <TransparentButton onClick={() => inputRef.current?.click()}>
            <Underline>Charger</Underline> ou <Underline>glisser-déposer</Underline> {parameter?.suffixMessage}
          </TransparentButton>

          <input
            ref={inputRef}
            accept={parameter?.acceptedFiles}
            hidden
            multiple
            onChange={handleFileSelect}
            type="file"
          />
          <Text $hasError={fileText !== parameter?.warningMessage}>{fileText}</Text>
        </LoadFileZone>
        {(mode === 'FILES' || mode === 'DOCUMENTS') && (
          <FileList files={documents} onDelete={index => deleteFile(index)} />
        )}
        {(mode === 'FILES' || mode === 'IMAGES') && (
          <FilePreview files={files} isSideWindow={isSideWindow} onDelete={index => deleteFile(index)} />
        )}
      </Container>
    </Wrapper>
  )
}

const Text = styled.p<{ $hasError: boolean }>`
  color: ${p => (p.$hasError ? p.theme.color.maximumRed : p.theme.color.slateGray)};
  font-style: italic;
  margin-bottom: 4px;
  margin-top: 4px;
`

const Wrapper = styled.div`
  padding: 16px 20px;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
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
