import { closeLayerOverlay } from '@features/layersSelector/metadataPanel/slice'
import { vigilanceAreaActions, VigilanceAreaFormTypeOpen } from '@features/VigilanceArea/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { setDisplayedItems } from 'domain/shared_slices/Global'
import { useFormikContext } from 'formik'

import { AMPList } from './AMPList'
import { SubFormBody, SubFormHeader, SubFormHelpText, SubFormTitle, ValidateButton } from '../style'

import type { VigilanceArea } from '@features/VigilanceArea/types'

export function SelectAMP() {
  const dispatch = useAppDispatch()
  const ampToAdd = useAppSelector(state => state.vigilanceArea.ampToAdd)
  const { setFieldValue } = useFormikContext<VigilanceArea.VigilanceArea>()

  const handleValidate = () => {
    setFieldValue('linkedAMPs', ampToAdd)
    dispatch(vigilanceAreaActions.setFormTypeOpen(VigilanceAreaFormTypeOpen.FORM))
    dispatch(closeLayerOverlay())
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

  return (
    <>
      <SubFormHeader>
        <SubFormTitle>Ajout d’une AMP en lien en cours…</SubFormTitle>
      </SubFormHeader>
      <SubFormBody>
        <SubFormHelpText>
          Ajoutez des AMPs en lien depuis le panneau de gauche (+) ou sélectionnez directement les tracés sur la carte.
        </SubFormHelpText>
        <div>
          <AMPList linkedAMPs={ampToAdd} />
        </div>
        <ValidateButton onClick={handleValidate}>Valider la sélection</ValidateButton>
      </SubFormBody>
    </>
  )
}
