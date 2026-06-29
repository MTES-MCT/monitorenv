import { IMAGES_WIDTH_LANDSCAPE, IMAGES_WIDTH_PORTRAIT } from '@components/Form/Images/FileUploader'
import { ImageViewer } from '@components/Form/Images/ImageViewer'
import { StyledImageButton } from '@features/VigilanceArea/components/VigilanceAreaForm/style'
import { Accent, Button, Icon, Size } from '@mtes-mct/monitor-ui'
import { useState } from 'react'
import styled from 'styled-components'

import { type FileApi, Orientation } from '../types'
import { useFileConverter } from './hook/useFileConverter'

type FilePreviewProps = {
  files?: FileApi[]
  isSideWindow: boolean
  onDelete: (index: number) => void
}

export function FilePreview({ files, isSideWindow = false, onDelete }: FilePreviewProps) {
  const thumbnails = useFileConverter(files, isSideWindow)
  const [fileViewerCurrentIndex, setFileViewerCurrentIndex] = useState<number>(-1)
  const openFileViewer = (currentIndex: number) => {
    setFileViewerCurrentIndex(currentIndex)
  }

  return (
    <>
      <PreviewList>
        {thumbnails?.map((thumbnail, index) => (
          <PreviewImagesContainer key={thumbnail.id ?? thumbnail.name}>
            <StyledImageButton onClick={() => openFileViewer(index)} type="button">
              <img
                alt={thumbnail.name}
                height="82px"
                src={thumbnail.image}
                width={thumbnail.orientation === Orientation.LANDSCAPE ? IMAGES_WIDTH_LANDSCAPE : IMAGES_WIDTH_PORTRAIT}
              />
            </StyledImageButton>
            <StyledButton
              accent={Accent.SECONDARY}
              Icon={Icon.Delete}
              onClick={() => onDelete(index)}
              size={Size.SMALL}
            />
          </PreviewImagesContainer>
        ))}
      </PreviewList>
      {fileViewerCurrentIndex !== -1 && (
        <ImageViewer
          currentIndex={fileViewerCurrentIndex}
          images={thumbnails ?? []}
          isSideWindow={isSideWindow}
          onClose={() => setFileViewerCurrentIndex(-1)}
        />
      )}
    </>
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
