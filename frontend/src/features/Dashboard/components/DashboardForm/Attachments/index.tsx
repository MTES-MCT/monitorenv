import { ImageUploader } from '@components/Form/Images/ImageUploader'
import { Links } from '@components/Form/Links/Links'
import { dashboardActions } from '@features/Dashboard/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { forwardRef } from 'react'
import styled from 'styled-components'

import { Accordion, Title, TitleContainer } from '../Accordion'

import type { FileApi, Link } from '@components/Form/types'

type AttachmentsProps = {
  images: FileApi[]
  isExpanded: boolean
  links: Link[]
  setExpandedAccordion: () => void
}

export const Attachments = forwardRef<HTMLDivElement, AttachmentsProps>(
  ({ images, isExpanded, links, setExpandedAccordion }, ref) => {
    const dispatch = useAppDispatch()
    const handleDeleteLink = (updatedLink: Link[]) => {
      dispatch(dashboardActions.setLinks(updatedLink))
    }

    const handleValidateLink = (updatedLink: Link[]) => {
      dispatch(dashboardActions.setLinks(updatedLink))
    }

    const handleDeleteImage = (updatedImages: FileApi[]) => {
      dispatch(dashboardActions.setImages(updatedImages))
    }

    const handleUploadImage = (updatedImages: FileApi[]) => {
      dispatch(dashboardActions.setImages(updatedImages))
    }

    return (
      <Accordion
        isExpanded={isExpanded}
        setExpandedAccordion={setExpandedAccordion}
        title={
          <TitleContainer>
            <Title>Pièces jointes</Title>
          </TitleContainer>
        }
        titleRef={ref}
      >
        <StyledContainer>
          <Links links={links} onDelete={handleDeleteLink} onValidate={handleValidateLink} />
          <ImageUploader files={images} isSideWindow onDelete={handleDeleteImage} onUpload={handleUploadImage} />
        </StyledContainer>
      </Accordion>
    )
  }
)

const StyledContainer = styled.div`
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`
