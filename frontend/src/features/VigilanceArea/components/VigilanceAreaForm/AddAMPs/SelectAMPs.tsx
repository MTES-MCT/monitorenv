import { vigilanceAreaActions, VigilanceAreaFormTypeOpen } from '@features/VigilanceArea/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, IconButton, THEME } from '@mtes-mct/monitor-ui'
import { restorePreviousDisplayedItems } from 'domain/shared_slices/Global'
import { useFormikContext } from 'formik'

import { SubFormBody, SubFormHeader, SubFormHelpText, SubFormTitle, ValidateButton } from '../style'
import { AMPList } from './AMPList'

import type { VigilanceArea } from '@features/VigilanceArea/types'

export function SelectAMP({ onCancel }: { onCancel: () => void }) {
  const dispatch = useAppDispatch()
  const ampToAdd = useAppSelector(state => state.vigilanceArea.ampToAdd)
  const { setFieldValue } = useFormikContext<VigilanceArea.VigilanceArea>()

  const handleValidate = () => {
    setFieldValue('linkedAMPs', ampToAdd)
    dispatch(vigilanceAreaActions.setFormTypeOpen(VigilanceAreaFormTypeOpen.FORM))
    dispatch(restorePreviousDisplayedItems())
  }

  return (
    <>
      <SubFormHeader>
        <SubFormTitle>Ajout d’une AMP en lien en cours…</SubFormTitle>
        <IconButton accent={Accent.TERTIARY} color={THEME.color.white} Icon={Icon.Close} onClick={onCancel} />
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
