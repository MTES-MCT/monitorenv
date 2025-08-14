import { vigilanceAreaActions, VigilanceAreaFormTypeOpen } from '@features/VigilanceArea/slice'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { hideLayers } from '@features/VigilanceArea/useCases/hideLayers'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Accent, Button, Icon, Label } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'

import { AMPList } from './AMPList'

export function AddAMPs() {
  const {
    values: { linkedAMPs }
  } = useFormikContext<VigilanceArea.VigilanceArea>()

  const dispatch = useAppDispatch()
  const addAMP = () => {
    dispatch(vigilanceAreaActions.setFormTypeOpen(VigilanceAreaFormTypeOpen.ADD_AMP))
    dispatch(hideLayers())
  }

  return (
    <div>
      <Label>AMP en lien avec la zone de vigilance</Label>
      <Button accent={Accent.SECONDARY} Icon={Icon.Plus} isFullWidth onClick={addAMP} title="Ajouter une AMP en lien">
        Ajouter une AMP en lien
      </Button>

      <AMPList linkedAMPs={linkedAMPs ?? []} />
    </div>
  )
}
