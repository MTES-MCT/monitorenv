import { DeleteModal } from '@features/commonComponents/Modals/Delete'
import { vigilanceAreaActions } from '@features/VigilanceArea/slice'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { deleteVigilanceArea } from '@features/VigilanceArea/useCases/deleteVigilanceArea'
import { saveVigilanceArea } from '@features/VigilanceArea/useCases/saveVigilanceArea'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Button, customDayjs, Icon, Size } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import { isEmpty } from 'lodash'
import { useMemo, useState } from 'react'
import styled from 'styled-components'

import { PublishedSchema } from './Schema'
import { DeleteButton, FooterContainer, FooterRightButtons } from './style'

const EMPTY_VALUE = '--'

export function VigilanceAreaPanel({ vigilanceArea }: { vigilanceArea: VigilanceArea.VigilanceArea | undefined }) {
  const dispatch = useAppDispatch()
  const selectedVigilanceAreaId = useAppSelector(state => state.vigilanceArea.selectedVigilanceAreaId)
  const editingVigilanceAreaId = useAppSelector(state => state.vigilanceArea.editingVigilanceAreaId)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

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
    ? customDayjs(vigilanceArea?.startDatePeriod).format('DD/MM/YYYY')
    : undefined
  const formattedEndPeriod = vigilanceArea?.endDatePeriod
    ? customDayjs(vigilanceArea?.endDatePeriod).format('DD/MM/YYYY')
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

  if (!vigilanceArea) {
    return null
  }

  return (
    <>
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
            </DateItem>
          </InlineItem>
          <InlineItem>
            <InlineItemLabel $isInline>Thématique</InlineItemLabel>
            <InlineItemValue>{vigilanceArea?.themes ? vigilanceArea?.themes.join(', ') : EMPTY_VALUE}</InlineItemValue>
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
          <InlineItemValue>{vigilanceArea?.comments ?? EMPTY_VALUE}</InlineItemValue>
        </SubPart>
        <SubPart>
          <InlineItemLabel>Liens utiles</InlineItemLabel>
          <InlineItemValue>
            {vigilanceArea?.links && vigilanceArea?.links.length > 0
              ? vigilanceArea?.links.map(link => (
                  <LinkContainer key={`${link.linkText}-${link.linkUrl}`}>
                    <LinkText>{link.linkText}</LinkText>
                    <LinkUrl href={link.linkUrl} rel="external" target="_blank">
                      {link.linkUrl}
                    </LinkUrl>
                  </LinkContainer>
                ))
              : EMPTY_VALUE}
          </InlineItemValue>
        </SubPart>
        <SubPart>
          <InternText>Section interne CACEM</InternText>
          <InlineItem>
            <InlineItemLabel $isInline>Crée le</InlineItemLabel>
            <InlineItemValue>{vigilanceArea?.createdBy ?? EMPTY_VALUE}</InlineItemValue>
          </InlineItem>
          <InlineItem>
            <InlineItemLabel $isInline>Source</InlineItemLabel>
            <InlineItemValue>{vigilanceArea?.source ?? EMPTY_VALUE}</InlineItemValue>
          </InlineItem>
        </SubPart>
      </Body>
      <FooterContainer>
        <DeleteButton accent={Accent.SECONDARY} Icon={Icon.Delete} onClick={onDelete} size={Size.SMALL}>
          Supprimer
        </DeleteButton>
        <FooterRightButtons>
          <Button accent={Accent.SECONDARY} onClick={edit} size={Size.SMALL}>
            Editer
          </Button>
          <Button disabled={!isFormValidForPublish} onClick={publish} size={Size.SMALL}>
            {vigilanceArea?.isDraft ? 'Publier' : 'Publiée'}
          </Button>
        </FooterRightButtons>
      </FooterContainer>
    </>
  )
}

const Body = styled.div`
  background-color: ${p => p.theme.color.white};
`
const SubPart = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  border-bottom: 1px solid ${p => p.theme.color.lightGray};
`

const InlineItem = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
`

const InlineItemLabel = styled.span<{ $isInline?: boolean }>`
  width: ${p => (p.$isInline ? '80px' : 'auto')};
  color: ${p => p.theme.color.slateGray};
  margin-bottom: 4px;
`

const InlineItemValue = styled.span`
  color: ${p => p.theme.color.gunMetal};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const DateItem = styled.div`
  display: flex;
  flex-direction: column;
`
const LinkContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const LinkText = styled.span`
  color: ${p => p.theme.color.gunMetal};
`

const LinkUrl = styled.a`
  color: #295edb;
`
const InternText = styled.span`
  color: ${p => p.theme.color.maximumRed};
  margin-bottom: 8px;
`
