import { useGetRegulatoryLayersQuery } from '@api/regulatoryLayersAPI'
import { ZonePicker } from '@features/commonComponents/ZonePicker'
import { vigilanceAreaActions } from '@features/VigilanceArea/slice'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import {
  CustomSearch,
  FormikDateRangePicker,
  FormikMultiRadio,
  FormikMultiSelect,
  FormikTextarea,
  FormikTextInput,
  getOptionsFromLabelledEnum,
  type Option
} from '@mtes-mct/monitor-ui'
import { getRegulatoryThemesAsOptions } from '@utils/getRegulatoryThemesAsOptions'
import { InteractionListener } from 'domain/entities/map/constants'
import { setDisplayedItems } from 'domain/shared_slices/Global'
import { drawPolygon } from 'domain/use_cases/draw/drawGeometry'
import { useFormikContext } from 'formik'
import { useMemo } from 'react'
import styled from 'styled-components'

import { Footer } from './Footer'
import { Frequency } from './Frequency'
import { Links } from './Links'

export function Form() {
  const dispatch = useAppDispatch()
  const { setFieldValue, validateForm, values } = useFormikContext<VigilanceArea.VigilanceArea>()

  const visibilityOptions = getOptionsFromLabelledEnum(VigilanceArea.VisibilityLabel)

  const { data: regulatoryLayers } = useGetRegulatoryLayersQuery()

  const regulatoryThemes = useMemo(() => getRegulatoryThemesAsOptions(regulatoryLayers), [regulatoryLayers])
  const regulatoryThemesCustomSearch = useMemo(
    () => new CustomSearch(regulatoryThemes as Array<Option>, ['label']),
    [regulatoryThemes]
  )

  const publish = () => {
    setFieldValue('isDraft', false)
    validateForm({ ...values, isDraft: false }).then(() => {})
  }

  const cancel = () => {
    dispatch(vigilanceAreaActions.closeForm())
  }

  const save = () => {}

  const deleteVigilanceArea = () => {}

  const deleteZone = () => {}

  const addZone = () => {
    dispatch(drawPolygon(values.geom, InteractionListener.VIGILANCE_ZONE))
    dispatch(setDisplayedItems({ isLayersSidebarVisible: false }))
  }

  return (
    <FormContainer>
      <StyledForm>
        <FormikTextInput
          isErrorMessageHidden
          label="Nom de la zone de vigilance"
          name="name"
          placeholder="Nom de la zone"
        />
        <FormikDateRangePicker isCompact isErrorMessageHidden label="Période de validité" name="period" />
        <Frequency />
        <FormikMultiSelect
          customSearch={regulatoryThemesCustomSearch}
          label="Thématiques"
          name="themes"
          options={regulatoryThemes || []}
          placeholder="Sélectionner un/des thématique(s)"
        />
        <FormikMultiRadio
          isErrorMessageHidden
          isInline
          label="Visibilité"
          name="visibility"
          options={visibilityOptions}
        />
        <FormikTextarea
          isErrorMessageHidden
          label="Commentaire"
          name="comments"
          placeholder="Description de la zone de vigilance"
        />
        <ZonePicker
          addLabel="Définir un tracé pour la zone de vigilance"
          deleteZone={deleteZone}
          handleAddZone={addZone}
          label="Localisation"
          listener={InteractionListener.VIGILANCE_ZONE}
          name="geom"
        />
        <Links />
        <Separator />
        <InternText>Interne CACEM</InternText>
        <StyledTrigramInput isErrorMessageHidden label="Créé par" name="createdBy" />
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
