import { DeleteModal } from '@features/commonComponents/Modals/Delete'
import { IMAGES_WIDTH_LANDSCAPE, IMAGES_WIDTH_PORTRAIT } from '@features/VigilanceArea/constants'
import { vigilanceAreaActions } from '@features/VigilanceArea/slice'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { deleteVigilanceArea } from '@features/VigilanceArea/useCases/deleteVigilanceArea'
import { saveVigilanceArea } from '@features/VigilanceArea/useCases/saveVigilanceArea'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Button, customDayjs, Icon, Size } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import { isEmpty } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { AMPList } from './AddAMPs/AMPList'
import { RegulatoryAreas } from './AddRegulatoryAreas/RegulatoryAreas'
import { ImageViewer } from './ImageViewer'
import { PublishedSchema } from './Schema'
import { DeleteButton, FooterContainer, FooterRightButtons } from './style'
import { getImages } from './utils'

const EMPTY_VALUE = '--'

export function VigilanceAreaPanel({ vigilanceArea }: { vigilanceArea: VigilanceArea.VigilanceArea | undefined }) {
  const dispatch = useAppDispatch()
  const selectedVigilanceAreaId = useAppSelector(state => state.vigilanceArea.selectedVigilanceAreaId)
  const editingVigilanceAreaId = useAppSelector(state => state.vigilanceArea.editingVigilanceAreaId)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [imageViewerCurrentIndex, setImageViewerCurrentIndex] = useState<number>(-1)
  const [imagesList, setImagesList] = useState<VigilanceArea.ImageForFrontProps[]>([])

  const { validateForm, values } = useFormikContext<VigilanceArea.VigilanceArea>()

  const isFormValidForPublish = useMemo(() => {
    try {
      PublishedSchema.validateSync(values, { abortEarly: false })

      return true
    } catch (e: any) {
      return false
    }
  }, [values])

  const formattedStartPeriod = vigilanceArea?.startDatePeriod
    ? customDayjs(vigilanceArea?.startDatePeriod).utc().format('DD/MM/YYYY')
    : undefined
  const formattedEndPeriod = vigilanceArea?.endDatePeriod
    ? customDayjs(vigilanceArea?.endDatePeriod).utc().format('DD/MM/YYYY')
    : undefined

  const onConfirmDeleteModal = () => {
    if (!vigilanceArea?.id) {
      return
    }

    dispatch(deleteVigilanceArea(vigilanceArea.id))
  }

  const onDelete = () => {
    setIsDeleteModalOpen(true)
  }

  const cancelDeleteModal = () => {
    setIsDeleteModalOpen(false)
  }

  const edit = () => {
    if (!editingVigilanceAreaId) {
      dispatch(vigilanceAreaActions.setEditingVigilanceAreaId(selectedVigilanceAreaId))

      return
    }
    if (!values.id) {
      return
    }
    dispatch(vigilanceAreaActions.openCancelModal(values.id))
  }

  const publish = () => {
    validateForm({ ...values, isDraft: false }).then(errors => {
      if (isEmpty(errors)) {
        dispatch(saveVigilanceArea({ ...values, isDraft: false }, true))
      }
    })
  }

  const frequencyText = () => {
    switch (vigilanceArea?.frequency) {
      case VigilanceArea.Frequency.ALL_YEARS:
        return 'Se répète tous les ans'
      case VigilanceArea.Frequency.ALL_MONTHS:
        return 'Se répète tous les mois'
      case VigilanceArea.Frequency.ALL_WEEKS:
        return 'Se répète toutes les semaines'
      case VigilanceArea.Frequency.NONE:
      default:
        return ''
    }
  }
  useEffect(() => {
    const fetchImages = async () => {
      const images = await getImages(values.images)
      setImagesList(images)
    }

    fetchImages()
  }, [values.images])

  const openImageViewer = (currentIndex: number) => {
    setImageViewerCurrentIndex(currentIndex)
  }

  const endingOccurenceText = () => {
    if (!vigilanceArea?.endingCondition) {
      return ''
    }

    if (vigilanceArea?.endingCondition === VigilanceArea.EndingCondition.NEVER) {
      return 'Pas de fin de récurrence'
    }

    return `Fin le ${customDayjs(vigilanceArea?.computedEndDate).utc().format('DD/MM/YYYY')}`
  }

  if (!vigilanceArea) {
    return null
  }

  return (
    <PanelContainer>
      <Body>
        <DeleteModal
          context="vigilance-area"
          isAbsolute={false}
          onCancel={cancelDeleteModal}
          onConfirm={onConfirmDeleteModal}
          open={isDeleteModalOpen}
          subTitle="Êtes-vous sûr de vouloir supprimer la zone de vigilance&nbsp;?"
          title="Supprimer la zone de vigilance&nbsp;?"
        />
        <SubPart>
          <InlineItem>
            <InlineItemLabel $isInline>Période</InlineItemLabel>
            <DateItem>
              <InlineItemValue>
                {formattedStartPeriod ? `Du ${formattedStartPeriod} au ${formattedEndPeriod}` : EMPTY_VALUE}
              </InlineItemValue>
              <InlineItemValue>{frequencyText()}</InlineItemValue>
              <StyledInlineItemValue>{endingOccurenceText()}</StyledInlineItemValue>
            </DateItem>
          </InlineItem>
          <InlineItem>
            <InlineItemLabel $isInline>Thématique</InlineItemLabel>
            <InlineItemValue $maxLine={2} title={vigilanceArea?.themes ? vigilanceArea?.themes.join(', ') : ''}>
              {vigilanceArea?.themes ? vigilanceArea?.themes.join(', ') : EMPTY_VALUE}
            </InlineItemValue>
          </InlineItem>
          <InlineItem>
            <InlineItemLabel $isInline>Visibilité</InlineItemLabel>
            <InlineItemValue>
              {vigilanceArea?.visibility ? VigilanceArea.VisibilityLabel[vigilanceArea?.visibility] : EMPTY_VALUE}
            </InlineItemValue>
          </InlineItem>
        </SubPart>
        <SubPart>
          <InlineItemLabel>Commentaire sur la zone</InlineItemLabel>
          <InlineItemValue $maxLine={8} title={vigilanceArea?.comments}>
            {vigilanceArea?.comments ?? EMPTY_VALUE}
          </InlineItemValue>
        </SubPart>
        {values?.linkedRegulatoryAreas && values?.linkedRegulatoryAreas.length > 0 && (
          <SubPart>
            <InlineItemLabel>Réglementations en lien</InlineItemLabel>
            <RegulatoryAreas isReadOnly linkedRegulatoryAreas={values?.linkedRegulatoryAreas} />
          </SubPart>
        )}
        {values?.linkedAMPs && values?.linkedAMPs.length > 0 && (
          <SubPart>
            <InlineItemLabel>AMP en lien</InlineItemLabel>
            <AMPList isReadOnly linkedAMPs={values?.linkedAMPs} />
          </SubPart>
        )}
        {imagesList.length > 0 && (
          <ImageContainer>
            {imagesList.map((image, index) => (
              <img
                key={Math.random()}
                alt="vigilance_area"
                aria-hidden="true"
                height="82px"
                onClick={() => openImageViewer(index)}
                src={image?.image}
                width={
                  image?.orientation === VigilanceArea.Orientation.LANDSCAPE
                    ? IMAGES_WIDTH_LANDSCAPE
                    : IMAGES_WIDTH_PORTRAIT
                }
              />
            ))}
          </ImageContainer>
        )}

        {vigilanceArea?.links && vigilanceArea?.links.length > 0 && (
          <SubPart>
            <InlineItemLabel>Liens utiles</InlineItemLabel>
            <InlineItemValue>
              {vigilanceArea?.links.map(link => (
                <LinkContainer key={`${link.linkText}-${link.linkUrl}`}>
                  <LinkText>{link.linkText}</LinkText>
                  <LinkUrl href={link.linkUrl} rel="external" target="_blank">
                    {link.linkUrl}
                  </LinkUrl>
                </LinkContainer>
              ))}
            </InlineItemValue>
          </SubPart>
        )}
        <SubPart>
          <InternText>Section interne CACEM</InternText>
          <InlineItem>
            <InlineItemLabel>Créé par</InlineItemLabel>
            <InlineItemValue>{vigilanceArea?.createdBy ?? EMPTY_VALUE}</InlineItemValue>
          </InlineItem>
          {vigilanceArea?.source && (
            <InlineItem>
              <InlineItemLabel>Source</InlineItemLabel>
              <InlineItemValue $maxLine={2} title={vigilanceArea?.source}>
                {vigilanceArea?.source}
              </InlineItemValue>
            </InlineItem>
          )}
        </SubPart>
        {imageViewerCurrentIndex >= 0 && (
          <ImageViewer
            currentIndex={imageViewerCurrentIndex}
            images={imagesList.map(image => image.image)}
            onClose={() => setImageViewerCurrentIndex(-1)}
          />
        )}
      </Body>
      <FooterContainer>
        <DeleteButton accent={Accent.SECONDARY} Icon={Icon.Delete} onClick={onDelete} size={Size.SMALL}>
          Supprimer
        </DeleteButton>
        <FooterRightButtons>
          <Button accent={Accent.SECONDARY} onClick={edit} size={Size.SMALL}>
            Editer
          </Button>
          <Button disabled={!isFormValidForPublish || !vigilanceArea?.isDraft} onClick={publish} size={Size.SMALL}>
            {vigilanceArea?.isDraft ? 'Publier' : 'Publiée'}
          </Button>
        </FooterRightButtons>
      </FooterContainer>
    </PanelContainer>
  )
}

const PanelContainer = styled.div`
  background-color: ${p => p.theme.color.white};
  box-shadow: 0px 1px 3px #707785b3;
  max-height: calc(100vh - 107px);
  display: flex;
  flex-direction: column;
  flex: 1;
`

const Body = styled.div`
  overflow-y: auto;
`

const SubPart = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px;
  border-bottom: 1px solid ${p => p.theme.color.lightGray};
`

const ImageContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 4px;
  padding: 16px;
  border-bottom: 1px solid ${p => p.theme.color.lightGray};
  > img {
    cursor: zoom-in;
  }
`

const InlineItem = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
`

const InlineItemLabel = styled.span<{ $isInline?: boolean }>`
  width: ${p => (p.$isInline ? '76px' : 'auto')};
  color: ${p => p.theme.color.slateGray};
  margin-bottom: 4px;
`

const InlineItemValue = styled.span<{ $maxLine?: number }>`
  color: ${p => p.theme.color.gunMetal};
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${p => p.$maxLine ?? '1'};
  overflow: hidden;
  white-space: pre-wrap;
`

const StyledInlineItemValue = styled(InlineItemValue)`
  margin-bottom: 4px;
`

const DateItem = styled.div`
  display: flex;
  flex-direction: column;
`
const LinkContainer = styled.div`
  display: flex;
  flex-direction: column;
  &:not(:last-child) {
    margin-bottom: 4px;
  }
`

const LinkText = styled.span`
  color: ${p => p.theme.color.gunMetal};
  font-weight: 500;
`

const LinkUrl = styled.a`
  color: #295edb;
`
const InternText = styled.span`
  color: ${p => p.theme.color.maximumRed};
  margin-bottom: 8px;
`
