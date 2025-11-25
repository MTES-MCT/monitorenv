/* eslint-disable react/destructuring-assignment */

import { PlanningBody } from '@features/VigilanceArea/components/VigilanceAreaForm/Planning/PlanningBody'
import { PanelSubPart } from '@features/VigilanceArea/components/VigilanceAreaForm/style'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { Label } from '@mtes-mct/monitor-ui'

type PlanningFormProps = {
  vigilanceArea: VigilanceArea.VigilanceArea
}

export function PlanningForm({ vigilanceArea }: PlanningFormProps) {
  return (
    <PanelSubPart>
      <Label>Planning de vigilance</Label>
      <PlanningBody vigilanceArea={vigilanceArea} />
    </PanelSubPart>
  )
}
