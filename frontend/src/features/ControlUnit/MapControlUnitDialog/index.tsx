import { Accent, Icon } from '@mtes-mct/monitor-ui'

import { MapMenuDialog } from '../../../ui/MapMenuDialog'

export function MapControlUnitDialog() {
  return (
    <MapMenuDialog.Container>
      <MapMenuDialog.Header>
        <MapMenuDialog.CloseButton Icon={Icon.Close} />
        <MapMenuDialog.Title>Unité de contrôle</MapMenuDialog.Title>
        <MapMenuDialog.VisibilityButton accent={Accent.SECONDARY} Icon={Icon.Display} />
      </MapMenuDialog.Header>
      <MapMenuDialog.Body>Bla bla</MapMenuDialog.Body>
    </MapMenuDialog.Container>
  )
}
