import { vigilanceAreaActions, VigilanceAreaFormTypeOpen } from '@features/VigilanceArea/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Accent, Button, Icon, Label } from '@mtes-mct/monitor-ui'

export function AddRegulatories() {
  const dispatch = useAppDispatch()
  const addRegulatory = () => {
    dispatch(vigilanceAreaActions.setFormTypeOpen(VigilanceAreaFormTypeOpen.ADD_REGULATORY))
  }

  return (
    <>
      <Label>Réglementations en lien avec la zone de vigilance</Label>
      <Button
        accent={Accent.SECONDARY}
        aria-label="Ajouter une réglementation en lien"
        Icon={Icon.Plus}
        isFullWidth
        onClick={addRegulatory}
      >
        Ajouter une réglementation en lien
      </Button>
    </>
  )
}
