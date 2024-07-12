import { closeLayerOverlay } from '@features/layersSelector/metadataPanel/slice'
import { vigilanceAreaActions, VigilanceAreaFormTypeOpen } from '@features/VigilanceArea/slice'
import { displayOrHideOtherLayers } from '@features/VigilanceArea/useCases/displayOrHideOtherLayers'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { useFormikContext } from 'formik'

import { RegulatoryAreas } from './RegulatoryAreas'
import { SubFormBody, SubFormHeader, SubFormHelpText, SubFormTitle, ValidateButton } from '../style'

import type { VigilanceArea } from '@features/VigilanceArea/types'

export function SelectRegulatoryAreas() {
  const dispatch = useAppDispatch()
  const regulatoryAreasToAdd = useAppSelector(state => state.vigilanceArea.regulatoryAreasToAdd)
  const { setFieldValue } = useFormikContext<VigilanceArea.VigilanceArea>()

  const handleValidate = () => {
    setFieldValue('linkedRegulatoryAreas', regulatoryAreasToAdd)
    dispatch(vigilanceAreaActions.setFormTypeOpen(VigilanceAreaFormTypeOpen.FORM))
    dispatch(closeLayerOverlay())
    dispatch(displayOrHideOtherLayers({ display: true }))
  }

  return (
    <>
      <SubFormHeader>
        <SubFormTitle>Ajout d’une réglementation en lien en cours…</SubFormTitle>
      </SubFormHeader>
      <SubFormBody>
        <SubFormHelpText>
          Ajoutez des réglementations en lien depuis le panneau de gauche (+) ou sélectionnez directement les tracés sur
          la carte.
        </SubFormHelpText>
        <div>
          <RegulatoryAreas linkedRegulatoryAreas={regulatoryAreasToAdd} />
        </div>
        <ValidateButton onClick={handleValidate}>Valider la sélection</ValidateButton>
      </SubFormBody>
    </>
  )
}
