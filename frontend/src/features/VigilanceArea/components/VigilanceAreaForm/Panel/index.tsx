import { DeleteModal } from '@features/commonComponents/Modals/Delete'
import { PanelDates } from '@features/VigilanceArea/components/VigilanceAreaForm/Panel/PanelDates'
import { isFormValid } from '@features/VigilanceArea/components/VigilanceAreaForm/utils'
import { vigilanceAreaActions } from '@features/VigilanceArea/slice'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { deleteVigilanceArea } from '@features/VigilanceArea/useCases/deleteVigilanceArea'
import { publish } from '@features/VigilanceArea/useCases/publish'
import { saveVigilanceArea } from '@features/VigilanceArea/useCases/saveVigilanceArea'
import { unpublish } from '@features/VigilanceArea/useCases/unpublish'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Button, customDayjs, Icon, Size } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import { isEmpty } from 'lodash'
import { useMemo, useState } from 'react'

import { PanelComments } from './PanelComments'
import { PanelImages } from './PanelImages'
import { PanelLinks } from './PanelLinks'
import { PanelPeriodAndThemes } from './PanelPeriodAndThemes'
import { PanelSource } from './PanelSource'
import { AMPList } from '../AddAMPs/AMPList'
import { RegulatoryAreas } from '../AddRegulatoryAreas/RegulatoryAreas'
import {
  DeleteButton,
  FooterContainer,
  FooterRightButtons,
  PanelBody,
  PanelContainer,
  PanelInlineItemLabel,
  PanelSubPart
} from '../style'

export function VigilanceAreaPanel({
  isSuperUser,
  vigilanceArea
}: {
  isSuperUser: boolean
  vigilanceArea: VigilanceArea.VigilanceArea | undefined
}) {
  const dispatch = useAppDispatch()

  const selectedVigilanceAreaId = useAppSelector(state => state.vigilanceArea.selectedVigilanceAreaId)
  const editingVigilanceAreaId = useAppSelector(state => state.vigilanceArea.editingVigilanceAreaId)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const { validateForm, values } = useFormikContext<VigilanceArea.VigilanceArea>()

  const isValid = useMemo(() => isFormValid(vigilanceArea), [vigilanceArea])

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

  const onEdit = () => {
    if (!editingVigilanceAreaId) {
      dispatch(vigilanceAreaActions.setEditingVigilanceAreaId(selectedVigilanceAreaId))

      return
    }
    if (!values.id) {
      return
    }
    dispatch(vigilanceAreaActions.openCancelModal(values.id))
  }

  const validate = () => {
    dispatch(saveVigilanceArea({ ...values, validatedAt: customDayjs().utc().toISOString() }, false))
  }

  const onPublish = () => {
    validateForm({ ...values, isDraft: false }).then(errors => {
      if (isEmpty(errors)) {
        dispatch(publish(values))
      }
    })
  }

  const onUnpublish = () => {
    validateForm({ ...values, isDraft: true }).then(errors => {
      if (isEmpty(errors)) {
        dispatch(unpublish(values))
      }
    })
  }

  if (!vigilanceArea) {
    return null
  }

  return (
    <PanelContainer>
      <PanelBody>
        <DeleteModal
          context="vigilance-area"
          isAbsolute={false}
          onCancel={cancelDeleteModal}
          onConfirm={onConfirmDeleteModal}
          open={isDeleteModalOpen}
          subTitle="Êtes-vous sûr de vouloir supprimer la zone de vigilance&nbsp;?"
          title="Supprimer la zone de vigilance&nbsp;?"
        />
        <PanelDates onValidate={validate} vigilanceArea={vigilanceArea} />
        <PanelPeriodAndThemes vigilanceArea={vigilanceArea} />
        <PanelComments comments={vigilanceArea?.comments} />
        {values?.linkedRegulatoryAreas && values?.linkedRegulatoryAreas.length > 0 && (
          <PanelSubPart>
            <PanelInlineItemLabel>Réglementations en lien</PanelInlineItemLabel>
            <RegulatoryAreas isReadOnly linkedRegulatoryAreas={values?.linkedRegulatoryAreas} />
          </PanelSubPart>
        )}
        {values?.linkedAMPs && values?.linkedAMPs.length > 0 && (
          <PanelSubPart>
            <PanelInlineItemLabel>AMP en lien</PanelInlineItemLabel>
            <AMPList isReadOnly linkedAMPs={values?.linkedAMPs} />
          </PanelSubPart>
        )}
        {values.images && values.images.length > 0 && (
          <PanelImages images={values.images} vigilanceAreaName={vigilanceArea?.name} />
        )}

        {vigilanceArea?.links && vigilanceArea?.links.length > 0 && <PanelLinks links={vigilanceArea.links} />}
        {isSuperUser && <PanelSource createdBy={vigilanceArea?.createdBy} source={vigilanceArea?.source} />}
      </PanelBody>
      {isSuperUser && (
        <FooterContainer>
          <DeleteButton accent={Accent.SECONDARY} Icon={Icon.Delete} onClick={onDelete} size={Size.SMALL}>
            Supprimer
          </DeleteButton>
          <FooterRightButtons>
            <Button accent={Accent.SECONDARY} onClick={onEdit} size={Size.SMALL}>
              Editer
            </Button>
            {vigilanceArea?.isDraft ? (
              <Button disabled={!isValid} onClick={onPublish} size={Size.SMALL}>
                Publier
              </Button>
            ) : (
              <Button disabled={!isValid} onClick={onUnpublish} size={Size.SMALL}>
                Dépublier
              </Button>
            )}
          </FooterRightButtons>
        </FooterContainer>
      )}
    </PanelContainer>
  )
}
