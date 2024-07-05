import { vigilanceAreaActions, VigilanceAreaFormTypeOpen } from '@features/VigilanceArea/slice'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Accent, Button, Icon, Label } from '@mtes-mct/monitor-ui'
import { setDisplayedItems } from 'domain/shared_slices/Global'
import { useFormikContext } from 'formik'

import { RegulatoryAreas } from './RegulatoryAreas'

export function AddRegulatoryAreas() {
  const {
    setFieldValue,
    values: { linkedRegulatoryAreas }
  } = useFormikContext<VigilanceArea.VigilanceArea>()

  const dispatch = useAppDispatch()
  const addRegulatory = () => {
    dispatch(vigilanceAreaActions.setFormTypeOpen(VigilanceAreaFormTypeOpen.ADD_REGULATORY))
    dispatch(vigilanceAreaActions.addRegulatoryAreasToVigilanceArea(linkedRegulatoryAreas))
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

  const deleteRegulatoryArea = id => {
    dispatch(vigilanceAreaActions.deleteRegulatoryAreasFromVigilanceArea(id))
    setFieldValue(
      'linkedRegulatoryAreas',
      linkedRegulatoryAreas.filter(regulatoryArea => regulatoryArea !== id)
    )
  }

  return (
    <div>
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

      <RegulatoryAreas
        deleteRegulatoryArea={id => deleteRegulatoryArea(id)}
        linkedRegulatoryAreas={linkedRegulatoryAreas}
      />
    </div>
  )
}
