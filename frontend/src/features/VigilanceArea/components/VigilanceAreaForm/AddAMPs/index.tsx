import { vigilanceAreaActions, VigilanceAreaFormTypeOpen } from '@features/VigilanceArea/slice'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Accent, Button, Icon, Label } from '@mtes-mct/monitor-ui'
import { setDisplayedItems } from 'domain/shared_slices/Global'
import { useFormikContext } from 'formik'

import { AMPList } from './AMPList'

export function AddAMPs() {
  const {
    setFieldValue,
    values: { linkedAMPs }
  } = useFormikContext<VigilanceArea.VigilanceArea>()

  const dispatch = useAppDispatch()
  const addAMP = () => {
    dispatch(vigilanceAreaActions.setFormTypeOpen(VigilanceAreaFormTypeOpen.ADD_AMP))
    dispatch(
      setDisplayedItems({
        displayInterestPointLayer: false,
        displayMissionEditingLayer: false,
        displayMissionSelectedLayer: false,
        displayMissionsLayer: false,
        displayMissionToAttachLayer: false,
        displayReportingEditingLayer: false,
        displayReportingSelectedLayer: false,
        displayReportingsLayer: false,
        displayReportingToAttachLayer: false,
        displaySemaphoresLayer: false,
        displayStationLayer: false
      })
    )
  }

  const deleteAMP = id => {
    dispatch(vigilanceAreaActions.deleteRegulatoryAreasFromVigilanceArea(id))
    setFieldValue(
      'linkedAMPs',
      linkedAMPs.filter(ampId => ampId !== id)
    )
  }

  return (
    <div>
      <Label>AMP en lien avec la zone de vigilance</Label>
      <Button
        accent={Accent.SECONDARY}
        aria-label="Ajouter une AMP en lien"
        Icon={Icon.Plus}
        isFullWidth
        onClick={addAMP}
      >
        Ajouter une AMP en lien
      </Button>

      <AMPList deleteAMP={id => deleteAMP(id)} linkedAMPs={linkedAMPs} />
    </div>
  )
}
