import { Links } from '@components/Form/Links/Links'
import { dashboardActions } from '@features/Dashboard/slice'
import { addSideWindowBanner } from '@features/SideWindow/useCases/addSideWindowBanner'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { FileUploader, Level, UploadMode } from '@mtes-mct/monitor-ui'
import { forwardRef, useCallback } from 'react'
import styled from 'styled-components'

import { Accordion, Title, TitleContainer } from '../Accordion'

import type { Link } from '@components/Form/types'
import type { FileApi } from '@mtes-mct/monitor-ui'

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

    const handleUploadError = useCallback(
      (errorMessage: string) => {
        dispatch(
          addSideWindowBanner({
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
          <FileUploader
            files={images}
            mode={UploadMode.IMAGES}
            onDelete={handleDeleteImage}
            onError={handleUploadError}
            onUpload={handleUploadImage}
          />
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
