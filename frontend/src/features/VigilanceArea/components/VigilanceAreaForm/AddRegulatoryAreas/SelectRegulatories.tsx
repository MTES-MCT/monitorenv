import { useGetRegulatoryLayersQuery } from '@api/regulatoryLayersAPI'
import { vigilanceAreaActions, VigilanceAreaFormTypeOpen } from '@features/VigilanceArea/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { useFormikContext } from 'formik'

import { RegulatoryArea } from './RegulatoryArea'
import { SubFormBody, SubFormHeader, SubFormHelpText, SubFormTitle, ValidateButton } from '../style'

import type { VigilanceArea } from '@features/VigilanceArea/types'

export function SelectRegulatories() {
  const dispatch = useAppDispatch()
  const regulatoryAreasToAdd = useAppSelector(state => state.vigilanceArea.regulatoryAreasToAdd)
  const { setFieldValue } = useFormikContext<VigilanceArea.VigilanceArea>()

  const { data: regulatoryLayers } = useGetRegulatoryLayersQuery()
  const regulatoryAreas = regulatoryAreasToAdd?.map(regulatoryArea => regulatoryLayers?.entities[regulatoryArea])

  const handleValidate = () => {
    setFieldValue('linkedRegulatoryAreas', regulatoryAreasToAdd)
    dispatch(vigilanceAreaActions.setFormTypeOpen(VigilanceAreaFormTypeOpen.FORM))
  }

  const deleteRegulatoryArea = id => {
    if (!id) {
      return
    }
    dispatch(vigilanceAreaActions.deleteRegulatoryAreasFromVigilanceArea(id))
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
          {regulatoryAreas &&
            regulatoryAreas.length > 0 &&
            regulatoryAreas.map(regulatoryArea => (
              <RegulatoryArea
                key={regulatoryArea?.id}
                deleteRegulatoryArea={() => deleteRegulatoryArea(regulatoryArea?.id)}
                regulatoryArea={regulatoryArea}
              />
            ))}
        </div>
        <ValidateButton onClick={handleValidate}>Valider la sélection</ValidateButton>
      </SubFormBody>
    </>
  )
}
