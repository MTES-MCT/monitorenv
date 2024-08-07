import { closeLayerOverlay } from '@features/layersSelector/metadataPanel/slice'
import { vigilanceAreaActions, VigilanceAreaFormTypeOpen } from '@features/VigilanceArea/slice'
import { displayOrHideOtherLayers } from '@features/VigilanceArea/useCases/displayOrHideOtherLayers'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Icon, IconButton } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'

import { AMPList } from './AMPList'
import { SubFormBody, SubFormHeader, SubFormHelpText, SubFormTitle, ValidateButton } from '../style'

import type { VigilanceArea } from '@features/VigilanceArea/types'

export function SelectAMP({ onCancel }: { onCancel: () => void }) {
  const dispatch = useAppDispatch()
  const ampToAdd = useAppSelector(state => state.vigilanceArea.ampToAdd)
  const { setFieldValue } = useFormikContext<VigilanceArea.VigilanceArea>()

  const handleValidate = () => {
    setFieldValue('linkedAMPs', ampToAdd)
    dispatch(vigilanceAreaActions.setFormTypeOpen(VigilanceAreaFormTypeOpen.FORM))
    dispatch(closeLayerOverlay())
    dispatch(displayOrHideOtherLayers({ display: true }))
  }

  return (
    <>
      <SubFormHeader>
        <SubFormTitle>Ajout d’une AMP en lien en cours…</SubFormTitle>
        <IconButton Icon={Icon.Close} onClick={onCancel} />
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
