import { addMainWindowBanner } from '@features/MainWindow/useCases/addMainWindowBanner'
import { Vessel } from '@features/Vessel/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { type FileApi, FileUploader, Level } from '@mtes-mct/monitor-ui'
import { useCallback } from 'react'
import styled from 'styled-components'

import { saveVesselFiles } from '../../../useCases/saveVesselFiles'

type AdditionalInformationProps = {
  vessel: Vessel.Vessel
}

export function AdditionalInformation({ vessel }: AdditionalInformationProps) {
  const dispatch = useAppDispatch()

  const onUpload = useCallback(
    (images: FileApi[]) => {
      const vesselId: Vessel.VesselId = {
        batchId: vessel.batchId,
        rowNumber: vessel.rowNumber,
        shipId: vessel.shipId
      }
      dispatch(saveVesselFiles(vesselId, images))
    },
    [dispatch, vessel.batchId, vessel.rowNumber, vessel.shipId]
  )

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
    <AttachmentsSection>
      <header>Pièce(s) jointe(s)</header>
      <StyledFileUploader
        files={vessel.files}
        mode="IMAGES"
        onDelete={onUpload}
        onError={onError}
        onUpload={onUpload}
      />
      <StyledFileUploader
        files={vessel.files}
        mode="DOCUMENTS"
        onDelete={onUpload}
        onError={onError}
        onUpload={onUpload}
      />
    </AttachmentsSection>
  )
}

const AttachmentsSection = styled.section`
  background-color: ${p => p.theme.color.white};
  header {
    background-color: ${p => p.theme.color.lightGray};
    padding: 10px 20px;
    color: ${p => p.theme.color.slateGray};
    font-weight: 500;
  }
`

const StyledFileUploader = styled(FileUploader)`
  padding: 16px 20px;
`
