import { vigilanceAreaActions, VigilanceAreaFormTypeOpen } from '@features/VigilanceArea/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { setDisplayedItems } from 'domain/shared_slices/Global'
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
    dispatch(
      setDisplayedItems({
        displayInterestPointLayer: true,
        displayMissionEditingLayer: true,
        displayMissionSelectedLayer: true,
        displayMissionsLayer: true,
        displayMissionToAttachLayer: true,
        displayReportingEditingLayer: true,
        displayReportingSelectedLayer: true,
        displayReportingsLayer: true,
        displayReportingToAttachLayer: true,
        displaySemaphoresLayer: true
      })
    )
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
          <RegulatoryAreas
            deleteRegulatoryArea={id => deleteRegulatoryArea(id)}
            linkedRegulatoryAreas={regulatoryAreasToAdd}
          />
        </div>
        <ValidateButton onClick={handleValidate}>Valider la sélection</ValidateButton>
      </SubFormBody>
    </>
  )
}
