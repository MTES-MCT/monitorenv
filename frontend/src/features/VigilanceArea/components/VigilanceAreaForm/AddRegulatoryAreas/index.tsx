import { vigilanceAreaActions, VigilanceAreaFormTypeOpen } from '@features/VigilanceArea/slice'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { hideLayers } from '@features/VigilanceArea/useCases/hideLayers'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Accent, Button, Icon, Label } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'

import { RegulatoryAreas } from './RegulatoryAreas'

export function AddRegulatoryAreas() {
  const {
    values: { linkedRegulatoryAreas }
  } = useFormikContext<VigilanceArea.VigilanceArea>()

  const dispatch = useAppDispatch()
  const addRegulatory = () => {
    dispatch(vigilanceAreaActions.setFormTypeOpen(VigilanceAreaFormTypeOpen.ADD_REGULATORY))
    dispatch(hideLayers())
  }

  return (
    <div>
      <Label>Réglementations en lien avec la zone de vigilance</Label>
      <Button
        accent={Accent.SECONDARY}
        Icon={Icon.Plus}
        isFullWidth
        onClick={addRegulatory}
        title="Ajouter une réglementation en lien"
      >
        Ajouter une réglementation en lien
      </Button>

      <RegulatoryAreas linkedRegulatoryAreas={linkedRegulatoryAreas} />
    </div>
  )
}
