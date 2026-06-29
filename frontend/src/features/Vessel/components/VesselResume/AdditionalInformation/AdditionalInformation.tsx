import { Vessel } from '@features/Vessel/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useCallback } from 'react'
import styled from 'styled-components'

import { FileUploader } from '../../../../../components/Form/Images/FileUploader'
import { saveVesselFiles } from '../../../useCases/saveVesselFiles'

import type { FileApi } from '@components/Form/types'

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

  return (
    <AttachmentsSection>
      <header>Pièce(s) jointe(s)</header>
      <FileUploader files={vessel.files} mode="IMAGES" onDelete={onUpload} onUpload={onUpload} />
      <FileUploader files={vessel.files} mode="DOCUMENTS" onDelete={onUpload} onUpload={onUpload} />
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
