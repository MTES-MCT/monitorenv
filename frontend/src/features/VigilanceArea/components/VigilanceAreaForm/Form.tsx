import { useGetRegulatoryLayersQuery } from '@api/regulatoryLayersAPI'
import { CancelEditDialog } from '@features/commonComponents/Modals/CancelEditModal'
import { ZonePicker } from '@features/commonComponents/ZonePicker'
import { vigilanceAreaActions } from '@features/VigilanceArea/slice'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { saveVigilanceArea } from '@features/VigilanceArea/useCases/saveVigilanceArea'
import { useAppDispatch } from '@hooks/useAppDispatch'
import {
  CustomSearch,
  DateRangePicker,
  FormikMultiRadio,
  FormikMultiSelect,
  FormikTextarea,
  FormikTextInput,
  getOptionsFromLabelledEnum,
  type DateAsStringRange,
  type Option
} from '@mtes-mct/monitor-ui'
import { getRegulatoryThemesAsOptions } from '@utils/getRegulatoryThemesAsOptions'
import { InteractionListener } from 'domain/entities/map/constants'
import { setDisplayedItems } from 'domain/shared_slices/Global'
import { drawPolygon } from 'domain/use_cases/draw/drawGeometry'
import { useFormikContext } from 'formik'
import { isEmpty } from 'lodash'
import { useMemo, useState } from 'react'
import styled from 'styled-components'

import { Footer } from './Footer'
import { Frequency } from './Frequency'
import { Links } from './Links'

export function Form() {
  const dispatch = useAppDispatch()
  const { dirty, setFieldValue, validateForm, values } = useFormikContext<VigilanceArea.VigilanceArea>()

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const visibilityOptions = getOptionsFromLabelledEnum(VigilanceArea.VisibilityLabel)

  const { data: regulatoryLayers } = useGetRegulatoryLayersQuery()

  const regulatoryThemes = useMemo(() => getRegulatoryThemesAsOptions(regulatoryLayers), [regulatoryLayers])
  const regulatoryThemesCustomSearch = useMemo(
    () => new CustomSearch(regulatoryThemes as Array<Option>, ['label']),
    [regulatoryThemes]
  )

  const publish = () => {
    validateForm({ ...values, isDraft: false }).then(errors => {
      if (isEmpty(errors)) {
        dispatch(saveVigilanceArea({ ...values, isDraft: false }))
      }
    })
  }

  const cancel = () => {
    if (dirty) {
      setIsDialogOpen(true)

      return
    }
    dispatch(vigilanceAreaActions.closeForm())
  }

  const onCancelEditModal = () => {
    setIsDialogOpen(false)
  }

  const onConfirmEditModal = () => {
    dispatch(vigilanceAreaActions.closeForm())
    setIsDialogOpen(false)
  }

  const save = () => {
    dispatch(saveVigilanceArea(values))
  }

  const deleteVigilanceArea = () => {}

  const deleteZone = index => {
    const coordinates = [...values.geom.coordinates]
    const nextCoordinates = coordinates.splice(index, 1)

    setFieldValue('geom', { ...values.geom, coordinates: nextCoordinates })
  }

  const addZone = () => {
    dispatch(drawPolygon(values.geom, InteractionListener.VIGILANCE_ZONE))
    dispatch(setDisplayedItems({ isLayersSidebarVisible: false }))
  }

  const setPeriod = (period: DateAsStringRange | undefined) => {
    if (!period) {
      return
    }
    setFieldValue('startDatePeriod', period[0])
    setFieldValue('endDatePeriod', period[1])
  }

  return (
    <FormContainer>
      <CancelEditDialog
        onCancel={onCancelEditModal}
        onConfirm={onConfirmEditModal}
        open={isDialogOpen}
        subText="Voulez-vous enregistrer les modifications avant de quitter ?"
        text="Vous êtes en train d'abandonner l'édition de la zone de vigilance"
        title="Enregistrer les modifications"
      />

      <StyledForm>
        <FormikTextInput
          isErrorMessageHidden
          isRequired
          label="Nom de la zone de vigilance"
          name="name"
          placeholder="Nom de la zone"
        />
        <DateRangePicker
          isCompact
          isErrorMessageHidden
          isRequired
          isStringDate
          label="Période de validité"
          name="period"
          onChange={setPeriod}
        />
        <Frequency />
        <FormikMultiSelect
          customSearch={regulatoryThemesCustomSearch}
          isErrorMessageHidden
          isRequired
          label="Thématiques"
          name="themes"
          options={regulatoryThemes || []}
          placeholder="Sélectionner un/des thématique(s)"
        />
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
        <Links />
        <Separator />
        <InternText>Interne CACEM</InternText>
        <StyledTrigramInput isErrorMessageHidden isRequired label="Créé par" name="createdBy" />
        <FormikTextarea
          label="Source de l'information"
          name="source"
          placeholder="Description de la source de l'information"
        />
      </StyledForm>
      <Footer onCancel={cancel} onDelete={deleteVigilanceArea} onPublish={publish} onSave={save} />
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

const Separator = styled.div`
  border-top: 1px solid ${p => p.theme.color.maximumRed};
`
const InternText = styled.span`
  color: ${p => p.theme.color.maximumRed};
`

const StyledTrigramInput = styled(FormikTextInput)`
  width: 126px;
`
