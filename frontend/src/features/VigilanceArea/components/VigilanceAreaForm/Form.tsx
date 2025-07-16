import { useGetTagsQuery } from '@api/tagsAPI'
import { useGetThemesQuery } from '@api/themesAPI'
import { Tooltip } from '@components/Tooltip'
import { ZonePicker } from '@components/ZonePicker'
import { CancelEditDialog } from '@features/commonComponents/Modals/CancelEditModal'
import { DeleteModal } from '@features/commonComponents/Modals/Delete'
import { NEW_VIGILANCE_AREA_ID } from '@features/VigilanceArea/constants'
import { vigilanceAreaActions, VigilanceAreaFormTypeOpen } from '@features/VigilanceArea/slice'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { deleteVigilanceArea } from '@features/VigilanceArea/useCases/deleteVigilanceArea'
import { hideLayers } from '@features/VigilanceArea/useCases/hideLayers'
import { publish } from '@features/VigilanceArea/useCases/publish'
import { saveVigilanceArea } from '@features/VigilanceArea/useCases/saveVigilanceArea'
import { unpublish } from '@features/VigilanceArea/useCases/unpublish'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import {
  CheckTreePicker,
  type DateAsStringRange,
  DateRangePicker,
  FormikCheckbox,
  FormikMultiRadio,
  FormikTextarea,
  FormikTextInput,
  getOptionsFromLabelledEnum,
  THEME
} from '@mtes-mct/monitor-ui'
import { getTagsAsOptions, parseOptionsToTags } from '@utils/getTagsAsOptions'
import { getThemesAsOptions, parseOptionsToThemes } from '@utils/getThemesAsOptions'
import { InteractionListener } from 'domain/entities/map/constants'
import { useFormikContext } from 'formik'
import { isEmpty } from 'lodash'
import { useMemo, useState } from 'react'
import styled from 'styled-components'

import { AddAMPs } from './AddAMPs'
import { AddRegulatoryAreas } from './AddRegulatoryAreas'
import { Footer } from './Footer'
import { Frequency } from './Frequency'
import { Links } from './Links'
import { PhotoUploader } from './PhotoUploader'

export function Form() {
  const dispatch = useAppDispatch()
  const isCancelModalOpen = useAppSelector(state => state.vigilanceArea.isCancelModalOpen)
  const {
    dirty,
    errors: formErrors,
    setFieldValue,
    validateForm,
    values
  } = useFormikContext<VigilanceArea.VigilanceArea>()

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const visibilityOptions = getOptionsFromLabelledEnum(VigilanceArea.VisibilityLabel)

  const { data: tags } = useGetTagsQuery()

  const tagsOptions = useMemo(() => getTagsAsOptions(Object.values(tags ?? [])), [tags])

  const { data: themes } = useGetThemesQuery()

  const themesOptions = useMemo(() => getThemesAsOptions(Object.values(themes ?? [])), [themes])
  // const regulatoryTagsCustomSearch = useMemo(() => new CustomSearch(tagsOptions, ['label']), [tagsOptions])

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

  const cancel = () => {
    if (dirty) {
      dispatch(vigilanceAreaActions.openCancelModal(values.id ?? NEW_VIGILANCE_AREA_ID))

      return
    }
    dispatch(vigilanceAreaActions.resetEditingVigilanceAreaState())
  }

  const onCancelEditModal = () => {
    dispatch(vigilanceAreaActions.closeCancelModal())
  }

  const onConfirmEditModal = () => {
    dispatch(vigilanceAreaActions.closeMainForm())
  }

  const onSave = () => {
    validateForm({ ...values }).then(errors => {
      if (isEmpty(errors)) {
        dispatch(saveVigilanceArea(values))
      }
    })
  }

  const onDelete = () => {
    setIsDeleteModalOpen(true)
  }

  const cancelDeleteModal = () => {
    setIsDeleteModalOpen(false)
  }

  const onConfirmDeleteModal = () => {
    if (!values.id) {
      return
    }

    dispatch(deleteVigilanceArea(values.id))
  }

  const deleteZone = index => {
    if (!values.geom) {
      return
    }
    const coordinates = [...values.geom.coordinates]
    coordinates.splice(index, 1)
    setFieldValue('geom', { ...values.geom, coordinates })
    dispatch(vigilanceAreaActions.setGeometry({ ...values.geom, coordinates }))
  }

  const addZone = () => {
    dispatch(vigilanceAreaActions.setGeometry(values.geom))
    dispatch(vigilanceAreaActions.setInitialGeometry(values.geom))
    dispatch(vigilanceAreaActions.setFormTypeOpen(VigilanceAreaFormTypeOpen.DRAW))
    dispatch(hideLayers({ keepInterestPoint: true }))
  }

  const setPeriod = (period: DateAsStringRange | undefined) => {
    setFieldValue('startDatePeriod', period ? period[0] : undefined)
    setFieldValue('endDatePeriod', period ? period[1] : undefined)
  }

  return (
    <FormContainer>
      <CancelEditDialog
        onCancel={onCancelEditModal}
        onConfirm={onConfirmEditModal}
        open={isCancelModalOpen}
        subText="Voulez-vous enregistrer les modifications avant de quitter ?"
        text={`Vous êtes en train d'abandonner l'édition de la zone de vigilance: ${values.name}`}
        title="Enregistrer les modifications"
      />
      <DeleteModal
        context="vigilance-area"
        isAbsolute={false}
        onCancel={cancelDeleteModal}
        onConfirm={onConfirmDeleteModal}
        open={isDeleteModalOpen}
        subTitle="Êtes-vous sûr de vouloir supprimer la zone de vigilance&nbsp;?"
        title="Supprimer la zone de vigilance&nbsp;?"
      />
      <StyledForm>
        <FormikTextInput
          isErrorMessageHidden
          isRequired
          label="Nom de la zone de vigilance"
          name="name"
          placeholder="Nom de la zone"
        />
        <DateWrapper>
          <DateRangePicker
            defaultValue={
              values?.startDatePeriod && values?.endDatePeriod
                ? [new Date(values?.startDatePeriod), new Date(values?.endDatePeriod)]
                : undefined
            }
            disabled={values.isAtAllTimes}
            error={formErrors.startDatePeriod ?? formErrors.endDatePeriod}
            hasSingleCalendar
            isCompact
            isErrorMessageHidden
            isRequired
            isStringDate
            isUndefinedWhenDisabled
            label="Période de validité"
            name="period"
            onChange={setPeriod}
          />
          <FormikCheckbox label="En tout temps" name="isAtAllTimes" />
        </DateWrapper>
        <Frequency />
        <ThemesAndTags>
          <CheckTreePicker
            childrenKey="subThemes"
            error={formErrors.themes}
            isErrorMessageHidden
            isRequired
            label="Thématiques et sous-thématiques"
            labelKey="name"
            name="theme"
            onChange={nextTheme => {
              setFieldValue('themes', parseOptionsToThemes(nextTheme))
            }}
            options={themesOptions}
            value={getThemesAsOptions(values.themes ?? [])}
            valueKey="id"
          />
          <CheckTreePicker
            childrenKey="subTags"
            error={formErrors.tags}
            isErrorMessageHidden
            isRequired
            label="Tags et sous-tags"
            labelKey="name"
            name="tags"
            onChange={nextTags => {
              setFieldValue('tags', parseOptionsToTags(nextTags))
            }}
            options={tagsOptions}
            renderedChildrenValue="Sous-tags."
            renderedValue="Tags"
            value={getTagsAsOptions(values.tags ?? [])}
            valueKey="id"
          />
          <ThemesAndTagsText $hasError={!!(formErrors.themes || formErrors.tags)}>
            Sélectionner au moins une thématique/sous-thématique ou un tag/sous-tag
          </ThemesAndTagsText>
        </ThemesAndTags>
        <FormikMultiRadio
          isErrorMessageHidden
          isInline
          isRequired
          label="Visibilité"
          name="visibility"
          options={visibilityOptions}
        />
        <FormikTextarea
          isErrorMessageHidden
          isRequired
          label="Commentaire"
          name="comments"
          placeholder="Description de la zone de vigilance"
          rows={8}
        />
        <ZonePicker
          addLabel="Définir un tracé pour la zone de vigilance"
          deleteZone={deleteZone}
          handleAddZone={addZone}
          isRequired
          label="Localisation"
          listener={InteractionListener.VIGILANCE_ZONE}
          name="geom"
        />
        <AddRegulatoryAreas />
        <AddAMPs />
        <PhotoUploader />
        <Links />
        <Separator />
        <Wrapper>
          <InternText>Interne CACEM</InternText>
          <Tooltip color={THEME.color.maximumRed}>
            Même si la visibilité de la zone de vigilance est publique, les infos de cette section &quot;Interne
            CACEM&quot; ne seront pas visibles sur la version de MonitorEnv hors du centre
          </Tooltip>
        </Wrapper>
        <StyledTrigramInput isErrorMessageHidden isRequired label="Créé par" name="createdBy" />
        <FormikTextarea
          label="Source de l'information"
          name="source"
          placeholder="Description de la source de l'information"
        />
      </StyledForm>
      <Footer
        isDraft={values.isDraft}
        onCancel={cancel}
        onDelete={onDelete}
        onPublish={onPublish}
        onSave={onSave}
        onUnpublish={onUnpublish}
      />
    </FormContainer>
  )
}

const FormContainer = styled.div`
  background-color: ${p => p.theme.color.white};
  box-shadow: 0px 1px 3px #707785b3;
  height: calc(100vh - 107px);
  display: flex;
  flex-direction: column;
  flex: 1;
`
const StyledForm = styled.div`
  gap: 16px;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`
const InternText = styled.span`
  color: ${p => p.theme.color.maximumRed};
  display: flex;
  gap: 8px;
`
const Separator = styled.div`
  border-top: 1px solid ${p => p.theme.color.maximumRed};
`
const StyledTrigramInput = styled(FormikTextInput)`
  width: 126px;
`

const Wrapper = styled.div`
  display: flex;
  gap: 8px;
`

const DateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const ThemesAndTags = styled.div`
  border-top: 1px solid ${p => p.theme.color.lightGray};
  border-bottom: 1px solid ${p => p.theme.color.lightGray};
  display: flex;
  gap: 10px;
  flex-direction: column;
  padding: 10px 0;
`
const ThemesAndTagsText = styled.span<{ $hasError: boolean }>`
  color: ${p => (p.$hasError ? p.theme.color.maximumRed : p.theme.color.slateGray)};
  font-style: italic;
`
