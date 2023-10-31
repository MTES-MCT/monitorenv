import { goToMainWindow } from '../utils'

export function goToMainWindowAndOpenControlUnit(controlUnitId: number) {
  goToMainWindow()

  cy.clickButton('Liste des unités de contrôle')
  cy.getDataCy('ControlUnitListDialog-control-unit').filter(`[data-id="${controlUnitId}"]`).forceClick().wait(250)
}
