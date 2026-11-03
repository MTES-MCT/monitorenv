import { Bold } from '@components/style'
import { addMainWindowBanner } from '@features/MainWindow/useCases/addMainWindowBanner'
import { editReportingInLocalStore } from '@features/Reportings/useCases/editReportingInLocalStore'
import { getFormattedReportingId } from '@features/Reportings/utils'
import { Vessel } from '@features/Vessel/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import {
  Accent,
  type FileApi,
  FilePreview,
  FileUploader,
  Icon,
  IconButton,
  Label,
  Level,
  THEME
} from '@mtes-mct/monitor-ui'
import { getDateAsLocalizedStringVeryCompact } from '@utils/getDateAsLocalizedString'
import { useCallback } from 'react'
import styled from 'styled-components'

import { ReportingContext } from '../../../../../domain/shared_slices/Global'
import { saveVesselFiles } from '../../../useCases/saveVesselFiles'

import type { Reporting } from '../../../../../domain/entities/reporting'

type AdditionalInformationProps = {
  reportings: Reporting[]
  vessel: Vessel.Vessel
}

export function AdditionalInformation({ reportings, vessel }: AdditionalInformationProps) {
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

  const goToReporting = (id: number) => {
    dispatch(editReportingInLocalStore(id, ReportingContext.MAP))
  }

  return (
    <>
      <AttachmentsSection>
        <header>Pièce(s) jointe(s)</header>
        <Wrapper>
          <FileUploader
            key="images"
            files={vessel.files}
            mode="IMAGES"
            onDelete={onUpload}
            onError={onError}
            onUpload={onUpload}
          />
          <FileUploader
            key="documents"
            files={vessel.files}
            mode="DOCUMENTS"
            onDelete={onUpload}
            onError={onError}
            onUpload={onUpload}
          />
        </Wrapper>
      </AttachmentsSection>
      {reportings.some(reporting => !!reporting.images?.length) && (
        <AttachmentsSection>
          <header>Documents ajoutés lors de contrôles et signalements</header>
          {reportings.map(reporting => (
            <Wrapper key={reporting.id}>
              <TitleWrapper>
                <Label>
                  Signalement <Bold>{getFormattedReportingId(reporting.reportingId)}</Bold> du{' '}
                  {getDateAsLocalizedStringVeryCompact(reporting.createdAt, true, true, 'HH MMM')}
                </Label>
                <IconButton
                  accent={Accent.TERTIARY}
                  color={THEME.color.slateGray}
                  Icon={Icon.Edit}
                  onClick={() => goToReporting(+reporting.id)}
                  title="Éditer le signalement"
                />
              </TitleWrapper>
              <FilePreview files={reporting.images} isSideWindow={false} />
            </Wrapper>
          ))}
        </AttachmentsSection>
      )}
    </>
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

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 20px;
`

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
